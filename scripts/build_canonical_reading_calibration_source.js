const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const bankPath = path.join(projectRoot, "data", "cambridge-test-bank.json");
const outputPath = path.join(
  projectRoot,
  "data",
  "canonical",
  "reading-question-calibration.v1.json",
);
const answerFields = new Set([
  "number",
  "answer",
  "answers",
  "acceptedAnswers",
  "acceptableAnswers",
]);
const testFields = [
  "draftStatus",
  "parseConfidence",
  "calibrationSource",
  "verification",
];

function buildCanonicalCalibrationSource(bank) {
  const readingTests = bank.tests
    .filter((test) => test.mode === "reading")
    .sort((left, right) => left.id.localeCompare(right.id));
  assert.equal(readingTests.length, 72, "Expected exactly 72 Reading tests");

  const tests = {};
  for (const test of readingTests) {
    assert.equal(test.questions.length, 40, `${test.id} must contain 40 questions`);
    const questions = {};
    for (const question of [...test.questions].sort(
      (left, right) => Number(left.number) - Number(right.number),
    )) {
      const number = String(Number(question.number));
      assert(!questions[number], `${test.id} contains duplicate question ${number}`);
      assert(
        String(question.evidence ?? "").trim(),
        `${test.id} Q${number} has no calibrated evidence`,
      );
      const entry = Object.fromEntries(
        Object.entries(question).filter(
          ([field, value]) => !answerFields.has(field) && value !== undefined && value !== null,
        ),
      );
      questions[number] = entry;
    }

    const testEntry = { questions };
    for (const field of testFields) {
      if (test[field] !== undefined && test[field] !== null) {
        testEntry[field] = test[field];
      }
    }
    tests[test.id] = testEntry;
  }

  return {
    schemaVersion: 1,
    kind: "ielts-reading-question-calibration",
    description:
      "Version-controlled Reading question structures, evidence and verification metadata merged after rebuilds.",
    tests,
  };
}

if (require.main === module) {
  const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
  const canonical = buildCanonicalCalibrationSource(bank);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(canonical, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(projectRoot, outputPath)} with 72 Reading tests.`);
}

module.exports = { buildCanonicalCalibrationSource };
