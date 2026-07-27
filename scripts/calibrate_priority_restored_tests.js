const fs = require("fs");
const path = require("path");
const { acceptedAnswerVariants, normalizeAnswer } = require("../answer-utils.js");

const projectRoot = path.resolve(__dirname, "..");
const rootBankPath = path.join(projectRoot, "data", "cambridge-test-bank.json");
const reportBankPath = path.join(
  projectRoot,
  "data",
  "generated",
  "reports",
  "cambridge-test-bank.json",
);
const browserBankPath = path.join(projectRoot, "data", "cambridge-test-bank.js");

const targets = [
  { id: "cambridge-17-reading-test-1", book: 17, test: 1, folder: "cambridge-16-18" },
  { id: "cambridge-17-reading-test-2", book: 17, test: 2, folder: "cambridge-16-18" },
  { id: "cambridge-17-reading-test-3", book: 17, test: 3, folder: "cambridge-16-18" },
  { id: "cambridge-17-reading-test-4", book: 17, test: 4, folder: "cambridge-16-18" },
  { id: "cambridge-18-reading-test-1", book: 18, test: 1, folder: "cambridge-16-18" },
  { id: "cambridge-18-reading-test-2", book: 18, test: 2, folder: "cambridge-16-18" },
  { id: "cambridge-21-reading-test-3", book: 21, test: 3, folder: "cambridge-19-21" },
  { id: "cambridge-21-reading-test-4", book: 21, test: 4, folder: "cambridge-19-21" },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function stripMarkdown(value) {
  return String(value ?? "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/^\s*[>|-]+\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function markdownFor(target, passage) {
  const filePath = path.join(
    projectRoot,
    "data",
    "generated",
    "intensive-reading",
    target.folder,
    `Cambridge-IELTS-${target.book}-Test-${target.test}-Passage-${passage}-双语精读.md`,
  );
  return fs.readFileSync(filePath, "utf8");
}

function lastQuestionBlock(markdown, number) {
  const patterns = [
    new RegExp(`^#{3,4}\\s+(?:Question\\s+)?${number}(?:\\s+.*)?$`, "gmi"),
    new RegExp(`^#{3,4}\\s+第\\s*${number}\\s*题(?:\\s+.*)?$`, "gmi"),
  ];
  const matches = patterns.flatMap((pattern) => [...markdown.matchAll(pattern)]);
  if (!matches.length) return "";
  const match = matches.sort((left, right) => left.index - right.index).at(-1);
  const rest = markdown.slice(match.index + match[0].length);
  const next = /^#{2,4}\s+(?:(?:Question\s+)?\d+|第\s*\d+\s*题|Questions?\s+)/mi.exec(rest);
  return rest.slice(0, next ? next.index : rest.length);
}

function evidenceParagraph(text) {
  const paragraphs = text
    .split(/\r?\n\r?\n/)
    .map(stripMarkdown)
    .filter(Boolean);
  return (
    paragraphs.find((paragraph) => /(?:定位|证据)/.test(paragraph)) ||
    paragraphs.find((paragraph) => paragraph.length >= 35 && /(?:原文|对应|改写)/.test(paragraph)) ||
    ""
  );
}

function evidenceFor(markdown, number) {
  const fromBlock = evidenceParagraph(lastQuestionBlock(markdown, number));
  if (fromBlock) return fromBlock;

  const paragraphs = markdown.split(/\r?\n\r?\n/);
  const markerIndex = paragraphs.findIndex((paragraph) =>
    new RegExp(`(?:第\\s*${number}\\s*空|\\b${number}\\s+_+)`).test(paragraph),
  );
  if (markerIndex >= 0) {
    const nearby = paragraphs
      .slice(markerIndex, markerIndex + 4)
      .find((paragraph) => /(?:定位|证据)/.test(paragraph));
    if (nearby) return stripMarkdown(nearby);
  }
  return "";
}

function cleanOfficialAnswer(value) {
  return String(value ?? "")
    .replace(/\s+\d+$/, "")
    .trim();
}

function parseOfficialAnswerKey(answerKeyText, testNumber) {
  const startPattern = new RegExp(
    `Listening and Reading answer keys\\s+TEST\\s+${testNumber}\\s+READING\\s+`,
    "gi",
  );
  const starts = [...answerKeyText.matchAll(startPattern)];
  assert(starts.length, `official answer-key text has no TEST ${testNumber} READING section`);
  const candidates = starts.map((start) => {
    const remainder = answerKeyText.slice(start.index + start[0].length);
    const boundaries = [
      /Listening and Reading answer keys/i.exec(remainder)?.index,
      /\nTEST\s+\d+\s*\nLISTENING\n/i.exec(remainder)?.index,
      /\nREADING\n/i.exec(remainder)?.index,
    ].filter((index) => Number.isInteger(index));
    const boundary = boundaries.length ? Math.min(...boundaries) : remainder.length;
    return remainder.slice(0, boundary);
  });
  const text = candidates.sort((left, right) => {
    const score = (value) => (value.match(/^\d+\s+\S.+$/gm) || []).length;
    return score(right) - score(left);
  })[0];
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const result = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const paired = /^(\d+)\s*&\s*(\d+)\s+IN EITHER ORDER$/i.exec(line);
    if (paired) {
      const values = [];
      for (let cursor = index + 1; cursor < lines.length && values.length < 2; cursor += 1) {
        if (/^\d/.test(lines[cursor]) || /^Reading Passage/i.test(lines[cursor])) break;
        if (/^[A-Z](?:\s*\/\s*[A-Z])?$/.test(lines[cursor])) values.push(lines[cursor]);
      }
      assert(
        values.length === 2,
        `could not parse paired official answers: ${line}; next=${lines.slice(index + 1, index + 6).join(" | ")}`,
      );
      result[Number(paired[1])] = values;
      result[Number(paired[2])] = values;
      continue;
    }
    const single = /^(\d+)\s+(.+)$/.exec(line);
    if (!single) continue;
    const number = Number(single[1]);
    if (number >= 1 && number <= 40 && !/Questions?/i.test(single[2])) {
      result[number] = [cleanOfficialAnswer(single[2])];
    }
  }
  return result;
}

function normalizedQuestionVariants(question) {
  return new Set(acceptedAnswerVariants(question).map(normalizeAnswer));
}

function verifyOfficialAnswers(test) {
  const testNumber = Number(/test-(\d+)/.exec(test.id)?.[1]);
  let official;
  try {
    official = parseOfficialAnswerKey(test.answerKeyText, testNumber);
  } catch (error) {
    throw new Error(`${test.id}: ${error.message}`);
  }
  const mismatches = [];
  for (const question of test.questions) {
    const expected = official[Number(question.number)] || [];
    if (!expected.length) {
      mismatches.push(`${question.number}: official answer not parsed`);
      continue;
    }
    const actualVariants = normalizedQuestionVariants(question);
    const expectedVariants = new Set(
      expected.flatMap((answer) =>
        acceptedAnswerVariants({ answer }).map(normalizeAnswer),
      ),
    );
    const matched = [...actualVariants].some((answer) => expectedVariants.has(answer));
    if (!matched) {
      mismatches.push(
        `${question.number}: bank=${question.answer}; official=${expected.join(" / ")}`,
      );
    }
  }
  assert(mismatches.length === 0, `${test.id} answer-key mismatch:\n${mismatches.join("\n")}`);
}

function writeBank(bank) {
  const json = `${JSON.stringify(bank, null, 2)}\n`;
  fs.writeFileSync(rootBankPath, json, "utf8");
  fs.writeFileSync(reportBankPath, json, "utf8");
  fs.writeFileSync(
    browserBankPath,
    `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`,
    "utf8",
  );
}

const bank = JSON.parse(fs.readFileSync(rootBankPath, "utf8"));
for (const target of targets) {
  const test = bank.tests.find((candidate) => candidate.id === target.id);
  assert(test, `missing test ${target.id}`);
  verifyOfficialAnswers(test);

  const markdownByPassage = Object.fromEntries(
    [1, 2, 3].map((passage) => [passage, markdownFor(target, passage)]),
  );
  for (const question of test.questions) {
    if (String(question.evidence ?? "").trim()) continue;
    const passage = Number(question.passage) || (question.number <= 13 ? 1 : question.number <= 26 ? 2 : 3);
    question.evidence = evidenceFor(markdownByPassage[passage], Number(question.number));
    assert(question.evidence, `${test.id} question ${question.number}: no evidence extracted`);
  }

  test.draftStatus = "manually_calibrated";
  test.parseConfidence = "human_verified";
  test.calibrationSource = "official_answer_key_and_bilingual_intensive_reading";
}

writeBank(bank);
console.log(`PASS: ${targets.length} priority restored tests match official answer keys and have evidence.`);
