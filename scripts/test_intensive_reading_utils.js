const assert = require("node:assert/strict");
const intensiveReadingUtils = require("../intensive-reading-utils.js");
const {
  PASSAGE_STAGES,
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
} = intensiveReadingUtils;

const START = "2026-07-31T08:00:00.000Z";

assert.strictEqual(
  globalThis.IELTS_INTENSIVE_READING_UTILS,
  intensiveReadingUtils,
  "the CommonJS and browser-compatible UMD entry points should expose the same API"
);
assert.deepStrictEqual(PASSAGE_STAGES, [
  "pre-read",
  "timed-read",
  "deep-read",
  "output",
  "review",
]);

const created = createPassageProgress(
  {
    id: "cambridge-21-test-1-passage-1",
    title: "The future of work",
  },
  { now: START }
);

assert.strictEqual(created.schemaVersion, 1);
assert.strictEqual(created.passageId, "cambridge-21-test-1-passage-1");
assert.strictEqual(created.title, "The future of work");
assert.strictEqual(created.stage, "pre-read");
assert.deepStrictEqual(created.stageHistory, [
  {
    stage: "pre-read",
    startedAt: START,
    completedAt: "",
  },
]);
assert.deepStrictEqual(created.paragraphGists, {});
assert.deepStrictEqual(created.sentenceReveals, {});
assert.deepStrictEqual(created.savedExpressions, []);
assert.deepStrictEqual(created.outputs, {
  summary: "",
  retell: "",
  updatedAt: "",
});
assert.deepStrictEqual(
  created.review.schedule.map(({ day, label, dueAt }) => ({ day, label, dueAt })),
  [
    { day: 0, label: "今天", dueAt: "2026-07-31T08:00:00.000Z" },
    { day: 1, label: "第1天", dueAt: "2026-08-01T08:00:00.000Z" },
    { day: 3, label: "第3天", dueAt: "2026-08-03T08:00:00.000Z" },
    { day: 7, label: "第7天", dueAt: "2026-08-07T08:00:00.000Z" },
  ]
);
assert.strictEqual(created.review.active, false);
assert.strictEqual(created.review.dueAt, "2026-07-31T08:00:00.000Z");
assert.strictEqual(created.review.mastery, "new");

const frozenCreated = structuredClone(created);
const timed = transitionPassageStage(created, undefined, {
  now: "2026-07-31T08:05:00.000Z",
});
assert.deepStrictEqual(created, frozenCreated, "stage transitions must not mutate their input");
assert.strictEqual(timed.stage, "timed-read");
assert.strictEqual(timed.stageHistory[0].completedAt, "2026-07-31T08:05:00.000Z");
assert.deepStrictEqual(timed.stageHistory[1], {
  stage: "timed-read",
  startedAt: "2026-07-31T08:05:00.000Z",
  completedAt: "",
});

const deep = transitionPassageStage(timed, "deep-read", {
  now: "2026-07-31T08:15:00.000Z",
});
const output = transitionPassageStage(deep, "output", {
  now: "2026-07-31T08:30:00.000Z",
});
const review = transitionPassageStage(output, "review", {
  now: "2026-07-31T08:45:00.000Z",
});
assert.strictEqual(review.stage, "review");
assert.strictEqual(review.review.active, true);
assert.strictEqual(review.review.activatedAt, "2026-07-31T08:45:00.000Z");
assert.strictEqual(review.review.dueAt, "2026-07-31T08:45:00.000Z");
assert.deepStrictEqual(
  review.review.schedule.map((entry) => entry.dueAt),
  [
    "2026-07-31T08:45:00.000Z",
    "2026-08-01T08:45:00.000Z",
    "2026-08-03T08:45:00.000Z",
    "2026-08-07T08:45:00.000Z",
  ],
  "the review plan starts when the passage reaches the review stage"
);
assert.throws(
  () => transitionPassageStage(review, "deep-read", { now: START }),
  /cannot move.*review.*deep-read/i
);
assert.throws(
  () => transitionPassageStage(created, "output", { now: START }),
  /one stage at a time/i
);
assert.strictEqual(
  transitionPassageStage(review, "review", { now: START }).stage,
  "review",
  "same-stage transitions should be idempotent"
);

let learning = recordParagraphGist(
  review,
  "paragraph-a",
  "The paragraph contrasts two explanations.",
  {
    referenceAnswer: "A contrast between environmental and social explanations.",
    selfRating: "hard",
    now: "2026-07-31T08:50:00.000Z",
  }
);
assert.deepStrictEqual(learning.paragraphGists["paragraph-a"], {
  answer: "The paragraph contrasts two explanations.",
  referenceAnswer: "A contrast between environmental and social explanations.",
  selfRating: "hard",
  updatedAt: "2026-07-31T08:50:00.000Z",
});

