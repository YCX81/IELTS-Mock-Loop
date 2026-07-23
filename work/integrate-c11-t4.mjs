import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const calibrationDir = path.join(root, "work", "calibration", "cambridge-11", "test-4");
const aggregatePath = path.join(calibrationDir, "calibration.json");
const sourcePagesPath = path.join(calibrationDir, "source-pages.json");
const pageJsonPath = path.join(root, "data", "generated", "page-json", "cambridge-ielts-11.pages.json");
const rawPath = path.join(root, "data", "generated", "text-pages", "cambridge-ielts-11.raw.md");
const bankJsonPaths = [
  path.join(root, "data", "cambridge-test-bank.json"),
  path.join(root, "data", "generated", "reports", "cambridge-test-bank.json"),
];
const bankJsPath = path.join(root, "data", "cambridge-test-bank.js");
const sourcePageNumbers = Array.from({ length: 13 }, (_, index) => index + 85);
const answerKeyPage = 129;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function instructionsOf(section) {
  const value = section.instructions ?? section.instruction;
  return Array.isArray(value) ? value : [value];
}

function acceptedAnswersOf(question) {
  return question.acceptableAnswers ?? question.acceptedVariants ?? [question.answer];
}

function optionsOf(question, section) {
  return question.options ?? section.options ?? section.headings ?? section.labels ?? [];
}

function buildQuestion(question, section, passage, officialAnswers) {
  return {
    id: `R${question.number}`,
    number: question.number,
    type: section.type.toLowerCase(),
    prompt: question.prompt ?? question.stem,
    options: optionsOf(question, section),
    answer: officialAnswers[String(question.number)] ?? question.answer,
    acceptedAnswers: acceptedAnswersOf(question),
    evidence: question.evidence,
    locator: question.location,
    distractorRationale: question.distractorRationale ?? question.distractorBasis,
    instruction: instructionsOf(section),
    wordLimit: question.wordLimit ?? section.wordLimit ?? null,
    sourcePages: passage.sourcePages,
    answerKeyPage,
  };
}

function buildReadingSection(passage) {
  const sentences = passage.paragraphs.flatMap((paragraph) => paragraph.sentences);
  const questionSections = passage.questionSections ?? passage.questionGroups;
  return {
    number: passage.passage,
    title: passage.title,
    subtitle: passage.subtitle ?? null,
    instruction: passage.instruction ?? passage.overallInstruction,
    kind: "reading",
    pages: passage.sourcePages,
    sourcePages: passage.sourcePages,
    answerKeyPage,
    paragraphs: passage.paragraphs.map((paragraph) => paragraph.sentences.join(" ")),
    paragraphDetails: passage.paragraphs,
    sentences,
    questionSections,
    questionRange: questionSections.map((section) => section.range).join(", "),
    audit: {
      sentenceCount: sentences.length,
      paragraphCount: passage.paragraphs.length,
      questionCount: questionSections.flatMap((section) => section.questions).length,
    },
  };
}

function buildReadingTest(passages, sourcePages, officialAnswers) {
  const readingSections = passages.map(buildReadingSection);
  const questions = passages.flatMap((passage) =>
    (passage.questionSections ?? passage.questionGroups).flatMap((section) =>
      section.questions.map((question) => buildQuestion(question, section, passage, officialAnswers)),
    ),
  );
  return {
    source: "Local Cambridge IELTS 11 manually calibrated against the original PDF",
    draftStatus: "manually_calibrated",
    parseConfidence: "human_verified",
    pdf: "data/Cambridge-IELTS-11.pdf",
    answerKeyText: sourcePages.find((page) => page.page === answerKeyPage).text,
    answerKeyPages: [answerKeyPage],
    mode: "reading",
    id: "cambridge-11-reading-test-4",
    title: "Cambridge IELTS 11 Reading Test 4",
    durationSec: 3600,
    passageTitle: readingSections[0].title,
    passage: readingSections[0].paragraphs,
    rawOcrText: sourcePages
      .filter((page) => sourcePageNumbers.includes(page.page))
      .map((page) => page.text)
      .join("\n\n"),
    readingSections,
    questions,
    sourcePages: sourcePageNumbers,
  };
}

function buildCalibration() {
  const passages = [1, 2, 3].map((number) =>
    readJson(path.join(calibrationDir, `passage-${number}.json`)),
  );
  const sourceDocument = readJson(sourcePagesPath);
  const sourcePages = sourceDocument.pages.map((page) => ({
    ...page,
    text: Array.isArray(page.lines) ? page.lines.join("\n") : page.text,
  }));
  const calibration = {
    book: 11,
    test: 4,
    status: "manually_calibrated",
    sourcePageNumbers,
    answerKeyPage,
    sourcePages,
    passages,
    readingTest: buildReadingTest(passages, sourcePages, sourceDocument.officialAnswers),
  };
  writeJson(aggregatePath, calibration);
  return calibration;
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

function updatePages(calibration) {
  const pageDocument = readJson(pageJsonPath);
  const replacements = new Map(calibration.sourcePages.map((page) => [page.page, page.text]));
  for (const page of pageDocument.pages) {
    if (!replacements.has(page.page)) continue;
    if (page.calibration?.reason) continue;
    page.text = replacements.get(page.page);
    page.engine = "manual_calibration_against_pdf";
    page.calibration = {
      status: "manually_calibrated",
      book: 11,
      test: 4,
      checkedAgainst: "data/Cambridge-IELTS-11.pdf",
    };
  }
  for (const pageNumber of replacements.keys()) {
    if (!pageDocument.pages.some((page) => page.page === pageNumber)) {
      throw new Error(`Missing source page ${pageNumber}`);
    }
  }
  writeJson(pageJsonPath, pageDocument);
  fs.writeFileSync(rawPath, buildRaw(pageDocument), "utf8");
}

function replaceTest(bank, readingTest) {
  if (!Array.isArray(bank.tests)) throw new Error("Expected a tests array in bank");
  const index = bank.tests.findIndex((test) => test.id === readingTest.id);
  if (index < 0) throw new Error(`Missing ${readingTest.id} in bank`);
  bank.tests[index] = readingTest;
  return bank;
}

function updateBanks(readingTest) {
  const existingPath = bankJsonPaths.find(fs.existsSync);
  if (!existingPath) throw new Error("No JSON test-bank mirror exists");
  const bank = replaceTest(readJson(existingPath), readingTest);
  for (const filePath of bankJsonPaths) writeJson(filePath, bank);
  fs.writeFileSync(bankJsPath, `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`, "utf8");
}

function validate(calibration) {
  const { readingTest } = calibration;
  if (readingTest.readingSections.length !== 3) throw new Error("Expected three sections");
  if (readingTest.questions.length !== 40) throw new Error("Expected 40 questions");
  readingTest.questions.forEach((question, index) => {
    if (question.number !== index + 1) throw new Error("Questions must be ordered 1 through 40");
    for (const key of ["prompt", "answer", "evidence", "locator", "distractorRationale"]) {
      if (!question[key]) throw new Error(`Question ${question.number} is missing ${key}`);
    }
  });
}

const calibration = buildCalibration();
validate(calibration);
updatePages(calibration);
updateBanks(calibration.readingTest);
console.log("Integrated Cambridge IELTS 11 Reading Test 4 calibration.");
