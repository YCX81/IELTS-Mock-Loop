(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.IELTS_INTENSIVE_READING_UTILS = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const PASSAGE_STAGES = Object.freeze([
    "pre-read",
    "timed-read",
    "deep-read",
    "output",
    "review",
  ]);
  const REVIEW_RATINGS = Object.freeze(["forgotten", "hard", "mastered"]);
  const REVIEW_INTERVAL_DAYS = Object.freeze({
    forgotten: 1,
    hard: 3,
    mastered: 7,
  });

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function deepClone(value) {
    if (Array.isArray(value)) return value.map(deepClone);
    if (value instanceof Date) return new Date(value.getTime());
    if (!isObject(value)) return value;
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, deepClone(nestedValue)])
    );
  }

  function asText(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value).trim();
    return "";
  }

  function asNonNegativeInteger(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? Math.floor(number) : fallback;
  }

  function uniqueStrings(values) {
    const seen = new Set();
    return values
      .map(asText)
      .filter((value) => {
        if (!value || seen.has(value)) return false;
        seen.add(value);
        return true;
      });
  }

  function toIso(value, fallback) {
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
    if (fallback !== undefined && fallback !== value) return toIso(fallback);
    return new Date().toISOString();
  }

  function optionalIso(value, fallback = "") {
    if (value === "" || value === null || value === undefined) return fallback;
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
  }

  function resolveNow(options) {
    const candidate = isObject(options)
      ? options.now ?? options.asOf ?? options.at
      : options;
    return toIso(candidate, new Date());
  }

  function addDaysIso(value, days) {
    const date = new Date(toIso(value));
    date.setUTCDate(date.getUTCDate() + Number(days || 0));
    return date.toISOString();
  }

  function normalizeStage(value) {
    const normalized = asText(value)
      .toLowerCase()
      .replace(/[_\s]+/g, "-")
      .replace(/-{2,}/g, "-");
    const aliases = {
      preread: "pre-read",
      timed: "timed-read",
      deep: "deep-read",
      intensive: "deep-read",
      production: "output",
      recall: "review",
    };
    const candidate = aliases[normalized] || normalized;
    return PASSAGE_STAGES.includes(candidate) ? candidate : "pre-read";
  }

  function reviewLabel(day) {
    return day === 0 ? "今天" : `第${day}天`;
  }

  function buildReviewSchedule(anchor) {
    const base = toIso(anchor);
    return [0, 1, 3, 7].map((day) => ({
      day,
      label: reviewLabel(day),
      dueAt: addDaysIso(base, day),
      completedAt: "",
    }));
  }

  function createPassageProgress(passage, options = {}) {
    const source = isObject(passage)
      ? passage
      : typeof passage === "string"
        ? { id: passage }
        : {};
    const now = resolveNow(options);
    const passageId =
      asText(source.passageId || source.id || source.slug || source.key) ||
      asText(options.passageId || options.id) ||
      "unknown-passage";
    const title =
      asText(source.title || source.name) ||
      asText(options.title || options.name);
    const schedule = buildReviewSchedule(now);

    return {
      schemaVersion: 1,
      passageId,
      title,
      stage: "pre-read",
      stageHistory: [
        {
          stage: "pre-read",
          startedAt: now,
          completedAt: "",
        },
      ],
      paragraphGists: {},
      sentenceReveals: {},
      savedExpressions: [],
      outputs: {
        summary: "",
        retell: "",
        updatedAt: "",
      },
      review: {
        active: false,
        activatedAt: "",
        dueAt: schedule[0].dueAt,
        schedule,
        attempts: [],
        mastery: "new",
        lapseCount: 0,
        streak: 0,
        lastReviewedAt: "",
      },
      createdAt: now,
      updatedAt: now,
    };
  }

  function normalizeStageHistory(value, stage, createdAt) {
    const history = (Array.isArray(value) ? value : [])
      .map((entry) => {
        if (!entry) return null;
        const item = typeof entry === "string" ? { stage: entry } : entry;
        const normalizedStage = normalizeStage(item.stage || item.name);
        return {
          stage: normalizedStage,
          startedAt: optionalIso(item.startedAt || item.started, createdAt),
          completedAt: optionalIso(item.completedAt || item.completed, ""),
        };
      })
      .filter(Boolean);

    if (!history.length) {
      return [
        {
          stage,
          startedAt: createdAt,
          completedAt: "",
        },
      ];
    }
    if (!history.some((entry) => entry.stage === stage)) {
      history.push({
        stage,
        startedAt: createdAt,
        completedAt: "",
      });
    }
    return history;
  }

  function normalizeParagraphGists(value) {
    if (!value) return {};
    const entries = Array.isArray(value)
      ? value.map((entry, index) => [
          asText(entry?.paragraphId || entry?.id || entry?.paragraph || index + 1),
          entry,
        ])
      : Object.entries(value);
    return Object.fromEntries(
      entries
        .map(([key, raw]) => {
          const paragraphId = asText(key);
          if (!paragraphId) return null;
          if (!isObject(raw)) {
            return [
              paragraphId,
              {
                answer: asText(raw),
                referenceAnswer: "",
                selfRating: "",
                updatedAt: "",
              },
            ];
          }
          return [
            paragraphId,
            {
              answer: asText(raw.answer ?? raw.text ?? raw.value ?? raw.gist),
              referenceAnswer: asText(
                raw.referenceAnswer ?? raw.reference ?? raw.modelAnswer ?? raw.mainIdea
              ),
              selfRating: asText(raw.selfRating ?? raw.rating),
              updatedAt: optionalIso(raw.updatedAt, ""),
            },
          ];
        })
        .filter(Boolean)
    );
  }

  function normalizeRevealRecord(raw, createdAt) {
    if (raw === true || raw === null || raw === undefined || typeof raw === "string") {
      return {
        layers: ["translation"],
        firstRevealedAt: "",
        updatedAt: "",
        translation: true,
      };
    }
    const explicitLayers = Array.isArray(raw.layers)
      ? raw.layers
      : Array.isArray(raw.revealed)
        ? raw.revealed
        : [];
    const booleanLayers = Object.entries(raw)
      .filter(
        ([key, enabled]) =>
          enabled === true &&
          !["firstRevealedAt", "updatedAt", "revealedAt"].includes(key)
      )
      .map(([key]) => key);
    const layers = uniqueStrings([...explicitLayers, ...booleanLayers]);
    const effectiveLayers = layers.length ? layers : ["translation"];
    const firstRevealedAt =
      raw.revealedAt === true
        ? createdAt
        : optionalIso(raw.firstRevealedAt || raw.revealedAt, "");
    const record = {
      layers: effectiveLayers,
      firstRevealedAt,
      updatedAt: optionalIso(raw.updatedAt, ""),
    };
    effectiveLayers.forEach((layer) => {
      record[layer] = true;
    });
    return record;
  }

  function normalizeSentenceReveals(value, createdAt) {
    if (!value) return {};
    const entries = Array.isArray(value)
      ? value.map((entry, index) => {
          if (isObject(entry)) {
            return [
              asText(entry.sentenceId || entry.id || entry.key || index + 1),
              entry,
            ];
          }
          return [asText(entry), true];
        })
      : Object.entries(value);
    return Object.fromEntries(
      entries
        .map(([key, raw]) => {
          const sentenceId = asText(key);
          if (raw === false) return null;
          return sentenceId
            ? [sentenceId, normalizeRevealRecord(raw, createdAt)]
            : null;
        })
        .filter(Boolean)
    );
  }

  function expressionKey(expression, passageId) {
    const text = asText(
      expression?.text || expression?.phrase || expression?.expression || expression
    ).toLocaleLowerCase();
    const sentenceId = asText(
      expression?.sentenceId || expression?.sentence || expression?.sourceSentenceId
    ).toLocaleLowerCase();
    return `${sentenceId || passageId}:${text}`;
  }

  function normalizeExpression(raw, passageId, createdAt) {
    const item = isObject(raw) ? raw : { text: raw };
    const text = asText(item.text || item.phrase || item.expression);
    if (!text) return null;
    const key = expressionKey(item, passageId);
    return {
      id: asText(item.id || item.key) || key,
      text,
      meaning: asText(item.meaning || item.translation || item.definition),
      sentenceId: asText(item.sentenceId || item.sentence || item.sourceSentenceId),
      note: asText(item.note || item.usage),
      savedAt: optionalIso(item.savedAt || item.createdAt, createdAt),
      updatedAt: optionalIso(item.updatedAt, optionalIso(item.savedAt || item.createdAt, createdAt)),
    };
  }

  function normalizeExpressions(value, passageId, createdAt) {
    const byKey = new Map();
    (Array.isArray(value) ? value : [])
      .map((entry) => normalizeExpression(entry, passageId, createdAt))
      .filter(Boolean)
      .forEach((entry) => {
        byKey.set(expressionKey(entry, passageId), entry);
      });
    return [...byKey.values()];
  }

  function normalizeOutputs(source) {
    const outputs = isObject(source.outputs)
      ? source.outputs
      : isObject(source.output)
        ? source.output
        : {};
    return {
      summary: asText(outputs.summary ?? source.summary),
      retell: asText(outputs.retell ?? source.retell),
      updatedAt: optionalIso(
        outputs.updatedAt || source.outputUpdatedAt,
        ""
      ),
    };
  }

  function normalizeReviewSchedule(value, anchor) {
    if (!Array.isArray(value) || !value.length) return buildReviewSchedule(anchor);
    return value
      .map((raw, index) => {
        const item = isObject(raw) ? raw : { day: raw };
        const day = asNonNegativeInteger(
          item.day ?? item.intervalDays ?? item.interval,
          index
        );
        return {
          ...deepClone(item),
          day,
          label: asText(item.label) || reviewLabel(day),
          dueAt: toIso(item.dueAt || item.date, addDaysIso(anchor, day)),
          completedAt: optionalIso(item.completedAt, ""),
        };
      })
      .sort((left, right) => left.day - right.day);
  }

  function normalizeReviewAttempts(value) {
    return (Array.isArray(value) ? value : [])
      .map((raw) => {
        if (!isObject(raw)) return null;
        const rating = REVIEW_RATINGS.includes(raw.rating)
          ? raw.rating
          : asText(raw.rating);
        const attemptedAt = optionalIso(raw.attemptedAt || raw.reviewedAt, "");
        const attempt = {
          ...deepClone(raw),
          rating,
          attemptedAt,
          previousDueAt: optionalIso(raw.previousDueAt, ""),
          nextDueAt: optionalIso(raw.nextDueAt || raw.dueAt, ""),
        };
        if ("answer" in raw) attempt.answer = asText(raw.answer);
        return attempt;
      })
      .filter(Boolean);
  }

  function normalizeMastery(value, attempts) {
    const mastery = asText(value).toLowerCase();
    if (["new", "learning", "reviewing", "mastered"].includes(mastery)) {
      return mastery;
    }
    const lastRating = attempts.at(-1)?.rating;
    if (lastRating === "forgotten") return "learning";
    if (lastRating === "hard") return "reviewing";
    if (lastRating === "mastered") return "mastered";
    return "new";
  }

  function normalizePassageProgress(progress, options = {}) {
    if (!isObject(progress)) {
      return createPassageProgress(
        {
          id: options.passageId || options.id,
          title: options.title || options.name,
        },
        options
      );
    }

    const source = deepClone(progress);
    const now = resolveNow(options);
    const createdAt = toIso(source.createdAt || source.startedAt, now);
    const passageId =
      asText(source.passageId || source.id || source.slug || source.key) ||
      asText(options.passageId || options.id) ||
      "unknown-passage";
    const title =
      asText(source.title || source.name) ||
      asText(options.title || options.name);
    const stage = normalizeStage(source.stage || source.currentStage);
    const reviewSource = isObject(source.review) ? source.review : {};
    const schedule = normalizeReviewSchedule(
      reviewSource.schedule || source.reviewSchedule,
      reviewSource.activatedAt || source.reviewActivatedAt || createdAt
    );
    const attempts = normalizeReviewAttempts(
      reviewSource.attempts || source.reviewAttempts
    );
    const dueAt = toIso(
      reviewSource.dueAt || source.dueAt || schedule[0]?.dueAt,
      createdAt
    );
    const active =
      reviewSource.active === true ||
      source.reviewActive === true ||
      stage === "review" ||
      attempts.length > 0;

    return {
      ...source,
      schemaVersion: 1,
      passageId,
      title,
      stage,
      stageHistory: normalizeStageHistory(
        source.stageHistory || source.stages,
        stage,
        createdAt
      ),
      paragraphGists: normalizeParagraphGists(
        source.paragraphGists || source.paragraphAnswers
      ),
      sentenceReveals: normalizeSentenceReveals(
        source.sentenceReveals || source.revealedSentences,
        createdAt
      ),
      savedExpressions: normalizeExpressions(
        source.savedExpressions || source.expressions,
        passageId,
        createdAt
      ),
      outputs: normalizeOutputs(source),
      review: {
        ...reviewSource,
        active,
        activatedAt: optionalIso(
          reviewSource.activatedAt || source.reviewActivatedAt,
          ""
        ),
        dueAt,
        schedule,
        attempts,
        mastery: normalizeMastery(
          reviewSource.mastery || source.mastery,
          attempts
        ),
        lapseCount: asNonNegativeInteger(
          reviewSource.lapseCount ?? source.lapseCount,
          attempts.filter((attempt) => attempt.rating === "forgotten").length
        ),
        streak: asNonNegativeInteger(reviewSource.streak ?? source.streak, 0),
        lastReviewedAt: optionalIso(
          reviewSource.lastReviewedAt ||
            source.lastReviewedAt ||
            attempts.at(-1)?.attemptedAt,
          ""
        ),
      },
      createdAt,
      updatedAt: toIso(source.updatedAt, createdAt),
    };
  }

  function transitionPassageStage(progress, nextStage, options = {}) {
    if (isObject(nextStage)) {
      options = nextStage;
      nextStage = undefined;
    }
    const now = resolveNow(options);
    const normalized = normalizePassageProgress(progress, { ...options, now });
    const currentIndex = PASSAGE_STAGES.indexOf(normalized.stage);
    const requestedStage =
      nextStage === undefined || nextStage === null || nextStage === ""
        ? PASSAGE_STAGES[Math.min(currentIndex + 1, PASSAGE_STAGES.length - 1)]
        : normalizeStage(nextStage);
    const requestedIndex = PASSAGE_STAGES.indexOf(requestedStage);

    if (requestedIndex === currentIndex) return normalized;
    if (requestedIndex < currentIndex) {
      throw new RangeError(
        `Cannot move passage stage backward from ${normalized.stage} to ${requestedStage}.`
      );
    }
    if (requestedIndex !== currentIndex + 1) {
      throw new RangeError(
        `Passage stages advance one stage at a time; cannot move from ${normalized.stage} to ${requestedStage}.`
      );
    }

    const history = normalized.stageHistory.map((entry) => ({ ...entry }));
    let currentRecordIndex = -1;
    for (let index = history.length - 1; index >= 0; index -= 1) {
      if (history[index].stage === normalized.stage) {
        currentRecordIndex = index;
        break;
      }
    }
    if (currentRecordIndex === -1) {
      history.push({
        stage: normalized.stage,
        startedAt: normalized.updatedAt || normalized.createdAt,
        completedAt: now,
      });
    } else {
      history[currentRecordIndex] = {
        ...history[currentRecordIndex],
        completedAt: history[currentRecordIndex].completedAt || now,
      };
    }
    history.push({
      stage: requestedStage,
      startedAt: now,
      completedAt: "",
    });

    const result = {
      ...normalized,
      stage: requestedStage,
      stageHistory: history,
      updatedAt: now,
    };

    if (requestedStage === "review") {
      const schedule = buildReviewSchedule(now);
      result.review = {
        ...normalized.review,
        active: true,
        activatedAt: now,
        dueAt: schedule[0].dueAt,
        schedule,
      };
    }
    return result;
  }

  function recordParagraphGist(progress, paragraphId, answer, options = {}) {
    const id = asText(paragraphId);
    if (!id) throw new TypeError("paragraphId is required.");
    const now = resolveNow(options);
    const normalized = normalizePassageProgress(progress, { ...options, now });
    return {
      ...normalized,
      paragraphGists: {
        ...normalized.paragraphGists,
        [id]: {
          answer: asText(answer),
          referenceAnswer: asText(options.referenceAnswer),
          selfRating: asText(options.selfRating),
          updatedAt: now,
        },
      },
      updatedAt: now,
    };
  }

  function revealSentence(progress, sentenceId, layer = "translation", options = {}) {
    if (isObject(layer)) {
      options = layer;
      layer = options.layer || "translation";
    }
    const id = asText(sentenceId);
    const revealLayer = asText(layer) || "translation";
    if (!id) throw new TypeError("sentenceId is required.");
    const now = resolveNow(options);
    const normalized = normalizePassageProgress(progress, { ...options, now });
    const previous = normalized.sentenceReveals[id] || {
      layers: [],
      firstRevealedAt: "",
      updatedAt: "",
    };
    const layers = uniqueStrings([...(previous.layers || []), revealLayer]);
    return {
      ...normalized,
      sentenceReveals: {
        ...normalized.sentenceReveals,
        [id]: {
          ...previous,
          layers,
          firstRevealedAt: previous.firstRevealedAt || now,
          updatedAt: now,
          [revealLayer]: true,
        },
      },
      updatedAt: now,
    };
  }

  function saveExpression(progress, expression, options = {}) {
    const now = resolveNow(options);
    const normalized = normalizePassageProgress(progress, { ...options, now });
    const incoming = normalizeExpression(
      expression,
      normalized.passageId,
      now
    );
    if (!incoming) throw new TypeError("An expression with non-empty text is required.");
    const key = expressionKey(incoming, normalized.passageId);
    const index = normalized.savedExpressions.findIndex(
      (entry) => expressionKey(entry, normalized.passageId) === key
    );
    const expressions = normalized.savedExpressions.map((entry) => ({ ...entry }));
    if (index === -1) {
      expressions.push({
        ...incoming,
        savedAt: now,
        updatedAt: now,
      });
    } else {
      const previous = expressions[index];
      expressions[index] = {
        ...previous,
        ...Object.fromEntries(
          Object.entries(incoming).filter(
            ([field, value]) =>
              !["savedAt", "updatedAt"].includes(field) && value !== ""
          )
        ),
        id: previous.id,
        savedAt: previous.savedAt || now,
        updatedAt: now,
      };
    }
    return {
      ...normalized,
      savedExpressions: expressions,
      updatedAt: now,
    };
  }

  function recordPassageOutput(progress, type, content, options = {}) {
    let updates;
    if (isObject(type)) {
      updates = type;
      options = isObject(content) ? content : options;
    } else {
      const outputType = asText(type);
      if (!["summary", "retell"].includes(outputType)) {
        throw new RangeError("Passage output type must be summary or retell.");
      }
      updates = { [outputType]: content };
    }
    const now = resolveNow(options);
    const normalized = normalizePassageProgress(progress, { ...options, now });
    const nextOutputs = {
      ...normalized.outputs,
    };
    ["summary", "retell"].forEach((outputType) => {
      if (Object.prototype.hasOwnProperty.call(updates, outputType)) {
        nextOutputs[outputType] = asText(updates[outputType]);
      }
    });
    nextOutputs.updatedAt = now;
    return {
      ...normalized,
      outputs: nextOutputs,
      updatedAt: now,
    };
  }

  function recordReviewAttempt(progress, rating, options = {}) {
    const normalizedRating = asText(rating).toLowerCase();
    if (!REVIEW_RATINGS.includes(normalizedRating)) {
      throw new RangeError(
        "Review rating must be forgotten, hard, or mastered."
      );
    }
    const now = resolveNow(options);
    const normalized = normalizePassageProgress(progress, { ...options, now });
    const nextDueAt = addDaysIso(now, REVIEW_INTERVAL_DAYS[normalizedRating]);
    const answer = asText(options.answer);
    const attempt = {
      rating: normalizedRating,
      attemptedAt: now,
      previousDueAt: normalized.review.dueAt,
      nextDueAt,
      ...(answer ? { answer } : {}),
    };
    const schedule = normalized.review.schedule.map((entry) => {
      if (!entry.completedAt && new Date(entry.dueAt).getTime() <= new Date(now).getTime()) {
        return {
          ...entry,
          completedAt: now,
          rating: normalizedRating,
        };
      }
      return { ...entry };
    });
    const previousStreak = asNonNegativeInteger(normalized.review.streak, 0);
    const mastery =
      normalizedRating === "forgotten"
        ? "learning"
        : normalizedRating === "hard"
          ? "reviewing"
          : "mastered";
    const streak =
      normalizedRating === "forgotten"
        ? 0
        : normalizedRating === "mastered"
          ? previousStreak + 1
          : previousStreak;

    return {
      ...normalized,
      review: {
        ...normalized.review,
        active: true,
        activatedAt: normalized.review.activatedAt || now,
        dueAt: nextDueAt,
        schedule,
        attempts: [...normalized.review.attempts, attempt],
        mastery,
        lapseCount:
          asNonNegativeInteger(normalized.review.lapseCount, 0) +
          (normalizedRating === "forgotten" ? 1 : 0),
        streak,
        lastReviewedAt: now,
      },
      updatedAt: now,
    };
  }

  function progressCollection(progresses) {
    if (Array.isArray(progresses)) return progresses;
    if (!isObject(progresses)) return [];
    if (progresses.passageId || progresses.id || progresses.slug) return [progresses];
    return Object.values(progresses);
  }

  function endOfUtcDayTime(value) {
    const date = new Date(toIso(value));
    date.setUTCHours(23, 59, 59, 999);
    return date.getTime();
  }

  function duePassageReviews(progresses, options = {}) {
    const asOf = resolveNow(options);
    const cutoff = endOfUtcDayTime(asOf);
    return progressCollection(progresses)
      .filter(isObject)
      .map((progress) => normalizePassageProgress(progress, { now: asOf }))
      .filter(
        (progress) =>
          progress.review.active &&
          new Date(progress.review.dueAt).getTime() <= cutoff
      )
      .sort((left, right) => {
        const dateDifference =
          new Date(left.review.dueAt).getTime() -
          new Date(right.review.dueAt).getTime();
        if (dateDifference) return dateDifference;
        return (left.title || left.passageId).localeCompare(
          right.title || right.passageId
        );
      });
  }

  function passageMetrics(progress, options = {}) {
    const asOf = resolveNow(options);
    const normalized = normalizePassageProgress(progress, { ...options, now: asOf });
    const stageIndex = PASSAGE_STAGES.indexOf(normalized.stage);
    const attempts = normalized.review.attempts;
    const masteredReviewCount = attempts.filter(
      (attempt) => attempt.rating === "mastered"
    ).length;
    return {
      passageId: normalized.passageId,
      stage: normalized.stage,
      completedStageCount: normalized.stageHistory.filter(
        (entry) => Boolean(entry.completedAt)
      ).length,
      stageProgressPercent: Math.round(
        (stageIndex / (PASSAGE_STAGES.length - 1)) * 100
      ),
      paragraphGistCount: Object.keys(normalized.paragraphGists).length,
      revealedSentenceCount: Object.keys(normalized.sentenceReveals).length,
      savedExpressionCount: normalized.savedExpressions.length,
      outputCount: ["summary", "retell"].filter(
        (key) => Boolean(normalized.outputs[key])
      ).length,
      reviewAttemptCount: attempts.length,
      masteredReviewCount,
      retentionRate: attempts.length ? masteredReviewCount / attempts.length : 0,
      mastery: normalized.review.mastery,
      dueAt: normalized.review.dueAt,
      isDue:
        normalized.review.active &&
        new Date(normalized.review.dueAt).getTime() <= endOfUtcDayTime(asOf),
    };
  }

  return {
    PASSAGE_STAGES,
    REVIEW_RATINGS,
    buildReviewSchedule,
    createPassageProgress,
    normalizePassageProgress,
    transitionPassageStage,
    recordParagraphGist,
    revealSentence,
    saveExpression,
    recordPassageOutput,
    recordReviewAttempt,
    duePassageReviews,
    passageMetrics,
  };
});
