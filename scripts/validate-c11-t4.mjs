import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const calibrationPath = path.join(root, "work", "calibration", "cambridge-11", "test-4", "calibration.json");
const pageJsonPath = path.join(root, "data", "generated", "page-json", "cambridge-ielts-11.pages.json");
const rawPath = path.join(root, "data", "generated", "text-pages", "cambridge-ielts-11.raw.md");
const intensiveDir = path.join(root, "data", "generated", "intensive-reading", "cambridge-10-12");
const expectedAnswers = [
  "FALSE", "NOT GIVEN", "NOT GIVEN", "TRUE", "A", "C", "B", "A", "A", "D", "B", "E", "F",
  "B", "A", "B", "D", "C", "D", "TRUE", "TRUE", "NOT GIVEN", "TRUE", "FALSE", "C", "A",
  "vi", "iv", "ii", "vii", "i", "v", "E", "G", "B", "F", "NO", "YES", "NOT GIVEN", "YES",
];
const expectedSentenceCounts = [39, 42, 32];
const expectedSourcePages = [
  [85, 86, 87, 88],
  [89, 90, 91, 92, 93],
  [94, 95, 96, 97],
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function buildRaw(pageDocument) {
  const prefix = [
    "# Cambridge IELTS 11 raw text",
    "",
    `Extraction method: ${pageDocument.method}. This is a local working draft. Check all question numbers, options, and answer keys before using it as a mock test.`,
    "",
  ].join("\n");
  const body = pageDocument.pages.map((page) => `## Page ${page.page}\n\n${page.text}`).join("\n\n");
  return `${prefix}${body}\n`;
}

function validateCalibration(calibration) {
  assert(calibration.book === 11, "Calibration book must be 11");
  assert(calibration.test === 4, "Calibration test must be 4");
  assert(calibration.status === "manually_calibrated", "Calibration status is wrong");
  assert(calibration.answerKeyPage === 129, "Answer key page must be 129");
  assert(
    JSON.stringify(calibration.sourcePageNumbers) === JSON.stringify(Array.from({ length: 13 }, (_, i) => i + 85)),
    "Source pages must be exactly 85 through 97",
  );
  assert(calibration.sourcePages.length === 14, "Expected 13 test pages plus answer page");
  const answerPage = calibration.sourcePages.find((page) => page.page === 129);
  assert(answerPage, "Missing calibrated answer page 129");
  expectedAnswers.forEach((answer, index) => {
    assert(answerPage.text.includes(`${index + 1} ${answer}`), `Answer page 129 is missing ${index + 1} ${answer}`);
  });

  const test = calibration.readingTest;
  assert(test.id === "cambridge-11-reading-test-4", "Unexpected reading-test id");
  assert(test.draftStatus === "manually_calibrated", "Test must be manually calibrated");
  assert(test.parseConfidence === "human_verified", "Parse confidence must be human verified");
  assert(test.answerKeyPages.length === 1 && test.answerKeyPages[0] === 129, "Wrong answer-key pages");
  assert(test.readingSections.length === 3, "Expected exactly three reading sections");
  assert(test.questions.length === 40, "Expected exactly 40 questions");
  test.readingSections.forEach((section, index) => {
    assert(section.sentences.length === expectedSentenceCounts[index], `Passage ${index + 1} sentence count is wrong`);
    assert(section.audit.sentenceCount === expectedSentenceCounts[index], `Passage ${index + 1} sentence audit is wrong`);
    assert(JSON.stringify(section.sourcePages) === JSON.stringify(expectedSourcePages[index]), `Passage ${index + 1} sourcePages are wrong`);
    assert(section.answerKeyPage === 129, `Passage ${index + 1} answerKeyPage is wrong`);
  });
  test.questions.forEach((question, index) => {
    assert(question.number === index + 1, `Question ${index + 1} is missing or out of order`);
    assert(question.answer === expectedAnswers[index], `Unexpected official answer for question ${index + 1}`);
    assert(question.prompt, `Question ${index + 1} has no prompt`);
    assert(question.evidence, `Question ${index + 1} has no evidence`);
    assert(question.locator, `Question ${index + 1} has no locator`);
    assert(question.distractorRationale, `Question ${index + 1} has no distractor rationale`);
    const passageIndex = index < 13 ? 0 : index < 26 ? 1 : 2;
    assert(JSON.stringify(question.sourcePages) === JSON.stringify(expectedSourcePages[passageIndex]), `Question ${index + 1} sourcePages are wrong`);
    assert(question.answerKeyPage === 129, `Question ${index + 1} answerKeyPage is wrong`);
  });
}

function validatePageMirrors(calibration) {
  const pageDocument = readJson(pageJsonPath);
  assert(fs.readFileSync(rawPath, "utf8") === buildRaw(pageDocument), "pages.json and raw.md are not character-for-character mirrors");
  for (const sourcePage of calibration.sourcePages) {
    const stored = pageDocument.pages.find((page) => page.page === sourcePage.page);
    assert(stored, `Missing page ${sourcePage.page} in pages.json`);
    if (!stored.calibration?.reason) {
      assert(stored.text === sourcePage.text, `Page ${sourcePage.page} differs from calibration`);
      assert(stored.engine === "manual_calibration_against_pdf", `Page ${sourcePage.page} engine is wrong`);
      assert(stored.calibration?.test === 4, `Page ${sourcePage.page} calibration metadata is wrong`);
    }
  }
}

function validateIntensiveFiles(calibration) {
  calibration.readingTest.readingSections.forEach((section, index) => {
    const fileName = `Cambridge-IELTS-11-Test-4-Passage-${index + 1}-双语精读.md`;
    const text = fs.readFileSync(path.join(intensiveDir, fileName), "utf8");
    const h2 = text.match(/^## .+$/gm) ?? [];
    assert(h2.length === 5, `${fileName} must contain exactly five H2 sections`);
    for (const name of ["逐句精读", "题目与选项精讲", "B1+ 词汇深讲总表", "IELTS 阅读提醒", "答案汇总"]) {
      assert(h2.some((heading) => heading.includes(name)), `${fileName} is missing H2 ${name}`);
    }
    const links = text.match(/https:\/\/dictionary\.cambridge\.org\/[^\s)]+/g) ?? [];
    assert(links.length === 3, `${fileName} must contain exactly three Cambridge links`);
    const aLayers = text.match(/A\s*层深挖/g) ?? [];
    assert(aLayers.length === 3, `${fileName} must contain exactly three A layers`);
    const images = text.match(/!\[[^\]]*\]\([^)]+\)/g) ?? [];
    assert(images.length === 0, `${fileName} must contain zero images`);
    const readingPart = text.split(/^## 02 /m)[0];
    const quotes = [...readingPart.matchAll(/^> (.+)$/gm)].map((match) => match[1].replace(/\r$/, ""));
    assert(quotes.length === expectedSentenceCounts[index], `${fileName} has the wrong English sentence count`);
    assert(section.sentences.every((sentence, sentenceIndex) => sentence === quotes[sentenceIndex]), `${fileName} English sentences differ from calibration`);
  });
}