learning = revealSentence(learning, "paragraph-a-sentence-2", "translation", {
  now: "2026-07-31T08:51:00.000Z",
});
learning = revealSentence(learning, "paragraph-a-sentence-2", "structure", {
  now: "2026-07-31T08:52:00.000Z",
});
assert.deepStrictEqual(
  learning.sentenceReveals["paragraph-a-sentence-2"].layers,
  ["translation", "structure"]
);
assert.strictEqual(
  learning.sentenceReveals["paragraph-a-sentence-2"].firstRevealedAt,
  "2026-07-31T08:51:00.000Z"
);
assert.strictEqual(
  learning.sentenceReveals["paragraph-a-sentence-2"].updatedAt,
  "2026-07-31T08:52:00.000Z"
);

learning = saveExpression(
  learning,
  {
    text: "be attributed to",
    meaning: "归因于",
    sentenceId: "paragraph-a-sentence-2",
    note: "Use with a cause.",
  },
  { now: "2026-07-31T08:53:00.000Z" }
);
learning = saveExpression(
  learning,
  {
    text: "BE ATTRIBUTED TO",
    meaning: "被归因于",
    sentenceId: "paragraph-a-sentence-2",
  },
  { now: "2026-07-31T08:54:00.000Z" }
);
assert.strictEqual(learning.savedExpressions.length, 1, "saved expressions should be de-duplicated");
assert.strictEqual(learning.savedExpressions[0].meaning, "被归因于");
assert.strictEqual(learning.savedExpressions[0].savedAt, "2026-07-31T08:53:00.000Z");
assert.strictEqual(learning.savedExpressions[0].updatedAt, "2026-07-31T08:54:00.000Z");

learning = recordPassageOutput(
  learning,
  "summary",
  "The text compares two competing accounts of workplace change.",
  { now: "2026-07-31T08:55:00.000Z" }
);
learning = recordPassageOutput(
  learning,
  { retell: "First, the author presents the old view. Then, new evidence challenges it." },
  { now: "2026-07-31T08:56:00.000Z" }
);
assert.strictEqual(
  learning.outputs.summary,
  "The text compares two competing accounts of workplace change."
);
assert.match(learning.outputs.retell, /new evidence challenges it/);
assert.strictEqual(learning.outputs.updatedAt, "2026-07-31T08:56:00.000Z");

const beforeAttempt = structuredClone(learning);
const forgotten = recordReviewAttempt(learning, "forgotten", {
  now: "2026-07-31T09:00:00.000Z",
  answer: "I could not recall the argument.",
});
assert.deepStrictEqual(learning, beforeAttempt, "review updates must not mutate their input");
assert.strictEqual(forgotten.review.dueAt, "2026-08-01T09:00:00.000Z");
assert.strictEqual(forgotten.review.mastery, "learning");
assert.strictEqual(forgotten.review.lapseCount, 1);
assert.strictEqual(forgotten.review.streak, 0);
assert.deepStrictEqual(forgotten.review.attempts[0], {
  rating: "forgotten",
  attemptedAt: "2026-07-31T09:00:00.000Z",
  previousDueAt: "2026-07-31T08:45:00.000Z",
  nextDueAt: "2026-08-01T09:00:00.000Z",
  answer: "I could not recall the argument.",
});

const hard = recordReviewAttempt(forgotten, "hard", {
  now: "2026-08-01T09:00:00.000Z",
});
assert.strictEqual(hard.review.dueAt, "2026-08-04T09:00:00.000Z");
assert.strictEqual(hard.review.mastery, "reviewing");
assert.strictEqual(hard.review.lapseCount, 1);
assert.strictEqual(hard.review.streak, 0);

const mastered = recordReviewAttempt(hard, "mastered", {
  now: "2026-08-04T09:00:00.000Z",
  answer: "The author contrasts two explanations and supports the second.",
});
assert.strictEqual(mastered.review.dueAt, "2026-08-11T09:00:00.000Z");
assert.strictEqual(mastered.review.mastery, "mastered");
assert.strictEqual(mastered.review.streak, 1);
assert.strictEqual(mastered.review.attempts.length, 3);
assert.throws(
  () => recordReviewAttempt(mastered, "easy", { now: START }),
  /forgotten, hard, or mastered/i
);

