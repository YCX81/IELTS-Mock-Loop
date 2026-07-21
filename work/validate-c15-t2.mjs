import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const calibrationPath = path.join(root, "work", "calibration", "cambridge-15", "test-2", "calibration.json");
const pageTextsPath = path.join(root, "work", "calibration", "cambridge-15", "test-2", "page-texts.json");
const passagesPath = path.join(root, "work", "calibration", "cambridge-15", "test-2", "passages.json");
const questionsPath = path.join(root, "work", "calibration", "cambridge-15", "test-2", "questions.json");
const testBankEntryPath = path.join(root, "work", "calibration", "cambridge-15", "test-2", "test-bank-entry.json");
const pagesPath = path.join(root, "data", "generated", "page-json", "cambridge-ielts-15.pages.json");
const rawPath = path.join(root, "data", "generated", "text-pages", "cambridge-ielts-15.raw.md");
const intensiveDir = path.join(root, "data", "generated", "intensive-reading", "cambridge-13-15");

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const sentenceSegmenter = new Intl.Segmenter("en", { granularity: "sentence" });

function sentenceRecords(passage) {
  if (passage.sentences?.length) {
    return passage.sentences.map((sentence, index) => ({
      ...sentence,
      id: `P${passage.passage}-S${index + 1}`,
    }));
  }
  const records = [];
  for (const paragraph of passage.paragraphs) {
    for (const item of sentenceSegmenter.segment(paragraph.text)) {
      const text = item.segment.trim();
      if (text) records.push({ id: `P${passage.passage}-S${records.length + 1}`, paragraph: paragraph.id, text });
    }
  }
  return records;
}

function rawPages(raw) {
  const matches = [...raw.matchAll(/^## Page (\d+)\r?\n\r?\n/gm)];
  const pages = new Map();
  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    pages.set(
      Number(matches[i][1]),
      raw.slice(start, end).replace(/\r?\n\r?\n$/, "").replace(/\r\n/g, "\n"),
    );
  }
  return pages;
}

const requiredCalibrationFiles = [calibrationPath, pageTextsPath, passagesPath, questionsPath, testBankEntryPath];
for (const file of requiredCalibrationFiles) {
  if (!fs.existsSync(file)) failures.push(`missing ${path.relative(root, file)}`);
}

if (requiredCalibrationFiles.every(fs.existsSync)) {
  const manifest = readJson(calibrationPath);
  const pageTextDoc = readJson(pageTextsPath);
  const passageDoc = readJson(passagesPath);
  const questionDoc = readJson(questionsPath);
  const testBankEntry = readJson(testBankEntryPath);
  const pageTexts = Object.fromEntries(pageTextDoc.pages.map((page) => [String(page.page), page.textLines.join("\n")]));
  const passages = passageDoc.passages.map((passage) => ({ ...passage, sentences: sentenceRecords(passage) }));
  const calibration = { ...manifest, pageTexts, passages, ...questionDoc };
  check(calibration.book === 15 && calibration.test === 2, "calibration must target Cambridge 15 Test 2");
  check(calibration.status === "manually_calibrated", "calibration status must be manually_calibrated");
  check(JSON.stringify(calibration.sourcePages) === JSON.stringify([39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]), "sourcePages must be physical pages 39–50");
  check(calibration.answerKeyPage === 124, "answerKeyPage must be physical page 124");
  check(calibration.pageTexts && Object.keys(calibration.pageTexts).length === 13, "pageTexts must contain pages 39–50 and 124");
  check(calibration.passages?.length === 3, "calibration must contain three passages");
  check(calibration.questionSections?.length === 8, "calibration must contain eight question sections");
  check(calibration.questions?.length === 40, "calibration must contain 40 questions");
  check(calibration.questions?.every((q, index) => q.number === index + 1), "question numbers must be exactly 1–40 in order");
  check(calibration.questions?.every((q) => q.answer && q.acceptedAnswers?.length && q.evidence && q.evidenceLocation && q.distractors), "every question must contain answers, evidence, location and distractor analysis");
  check(testBankEntry.draftStatus === "manually_calibrated", "test-bank entry must be manually_calibrated");
  check(testBankEntry.readingSections?.filter((section) => section.kind === "reading").length === 3, "test-bank entry must contain three reading sections");
  check(testBankEntry.readingSections?.filter((section) => section.kind === "questions").length === 8, "test-bank entry must contain eight question sections");
  check(testBankEntry.questions?.length === 40, "test-bank entry must contain 40 questions");

  if (fs.existsSync(pagesPath) && fs.existsSync(rawPath)) {
    const pagesDoc = readJson(pagesPath);
    const byNumber = new Map(pagesDoc.pages.map((page) => [Number(page.page), page.text]));
    const rawByNumber = rawPages(fs.readFileSync(rawPath, "utf8"));
    for (const page of [...calibration.sourcePages, calibration.answerKeyPage]) {
      check(byNumber.get(page) === calibration.pageTexts[String(page)], `pages.json page ${page} must equal calibrated text exactly`);
      check(rawByNumber.get(page) === calibration.pageTexts[String(page)], `raw.md page ${page} must equal calibrated text exactly`);
      check(byNumber.get(page) === rawByNumber.get(page), `pages.json/raw.md mismatch on page ${page}`);
    }
  }

  for (const passage of calibration.passages || []) {
    const file = path.join(intensiveDir, `Cambridge-IELTS-15-Test-2-Passage-${passage.passage}-双语精读.md`);
    if (!fs.existsSync(file)) {
      failures.push(`missing ${path.relative(root, file)}`);
      continue;
    }
    const markdown = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const aLayers = (markdown.match(/A层深挖/g) || []).length;
    const links = (markdown.match(/https:\/\/dictionary\.cambridge\.org\//g) || []).length;
    const images = (markdown.match(/!\[[^\]]*\]\([^)]*\)/g) || []).length;
    check(aLayers === 3, `Passage ${passage.passage} must contain exactly 3 A层深挖 markers (got ${aLayers})`);
    check(links === 3, `Passage ${passage.passage} must contain exactly 3 Cambridge Dictionary links (got ${links})`);
    check(images === 0, `Passage ${passage.passage} must contain 0 images (got ${images})`);
    check((markdown.match(/^### 句 \d+$/gm) || []).length === passage.sentences.length, `Passage ${passage.passage} sentence-unit count must match source`);
    passage.sentences.forEach((sentence, index) => {
      check(markdown.includes(`### 句 ${index + 1}\n\n${sentence.text}\n`), `Passage ${passage.passage} sentence ${index + 1} must match calibrated source exactly`);
    });
    const expectedNumbers = calibration.questions.filter((q) => q.passage === passage.passage).map((q) => q.number);
    expectedNumbers.forEach((number) => check(new RegExp(`^### 第 ${number} 题$`, "m").test(markdown), `Passage ${passage.passage} missing question ${number}`));
  }
}

if (failures.length) {
  console.error(`FAIL c15-t2: ${failures.length} issue(s)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("PASS c15-t2: source pages, 3 passages, 40 questions and intensive-reading invariants verified");
