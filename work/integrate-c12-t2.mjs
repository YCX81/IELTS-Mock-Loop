import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const calibrationDir = path.join(root, "work", "calibration", "cambridge-12", "test-2");
const calibrationPath = path.join(calibrationDir, "calibration.json");
const pagesPath = path.join(root, "data", "generated", "page-json", "cambridge-ielts-12.pages.json");
const rawPath = path.join(root, "data", "generated", "text-pages", "cambridge-ielts-12.raw.md");
const applyShared = process.argv.includes("--apply-shared");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

function loadParts() {
  return [1, 2, 3].map((passage) => {
    const file = path.join(calibrationDir, `passage-${passage}.json`);
    requireValue(fs.existsSync(file), `Missing ${path.relative(root, file)}`);
    const part = readJson(file);
    requireValue(part.passage === passage || part.section?.passageNumber === passage, `Passage ${passage}: invalid passageNumber`);
    part.section = {
      ...part.section,
      passageNumber: passage,
      sourcePages: part.section.sourcePages || part.section.pages,
      answerKeyPage: part.section.answerKeyPage || 119,
    };
    return part;
  });
}

function answerKeyPageText() {
  return `Listening and Reading Answer Keys
READING

Reading Passage 1,
Questions 1-13
1 A
2 B
3 H
4 D
5 B
6 C
7 G
8 B
9 A
10 D
11 E
12 C
13 D

Reading Passage 2,
Questions 14-26
14 iv
15 vi
16 viii
17 v
18 i
19 vii
20 iii
21 TRUE
22 FALSE
23 FALSE
24 NOT GIVEN
25 rubber
26 farmer

Reading Passage 3,
Questions 27-40
27 eye movements
28 language co-activation
29 Stroop Task
30 conflict management
31 cognitive control
32 YES
33 NOT GIVEN
34 NO
35 NO
36 NOT GIVEN
37 D
38 G
39 B
40 C

If you score ...

0-15
you are unlikely to get an acceptable score under examination conditions and we recommend that you spend a lot of time improving your English before you take IELTS.

16-25
you may get an acceptable score under examination conditions but we recommend that you think about having more practice or lessons before you take IELTS.

26-40
you are likely to get an acceptable score under examination conditions but remember that different institutions will find different scores acceptable.

119`;
}

function mergeCalibration(parts) {
  const pageTexts = parts.flatMap((part) => part.pageTexts || []);
  pageTexts.push({ page: 119, text: answerKeyPageText() });
  pageTexts.sort((a, b) => a.page - b.page);

  const readingSections = parts.map((part) => part.section);
  const questionSections = parts.flatMap((part) => part.questionSections || []);
  const questions = parts
    .flatMap((part) => part.questions || [])
    .map((question) => ({ ...question, answerKeyPage: 119 })).sort((a, b) => a.number - b.number);
  requireValue(readingSections.length === 3, "Expected 3 reading sections");
  requireValue(questions.length === 40, `Expected 40 questions, got ${questions.length}`);
  requireValue(questions.every((question, index) => question.number === index + 1), "Questions must be numbered 1-40");
  requireValue(new Set(pageTexts.map((entry) => entry.page)).size === 15, "Expected 15 unique calibrated physical pages");

  return {
    schemaVersion: 1,
    book: 12,
    test: 2,
    printedTest: 6,
    testId: "cambridge-12-reading-test-2",
    sourcePdf: "data/Cambridge-IELTS-12.pdf",
    sourcePages: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
    answerKeyPages: [119],
    calibrationStatus: "manually_calibrated",
    pageTexts,
    readingSections,
    questionSections,
    questions,
    audit: {
      sourceReviewedAtOriginalResolution: true,
      oldIntensiveReadingUsedAsSource: false,
      visualPagesReviewed: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 119],
    },
  };
}

function updatePageSources(calibration) {
  const pageDoc = readJson(pagesPath);
  const byPage = new Map(calibration.pageTexts.map((entry) => [entry.page, entry.text.replace(/\r\n/g, "\n").trim()]));
  for (const page of pageDoc.pages) {
    if (!byPage.has(page.page)) continue;
    page.text = byPage.get(page.page);
    page.calibration = {
      status: "calibrated",
      reason: "manual_reading_test_reconstruction",
      bookTest: 2,
      printedTest: 6,
    };
  }
  writeJson(pagesPath, pageDoc);

  const header = "# Cambridge IELTS 12 raw text\n\nExtraction method: paddleocr_gpu. This is a local working draft. Check all question numbers, options, and answer keys before using it as a mock test.";
  const body = pageDoc.pages.map((page) => `## Page ${page.page}\n\n${String(page.text || "").replace(/\r\n/g, "\n").trim()}`).join("\n\n");
  fs.writeFileSync(rawPath, `${header}\n\n${body}\n`, "utf8");
}

function makeTest(calibration) {
  const passage = calibration.readingSections
    .map((section) => section.paragraphs.map((paragraph) => paragraph.text).join("\n\n"))
    .join("\n\n");
  return {
    source: "Cambridge IELTS 12 Test 2 manually calibrated from local PDF",
    draftStatus: "manually_calibrated",
    parseConfidence: "verified",
    pdf: "data/Cambridge-IELTS-12.pdf",
    answerKeyText: answerKeyPageText(),
    answerKeyPages: [119],
    mode: "reading",
    id: "cambridge-12-reading-test-2",
    title: "Cambridge IELTS 12 Reading Test 2",
    durationSec: 3600,
    passageTitle: calibration.readingSections.map((section) => section.title).join(" | "),
    passage,
    rawOcrText: calibration.pageTexts.filter((entry) => entry.page >= 36 && entry.page <= 49).map((entry) => entry.text).join("\n\n"),
    readingSections: calibration.readingSections,
    questionSections: calibration.questionSections,
    questions: calibration.questions,
    sourcePages: calibration.sourcePages,
  };
}

function updateSharedBanks(test) {
  const canonicalPath = path.join(root, "data", "cambridge-test-bank.json");
  const reportPath = path.join(root, "data", "generated", "reports", "cambridge-test-bank.json");
  const jsPath = path.join(root, "data", "cambridge-test-bank.js");
  const sourcePath = fs.existsSync(canonicalPath) ? canonicalPath : reportPath;
  const bank = readJson(sourcePath);
  const index = bank.tests.findIndex((entry) => entry.id === test.id);
  requireValue(index >= 0, `Shared bank does not contain ${test.id}`);
  bank.tests[index] = test;
  bank.generatedAt = new Date().toISOString();
  writeJson(canonicalPath, bank);
  writeJson(reportPath, bank);
  fs.writeFileSync(jsPath, `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`, "utf8");
}

const parts = loadParts();
const calibration = mergeCalibration(parts);
writeJson(calibrationPath, calibration);
updatePageSources(calibration);
const test = makeTest(calibration);
if (applyShared) updateSharedBanks(test);

console.log(`Integrated Cambridge IELTS 12 Test 2: ${calibration.readingSections.length} sections, ${calibration.questions.length} questions, ${calibration.pageTexts.length} calibrated pages${applyShared ? ", shared banks updated" : ""}.`);
