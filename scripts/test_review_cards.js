const assert = require("assert");
const {
  buildReadingReviewCard,
  buildReviewAnkiCandidate,
  inferReadingErrorType,
} = require("../review-utils.js");

assert.strictEqual(inferReadingErrorType({ type: "TRUE / FALSE / NOT GIVEN" }, "FALSE"), "判断题证据边界");
assert.strictEqual(inferReadingErrorType({ type: "yes-no-not-given" }, "YES"), "判断题证据边界");
assert.strictEqual(inferReadingErrorType({ type: "sentence_completion" }, "word"), "定位词、词形与字数限制");
assert.strictEqual(inferReadingErrorType({ type: "Matching Headings" }, "iv"), "段落主旨与定位");
assert.strictEqual(inferReadingErrorType({ type: "multiple-choice" }, "B"), "同义替换与干扰项");
assert.strictEqual(inferReadingErrorType({ type: "multiple-choice" }, ""), "未作答/时间管理");

const card = buildReadingReviewCard(
  {
    number: 7,
    type: "multiple_choice",
    prompt: "Why did the researchers change the method?",
    answer: "B",
    evidence: "The original procedure produced inconsistent results.",
    evidenceLocation: { passage: 2, paragraph: "C", sentence: 3 },
    synonymSubstitutions: [
      { question: "change the method", passage: "altered the procedure" },
      "inconsistent = unreliable",
    ],
    distractors: ["A：只提到时间，没有说明改变原因。", "C：与原文因果方向相反。"],
  },
  "A",
  {
    testId: "cambridge-21-test-1-reading",
    source: "Cambridge 21 Test 1",
    createdAt: "2026-07-28T00:00:00.000Z",
  }
);

assert.strictEqual(card.questionKey, "cambridge-21-test-1-reading:Q7");
assert.strictEqual(card.errorType, "同义替换与干扰项");
assert.strictEqual(card.evidenceLocation, "Passage 2 · Paragraph C · Sentence 3");
assert.deepStrictEqual(card.synonymSubstitutions, [
  "change the method ↔ altered the procedure",
  "inconsistent = unreliable",
]);
assert.strictEqual(card.distractorAnalysis.length, 2);
assert.deepStrictEqual(
  card.reviewSchedule.map((entry) => [entry.day, entry.dueAt]),
  [
    [1, "2026-07-29T00:00:00.000Z"],
    [3, "2026-07-31T00:00:00.000Z"],
    [7, "2026-08-04T00:00:00.000Z"],
  ]
);

const sparse = buildReadingReviewCard(
  { number: 12, answer: "FALSE", evidence: "No increase was recorded." },
  "",
  { source: "Imported test" }
);
assert.strictEqual(sparse.prompt, "Q12");
assert.deepStrictEqual(sparse.synonymSubstitutions, []);
assert.deepStrictEqual(sparse.distractorAnalysis, []);
assert.strictEqual(sparse.evidenceLocation, "");

const evidenceDataCard = buildReadingReviewCard(
  {
    number: 18,
    answer: "NOT GIVEN",
    evidence: ["C21-T3-P1-S2", "C21-T3-P1-S3"],
    evidenceData: { text: "The report did not compare the two groups.", section: "Passage 1" },
  },
  "FALSE",
  { testId: "c21-t3" }
);
assert.strictEqual(evidenceDataCard.evidence, "The report did not compare the two groups.");
assert.deepStrictEqual(evidenceDataCard.evidenceSentenceIds, ["C21-T3-P1-S2", "C21-T3-P1-S3"]);

const mappedDistractors = buildReadingReviewCard(
  {
    number: 19,
    answer: "C",
    distractorAnalysis: {
      A: "只复述背景，没有回答原因。",
      B: "把结果误当成原因。",
    },
  },
  "B",
  { testId: "mapped-distractors" }
);
assert.deepStrictEqual(mappedDistractors.distractorAnalysis, [
  "A：只复述背景，没有回答原因。",
  "B：把结果误当成原因。",
]);

const anki = buildReviewAnkiCandidate(card);
assert(anki.front.includes("Why did the researchers change the method?"));
assert(anki.back.includes("正确答案：B"));
assert(anki.back.includes("原文证据：The original procedure produced inconsistent results."));
assert(anki.back.includes("change the method ↔ altered the procedure"));
assert.strictEqual(anki.tags, "ielts reading wrong-answer");

console.log("PASS: reading review cards normalize question types, evidence, explanations, schedules, and Anki candidates.");
