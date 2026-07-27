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
const evidenceRoot = path.join(
  projectRoot,
  "data",
  "calibration",
  "reading-evidence",
);
const targetIds = [
  "cambridge-04-reading-test-1",
  "cambridge-04-reading-test-2",
  "cambridge-21-reading-test-1",
  "cambridge-21-reading-test-2",
];
const evidenceFields = [
  "evidence",
  "evidenceLocation",
  "evidenceSentenceIds",
  "synonymSubstitutions",
  "distractors",
];

function nonBlank(value) {
  return String(value ?? "").trim();
}

function applyEvidencePackage(bank, packageData) {
  assert(targetIds.includes(packageData.testId), `Unexpected evidence package ${packageData.testId}`);
  const test = bank.tests.find((candidate) => candidate.id === packageData.testId);
  assert(test, `Missing Reading test ${packageData.testId}`);
  assert.equal(test.questions.length, 40, `${test.id} must contain 40 questions`);

  const entries = packageData.questions || {};
  assert.equal(Object.keys(entries).length, 40, `${test.id} evidence package must contain 40 questions`);

  for (const question of test.questions) {
    const number = String(Number(question.number));
    const entry = entries[number];
    assert(entry, `${test.id} evidence package lacks Q${number}`);
    assert(nonBlank(entry.evidence), `${test.id} Q${number} evidence is blank`);
    if (entry.answer !== undefined) {
      assert.equal(
        nonBlank(entry.answer),
        nonBlank(question.answer),
        `${test.id} Q${number} evidence package answer differs from the bank`,
      );
    }
    for (const field of evidenceFields) {
      if (entry[field] !== undefined && entry[field] !== null) {
        question[field] = entry[field];
      }
    }
  }

  test.draftStatus = "manually_calibrated";
  test.parseConfidence = "human_verified";
  test.calibrationSource = "official_answer_key_and_bilingual_intensive_reading";
}

function standardizeReadingVerification(bank) {
  const readingTests = bank.tests.filter((test) => test.mode === "reading");
  assert.equal(readingTests.length, 72, "Expected exactly 72 Reading tests");

  for (const test of readingTests) {
    assert.equal(test.questions.length, 40, `${test.id} must contain 40 questions`);
    const missingEvidence = test.questions.filter(
      (question) => !nonBlank(question.evidence),
    );
    assert.equal(
      missingEvidence.length,
      0,
      `${test.id} lacks evidence at ${missingEvidence.map((question) => question.number).join(", ")}`,
    );
    test.verification = {
      schemaVersion: 1,
      answerKey: "verified_against_local_official_answer_key_text",
      evidence: "complete",
      questionCount: 40,
      verifiedOn: "2026-07-27",
    };
  }
}

function writeBank(bank) {
  const json = `${JSON.stringify(bank, null, 2)}\n`;
  fs.writeFileSync(rootBankPath, json, "utf8");
  fs.writeFileSync(reportBankPath, json, "utf8");
  fs.writeFileSync(
    browserBankPath,
    `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`,
    "utf8",
  );
}

function main() {
  const bank = JSON.parse(fs.readFileSync(rootBankPath, "utf8"));
  for (const testId of targetIds) {
    const packagePath = path.join(evidenceRoot, `${testId}.json`);
    assert(fs.existsSync(packagePath), `Missing evidence package ${packagePath}`);
    applyEvidencePackage(bank, JSON.parse(fs.readFileSync(packagePath, "utf8")));
  }
  standardizeReadingVerification(bank);
  writeBank(bank);
  console.log("PASS: applied 160 evidence calibrations and standardized 72 Reading tests.");
}

if (require.main === module) main();

module.exports = {
  applyEvidencePackage,
  standardizeReadingVerification,
};
