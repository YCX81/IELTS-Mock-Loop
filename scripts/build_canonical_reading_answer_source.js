const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const bankPath = path.join(projectRoot, "data", "cambridge-test-bank.json");
const outputPath = path.join(
  projectRoot,
  "data",
  "canonical",
  "reading-answer-key.v1.json",
);

function uniqueNonBlank(values) {
  return [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))];
}

function canonicalEntry(question) {
  const answer = String(question.answer ?? "").trim();
  assert(answer, `Question ${question.number} has no answer`);

  const acceptedAnswers = uniqueNonBlank([
    ...(Array.isArray(question.acceptedAnswers) ? question.acceptedAnswers : []),
    ...(Array.isArray(question.acceptableAnswers) ? question.acceptableAnswers : []),
    ...(Array.isArray(question.answers) ? question.answers : []),
  ]).filter((candidate) => candidate !== answer);

  return acceptedAnswers.length ? { answer, acceptedAnswers } : { answer };
}

function buildCanonicalSource(bank) {
  const readingTests = bank.tests
    .filter((test) => test.mode === "reading")
    .sort((left, right) => left.id.localeCompare(right.id));

  assert.equal(readingTests.length, 72, "Expected exactly 72 reading tests");

  const tests = {};
  for (const test of readingTests) {
    assert.equal(test.questions.length, 40, `${test.id} must contain 40 questions`);
    const answers = {};
    for (const question of [...test.questions].sort(
      (left, right) => Number(left.number) - Number(right.number),
    )) {
      const number = String(Number(question.number));
      assert(!answers[number], `${test.id} contains duplicate question ${number}`);
      answers[number] = canonicalEntry(question);
    }
    tests[test.id] = {
      ...(test.book === undefined ? {} : { book: test.book }),
      ...(test.testNumber === undefined ? {} : { testNumber: test.testNumber }),
      answers,
    };
  }

  return {
    schemaVersion: 1,
    kind: "ielts-reading-answer-key",
    description:
      "Canonical, version-controlled Reading answer source. Rebuild scripts must merge these answer fields into generated questions instead of deriving answers from Git history.",
    tests,
  };
}

if (require.main === module) {
  const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
  const canonical = buildCanonicalSource(bank);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(canonical, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(projectRoot, outputPath)} with 72 reading tests.`);
}

module.exports = { buildCanonicalSource, canonicalEntry };
