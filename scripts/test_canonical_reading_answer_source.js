const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const canonicalPath = path.join(
  projectRoot,
  "data",
  "canonical",
  "reading-answer-key.v1.json",
);
const restoreScriptPath = path.join(
  projectRoot,
  "scripts",
  "restore_reading_answer_calibrations.js",
);

assert(
  fs.existsSync(canonicalPath),
  "versioned canonical reading answer source is missing",
);

const canonical = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
const currentBank = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "data", "cambridge-test-bank.json"), "utf8"),
);
const { buildCanonicalSource } = require("./build_canonical_reading_answer_source.js");
assert.equal(canonical.schemaVersion, 1);
assert.equal(canonical.kind, "ielts-reading-answer-key");
assert.equal(Object.keys(canonical.tests).length, 72);
assert.deepEqual(
  buildCanonicalSource(currentBank),
  canonical,
  "canonical answer source is stale; rebuild it intentionally after answer changes",
);

for (const [testId, testKey] of Object.entries(canonical.tests)) {
  assert.equal(
    Object.keys(testKey.answers).length,
    40,
    `${testId} must contain 40 canonical answers`,
  );
  for (let number = 1; number <= 40; number += 1) {
    const entry = testKey.answers[String(number)];
    assert(entry, `${testId} is missing canonical answer ${number}`);
    assert(String(entry.answer ?? "").trim(), `${testId} Q${number} has a blank canonical answer`);
  }
}

const restoreSource = fs.readFileSync(restoreScriptPath, "utf8");
assert(
  !restoreSource.includes("child_process") &&
    !restoreSource.includes("git") &&
    !restoreSource.includes("historicalRevision"),
  "answer restoration must not depend on Git history",
);

const { restoreBank } = require("./restore_reading_answer_calibrations.js");
const sampleTestId = Object.keys(canonical.tests)[0];
const sampleKey = canonical.tests[sampleTestId];
const incompleteBank = {
  tests: [
    {
      id: sampleTestId,
      mode: "reading",
      draftStatus: "manually_calibrated",
      questions: Array.from({ length: 40 }, (_, index) => ({
        number: index + 1,
        prompt: `current prompt ${index + 1}`,
        evidence: `current evidence ${index + 1}`,
        answer: "",
      })),
    },
  ],
};
incompleteBank.tests[0].questions[0].answers = ["stale alias"];
incompleteBank.tests[0].questions[0].acceptableAnswers = ["another stale alias"];
incompleteBank.tests[0].questions[1].answer = "DO NOT OVERWRITE";

const result = restoreBank(incompleteBank, canonical);
assert.deepEqual(result, { restoredTests: 1, restoredAnswers: 39 });
assert.equal(incompleteBank.tests[0].questions[0].prompt, "current prompt 1");
assert.equal(incompleteBank.tests[0].questions[0].evidence, "current evidence 1");
assert.equal(incompleteBank.tests[0].draftStatus, "manually_calibrated");
assert.equal(
  incompleteBank.tests[0].questions[0].answer,
  sampleKey.answers["1"].answer,
);
assert(!("answers" in incompleteBank.tests[0].questions[0]));
assert(!("acceptableAnswers" in incompleteBank.tests[0].questions[0]));
assert.equal(incompleteBank.tests[0].questions[1].answer, "DO NOT OVERWRITE");

console.log(
  "PASS: canonical reading answers are complete and restoration is Git-independent and non-destructive.",
);
