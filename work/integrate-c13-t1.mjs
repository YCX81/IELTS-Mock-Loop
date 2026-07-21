import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const calibrationDir = path.join(
  root,
  "work",
  "calibration",
  "cambridge-13",
  "test-1",
);
const calibrationPath = path.join(calibrationDir, "calibration.json");
const pageJsonPath = path.join(
  root,
  "data",
  "generated",
  "page-json",
  "cambridge-ielts-13.pages.json",
);
const rawPath = path.join(
  root,
  "data",
  "generated",
  "text-pages",
  "cambridge-ielts-13.raw.md",
);
const bankJsonPaths = [
  path.join(root, "data", "cambridge-test-bank.json"),
  path.join(root, "data", "generated", "reports", "cambridge-test-bank.json"),
];
const bankJsPath = path.join(root, "data", "cambridge-test-bank.js");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function assembleCalibration() {
  const source = readJson(path.join(calibrationDir, "source-pages.json"));
  const passages = [1, 2, 3].map((number) =>
    readJson(path.join(calibrationDir, `passage-${number}.json`)),
  );
  const readingSections = passages.map((passage) => ({
    title: `Reading Passage ${passage.passageNumber}`,
    passageNumber: passage.passageNumber,
    kind: "reading-passage",
    titleText: passage.title,
    subtitle: passage.subtitle ?? "",
    pages: passage.sourcePages,
    paragraphs: passage.bodyParagraphs,
    sentences: passage.sentences.map((sentence, index) =>
      typeof sentence === "string" ? { number: index + 1, text: sentence } : sentence,
    ),
  }));
  const questionSections = passages.flatMap((passage) =>
    passage.questionSections.map((section) => ({
      ...section,
      passageNumber: passage.passageNumber,
    })),
  );
  const questions = passages.flatMap((passage) => passage.questions);
  const answerKeyText = questions
    .map((question) => `${question.number} ${Array.isArray(question.answer) ? question.answer.join(" / ") : question.answer}`)
    .join("; ");
  const passageText = passages.flatMap((passage) => passage.bodyParagraphs).join("\n\n");
  const readingTest = {
    source: "Cambridge IELTS 13 Academic",
    draftStatus: "manually_calibrated",
    parseConfidence: "manual",
    pdf: "data/Cambridge-IELTS-13.pdf",
    answerKeyText,
    answerKeyPages: [source.answerKeyPage],
    answerKeyPage: source.answerKeyPage,
    mode: "reading",
    id: "cambridge-13-reading-test-1",
    title: "Cambridge IELTS 13 Reading Test 1",
    durationSec: 3600,
    passageTitle: "Cambridge IELTS 13 Reading Test 1",
    passage: passageText,
    rawOcrText: passageText,
    calibratedText: passageText,
    readingSections,
    questionSections,
    questions,
    sourcePages: source.sourcePages.map((page) => page.page).filter((page) => page !== source.answerKeyPage),
    sourcePageMap: source.passageAndQuestionPages,
  };
  const calibration = {
    book: 13,
    test: 1,
    reviewMethod: source.reviewMethod,
    passageAndQuestionPages: source.passageAndQuestionPages,
    answerKeyPage: source.answerKeyPage,
    sourcePages: source.sourcePages,
    readingTest,
  };
  writeJson(calibrationPath, calibration);
  return calibration;
}

function buildRaw(pageDocument) {
  const prefix = [
    "# Cambridge IELTS 13 raw text",
    "",
    `Extraction method: ${pageDocument.method}. This is a local working draft. Check all question numbers, options, and answer keys before using it as a mock test.`,
    "",
  ].join("\n");
  const body = pageDocument.pages
    .map((page) => `## Page ${page.page}\n\n${page.text}`)
    .join("\n\n");
  return `${prefix}\n${body}\n`;
}

function updatePages(calibration) {
  const document = readJson(pageJsonPath);
  const replacements = new Map(
    calibration.sourcePages.map((page) => [Number(page.page), String(page.text)]),
  );
  const missing = [];
  for (const [pageNumber, text] of replacements) {
    const page = document.pages.find((candidate) => Number(candidate.page) === pageNumber);
    if (!page) {
      missing.push(pageNumber);
      continue;
    }
    page.text = text;
    page.engine = "manual_calibration_against_pdf";
  }
  if (missing.length) {
    throw new Error(`Missing source page(s): ${missing.join(", ")}`);
  }
  writeJson(pageJsonPath, document);
  fs.writeFileSync(rawPath, buildRaw(document), "utf8");
}

function updateBankObject(bank, readingTest) {
  if (!Array.isArray(bank.tests)) {
    throw new Error("Expected test-bank object with a tests array");
  }
  const index = bank.tests.findIndex((test) => test.id === readingTest.id);
  if (index < 0) {
    throw new Error(`Could not find ${readingTest.id}`);
  }
  bank.tests[index] = readingTest;
  return bank;
}

function readJsBank(file) {
  const source = fs.readFileSync(file, "utf8").trim();
  const match = source.match(/^window\.CAMBRIDGE_TEST_BANK\s*=\s*([\s\S]*);$/);
  if (!match) throw new Error(`Unexpected JS bank wrapper: ${path.relative(root, file)}`);
  return JSON.parse(match[1]);
}

function writeJsBank(file, bank) {
  fs.writeFileSync(
    file,
    `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`,
    "utf8",
  );
}

function updateBanks(calibration) {
  const existingJsonPath = bankJsonPaths.find((file) => fs.existsSync(file));
  if (!existingJsonPath) throw new Error("No JSON test-bank mirror exists");
  const bank = updateBankObject(readJson(existingJsonPath), calibration.readingTest);
  for (const file of bankJsonPaths) writeJson(file, bank);
  if (fs.existsSync(bankJsPath)) {
    const jsBank = readJsBank(bankJsPath);
    if (jsBank.tests.length > 0) {
      updateBankObject(jsBank, calibration.readingTest);
      writeJsBank(bankJsPath, jsBank);
    } else {
      writeJsBank(bankJsPath, bank);
    }
  }
}

function validateCalibration(calibration) {
  if (calibration.book !== 13 || calibration.test !== 1) {
    throw new Error("This integration script only accepts Cambridge 13 Test 1");
  }
  const readingTest = calibration.readingTest;
  if (readingTest.id !== "cambridge-13-reading-test-1") {
    throw new Error("Unexpected reading test id");
  }
  if (readingTest.draftStatus !== "manually_calibrated") {
    throw new Error("readingTest.draftStatus must be manually_calibrated");
  }
  if (!Array.isArray(readingTest.readingSections) || readingTest.readingSections.length !== 3) {
    throw new Error("Expected exactly three readingSections");
  }
  if (!Array.isArray(readingTest.questions) || readingTest.questions.length !== 40) {
    throw new Error("Expected exactly 40 questions");
  }
  const numbers = readingTest.questions.map((question) => question.number);
  if (numbers.some((number, index) => number !== index + 1)) {
    throw new Error("Question numbers must be exactly 1 through 40");
  }
}

const calibration = assembleCalibration();
validateCalibration(calibration);
updatePages(calibration);
updateBanks(calibration);
console.log("Integrated Cambridge IELTS 13 Reading Test 1 calibration.");
