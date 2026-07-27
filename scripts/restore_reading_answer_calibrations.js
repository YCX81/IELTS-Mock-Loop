const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const rootBankPath = path.join(projectRoot, "data", "cambridge-test-bank.json");
const reportBankPath = path.join(
  projectRoot,
  "data",
  "generated",
  "reports",
  "cambridge-test-bank.json",
);
const browserBankPath = path.join(projectRoot, "data", "cambridge-test-bank.js");
const canonicalPath = path.join(
  projectRoot,
  "data",
  "canonical",
  "reading-answer-key.v1.json",
);

function nonBlank(value) {
  return String(value ?? "").trim();
}

function restoreQuestionAnswer(testId, question, canonicalEntry) {
  assert(canonicalEntry, `${testId} Q${question.number} has no canonical answer`);
  assert(nonBlank(canonicalEntry.answer), `${testId} Q${question.number} canonical answer is blank`);

  if (nonBlank(question.answer)) return false;

  question.answer = nonBlank(canonicalEntry.answer);
  delete question.answers;
  delete question.acceptableAnswers;
  if (Array.isArray(canonicalEntry.acceptedAnswers)) {
    question.acceptedAnswers = [...canonicalEntry.acceptedAnswers];
  } else {
    delete question.acceptedAnswers;
  }
  return true;
}

function restoreBank(currentBank, canonical) {
  assert.equal(canonical.schemaVersion, 1, "Unsupported canonical answer schema");
  assert.equal(canonical.kind, "ielts-reading-answer-key", "Unexpected canonical answer source");

  let restoredTests = 0;
  let restoredAnswers = 0;

  for (const test of currentBank.tests) {
    if (test.mode !== "reading") continue;

    const missing = test.questions.filter((question) => !nonBlank(question.answer));
    if (missing.length === 0) continue;

    const testKey = canonical.tests[test.id];
    assert(testKey, `Canonical answers missing for ${test.id}`);
    assert.equal(
      Object.keys(testKey.answers).length,
      40,
      `${test.id} canonical key must contain 40 answers`,
    );

    for (const question of test.questions) {
      if (
        restoreQuestionAnswer(
          test.id,
          question,
          testKey.answers[String(Number(question.number))],
        )
      ) {
        restoredAnswers += 1;
      }
    }
    restoredTests += 1;
  }

  return { restoredTests, restoredAnswers };
}

function assertComplete(bank) {
  const readingTests = bank.tests.filter((test) => test.mode === "reading");
  assert.equal(readingTests.length, 72, `Expected 72 reading tests, found ${readingTests.length}`);
  for (const test of readingTests) {
    assert.equal(test.questions.length, 40, `${test.id} must contain 40 questions`);
    const missing = test.questions.filter((question) => !nonBlank(question.answer));
    assert.equal(missing.length, 0, `${test.id} still has ${missing.length} missing answers`);
  }
}

function writeBank(bank) {
  const json = `${JSON.stringify(bank, null, 2)}\n`;
  fs.writeFileSync(rootBankPath, json, "utf8");
  fs.writeFileSync(reportBankPath, json, "utf8");
  fs.writeFileSync(browserBankPath, `window.CAMBRIDGE_TEST_BANK = ${json}`, "utf8");
}

function main() {
  const currentBank = JSON.parse(fs.readFileSync(rootBankPath, "utf8"));
  const canonical = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
  const result = restoreBank(currentBank, canonical);

  assertComplete(currentBank);
  if (result.restoredTests > 0) writeBank(currentBank);

  console.log(
    result.restoredTests > 0
      ? `Restored ${result.restoredAnswers} answers across ${result.restoredTests} reading tests.`
      : "All reading answers are already complete; no restoration was needed.",
  );
}

if (require.main === module) main();

module.exports = {
  assertComplete,
  restoreBank,
  restoreQuestionAnswer,
};