const legacy = {
  id: "legacy-passage",
  name: "Legacy passage",
  currentStage: "deep_read",
  paragraphAnswers: {
    A: "A legacy main-idea answer.",
  },
  revealedSentences: ["a-1", "a-2"],
  expressions: [
    {
      phrase: "in light of",
      translation: "鉴于",
      sentence: "a-2",
    },
  ],
  summary: "A summary imported from the old format.",
  retell: "A retell imported from the old format.",
  reviewSchedule: [
    {
      day: 1,
      dueAt: "2026-08-01T00:00:00.000Z",
    },
  ],
  reviewAttempts: [
    {
      rating: "hard",
      attemptedAt: "2026-07-30T00:00:00.000Z",
      nextDueAt: "2026-08-02T00:00:00.000Z",
    },
  ],
  dueAt: "2026-08-02T00:00:00.000Z",
  mastery: "reviewing",
};
const legacyBefore = structuredClone(legacy);
const normalizedLegacy = normalizePassageProgress(legacy, {
  now: "2026-07-31T00:00:00.000Z",
});
assert.deepStrictEqual(legacy, legacyBefore, "normalization must not mutate legacy data");
assert.strictEqual(normalizedLegacy.passageId, "legacy-passage");
assert.strictEqual(normalizedLegacy.title, "Legacy passage");
assert.strictEqual(normalizedLegacy.stage, "deep-read");
assert.strictEqual(normalizedLegacy.paragraphGists.A.answer, "A legacy main-idea answer.");
assert.deepStrictEqual(Object.keys(normalizedLegacy.sentenceReveals), ["a-1", "a-2"]);
assert.strictEqual(normalizedLegacy.savedExpressions[0].text, "in light of");
assert.strictEqual(normalizedLegacy.savedExpressions[0].meaning, "鉴于");
assert.strictEqual(normalizedLegacy.outputs.summary, "A summary imported from the old format.");
assert.strictEqual(normalizedLegacy.outputs.retell, "A retell imported from the old format.");
assert.strictEqual(normalizedLegacy.review.dueAt, "2026-08-02T00:00:00.000Z");
assert.strictEqual(normalizedLegacy.review.mastery, "reviewing");
assert.strictEqual(normalizedLegacy.review.attempts.length, 1);

const missing = normalizePassageProgress(null, {
  passageId: "missing-state-passage",
  title: "Recovered passage",
  now: START,
});
assert.strictEqual(missing.passageId, "missing-state-passage");
assert.strictEqual(missing.stage, "pre-read");
assert.strictEqual(missing.createdAt, START);

const dueReview = {
  ...review,
  passageId: "due-review",
  title: "Due now",
};
const futureReview = {
  ...review,
  passageId: "future-review",
  title: "Due later",
  review: {
    ...review.review,
    dueAt: "2026-08-10T00:00:00.000Z",
  },
};
const inactiveReview = {
  ...created,
  passageId: "inactive-review",
  title: "Not yet studied",
};
const dueQueue = duePassageReviews(
  {
    future: futureReview,
    inactive: inactiveReview,
    due: dueReview,
    malformed: null,
  },
  { asOf: "2026-07-31T23:59:59.999Z" }
);
assert.deepStrictEqual(
  dueQueue.map((item) => item.passageId),
  ["due-review"],
  "only active reviews due at or before the cutoff should appear"
);
assert.notStrictEqual(dueQueue[0], dueReview, "the due queue should return normalized copies");

const metrics = passageMetrics(mastered, {
  asOf: "2026-08-11T09:00:00.000Z",
});
assert.deepStrictEqual(metrics, {
  passageId: "cambridge-21-test-1-passage-1",
  stage: "review",
  completedStageCount: 4,
  stageProgressPercent: 100,
  paragraphGistCount: 1,
  revealedSentenceCount: 1,
  savedExpressionCount: 1,
  outputCount: 2,
  reviewAttemptCount: 3,
  masteredReviewCount: 1,
  retentionRate: 1 / 3,
  mastery: "mastered",
  dueAt: "2026-08-11T09:00:00.000Z",
  isDue: true,
});

const noAttemptsMetrics = passageMetrics(created, { asOf: START });
assert.strictEqual(noAttemptsMetrics.retentionRate, 0);
assert.strictEqual(noAttemptsMetrics.stageProgressPercent, 0);
assert.strictEqual(noAttemptsMetrics.isDue, false, "inactive reviews are never due");

const stringProgress = createPassageProgress("string-passage", {
  now: new Date(START),
});
assert.strictEqual(stringProgress.passageId, "string-passage");
assert.strictEqual(
  createPassageProgress(null, { now: START }).passageId,
  "unknown-passage"
);

