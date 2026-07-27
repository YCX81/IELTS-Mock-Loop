const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..");
const targetIds = new Set([
  "cambridge-04-reading-test-1",
  "cambridge-04-reading-test-2",
  "cambridge-21-reading-test-1",
  "cambridge-21-reading-test-2",
]);

function loadBrowserBank() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(projectRoot, "data", "cambridge-test-bank.js"), "utf8"),
    context,
  );
  return context.window.CAMBRIDGE_TEST_BANK;
}

function verify(bank, label) {
  const readingTests = bank.tests.filter((test) => test.mode === "reading");
  assert.equal(readingTests.length, 72, `${label}: expected 72 Reading tests`);

  for (const test of readingTests) {
    assert.equal(
      test.verification?.answerKey,
      "verified_against_local_official_answer_key_text",
      `${label}: ${test.id} lacks standardized answer-key verification`,
    );
    assert.equal(
      test.verification?.evidence,
      "complete",
      `${label}: ${test.id} lacks standardized evidence verification`,
    );
    assert.equal(
      test.verification?.questionCount,
      40,
      `${label}: ${test.id} verification question count is not 40`,
    );
  }

  for (const test of readingTests.filter((candidate) => targetIds.has(candidate.id))) {
    const missing = test.questions
      .filter((question) => !String(question.evidence ?? "").trim())
      .map((question) => question.number);
    assert.deepEqual(missing, [], `${label}: ${test.id} lacks evidence at ${missing.join(", ")}`);
    assert.equal(
      test.parseConfidence,
      "human_verified",
      `${label}: ${test.id} must be human_verified`,
    );
    assert.equal(
      test.draftStatus,
      "manually_calibrated",
      `${label}: ${test.id} must be manually_calibrated`,
    );
  }
}

verify(
  JSON.parse(fs.readFileSync(path.join(projectRoot, "data", "cambridge-test-bank.json"), "utf8")),
  "root JSON",
);
verify(
  JSON.parse(
    fs.readFileSync(
      path.join(projectRoot, "data", "generated", "reports", "cambridge-test-bank.json"),
      "utf8",
    ),
  ),
  "generated report JSON",
);
verify(loadBrowserBank(), "browser JS");

console.log("PASS: all Reading tests have standardized verification and complete evidence.");
