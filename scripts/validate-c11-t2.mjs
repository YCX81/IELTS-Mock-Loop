import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const calibrationPath = path.join(
  root,
  "work",
  "calibration",
  "cambridge-11",
  "test-2",
  "calibration.json",
);
const pageJsonPath = path.join(
  root,
  "data",
  "generated",
  "page-json",
  "cambridge-ielts-11.pages.json",
);
const rawPath = path.join(
  root,
  "data",
  "generated",
  "text-pages",
  "cambridge-ielts-11.raw.md",
);
const intensiveDir = path.join(
  root,
  "data",
  "generated",
  "intensive-reading",
  "cambridge-10-12",
);
const expectedAnswers = [
  "TRUE",
  "NOT GIVEN",
  "TRUE",
  "FALSE",
  "C",
  "B",
  "G",
  "A",
  "(lifting) frame",
  "hydraulic jacks",
  "stabbing guides",
  "(lifting) cradle",
  "air bags",
  "ii",
  "ix",
  "viii",
  "i",
  "iv",
  "vii",
  "vi",
  "farming",
  "canoes",
  "birds",
  "wood",
  "B",
  "C",
  "C",
  "D",
  "B",
  "A",
  "C",
  "B",
  "H",
  "NOT GIVEN",
  "YES",
  "NO",
  "NO",
  "YES",
  "NOT GIVEN",
  "A",
];
const requiredSectionPatterns = [
  /^##\s+01\s+逐句精读\s*$/m,
  /^##\s+02\s+题目与选项精讲\s*$/m,
  /^##\s+03\s+B1\+\s*.*$/m,
  /^##\s+04\s+IELTS\s*阅读提醒\s*$/m,
  /^##\s+05\s+答案汇总\s*$/m,
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function buildRaw(pageDocument) {
  const prefix = [
    "# Cambridge IELTS 11 raw text",
    "",
    `Extraction method: ${pageDocument.method}. This is a local working draft. Check all question numbers, options, and answer keys before using it as a mock test.`,
    "",
  ].join("\n");
  const body = pageDocument.pages
    .map((page) => `## Page ${page.page}\n\n${page.text}`)
    .join("\n\n");
  return `${prefix}${body}\n`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateCalibration(calibration) {
  assert(calibration.book === 11, "Calibration book must be 21");
  assert(calibration.test === 2, "Calibration test must be 2");
  assert(calibration.answerKeyPage === 125, "Answer key page must be 125");
  assert(
    JSON.stringify(calibration.sourcePageNumbers) ===
      JSON.stringify(Array.from({ length: 13 }, (_, index) => index + 39)),
    "Source pages must be exactly 39 through 51",
  );
  assert(calibration.sourcePages.length === 14, "Expected 13 test pages plus answer page");

  const readingTest = calibration.readingTest;
  assert(readingTest.id === "cambridge-11-reading-test-2", "Unexpected test id");
  assert(readingTest.draftStatus === "manually_calibrated", "Test must be manually calibrated");
  assert(readingTest.readingSections.length === 3, "Expected exactly three reading sections");
  assert(readingTest.questions.length === 40, "Expected exactly 40 questions");
  readingTest.questions.forEach((question, index) => {
    assert(question.number === index + 1, `Question ${index + 1} is missing or out of order`);
    assert(question.answer === expectedAnswers[index], `Unexpected answer for question ${index + 1}`);
    assert(question.prompt, `Question ${index + 1} has no prompt`);
    assert(question.evidence, `Question ${index + 1} has no evidence`);
    assert(question.locator, `Question ${index + 1} has no locator`);
    assert(question.distractorRationale, `Question ${index + 1} has no distractor rationale`);
  });
}

function validatePageMirrors(calibration) {
  const pageDocument = readJson(pageJsonPath);
  assert(
    fs.readFileSync(rawPath, "utf8") === buildRaw(pageDocument),
    "pages.json and raw.md are not character-for-character mirrors",
  );
  for (const sourcePage of calibration.sourcePages) {
    const storedPage = pageDocument.pages.find((page) => page.page === sourcePage.page);
    assert(storedPage, `Missing page ${sourcePage.page} in pages.json`);
    if (!storedPage.calibration?.reason) {
      assert(storedPage.text === sourcePage.text, `Page ${sourcePage.page} does not match calibration`);
    }
  }
}

function validateIntensiveFiles(calibration) {
  const expectedImageCounts = [1, 0, 0];
  calibration.readingTest.readingSections.forEach((section, index) => {
    const fileName = `Cambridge-IELTS-11-Test-2-Passage-${index + 1}-双语精读.md`;
    const filePath = path.join(intensiveDir, fileName);
    assert(fs.existsSync(filePath), `Missing intensive-reading file ${fileName}`);
    const text = fs.readFileSync(filePath, "utf8");
    for (const headingPattern of requiredSectionPatterns) {
      assert(
        headingPattern.test(text),
        `${fileName} is missing a required top-level section`,
      );
    }
    const dictionaryLinks = text.match(/https:\/\/dictionary\.cambridge\.org\/[^\s)]+/g) ?? [];
    assert(dictionaryLinks.length === 3, `${fileName} must contain exactly three Cambridge links`);
    const aLayers = text.match(/A层深挖/g) ?? [];
    assert(aLayers.length === 3, `${fileName} must contain exactly three A-layer deep dives`);
    const images = text.match(/!\[[^\]]*\]\([^)]+\)/g) ?? [];
    assert(images.length === expectedImageCounts[index], `${fileName} has the wrong image count`);
    assert(
      !/!\[[^\]]*\]\([^)]*(?:answer-)?page-\d{3}\.png\)/i.test(text),
      `${fileName} embeds a prohibited full-page screenshot`,
    );
    assert(
      section.sentences.length === section.audit.sentenceCount,
      `Passage ${index + 1} sentence count audit is inconsistent`,
    );
  });
}

function validateSharedMirrors(calibration) {
  const jsonPaths = [
    path.join(root, "data", "cambridge-test-bank.json"),
    path.join(root, "data", "generated", "reports", "cambridge-test-bank.json"),
  ];
  assert(jsonPaths.every(fs.existsSync), "Both JSON bank mirrors must exist");
  const jsonTexts = jsonPaths.map((filePath) => fs.readFileSync(filePath, "utf8"));
  assert(jsonTexts[0] === jsonTexts[1], "JSON test-bank mirrors differ");
  const jsSource = fs.readFileSync(path.join(root, "data", "cambridge-test-bank.js"), "utf8").trim();
  const match = jsSource.match(/^window\.CAMBRIDGE_TEST_BANK\s*=\s*([\s\S]*);$/);
  assert(match, "Unexpected JavaScript bank wrapper");
  assert(JSON.stringify(JSON.parse(match[1])) === JSON.stringify(JSON.parse(jsonTexts[0])), "JS bank differs");
  const bank = JSON.parse(jsonTexts[0]);
  const integrated = bank.tests.find((test) => test.id === calibration.readingTest.id);
  validateIntegratedTest(integrated, calibration.readingTest);
}

function validateIntegratedTest(integrated, expected) {
  assert(integrated, "Integrated test is missing");
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
console.log("Validated Cambridge IELTS 11 Test 2 calibration and intensive reading.");