const migratedHistory = normalizePassageProgress(
  {
    passageId: "history-migration",
    stage: "timed-read",
    createdAt: START,
    stageHistory: [
      {
        stage: "pre-read",
        startedAt: START,
        completedAt: "2026-07-31T08:03:00.000Z",
      },
    ],
    paragraphGists: [
      {
        paragraphId: "B",
        gist: "The paragraph qualifies the earlier claim.",
      },
    ],
    sentenceReveals: [
      {
        sentenceId: "b-1",
        revealed: ["translation", "vocabulary"],
        revealedAt: true,
      },
    ],
  },
  { now: START }
);
assert.deepStrictEqual(
  migratedHistory.stageHistory.map((entry) => entry.stage),
  ["pre-read", "timed-read"]
);
assert.strictEqual(
  migratedHistory.paragraphGists.B.answer,
  "The paragraph qualifies the earlier claim."
);
assert.deepStrictEqual(
  migratedHistory.sentenceReveals["b-1"].layers,
  ["translation", "vocabulary"]
);
assert.strictEqual(
  migratedHistory.sentenceReveals["b-1"].firstRevealedAt,
  START
);

const inferredHardMastery = normalizePassageProgress(
  {
    id: "hard-inference",
    reviewAttempts: [{ rating: "hard", attemptedAt: START }],
  },
  { now: START }
);
assert.strictEqual(inferredHardMastery.review.mastery, "reviewing");
const inferredMasteredMastery = normalizePassageProgress(
  {
    id: "mastered-inference",
    reviewAttempts: [{ rating: "mastered", attemptedAt: START }],
  },
  { now: START }
);
assert.strictEqual(inferredMasteredMastery.review.mastery, "mastered");
const hiddenSentence = normalizePassageProgress(
  {
    id: "legacy-hidden-sentence",
    sentenceReveals: {
      hidden: false,
      visible: true,
    },
  },
  { now: START }
);
assert.deepStrictEqual(
  Object.keys(hiddenSentence.sentenceReveals),
  ["visible"],
  "legacy false reveal flags must remain hidden"
);

const implicitTransition = transitionPassageStage(created, {
  now: "2026-07-31T08:06:00.000Z",
});
assert.strictEqual(implicitTransition.stage, "timed-read");
const implicitReveal = revealSentence(created, "sentence-x", {
  layer: "analysis",
  now: "2026-07-31T08:07:00.000Z",
});
assert.deepStrictEqual(
  implicitReveal.sentenceReveals["sentence-x"].layers,
  ["analysis"]
);

const stringExpression = saveExpression(created, "on the grounds that", {
  now: "2026-07-31T08:08:00.000Z",
});
assert.strictEqual(stringExpression.savedExpressions[0].text, "on the grounds that");
assert.throws(
  () => recordParagraphGist(created, "", "answer", { now: START }),
  /paragraphId is required/i
);
assert.throws(
  () => revealSentence(created, "", "translation", { now: START }),
  /sentenceId is required/i
);
assert.throws(
  () => saveExpression(created, { text: " " }, { now: START }),
  /non-empty text/i
);
assert.throws(
  () => recordPassageOutput(created, "essay", "text", { now: START }),
  /summary or retell/i
);

const earlierDue = {
  ...review,
  passageId: "earlier-due",
  title: "Zulu",
  review: {
    ...review.review,
    dueAt: "2026-07-30T08:45:00.000Z",
  },
};
const alphabeticDue = {
  ...review,
  passageId: "alphabetic-due",
  title: "Alpha",
};
const laterToday = {
  ...review,
  passageId: "later-today",
  title: "Later today",
  review: {
    ...review.review,
    dueAt: "2026-07-31T22:00:00.000Z",
  },
};
assert.deepStrictEqual(
  duePassageReviews(
    [dueReview, alphabeticDue, earlierDue, futureReview],
    "2026-07-31T23:59:59.999Z"
  ).map((item) => item.passageId),
  ["earlier-due", "alphabetic-due", "due-review"]
);
assert.deepStrictEqual(
  duePassageReviews(dueReview, { asOf: "2026-07-31T23:59:59.999Z" }).map(
    (item) => item.passageId
  ),
  ["due-review"]
);
assert.deepStrictEqual(
  duePassageReviews([laterToday], { asOf: "2026-07-31T09:00:00.000Z" }).map(
    (item) => item.passageId
  ),
  ["later-today"],
  "the today queue should include reviews due later on the same calendar day"
);
assert.deepStrictEqual(duePassageReviews(null, { asOf: START }), []);

console.log(
  "PASS: intensive reading utilities cover immutable progress, active learning, legacy migration, adaptive reviews, due queues, and metrics."
);
