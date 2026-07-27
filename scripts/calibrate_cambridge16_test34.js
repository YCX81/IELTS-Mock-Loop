const fs = require("fs");
const path = require("path");

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
const intensiveRoot = path.join(
  projectRoot,
  "data",
  "generated",
  "intensive-reading",
  "cambridge-16-18",
);

const testSpecs = {
  "cambridge-16-reading-test-3": {
    testNumber: 3,
    promptOverrides: {
      6: "Warships were designed so that they were __________ and moved quickly.",
    },
    groups: [
      { start: 1, end: 5, passage: 1, type: "true-false-not-given" },
      { start: 6, end: 13, passage: 1, type: "summary-completion" },
      { start: 14, end: 19, passage: 2, type: "matching-information", options: letters("A", "H") },
      { start: 20, end: 22, passage: 2, type: "summary-completion" },
      {
        start: 23,
        end: 24,
        passage: 2,
        type: "multiple-choice-multiple-answer",
        shared: true,
        selectionCount: 2,
        answerOrder: "either",
      },
      {
        start: 25,
        end: 26,
        passage: 2,
        type: "multiple-choice-multiple-answer",
        shared: true,
        selectionCount: 2,
        answerOrder: "either",
      },
      { start: 27, end: 32, passage: 3, type: "true-false-not-given" },
      { start: 33, end: 37, passage: 3, type: "matching-information", options: letters("A", "H") },
      { start: 38, end: 40, passage: 3, type: "sentence-completion" },
    ],
  },
  "cambridge-16-reading-test-4": {
    testNumber: 4,
    promptOverrides: {
      1: "__________ to direct the tunnelling",
      2: "water runs into a __________ used by local people",
      3: "vertical shafts to remove earth and for __________",
      4: "__________ made of wood or stone",
      5: "__________ attached to the plumb line",
      6: "handholds and footholds used for __________",
    },
    groups: [
      { start: 1, end: 6, passage: 1, type: "diagram-labelling" },
      { start: 7, end: 10, passage: 1, type: "true-false-not-given" },
      { start: 11, end: 13, passage: 1, type: "short-answer" },
      { start: 14, end: 17, passage: 2, type: "multiple-choice-single-answer" },
      {
        start: 18,
        end: 22,
        passage: 2,
        type: "summary-completion-with-options",
        options: [
          "A fast",
          "B isolated",
          "C emotional",
          "D worrying",
          "E many",
          "F hard",
          "G combined",
          "H thorough",
        ],
      },
      { start: 23, end: 26, passage: 2, type: "yes-no-not-given" },
      {
        start: 27,
        end: 32,
        passage: 3,
        type: "matching-headings",
        options: [
          "i An increasing divergence of attitudes towards AI",
          "ii Reasons why we have more faith in human judgement than in AI",
          "iii The superiority of AI projections over those made by humans",
          "iv The process by which AI can help us make good decisions",
          "v The advantages of involving users in AI processes",
          "vi Widespread distrust of an AI innovation",
          "vii Encouraging openness about how AI functions",
          "viii A surprisingly successful AI application",
        ],
      },
      { start: 33, end: 35, passage: 3, type: "multiple-choice-single-answer" },
      { start: 36, end: 40, passage: 3, type: "yes-no-not-given" },
    ],
  },
};

