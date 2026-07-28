(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.IELTS_REVIEW_UTILS = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function asText(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value).trim();
    if (Array.isArray(value)) return value.map(asText).filter(Boolean).join("；");
    if (typeof value === "object") {
      return asText(value.text || value.quote || value.evidence || value.value || value.explanation);
    }
    return String(value).trim();
  }

  function asList(value) {
    if (value === null || value === undefined || value === "") return [];
    return (Array.isArray(value) ? value : [value]).flatMap((item) => {
      if (item === null || item === undefined || item === "") return [];
      if (typeof item !== "object") return [String(item).trim()].filter(Boolean);
      const left = asText(item.question || item.prompt || item.from || item.term);
      const right = asText(item.passage || item.evidence || item.to || item.paraphrase);
      if (left && right) return [`${left} ↔ ${right}`];
      const rendered = asText(item);
      if (rendered) return [rendered];
      return Object.entries(item)
        .map(([key, nestedValue]) => {
          const text = asText(nestedValue);
          return text ? `${key}：${text}` : "";
        })
        .filter(Boolean);
    });
  }

  function formatEvidenceLocation(value) {
    if (!value) return "";
    if (typeof value !== "object") return asText(value);
    const parts = [];
    const passage = value.passage ?? value.passageNumber;
    const paragraph = value.paragraph ?? value.paragraphLabel;
    const sentence = value.sentence ?? value.sentenceNumber;
    const lines = value.lines ?? value.line;
    if (passage !== undefined && passage !== "") parts.push(`Passage ${passage}`);
    if (paragraph !== undefined && paragraph !== "") parts.push(`Paragraph ${paragraph}`);
    if (sentence !== undefined && sentence !== "") parts.push(`Sentence ${sentence}`);
    if (lines !== undefined && lines !== "") parts.push(`Line ${lines}`);
    return parts.length ? parts.join(" · ") : asText(value);
  }

  function normalizeType(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[_/–—-]+/g, " ")
      .replace(/\s+/g, " ");
  }

  function readingTypeFamily(question) {
    const type = normalizeType(question?.type || question?.questionType);
    if (
      type === "tfng" ||
      type === "ynng" ||
      (type.includes("not given") && (type.includes("true") || type.includes("yes")))
    ) {
      return "judgement";
    }
    if (type.includes("matching") || type.includes("heading") || type.includes("classification")) {
      return "matching";
    }
    if (type.includes("multiple choice") || type.includes("selection") || type === "choice") {
      return "choice";
    }
    if (
      type.includes("completion") ||
      type.includes("labelling") ||
      type.includes("labeling") ||
      type.includes("short answer")
    ) {
      return "completion";
    }
    const options = Array.isArray(question?.options) ? question.options.map(asText) : [];
    if (options.some((option) => /^(true|false|yes|no|not given)$/i.test(option))) return "judgement";
    if (options.length) return "choice";
    return "unknown";
  }

  function inferReadingErrorType(question, userAnswer) {
    if (!String(userAnswer ?? "").trim()) return "未作答/时间管理";
    const family = readingTypeFamily(question);
    if (family === "judgement") return "判断题证据边界";
    if (family === "completion") return "定位词、词形与字数限制";
    if (family === "matching") return "段落主旨与定位";
    if (family === "choice") return "同义替换与干扰项";
    return "同义替换/细节定位";
  }

  function reviewNextAction(errorType) {
    const actions = {
      "未作答/时间管理": "复现定位过程，并记录从题干到证据句所用时间。",
      "判断题证据边界": "圈出原文明确陈述的范围，区分相反信息与未提及信息。",
      "定位词、词形与字数限制": "核对定位词、词性、单复数和题目字数限制。",
      "段落主旨与定位": "为相关段落写一句主旨，再核对题干关键词的落点。",
      "同义替换与干扰项": "逐项说明为什么正确选项受证据支持、其他选项为什么不成立。",
    };
    return actions[errorType] || "把题干表达和原文证据并排记录，标出同义替换。";
  }

  function addDaysIso(createdAt, days) {
    const date = createdAt ? new Date(createdAt) : new Date();
    const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
    safeDate.setUTCDate(safeDate.getUTCDate() + days);
    return safeDate.toISOString();
  }

  function buildReadingReviewCard(question, userAnswer, context = {}) {
    const number = question?.number ?? question?.questionNumber ?? "";
    const prompt = asText(question?.prompt || question?.stem) || (number !== "" ? `Q${number}` : "Reading question");
    const createdAt = context.createdAt || new Date().toISOString();
    const errorType = inferReadingErrorType(question, userAnswer);
    const testId = asText(context.testId || context.source || "reading");
    const location = question?.evidenceLocation ?? question?.location ?? question?.locator;
    const synonyms =
      question?.synonymSubstitutions ??
      question?.synonyms ??
      question?.paraphrases;
    const distractors =
      question?.distractors ??
      question?.distractorAnalysis ??
      question?.distractorRationale ??
      question?.distractorsZh;
    const evidenceSentenceIds = Array.isArray(question?.evidence)
      ? question.evidence.map(asText).filter(Boolean)
      : [];
    const evidence = asText(question?.evidenceData?.text) || (evidenceSentenceIds.length ? "" : asText(question?.evidence));

    return {
      schemaVersion: 1,
      questionKey: `${testId}:Q${number || "?"}`,
      number,
      prompt,
      userAnswer: asText(userAnswer),
      correctAnswer: asText(question?.answer),
      errorType,
      evidence,
      evidenceSentenceIds,
      evidenceLocation: formatEvidenceLocation(location),
      synonymSubstitutions: asList(synonyms),
      distractorAnalysis: asList(distractors),
      learnerDiagnosis: "",
      nextAction: reviewNextAction(errorType),
      reviewSchedule: [1, 3, 7].map((day) => ({
        day,
        label: `第${day}天`,
        dueAt: addDaysIso(createdAt, day),
        completedAt: "",
      })),
      createdAt,
      source: asText(context.source),
    };
  }

  function buildReviewAnkiCandidate(card) {
    const details = [
      `正确答案：${card.correctAnswer || "—"}`,
      card.evidence ? `原文证据：${card.evidence}` : "",
      card.evidenceLocation ? `证据位置：${card.evidenceLocation}` : "",
      card.synonymSubstitutions?.length ? `同义替换：${card.synonymSubstitutions.join("；")}` : "",
      card.distractorAnalysis?.length ? `干扰项：${card.distractorAnalysis.join("；")}` : "",
      card.nextAction ? `下次动作：${card.nextAction}` : "",
    ].filter(Boolean);
    return {
      front: `Q${card.number || "?"}：${card.prompt}`,
      back: details.join("\n"),
      tags: "ielts reading wrong-answer",
      source: card.source || "",
      errorKey: card.questionKey || "",
    };
  }

  return {
    asList,
    buildReadingReviewCard,
    buildReviewAnkiCandidate,
    formatEvidenceLocation,
    inferReadingErrorType,
    readingTypeFamily,
  };
});
