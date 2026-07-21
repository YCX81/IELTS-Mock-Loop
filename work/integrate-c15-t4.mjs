import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const calibrationDir = path.join(root, "work", "calibration", "cambridge-15", "test-4");
const manifest = readJson(path.join(calibrationDir, "calibration.json"));
const pageTextDoc = readJson(path.join(calibrationDir, "page-texts.json"));
const passageDoc = readJson(path.join(calibrationDir, "passages.json"));
const questionDoc = readJson(path.join(calibrationDir, "questions.json"));
const sentenceSegmenter = new Intl.Segmenter("en", { granularity: "sentence" });

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

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
      if (text) {
        records.push({
          id: `P${passage.passage}-S${records.length + 1}`,
          paragraph: paragraph.id,
          text,
        });
      }
    }
  }
  return records;
}

function questionSectionParagraphs(section, questions) {
  const lines = [section.heading, ...section.instructions];
  if (section.wordLimit) lines.push(section.wordLimit);
  if (section.prompt) lines.push(section.prompt);
  if (section.title) lines.push(section.title);
  if (section.notesTitle) lines.push(section.notesTitle);
  if (section.tableTitle) lines.push(section.tableTitle);
  if (section.columnHeadings) lines.push(...section.columnHeadings);
  if (section.subheadings) lines.push(...section.subheadings);
  if (section.definitions) lines.push(...Object.entries(section.definitions).map(([label, value]) => `${label} ${value}`));
  if (section.responseOptions) {
    lines.push(...section.responseOptions.map((option) => `${option.label} ${option.definition}`));
  }
  for (const domain of [section.options, section.optionDomain, section.sharedOptions]) {
    if (!domain) continue;
    if (Array.isArray(domain)) {
      lines.push(...domain.map((option) => typeof option === "string" ? option : `${option.label} ${option.text}`));
    } else {
      lines.push(...Object.entries(domain).map(([label, value]) => `${label} ${value}`));
    }
  }
  if (section.box?.title) {
    lines.push(section.box.title, ...section.box.items.map((item) => item.renderedText));
  }
  if (section.table?.rows) lines.push(...section.table.rows.map((row) => `${row.period}: ${row.text}`));
  if (section.summaryTitle) lines.push(section.summaryTitle);
  if (Array.isArray(section.summary)) lines.push(...section.summary);
  else if (section.summary) lines.push(section.summary);
  for (const question of questions) {
    if (!lines.some((line) => line.includes(question.prompt))) lines.push(`${question.number} ${question.prompt}`);
    if (question.options) {
      const options = Array.isArray(question.options)
        ? question.options.map((option) => typeof option === "string" ? option : `${option.label} ${option.text}`)
        : Object.entries(question.options).map(([label, value]) => `${label} ${value}`);
      lines.push(...options);
    }
  }
  return lines;
}
function buildQuestionStructure(section, questions) {
  const structure = { ...section };
  delete structure.passage;
  delete structure.physicalPage;
  structure.physicalPage = section.physicalPage;
  if (!structure.questions) {
    structure.questions = questions.map((question) => ({
      number: question.number,
      stem: question.prompt,
      options: question.options || undefined,
    }));
  }
  return structure;
}

