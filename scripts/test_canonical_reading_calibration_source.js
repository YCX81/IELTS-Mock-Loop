const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const canonicalPath = path.join(
  projectRoot,
  "data",
  "canonical",
  "reading-question-calibration.v1.json",
);
const bankPath = path.join(projectRoot, "data", "cambridge-test-bank.json");
const { buildCanonicalCalibrationSource } = require(
  "./build_canonical_reading_calibration_source.js"
);

assert(fs.existsSync(canonicalPath), "canonical Reading calibration source is missing");
const canonical = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));

assert.equal(canonical.schemaVersion, 1);
assert.equal(canonical.kind, "ielts-reading-question-calibration");
assert.equal(Object.keys(canonical.tests).length, 72);
assert.deepEqual(
  buildCanonicalCalibrationSource(bank),
  canonical,
  "canonical Reading calibration source is stale",
);

for (const [testId, test] of Object.entries(canonical.tests)) {
  assert.equal(Object.keys(test.questions).length, 40, `${testId} must contain 40 questions`);
  assert.equal(test.verification?.evidence, "complete", `${testId} evidence is not complete`);
  for (let number = 1; number <= 40; number += 1) {
    assert(
      String(test.questions[String(number)]?.evidence ?? "").trim(),
      `${testId} Q${number} lacks evidence`,
    );
  }
}

console.log("PASS: canonical Reading calibration source covers all 72 tests.");
