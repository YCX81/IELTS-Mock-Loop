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
  "test-3",
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
  "tea",
  "reel",
  "women",
  "royalty",
  "currency",
  "paper",
  "wool",
  "monks",
  "nylon",
  "FALSE",
  "TRUE",
  "FALSE",
  "NOT GIVEN",
  "FALSE",
  "TRUE",
  "NOT GIVEN",
  "TRUE",
  "FALSE",
  "G",
  "C",
  "A",
  "E",
  "speed",
  "plains",
  "bottlenecks",
  "corridor/passageway",
  "D",
  "B",
  "G",
  "C",
  "B",
  "E",
  "A",
  "F",
  "beginner",
  "arithmetic",
  "intuitive",
  "scientists",
  "experiments",
  "theorems",
];
const expectedSentenceCounts = [40, 38, 37];
const requiredSectionPatterns = [
  /^##\s+(?:\d{2}\s+)?题目与选项精讲\s*$/m,
  /^##\s+(?:\d{2}\s+)?B1\+\s*.*$/m,
  /^##\s+(?:\d{2}\s+)?(?:官方)?答案汇总\s*$/m,
  /^##\s+(?:\d{2}\s+)?(?:IELTS\s*阅读提醒|学习总结)\s*$/m,
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
  assert(calibration.book === 11, "Calibration book must be 11");
  assert(calibration.test === 3, "Calibration test must be 3");
  assert(calibration.answerKeyPage === 127, "Answer key page must be 127");
  assert(
    JSON.stringify(calibration.sourcePageNumbers) ===
      JSON.stringify(Array.from({ length: 12 }, (_, index) => index + 63)),
    "Source pages must be exactly 63 through 74",
  );
  assert(calibration.sourcePages.length === 13, "Expected 12 test pages plus answer page");
  const answerPage = calibration.sourcePages.find((page) => page.page === 127);
  assert(answerPage, "Missing calibrated answer page 127");
  expectedAnswers.forEach((answer, index) => {
    assert(
      answerPage.text.includes(`${index + 1} ${answer}`),
      `Answer page 127 is missing answer ${index + 1}`,
    );
  });

  const readingTest = calibration.readingTest;
  assert(readingTest.id === "cambridge-11-reading-test-3", "Unexpected test id");
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
    assert(storedPage.text === sourcePage.text, `Page ${sourcePage.page} does not match calibration`);
  }
}

function validateIntensiveFiles(calibration) {
  const expectedImageCounts = [0, 0, 0];
  calibration.readingTest.readingSections.forEach((section, index) => {
    const fileName = `Cambridge-IELTS-11-Test-3-Passage-${index + 1}-双语精读.md`;
    const filePath = path.join(intensiveDir, fileName);
    assert(fs.existsSync(filePath), `Missing intensive-reading file ${fileName}`);
    const text = fs.readFileSync(filePath, "utf8");
    const topLevelSections = text.match(/^##\s+.+$/gm) ?? [];
    assert(topLevelSections.length >= 5, `${fileName} must contain at least five top-level sections`);
    for (const headingPattern of requiredSectionPatterns) {
      assert(
        headingPattern.test(text),
        `${fileName} is missing a required top-level section`,
      );
    }
    const dictionaryLinks = text.match(/https:\/\/dictionary\.cambridge\.org\/[^\s)]+/g) ?? [];
    assert(dictionaryLinks.length === 3, `${fileName} must contain exactly three Cambridge links`);
    const aLayers = text.match(/A\s*层深挖/g) ?? [];
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
    assert(
      section.sentences.length === expectedSentenceCounts[index],
      `Passage ${index + 1} must contain exactly ${expectedSentenceCounts[index]} sentences`,
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
  assert(JSON.stringify(integrated) === JSON.stringify(calibration.readingTest), "Integrated test differs");
}

assert(fs.existsSync(calibrationPath), "Missing aggregate calibration.json");
const calibration = readJson(calibrationPath);
validateCalibration(calibration);
validatePageMirrors(calibration);
validateIntensiveFiles(calibration);
if (process.argv.includes("--shared")) validateSharedMirrors(calibration);
console.log("Validated Cambridge IELTS 11 Test 3 calibration and intensive reading.");