function buildTest() {
  const calibratedPassages = passageDoc.passages.map((passage) => {
    const sentences = sentenceRecords(passage);
    return {
      ...passage,
      paragraphs: passage.paragraphs.map((paragraph) => paragraph.text),
      structuredParagraphs: passage.paragraphs,
      sentences,
      paragraphCount: passage.paragraphs.length,
      sentenceCount: sentences.length,
      images: [],
    };
  });

  const readingSections = [];
  for (const passage of calibratedPassages) {
    readingSections.push({
      title: `Reading Passage ${passage.passage}`,
      kind: "reading",
      pages: passage.sourcePages,
      paragraphs: passage.paragraphs,
      structuredParagraphs: passage.structuredParagraphs,
      sentences: passage.sentences,
      paragraphCount: passage.paragraphCount,
      sentenceCount: passage.sentenceCount,
    });
    for (const section of questionDoc.questionSections.filter((item) => item.passage === passage.passage)) {
      const sectionQuestions = questionDoc.questions.filter((question) => {
        if (question.passage !== passage.passage) return false;
        const numbers = section.heading.match(/\d+/g)?.map(Number) || [];
        return numbers.length === 1
          ? question.number === numbers[0]
          : question.number >= numbers[0] && question.number <= numbers[numbers.length - 1];
      });
      readingSections.push({
        title: section.heading,
        kind: "questions",
        pages: [section.physicalPage],
        paragraphs: questionSectionParagraphs(section, sectionQuestions),
        questionStructure: buildQuestionStructure(section, sectionQuestions),
      });
    }
  }

  const answerPage = pageTextDoc.pages.find((page) => page.page === manifest.answerKeyPage);
  const passage = [];
  for (const section of readingSections) {
    passage.push(`${section.title}\n${section.paragraphs.join("\n")}`);
  }

  return {
    source: manifest.source,
    draftStatus: "manually_calibrated",
    parseConfidence: "verified",
    pdf: "data/Cambridge-IELTS-15.pdf",
    answerKeyText: answerPage.textLines.join("\n"),
    answerKeyPages: [manifest.answerKeyPage],
    mode: "reading",
    id: "cambridge-15-reading-test-4",
    title: "Cambridge IELTS 15 Reading Test 4",
    durationSec: 3600,
    passageTitle: "Cambridge IELTS 15 Reading Test 4",
    passage,
    rawOcrText: pageTextDoc.pages
      .filter((page) => manifest.sourcePages.includes(page.page))
      .map((page) => page.textLines.join("\n"))
      .join("\n\n"),
    readingSections,
    calibratedPassages,
    questions: questionDoc.questions,
    sourcePages: manifest.sourcePages,
    semanticImagesRequired: false,
    images: [],
    calibration: {
      method: "manual visual page-by-page readback",
      passageParagraphCounts: calibratedPassages.map((passageItem) => passageItem.paragraphCount),
      passageSentenceCounts: calibratedPassages.map((passageItem) => passageItem.sentenceCount),
      questionRange: [1, 40],
      questionCount: questionDoc.questions.length,
      answerKeyPages: [manifest.answerKeyPage],
      manuallyReadBack: true,
    },
  };
}

function integrateSourcePages() {
  const pagesPath = path.join(root, "data", "generated", "page-json", "cambridge-ielts-15.pages.json");
  const rawPath = path.join(root, "data", "generated", "text-pages", "cambridge-ielts-15.raw.md");
  const pagesDoc = readJson(pagesPath);
  const pageTextMap = new Map(pageTextDoc.pages.map((page) => [page.page, page.textLines.join("\n")]));
  for (const page of pagesDoc.pages) {
    if (!pageTextMap.has(Number(page.page))) continue;
    page.text = pageTextMap.get(Number(page.page));
    page.calibration = {
      status: "manually_calibrated",
      book: 15,
      test: 3,
      method: "manual visual page-by-page readback",
    };
  }
  writeJson(pagesPath, pagesDoc);

  let raw = fs.readFileSync(rawPath, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  for (const [pageNumber, text] of pageTextMap) {
    const marker = `## Page ${pageNumber}${eol}${eol}`;
    const start = raw.indexOf(marker);
    if (start < 0) throw new Error(`Missing raw page marker ${pageNumber}`);
    const bodyStart = start + marker.length;
    const next = raw.indexOf(`${eol}## Page `, bodyStart);
    const bodyEnd = next < 0 ? raw.length : next + eol.length;
    const replacement = `${text.replace(/\n/g, eol)}${eol}${eol}`;
    raw = `${raw.slice(0, bodyStart)}${replacement}${raw.slice(bodyEnd)}`;
  }
  fs.writeFileSync(rawPath, raw, "utf8");
}

function integrateSharedBanks(test) {
  const canonical = path.join(root, "data", "cambridge-test-bank.json");
  const report = path.join(root, "data", "generated", "reports", "cambridge-test-bank.json");
  const jsMirror = path.join(root, "data", "cambridge-test-bank.js");
  const source = fs.existsSync(canonical) ? canonical : report;
  if (!fs.existsSync(source)) return;
  const bank = readJson(source);
  const index = bank.tests.findIndex((item) => item.id === test.id);
  if (index < 0) bank.tests.push(test);
  else bank.tests[index] = test;
  writeJson(canonical, bank);
  writeJson(report, bank);
  fs.writeFileSync(jsMirror, `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`, "utf8");
}

const test = buildTest();
writeJson(path.join(calibrationDir, "test-bank-entry.json"), test);
integrateSourcePages();
integrateSharedBanks(test);

console.log(`integrated ${test.id}`);
console.log(`passage sentence counts: ${test.calibration.passageSentenceCounts.join(", ")}`);
console.log(`question sections: ${test.readingSections.filter((section) => section.kind === "questions").length}`);
console.log(`questions: ${test.questions.length}`);
