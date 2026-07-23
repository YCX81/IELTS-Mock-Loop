import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const books = ["09", "10", "11", "13", "14", "15"];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function pageBlock(raw, page) {
  const match = raw.match(
    new RegExp(`^## Page ${page}\\r?$([\\s\\S]*?)(?=^## Page \\d+\\r?$|(?![\\s\\S]))`, "m"),
  );
  return match?.[1]?.trim() || "";
}

function normalize(text) {
  return String(text || "").replace(/\r\n/g, "\n").trim();
}

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file, output);
    else output.push(file);
  }
  return output;
}

const canonical = readJson(path.join(root, "data", "cambridge-test-bank.json"));
const report = readJson(path.join(root, "data", "generated", "reports", "cambridge-test-bank.json"));
const jsText = fs.readFileSync(path.join(root, "data", "cambridge-test-bank.js"), "utf8").trim();
const jsMatch = jsText.match(/^window\.CAMBRIDGE_TEST_BANK\s*=\s*([\s\S]*);$/);
assert(jsMatch, "invalid JavaScript bank wrapper");
const jsBank = JSON.parse(jsMatch[1]);
assert.deepEqual(report, canonical, "canonical and report bank mirrors differ");
assert.deepEqual(jsBank, canonical, "JavaScript and JSON bank mirrors differ");

const lessons = walk(path.join(root, "data", "generated", "intensive-reading")).filter(
  (file) => file.endsWith(".md") && !file.endsWith("-recovered-source.md"),
);

for (const book of books) {
  const tests = canonical.tests
    .filter((test) => test.id?.startsWith(`cambridge-${book}-reading-test-`))
    .sort((a, b) => a.id.localeCompare(b.id));
  assert.equal(tests.length, 4, `Cambridge ${book}: expected four reading tests`);

  const pagesDoc = readJson(
    path.join(root, "data", "generated", "page-json", `cambridge-ielts-${book}.pages.json`),
  );
  const pages = new Map(pagesDoc.pages.map((page) => [Number(page.page), page]));
  const raw = fs.readFileSync(
    path.join(root, "data", "generated", "text-pages", `cambridge-ielts-${book}.raw.md`),
    "utf8",
  );

  for (const [index, test] of tests.entries()) {
    assert.equal(test.id, `cambridge-${book}-reading-test-${index + 1}`);
    assert.equal(test.questions?.length, 40, `${test.id}: expected 40 questions`);
    assert.deepEqual(
      test.questions.map((question) => Number(question.number)),
      Array.from({ length: 40 }, (_, questionIndex) => questionIndex + 1),
      `${test.id}: question numbering differs`,
    );
    const readingSections = test.readingSections?.filter((section) => section.kind === "reading") || [];
    assert.equal(readingSections.length, 3, `${test.id}: expected three reading sections`);
    if (test.calibratedPassages) {
      assert.equal(test.calibratedPassages.length, 3, `${test.id}: expected three calibrated passages`);
    }
    for (const pageNumber of test.sourcePages || []) {
      const page = pages.get(Number(pageNumber));
      assert(page, `${test.id}: missing page JSON page ${pageNumber}`);
      assert.equal(
        normalize(pageBlock(raw, pageNumber)),
        normalize(page.text),
        `${test.id}: raw/page JSON mismatch on page ${pageNumber}`,
      );
    }
  }

  const bookLessons = lessons.filter((file) =>
    path.basename(file).toLowerCase().includes(`cambridge-ielts-${book}-test`),
  );
  assert.equal(bookLessons.length, 12, `Cambridge ${book}: expected 12 canonical lessons`);
  console.log(`PASS Cambridge ${book}: 4 tests, 160 questions, 12 lessons`);
}
