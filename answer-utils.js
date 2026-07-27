(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.IELTS_ANSWER_UTILS = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function normalizeAnswer(value) {
    return String(value ?? "")
      .replace(/[’‘]/g, "'")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function expandOptionalWords(value) {
    const pending = [String(value ?? "").replace(/[’‘]/g, "'")];
    const expanded = [];

    while (pending.length) {
      const current = pending.pop();
      const match = current.match(/\(([^()]*)\)/);
      if (!match) {
        expanded.push(current);
        continue;
      }

      const before = current.slice(0, match.index);
      const after = current.slice(match.index + match[0].length);
      pending.push(`${before}${after}`);
      pending.push(`${before}${match[1]}${after}`);
    }

    return expanded;
  }

  function expandOfficialNotation(value) {
    return String(value ?? "")
      .split(/\s*\/\s*/)
      .flatMap(expandOptionalWords)
      .map(normalizeAnswer)
      .filter(Boolean);
  }

  function acceptedAnswerVariants(question) {
    const declared = [
      question?.answer,
      ...(Array.isArray(question?.answers) ? question.answers : []),
      ...(Array.isArray(question?.acceptedAnswers) ? question.acceptedAnswers : []),
      ...(Array.isArray(question?.acceptableAnswers) ? question.acceptableAnswers : []),
    ];

    return [...new Set(declared.flatMap(expandOfficialNotation))];
  }

  function answerMatches(question, userAnswer) {
    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    return Boolean(normalizedUserAnswer) && acceptedAnswerVariants(question).includes(normalizedUserAnswer);
  }

  return {
    normalizeAnswer,
    acceptedAnswerVariants,
    answerMatches,
  };
});
