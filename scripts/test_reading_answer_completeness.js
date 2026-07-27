const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..");
const jsonPaths = [
  path.join(projectRoot, "data", "cambridge-test-bank.json"),
  path.join(projectRoot, "data", "generated", "reports", "cambridge-test-bank.json"),
];
const browserBankPath = path.join(projectRoot, "data", "cambridge-test-bank.js");
const priorityCalibrationIds = new Set([
  "cambridge-16-reading-test-3",
  "cambridge-16-reading-test-4",
  "cambridge-17-reading-test-1",
  "cambridge-17-reading-test-2",
  "cambridge-17-reading-test-3",
  "cambridge-17-reading-test-4",
  "cambridge-18-reading-test-1",
  "cambridge-18-reading-test-2",
  "cambridge-21-reading-test-3",
  "cambridge-21-reading-test-4",
]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function loadJsonBank(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadBrowserBank(filePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, {
    filename: filePath,
  });
  return context.window.CAMBRIDGE_TEST_BANK;
}

function readingAnswerSnapshot(bank, label) {
  const readingTests = bank.tests.filter((test) => test.mode === "reading");
  assert(readingTests.length === 72, `${label}: expected 72 reading tests, found ${readingTests.length}`);

  const snapshot = {};
  for (const test of readingTests) {
    assert(test.questions.length === 40, `${label}: ${test.id} must contain 40 questions`);

    const numbers = test.questions.map((question) => Number(question.number));
    assert(
      numbers.every((number, index) => number === index + 1),
      `${label}: ${test.id} question numbers must be exactly 1-40`,
    );

    const missing = test.questions
      .filter((question) => !String(question.answer ?? "").trim())
      .map((question) => question.number);
    assert(
      missing.length === 0,
      `${label}: ${test.id} has missing answers at questions ${missing.join(", ")}`,
    );

    const shellPrompts = test.questions
      .filter((question) => /^Answer \d+$/i.test(String(question.prompt ?? "").trim()))
      .map((question) => question.number);
    assert(
      shellPrompts.length === 0,
      `${label}: ${test.id} still has generic shell prompts at questions ${shellPrompts.join(", ")}`,
    );

    if (priorityCalibrationIds.has(test.id)) {
      const missingEvidence = test.questions
        .filter((question) => !String(question.evidence ?? "").trim())
        .map((question) => question.number);
      assert(
        missingEvidence.length === 0,
        `${label}: ${test.id} lacks calibrated evidence at questions ${missingEvidence.join(", ")}`,
      );
      assert(
        test.parseConfidence === "human_verified",
        `${label}: ${test.id} must be marked human_verified after calibration`,
      );
    }

    snapshot[test.id] = test.questions.map((question) => ({
      number: Number(question.number),
      answer: String(question.answer).trim(),
    }));
  }

  return snapshot;
}

const rootSnapshot = readingAnswerSnapshot(loadJsonBank(jsonPaths[0]), "root JSON");
const reportSnapshot = readingAnswerSnapshot(loadJsonBank(jsonPaths[1]), "generated report JSON");
const browserSnapshot = readingAnswerSnapshot(loadBrowserBank(browserBankPath), "browser JS");

assert(
  JSON.stringify(reportSnapshot) === JSON.stringify(rootSnapshot),
  "generated report JSON reading answers differ from root JSON",
);
assert(
  JSON.stringify(browserSnapshot) === JSON.stringify(rootSnapshot),
  "browser JS reading answers differ from root JSON",
);

console.log("PASS: all 72 reading tests contain 40 answers and all three bank artifacts agree.");