function validateSharedMirrors(calibration) {
  const jsonPaths = [
    path.join(root, "data", "cambridge-test-bank.json"),
    path.join(root, "data", "generated", "reports", "cambridge-test-bank.json"),
  ];
  const jsonTexts = jsonPaths.map((filePath) => fs.readFileSync(filePath, "utf8"));
  assert(jsonTexts[0] === jsonTexts[1], "JSON test-bank mirrors differ character-for-character");
  const jsText = fs.readFileSync(path.join(root, "data", "cambridge-test-bank.js"), "utf8").trim();
  const wrapper = jsText.match(/^window\.CAMBRIDGE_TEST_BANK\s*=\s*([\s\S]*);$/);
  assert(wrapper, "Unexpected JavaScript bank wrapper");
  const jsonBank = JSON.parse(jsonTexts[0]);
  const jsBank = JSON.parse(wrapper[1]);
  assert(JSON.stringify(jsBank) === JSON.stringify(jsonBank), "JavaScript bank mirror differs from JSON");
  const integrated = jsonBank.tests.find((test) => test.id === calibration.readingTest.id);
  assert(integrated, "Integrated Test 4 is missing from shared bank");
  validateIntegratedTest(integrated, calibration.readingTest);
}

function validateIntegratedTest(integrated, expected) {
  const { rawOcrText: _expectedRaw, readingSections: expectedSections, ...expectedCore } = expected;
  const { rawOcrText: _integratedRaw, readingSections: integratedSections, ...integratedCore } = integrated;
  assert(JSON.stringify(integratedCore) === JSON.stringify(expectedCore), "Integrated test core differs");
  assert(integratedSections.length === expectedSections.length, "Integrated reading section count differs");
  expectedSections.forEach((section, index) => {
    const { paragraphs: expectedParagraphs = [], ...expectedSectionCore } = section;
    const { paragraphs: integratedParagraphs = [], ...integratedSectionCore } = integratedSections[index];
    assert(JSON.stringify(integratedSectionCore) === JSON.stringify(expectedSectionCore), `Integrated section ${index + 1} differs`);
    assert(expectedParagraphs.every((paragraph) => integratedParagraphs.includes(paragraph)), `Integrated section ${index + 1} lost calibrated text`);
    assert(integratedParagraphs.every((paragraph) => expectedParagraphs.includes(paragraph) || /^!\[[^\]]*]\([^)]+\)$/.test(paragraph) || paragraph.trim().startsWith("|")), `Integrated section ${index + 1} has an unsupported augmentation`);
  });
}

assert(fs.existsSync(calibrationPath), "Missing aggregate calibration.json");
const calibration = readJson(calibrationPath);
validateCalibration(calibration);
validatePageMirrors(calibration);
validateIntensiveFiles(calibration);
if (process.argv.includes("--shared")) validateSharedMirrors(calibration);
console.log("Validated Cambridge IELTS 11 Test 4 calibration and intensive reading.");
