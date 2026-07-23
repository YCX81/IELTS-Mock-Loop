import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const calibrationPath = path.join(root, "work", "calibration", "cambridge-12", "test-4", "calibration.json");
const lessonDir = path.join(root, "data", "generated", "intensive-reading", "cambridge-10-12");
const pageJsonPath = path.join(root, "data", "generated", "page-json", "cambridge-ielts-12.pages.json");
const rawPath = path.join(root, "data", "generated", "text-pages", "cambridge-ielts-12.raw.md");
const checkShared = process.argv.includes("--check-shared");

const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

function rawPage(raw, page) {
  const match = raw.match(new RegExp(`^## Page ${page}\\r?$\\n\\n([\\s\\S]*?)(?=\\n\\n## Page \\d+\\r?$|(?![\\s\\S]))`, "m"));
  return match?.[1]?.replace(/\n$/, "") ?? "";
}

function lessonPath(passage) {
  return path.join(lessonDir, `Cambridge-IELTS-12-Test-4-Passage-${passage}-双语精读.md`);
}

assert(fs.existsSync(calibrationPath), "missing Test 4 calibration.json");

if (fs.existsSync(calibrationPath)) {
  const calibration = readJson(calibrationPath);
  assert(calibration.book === 12, "calibration.book must be 12");
  assert(calibration.test === 4, "calibration.test must be 3");
  assert(calibration.printedTest === 8, "calibration.printedTest must be 8");
  assert(JSON.stringify(calibration.sourcePages) === JSON.stringify([80,81,82,83,84,85,86,87,88,89,90,91]), "sourcePages must be physical pages 80-91");
  assert(JSON.stringify(calibration.answerKeyPages) === JSON.stringify([123]), "answerKeyPages must be [123]");
  assert(Array.isArray(calibration.pageTexts) && calibration.pageTexts.length === 13, "pageTexts must cover 13 physical pages");
  assert(Array.isArray(calibration.readingSections) && calibration.readingSections.length === 3, "exactly 3 readingSections required");
  assert(Array.isArray(calibration.questions) && calibration.questions.length === 40, "exactly 40 questions required");

  const numbers = (calibration.questions || []).map((question) => question.number);
  assert(JSON.stringify(numbers) === JSON.stringify(Array.from({ length: 40 }, (_, index) => index + 1)), "question numbers must be exactly 1-40 in order");

  for (const question of calibration.questions || []) {
    assert(Boolean(question.instruction), `question ${question.number}: missing instruction`);
    assert(Boolean(question.prompt), `question ${question.number}: missing prompt`);
    assert(Array.isArray(question.answers) && question.answers.length > 0, `question ${question.number}: missing official answer/variant`);
    assert(Boolean(question.evidence), `question ${question.number}: missing evidence`);
    assert(Boolean(question.location), `question ${question.number}: missing location`);
    assert(Boolean(question.distractorAnalysis), `question ${question.number}: missing distractor analysis`);
    assert(Array.isArray(question.sourcePages) && question.sourcePages.length > 0, `question ${question.number}: missing sourcePages`);
    assert(question.answerKeyPage === 123, `question ${question.number}: answerKeyPage must be 123`);
  }

  if (fs.existsSync(pageJsonPath) && fs.existsSync(rawPath)) {
    const pageDoc = readJson(pageJsonPath);
    const raw = fs.readFileSync(rawPath, "utf8").replace(/\r\n/g, "\n");
    for (const page of pageDoc.pages) {
      assert(rawPage(raw, page.page) === String(page.text || "").replace(/\r\n/g, "\n"), `page ${page.page}: pages.json/raw.md mismatch`);
    }
  }

  for (let passage = 1; passage <= 3; passage += 1) {
    const file = lessonPath(passage);
    assert(fs.existsSync(file), `Passage ${passage}: missing intensive-reading file`);
    if (!fs.existsSync(file)) continue;
    const markdown = fs.readFileSync(file, "utf8");
    const section = calibration.readingSections[passage - 1];
    const sentenceCount = (markdown.match(/^## 句 \d+$/gm) || []).length;
    assert(sentenceCount === section.sentences.length, `Passage ${passage}: sentence count ${sentenceCount} != ${section.sentences.length}`);
    let cursor = 0;
    for (const sentence of section.sentences) {
      const position = markdown.indexOf(sentence.text, cursor);
      assert(position >= cursor, `Passage ${passage}: missing or out-of-order exact sentence ${sentence.number}`);
      if (position >= cursor) cursor = position + sentence.text.length;
    }
    assert((markdown.match(/A层深挖/g) || []).length === 3, `Passage ${passage}: A-layer count must be 3`);
    assert((markdown.match(/https:\/\/dictionary\.cambridge\.org\//g) || []).length === 3, `Passage ${passage}: Cambridge link count must be 3`);
    assert((markdown.match(/!\[/g) || []).length === 0, `Passage ${passage}: image count must be 0`);
    assert(!/\((?:A1|A2)\)/.test(markdown), `Passage ${passage}: A1/A2 must use 基础词（A1/A2） or 基础表达（A1/A2）`);
    assert(markdown.includes("## 题目与选项精讲"), `Passage ${passage}: missing question explanation section`);
    for (let n = section.questionRange[0]; n <= section.questionRange[1]; n += 1) {
      assert(markdown.includes(`### 第 ${n} 题`), `Passage ${passage}: missing question ${n}`);
    }
  }
}

if (checkShared) {
  const canonical = path.join(root, "data", "cambridge-test-bank.json");
  const report = path.join(root, "data", "generated", "reports", "cambridge-test-bank.json");
  const js = path.join(root, "data", "cambridge-test-bank.js");
  assert(fs.existsSync(canonical), "shared canonical test bank missing");
  assert(fs.existsSync(report), "shared report test bank missing");
  assert(fs.existsSync(js), "shared JavaScript test bank missing");
  if ([canonical, report, js].every(fs.existsSync)) {
    const canonicalText = JSON.stringify(readJson(canonical));
    const reportText = JSON.stringify(readJson(report));
    const jsText = fs.readFileSync(js, "utf8").trim().replace(/^window\.CAMBRIDGE_TEST_BANK\s*=\s*/, "").replace(/;$/, "");
    assert(canonicalText === reportText, "canonical/report test-bank mirrors differ");
    assert(canonicalText === JSON.stringify(JSON.parse(jsText)), "canonical/JavaScript test-bank mirrors differ");
  }
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} Cambridge 12 Test 4 validation issue(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("OK: Cambridge IELTS 12 Test 4 calibration, lessons, and optional shared mirrors validated");
