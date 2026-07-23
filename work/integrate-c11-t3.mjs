import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const calibrationDir = path.join(root, "work", "calibration", "cambridge-11", "test-3");
const aggregatePath = path.join(calibrationDir, "calibration.json");
const sourcePagesPath = path.join(calibrationDir, "source-pages.json");
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
const bankJsonPaths = [
  path.join(root, "data", "cambridge-test-bank.json"),
  path.join(root, "data", "generated", "reports", "cambridge-test-bank.json"),
];
const bankJsPath = path.join(root, "data", "cambridge-test-bank.js");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function getQuestionSections(passage) {
  return passage.questionGroups ?? passage.questionSections;
}

function getPassageSourcePages(passage) {
  if (Array.isArray(passage.sourcePages)) return passage.sourcePages;
  return [...passage.sourcePages.passage, ...passage.sourcePages.questions];
}

function getAcceptedAnswers(question) {
  return (
    question.acceptableAnswers ??
    question.acceptedVariants ??
    [question.answer]
  );
}

function getInstructions(questionSection) {
  const instructions = questionSection.instructions ?? questionSection.instruction;
  return Array.isArray(instructions) ? instructions : [instructions];
}

function buildQuestion(question, questionSection, sourcePages, officialAnswers) {
  return {
    id: `R${question.number}`,
    number: question.number,
    type: questionSection.type.toLowerCase(),
    prompt: question.prompt ?? question.stem,
    options: question.options ?? questionSection.options ?? questionSection.labels ?? [],
    answer: officialAnswers[String(question.number)] ?? question.answer,
    acceptedAnswers: getAcceptedAnswers(question),
    evidence: question.evidence,
    locator: question.location,
    distractorRationale:
      question.distractorRationale ?? question.distractorBasis,
    instruction: getInstructions(questionSection),
    wordLimit: question.wordLimit ?? questionSection.wordLimit ?? null,
    sourcePages,
    answerKeyPage: 127,
  };
}

function buildReadingSection(passage) {
  const sourcePages = getPassageSourcePages(passage);
  const sentences = passage.paragraphs.flatMap((paragraph) => paragraph.sentences);
  const questionSections = getQuestionSections(passage);
  return {
    number: passage.passage,
    title: passage.title,
    subtitle: passage.subtitle ?? null,
    instruction: passage.instruction ?? passage.overallInstruction,
    kind: "reading",
    pages: sourcePages,
    sourcePages,
    answerKeyPage: 127,
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
  const questions = passages.flatMap((passage, index) => {
    const passagePages = readingSections[index].sourcePages;
    return getQuestionSections(passage).flatMap((questionSection) =>
      questionSection.questions.map((question) =>
        buildQuestion(
          question,
          questionSection,
          passagePages,
          officialAnswers,
        ),
      ),
    );
  });
  const answerKeyText = sourcePages.find((page) => page.page === 127).text;
  return {
    source: "Local Cambridge IELTS 11 manually calibrated against the original PDF",
    draftStatus: "manually_calibrated",
    parseConfidence: "human_verified",
    pdf: "data/Cambridge-IELTS-11.pdf",
    answerKeyText,
    answerKeyPages: [127],
    mode: "reading",
    id: "cambridge-11-reading-test-3",
    title: "Cambridge IELTS 11 Reading Test 3",
    durationSec: 3600,
    passageTitle: readingSections[0].title,
    passage: readingSections[0].paragraphs,
    rawOcrText: sourcePages
      .filter((page) => page.page >= 63 && page.page <= 74)
      .map((page) => page.text)
      .join("\n\n"),
    readingSections,
    questions,
    sourcePages: Array.from({ length: 12 }, (_, index) => index + 63),
  };
}

function buildCalibration() {
  const passages = [1, 2, 3].map((number) =>
    readJson(path.join(calibrationDir, `passage-${number}.json`)),
  );
  const sourcePageDocument = readJson(sourcePagesPath);
  const sourcePages = sourcePageDocument.pages.map((page) => ({
    ...page,
    text: Array.isArray(page.lines) ? page.lines.join("\n") : page.text,
  }));
  const calibration = {
    book: 11,
    test: 3,
    status: "manually_calibrated",
    sourcePageNumbers: Array.from({ length: 12 }, (_, index) => index + 63),
    answerKeyPage: 127,
    sourcePages,
    passages,
    readingTest: buildReadingTest(
      passages,
      sourcePages,
      sourcePageDocument.officialAnswers,
    ),
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
  const replacements = new Map(
    calibration.sourcePages.map((page) => [page.page, page.text]),
  );
  for (const page of pageDocument.pages) {
    if (!replacements.has(page.page)) continue;
    if (page.calibration?.reason) continue;
    page.text = replacements.get(page.page);
    page.engine = "manual_calibration_against_pdf";
    page.calibration = {
      status: "manually_calibrated",
      book: 11,
      test: 3,
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

function updateBankObject(bank, readingTest) {
  if (!Array.isArray(bank.tests)) throw new Error("Expected a tests array in bank");
  const index = bank.tests.findIndex((test) => test.id === readingTest.id);
  if (index < 0) throw new Error(`Missing ${readingTest.id} in bank`);
  bank.tests[index] = readingTest;
  return bank;
}

function updateBanks(readingTest) {
  const existingJsonPath = bankJsonPaths.find(fs.existsSync);
  if (!existingJsonPath) throw new Error("No JSON test-bank mirror exists");
  const bank = updateBankObject(readJson(existingJsonPath), readingTest);
  for (const filePath of bankJsonPaths) writeJson(filePath, bank);
  fs.writeFileSync(
    bankJsPath,
    `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`,
    "utf8",
  );
}

function validateCalibration(calibration) {
  const { readingTest } = calibration;
  if (readingTest.readingSections.length !== 3) {
    throw new Error("Expected exactly three reading sections");
  }
  if (readingTest.questions.length !== 40) {
    throw new Error("Expected exactly 40 questions");
  }
  readingTest.questions.forEach((question, index) => {
    if (question.number !== index + 1) {
      throw new Error("Questions must be ordered 1 through 40");
    }
    for (const key of ["prompt", "answer", "evidence", "locator", "distractorRationale"]) {
      if (!question[key]) throw new Error(`Question ${question.number} is missing ${key}`);
    }
  });
}

const calibration = buildCalibration();
validateCalibration(calibration);
updatePages(calibration);
updateBanks(calibration.readingTest);
console.log("Integrated Cambridge IELTS 11 Reading Test 3 calibration.");