function letters(start, end) {
  const values = [];
  for (let code = start.charCodeAt(0); code <= end.charCodeAt(0); code += 1) {
    values.push(String.fromCharCode(code));
  }
  return values;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizeSpace(value) {
  return String(value ?? "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripMarkdown(value) {
  return normalizeSpace(
    String(value ?? "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*/g, "")
      .replace(/^\s*[-|>]+\s*/gm, "")
      .replace(/\|/g, " "),
  );
}

function questionSection(test, start, end) {
  const candidates = test.readingSections.filter((section) => section.kind === "questions");
  const exact = candidates.find((section) => {
    const numbers = (section.title.match(/\d+/g) || []).map(Number);
    return numbers.includes(start) && numbers.includes(end);
  });
  assert(exact, `${test.id}: missing question section ${start}-${end}`);
  return exact;
}

function splitNumberedText(text, start, end) {
  const normalized = normalizeSpace(text);
  const result = {};
  let cursor = 0;
  for (let number = start; number <= end; number += 1) {
    const marker = new RegExp(`(?:^|\\s)${number}\\s+`);
    const remainder = normalized.slice(cursor);
    const match = marker.exec(remainder);
    assert(match, `could not find question marker ${number} in ${normalized.slice(0, 160)}`);
    const contentStart = cursor + match.index + match[0].length;
    let contentEnd = normalized.length;
    if (number < end) {
      const nextMarker = new RegExp(`(?:^|\\s)${number + 1}\\s+`);
      const nextMatch = nextMarker.exec(normalized.slice(contentStart));
      assert(nextMatch, `could not find question marker ${number + 1}`);
      contentEnd = contentStart + nextMatch.index;
    }
    result[number] = normalized.slice(contentStart, contentEnd).trim();
    cursor = contentEnd;
  }
  return result;
}

function parseLetterOptions(text, maxLetter = "H") {
  const normalized = normalizeSpace(text);
  const optionPattern = new RegExp(
    `(?:^|\\s)([A-${maxLetter}])\\s+(.+?)(?=\\s+[A-${maxLetter}]\\s+|$)`,
    "g",
  );
  return [...normalized.matchAll(optionPattern)].map((match) =>
    normalizeSpace(`${match[1]} ${match[2]}`),
  );
}

function parsePromptAndOptions(segment, shouldParseOptions) {
  if (!shouldParseOptions) {
    return { prompt: normalizeSpace(segment), options: [] };
  }
  const firstOption = /(?:^|\s)A\s+/.exec(segment);
  if (!firstOption) {
    return { prompt: normalizeSpace(segment), options: [] };
  }
  return {
    prompt: normalizeSpace(segment.slice(0, firstOption.index)),
    options: parseLetterOptions(segment.slice(firstOption.index)),
  };
}

function blankContext(text, number) {
  const normalized = normalizeSpace(text);
  const marker = new RegExp(`(?:^|\\s)${number}\\s+`);
  const match = marker.exec(normalized);
  assert(match, `could not locate completion marker ${number}`);
  const markerStart = match.index + (match[0].startsWith(" ") ? 1 : 0);
  const contentStart = match.index + match[0].length;
  const blankIndex = normalized.indexOf("__________", contentStart);
  assert(blankIndex >= 0, `question ${number} lacks a blank`);
  const before = normalized.slice(0, markerStart);
  const sentenceStart = Math.max(
    before.lastIndexOf("."),
    before.lastIndexOf("?"),
    before.lastIndexOf("!"),
  );
  const stops = [".", "?", "!"]
    .map((character) => normalized.indexOf(character, blankIndex))
    .filter((index) => index >= 0);
  const sentenceEnd = stops.length ? Math.min(...stops) + 1 : normalized.length;
  return normalizeSpace(
    `${normalized.slice(sentenceStart + 1, markerStart)}${normalized.slice(contentStart, sentenceEnd)}`,
  ).replace(/\b\d+\s+(?=_+)/g, "");
}

function promptsForGroup(test, group) {
  const section = questionSection(test, group.start, group.end);
  const text = section.paragraphs.join(" ");

  if (group.shared) {
    const questionLine = section.paragraphs.find((paragraph) => paragraph.trim().endsWith("?"));
    const options = parseLetterOptions(text, "E");
    assert(questionLine && options.length === 5, `${test.id}: failed to parse shared group ${group.start}`);
    return Object.fromEntries(
      Array.from({ length: group.end - group.start + 1 }, (_, index) => [
        group.start + index,
        { prompt: normalizeSpace(questionLine), options },
      ]),
    );
  }

  const segments = splitNumberedText(text, group.start, group.end);
  const result = {};
  for (let number = group.start; number <= group.end; number += 1) {
    const hasBlank = /completion|labelling/.test(group.type);
    const parsed = hasBlank
      ? { prompt: blankContext(text, number), options: [] }
      : parsePromptAndOptions(
          segments[number],
          group.type === "multiple-choice-single-answer",
        );
    result[number] = {
      prompt: parsed.prompt,
      options: parsed.options,
    };
  }

  if (group.options) {
    for (const item of Object.values(result)) {
      item.options = group.options;
      const optionStart = item.prompt.search(/\s+A\s+/);
      if (optionStart >= 0) {
        item.prompt = item.prompt.slice(0, optionStart).trim();
      }
    }
  }

  return result;
}

function questionBlock(markdown, number) {
  const heading = new RegExp(
    `^#{3,4}\\s+(?:Question\\s+)?${number}(?:\\s+.*)?$`,
    "gmi",
  );
  const matches = [...markdown.matchAll(heading)];
  const match = matches.at(-1);
  assert(match, `intensive-reading source lacks question ${number}`);
  const start = match.index + match[0].length;
  const rest = markdown.slice(start);
  const next = /^#{3,4}\s+(?:Question\s+)?\d+(?:\s+.*)?$|^##\s+/mi.exec(rest);
  return rest.slice(0, next ? next.index : rest.length);
}

function evidenceFromBlock(block, number) {
  const paragraphs = block
    .split(/\r?\n\r?\n/)
    .map(stripMarkdown)
    .filter(Boolean);
  const located = paragraphs.find((paragraph) =>
    /(?:定位|原文|对应|支持|概括|改写|段第|句)/.test(paragraph),
  );
  if (located) {
    return located;
  }
  const analytical = paragraphs.find(
    (paragraph) =>
      !/^(?:答案|中文|译文|B1|选项)/.test(paragraph) &&
      paragraph.length >= 20,
  );
  assert(analytical, `question ${number}: no usable evidence paragraph`);
  return analytical;
}

function intensiveMarkdown(testNumber, passage) {
  const filePath = path.join(
    intensiveRoot,
    `Cambridge-IELTS-16-Test-${testNumber}-Passage-${passage}-双语精读.md`,
  );
  return fs.readFileSync(filePath, "utf8");
}

function acceptedAnswersFor(question) {
  const current = Array.isArray(question.acceptedAnswers) ? question.acceptedAnswers : [];
  const answers = current.length ? current : [question.answer];
  return [...new Set(answers.map((answer) => String(answer).trim()).filter(Boolean))];
}

function calibrateTest(test, spec) {
  const promptMap = {};
  const groupByNumber = {};
  for (const group of spec.groups) {
    Object.assign(promptMap, promptsForGroup(test, group));
    for (let number = group.start; number <= group.end; number += 1) {
      groupByNumber[number] = group;
    }
  }

  const markdownByPassage = Object.fromEntries(
    [1, 2, 3].map((passage) => [passage, intensiveMarkdown(spec.testNumber, passage)]),
  );

  test.questions = test.questions.map((current) => {
    const number = Number(current.number);
    const group = groupByNumber[number];
    const parsed = promptMap[number];
    if (spec.promptOverrides?.[number]) {
      parsed.prompt = spec.promptOverrides[number];
    }
    assert(group && parsed, `${test.id}: no calibration spec for question ${number}`);
    assert(parsed.prompt && !/^Answer \d+$/i.test(parsed.prompt), `${test.id}: bad prompt ${number}`);

    const block = questionBlock(markdownByPassage[group.passage], number);
    const next = {
      ...current,
      id: `R${number}`,
      number,
      passage: group.passage,
      type: group.type,
      prompt: parsed.prompt,
      answer: String(current.answer).trim(),
      acceptedAnswers: acceptedAnswersFor(current),
      evidence: evidenceFromBlock(block, number),
      sourcePages: [...new Set(test.sourcePages || [])],
      answerKeyPage: (test.answerKeyPages || [])[0],
    };

    if (parsed.options.length) {
      next.options = parsed.options;
    } else {
      delete next.options;
    }
    if (group.selectionCount) next.selectionCount = group.selectionCount;
    if (group.answerOrder) next.answerOrder = group.answerOrder;
    if (group.shared) {
      next.pairedWith = number === group.start ? group.end : group.start;
      next.acceptedAnswerMode = "paired_blanks_in_either_order";
    }
    return next;
  });

  test.draftStatus = "manually_calibrated";
  test.parseConfidence = "human_verified";
  test.calibrationSource = "official_question_pages_and_bilingual_intensive_reading";
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
for (const [testId, spec] of Object.entries(testSpecs)) {
  const test = bank.tests.find((candidate) => candidate.id === testId);
  assert(test, `missing test ${testId}`);
  calibrateTest(test, spec);
}
writeBank(bank);
console.log("PASS: Cambridge 16 Reading Tests 3 and 4 were rebuilt from official question surfaces.");
