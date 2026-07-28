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

  function submittedAnswer(question, answers) {
    if (!question || !answers) return "";
    const keys = [question.id, `Q${question.number}`, `R${question.number}`, String(question.number)].filter(Boolean);
    const key = keys.find((candidate) => Object.prototype.hasOwnProperty.call(answers, candidate));
    return key ? answers[key] : "";
  }

  function answerMatchesInContext(question, userAnswer, questions = [], answers = {}) {
    if (question?.acceptedAnswerMode !== "paired_blanks_in_either_order" || !question?.pairedWith) {
      return answerMatches(question, userAnswer);
    }
    const partner = questions.find((candidate) => Number(candidate.number) === Number(question.pairedWith));
    if (!partner) return answerMatches(question, userAnswer);

    const group = [question, partner].sort((a, b) => Number(a.number) - Number(b.number));
    const officialGroups = group.map(acceptedAnswerVariants);
    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    const matchedGroup = officialGroups.findIndex((variants) => variants.includes(normalizedUserAnswer));
    if (matchedGroup < 0) return false;

    const currentIndex = group.findIndex((candidate) => candidate === question || Number(candidate.number) === Number(question.number));
    const matchedBeforeOrAt = group.slice(0, currentIndex + 1).filter((candidate) => {
      const submitted = normalizeAnswer(submittedAnswer(candidate, answers));
      return officialGroups[matchedGroup].includes(submitted);
    }).length;
    const available = officialGroups.filter((variants) =>
      variants.some((variant) => officialGroups[matchedGroup].includes(variant))
    ).length;
    return matchedBeforeOrAt <= available;
  }

  return {
    normalizeAnswer,
    acceptedAnswerVariants,
    answerMatches,
    answerMatchesInContext,
  };
});
