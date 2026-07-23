import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');

const paths = {
  calibrations: [1, 2, 3].map((passage) =>
    path.join(root, 'work', `c06-t2-p${passage}-calibration.json`),
  ),
  pageJson: path.join(
    root,
    'data',
    'generated',
    'page-json',
    'cambridge-ielts-06.pages.json',
  ),
  raw: path.join(
    root,
    'data',
    'generated',
    'text-pages',
    'cambridge-ielts-06.raw.md',
  ),
  bankJson: path.join(root, 'data', 'cambridge-test-bank.json'),
  bankReport: path.join(
    root,
    'data',
    'generated',
    'reports',
    'cambridge-test-bank.json',
  ),
  bankJs: path.join(root, 'data', 'cambridge-test-bank.js'),
};

const targetTestId = 'cambridge-06-reading-test-2';
const sourcePages = Array.from({ length: 12 }, (_, index) => index + 41);
const answerKeyPage = 155;
const calibrationMetadata = Object.freeze({
  status: 'manually_calibrated',
  source: 'original PDF visual inspection',
  date: '2026-07-20',
});

const questionPageByRange = Object.freeze({
  '1–5': 41,
  '6–10': 44,
  '11–13': 44,
  '14–22': 47,
  '23–26': 48,
  '27–31': 51,
  '32–40': 52,
});

const questionTypeByRange = Object.freeze({
  '1–5': 'matching_headings',
  '6–10': 'true_false_not_given',
  '11–13': 'matching_features',
  '14–22': 'summary_completion_with_options',
  '23–26': 'sentence_endings',
  '27–31': 'sentence_endings',
  '32–40': 'true_false_not_given',
});

const evidenceByQuestion = Object.freeze({
  1: 'In paragraph A, local pressure groups forced a referendum on redirecting road money to light rail; the rail proposal won and worked spectacularly well.',
  2: 'Paragraph B says travel times had remained stable for centuries, but congestion caused by infrastructure failing to keep pace now makes commuting times far higher.',
  3: 'Paragraph C shows that wealth does not require greater car use: wealthy European and Asian cities use fewer cars, and Stockholm car use fell as wealth increased.',
  4: 'Paragraph D recommends urban villages around railway stations instead of pushing everyone into an overcrowded city centre.',
  5: 'Paragraph E says related workers benefit from being placed together and that creativity flourishes when people meet face-to-face.',
  6: 'The study compared public and private transport costs in thirty-seven cities, not public and private systems in every city in the world.',
  7: 'Professor Newman says efficient cities can invest the savings in creating a better place to live.',
  8: 'The passage says Melbourne’s tram network lowers inner-city car use, but gives no information that it is dangerous for drivers.',
  9: 'Demand for accommodation has exploded in Melbourne’s inner suburbs, indicating a preference for the inner city rather than the outer suburbs.',
  10: 'Amsterdam and Copenhagen were very efficient even though their public transport systems were only “reasonable but not special”.',
  11: 'Perth is described as having minimal public transport and spending 17% of its wealth on transport costs.',
  12: 'Newman accepts that Auckland’s hilly terrain would make it hard to develop a really good rail network.',
  13: 'Portland redirected federal road money to light rail after a referendum, and the resulting railway worked spectacularly well.',
  14: 'The survey found that the common medical complaints of people over 65 trouble a smaller proportion every year.',
  15: 'The data confirms that the rate at which these diseases are declining continues to accelerate.',
  16: 'Problems once regarded as normal at age 65 often do not appear until people are 70 or 75.',
  17: 'The passage attributes the retreat of certain diseases to medical advances.',
  18: 'Improved childhood nutrition gave today’s elderly population a better start than earlier generations.',
  19: 'Researchers connect increases in some cancers and bronchitis with poorer air quality and long exposure to pollution.',
  20: 'Manton found that better-educated people are likely to live longer.',
  21: 'The survey found a significant reduction in the number of disabled elderly people.',
  22: 'Reduced disability saved Medicare more than $200 billion, so supporting an ageing population may cost less than expected.',
  23: 'The increased use of simple home medical aids is linked to greater self-reliance and independence among elderly people.',
  24: 'Daily physical activity raises a factor that keeps neurons functioning and may prevent active people’s brains from deteriorating.',
  25: 'During challenging activities, people who felt in control produced lower levels of stress hormones.',
  26: 'Emotionally isolated elderly people maintained higher levels of stress hormones even while asleep.',
  27: 'A sophisticated number system became paramount when people began to settle, grow plants and herd animals.',
  28: 'Where number words had a limited range, gestures showed the intended number and resolved confusion.',
  29: 'In seventh-century Europe, a man had to be able to count to nine to qualify as a witness in court.',
  30: 'Treating number as an abstract idea independent of objects prepares a person to develop notation and arithmetic.',
  31: 'The Tsimshian system uses distinct number words according to the class of item, preserving characteristics of an older system.',
  32: 'The earliest people asked “Is this enough?” rather than “How many?”, so sufficiency mattered more than exact quantity.',
  33: 'Indigenous Tasmanians used three terms—one, two and many—not four.',
  34: 'The passage explicitly says number words were accompanied by gestures to resolve confusion.',
  35: 'Some cultures lacked the ability to deal with large numbers, so clear expression of large numbers was not universal.',
  36: 'The passage discusses Anglo-Saxon words for ten and one hundred but says nothing about the origin of the word “thousand”.',
  37: 'The average person in seventh-century Europe is described as far less familiar with numbers than people today.',
  38: 'Tsimshian has separate number-word sets for long objects and trees and for canoes.',
  39: 'The first six Tsimshian sets are relics of an older system, while the object-independent seventh set is a later development.',
  40: 'Pebbles, grains and fingers are all listed as counting aids, but the passage does not compare which was easier to use.',
});

const evidenceLocationByQuestion = Object.freeze({
  1: 'Cambridge IELTS 6 Test 2, Reading Passage 1, paragraph A (page 43)',
  2: 'Cambridge IELTS 6 Test 2, Reading Passage 1, paragraph B (page 43)',
  3: 'Cambridge IELTS 6 Test 2, Reading Passage 1, paragraph C (page 43)',
  4: 'Cambridge IELTS 6 Test 2, Reading Passage 1, paragraph D (page 43)',
  5: 'Cambridge IELTS 6 Test 2, Reading Passage 1, paragraph E (page 43)',
  6: 'Cambridge IELTS 6 Test 2, Reading Passage 1, opening study description (page 42)',
  7: 'Cambridge IELTS 6 Test 2, Reading Passage 1, Perth comparison (page 42)',
  8: 'Cambridge IELTS 6 Test 2, Reading Passage 1, Melbourne discussion (page 42)',
  9: 'Cambridge IELTS 6 Test 2, Reading Passage 1, Melbourne discussion (page 42)',
  10: 'Cambridge IELTS 6 Test 2, Reading Passage 1, bicycle-use discussion (page 42)',
  11: 'Cambridge IELTS 6 Test 2, Reading Passage 1, Perth comparison (page 42)',
  12: 'Cambridge IELTS 6 Test 2, Reading Passage 1, Auckland comparison (page 43)',
  13: 'Cambridge IELTS 6 Test 2, Reading Passage 1, paragraph A (page 43)',
  14: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 2 (page 45)',
  15: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 2 (page 45)',
  16: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 3 (page 45)',
  17: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 4 (page 45)',
  18: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 4 (page 45)',
  19: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 5 (page 45)',
  20: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 6 (page 45)',
  21: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 7 (pages 45–46)',
  22: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 7 (pages 45–46)',
  23: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 8 (page 46)',
  24: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 9 (page 46)',
  25: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 10 (page 46)',
  26: 'Cambridge IELTS 6 Test 2, Reading Passage 2, paragraph 11 (page 46)',
  27: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 2 (page 49)',
  28: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 3 (page 49)',
  29: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 4 (page 49)',
  30: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 5 (page 50)',
  31: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 6 (page 50)',
  32: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 2 (page 49)',
  33: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 3 (page 49)',
  34: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 3 (page 49)',
  35: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 4 (page 49)',
  36: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 4 (page 49)',
  37: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 4 (page 49)',
  38: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 6 (page 50)',
  39: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 6 (page 50)',
  40: 'Cambridge IELTS 6 Test 2, Reading Passage 3, paragraph 7 (page 50)',
});

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${label}: ${error.message}`);
  }
}

function asEntries(value) {
  if (Array.isArray(value)) {
    return value.map((item) => ({
      label: String(item.label),
      text: String(item.text),
    }));
  }
  return Object.entries(value ?? {}).map(([label, text]) => ({
    label: String(label),
    text: String(text),
  }));
}

function asPrompts(value) {
  if (Array.isArray(value)) {
    return value.map((item) => ({
      number: Number(item.number),
      text: String(item.text ?? item.prompt),
    }));
  }
  return Object.entries(value ?? {}).map(([number, text]) => ({
    number: Number(number),
    text: String(text),
  }));
}

function normalizeBodyParagraph(paragraph) {
  if (typeof paragraph === 'string') return paragraph;
  const text = String(paragraph.text);
  return paragraph.label ? `${paragraph.label}\n${text}` : text;
}

function renderQuestionGroup(group) {
  const lines = [`Questions ${group.range}`, ...group.instructions];
  const prompts = asPrompts(group.prompts);
  const options = asEntries(group.options);

  if (group.range === '1–5') {
    lines.push('List of Headings');
    lines.push(...options.map(({ label, text }) => `${label} ${text}`));
    lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
  } else if (group.range === '11–13') {
    lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
    lines.push('List of Descriptions');
    lines.push(...options.map(({ label, text }) => `${label} ${text}`));
  } else if (group.summary) {
    lines.push(group.summary);
    lines.push(...options.map(({ label, text }) => `${label} ${text}`));
  } else if (
    questionTypeByRange[group.range] === 'true_false_not_given'
  ) {
    lines.push(...options.map(({ label, text }) => `${label} ${text}`));
    lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
  } else {
    lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
    lines.push(...options.map(({ label, text }) => `${label} ${text}`));
  }

  return lines.join('\n');
}

function answerRecord(calibration, number, options) {
  const raw = calibration.answers[String(number)];
  assert.notEqual(raw, undefined, `Missing official answer for question ${number}`);

  if (raw && typeof raw === 'object') {
    const answer = String(raw.letter ?? raw.answer);
    return {
      answer,
      answerText: String(raw.text ?? options.find((item) => item.label === answer)?.text ?? answer),
      acceptedAnswers: [answer],
    };
  }

  const answer = String(raw);
  return {
    answer,
    answerText: String(options.find((item) => item.label === answer)?.text ?? answer),
    acceptedAnswers: [answer],
  };
}

function buildReadingSection(calibration) {
  const pages = calibration.sourcePages.filter((page) => {
    const text = calibration.pages[String(page)];
    return text.includes(calibration.title) || calibration.bodyParagraphs.some((paragraph) => {
      const body = typeof paragraph === 'string' ? paragraph : paragraph.text;
      return text.includes(body.slice(0, Math.min(80, body.length)));
    });
  });

  return {
    kind: 'reading',
    title: `Reading Passage ${calibration.passage}`,
    pages,
    paragraphs: [
      calibration.title,
      ...calibration.bodyParagraphs.map(normalizeBodyParagraph),
    ],
  };
}

function buildQuestionSection(group) {
  return {
    kind: 'questions',
    title: `Questions ${group.range}`,
    pages: [questionPageByRange[group.range]],
    paragraphs: [renderQuestionGroup(group)],
  };
}

function buildQuestions(calibrations) {
  const questions = [];

  for (const calibration of calibrations) {
    for (const group of calibration.questionGroups) {
      const options = asEntries(group.options);
      const prompts = asPrompts(group.prompts);
      const context = renderQuestionGroup(group);
      const type = questionTypeByRange[group.range];
      assert.ok(type, `No question type configured for range ${group.range}`);

      for (const { number, text: prompt } of prompts) {
        const official = answerRecord(calibration, number, options);
        questions.push({
          id: `C06-T2-P${calibration.passage}-Q${number}`,
          number,
          passage: calibration.passage,
          type,
          prompt,
          groupPrompt: group.instructions.join(' '),
          options,
          independentOptions: options.map((option) => ({ ...option })),
          ...official,
          evidence: evidenceByQuestion[number],
          evidenceLocation: evidenceLocationByQuestion[number],
          distractors: null,
          sourcePages: [questionPageByRange[group.range]],
          answerKeyPage,
          questionContext: context,
          rowContext: group.summary ?? null,
          answerSetId: null,
        });
      }
    }
  }

  return questions.sort((a, b) => a.number - b.number);
}

function buildAnswerKeyText(calibrations) {
  const lines = ['Answer key', 'ACADEMIC READING'];

  for (const calibration of calibrations) {
    const first = Math.min(...Object.keys(calibration.answers).map(Number));
    const last = Math.max(...Object.keys(calibration.answers).map(Number));
    lines.push('', `Reading Passage ${calibration.passage}, Questions ${first}–${last}`);
    for (let number = first; number <= last; number += 1) {
      const raw = calibration.answers[String(number)];
      const answer = raw && typeof raw === 'object'
        ? String(raw.letter ?? raw.answer)
        : String(raw);
      lines.push(`${number} ${answer}`);
    }
  }

  return lines.join('\n');
}

function replaceRawPages(rawText, pageTexts) {
  const replacements = [];

  for (const [page, text] of pageTexts) {
    const pattern = new RegExp(
      `(^## Page ${page}\\s*\\r?\\n)([\\s\\S]*?)(?=^## Page \\d+\\s*$|(?![\\s\\S]))`,
      'm',
    );
    const match = pattern.exec(rawText);
    assert.ok(match, `raw.md is missing the Page ${page} section`);
    const start = match.index + match[1].length;
    const end = start + match[2].length;
    const trailingNewlines = match[2].match(/(?:\r?\n)*$/)?.[0] ?? '';
    replacements.push({ start, end, value: `${text}${trailingNewlines || '\n\n'}` });
  }

  let result = rawText;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    result = result.slice(0, replacement.start) + replacement.value + result.slice(replacement.end);
  }
  return result;
}

function extractRawPage(rawText, page) {
  const pattern = new RegExp(
    `^## Page ${page}\\s*\\r?\\n([\\s\\S]*?)(?=^## Page \\d+\\s*$|(?![\\s\\S]))`,
    'm',
  );
  const match = pattern.exec(rawText);
  assert.ok(match, `raw.md is missing the Page ${page} section after replacement`);
  return match[1].trim();
}

function validateCalibrations(calibrations) {
  assert.deepEqual(
    calibrations.map((item) => item.passage),
    [1, 2, 3],
    'Calibration files must describe Passages 1, 2 and 3 in order',
  );

  const calibratedPages = calibrations
    .flatMap((item) => Object.keys(item.pages).map(Number))
    .sort((a, b) => a - b);
  assert.deepEqual(calibratedPages, sourcePages, 'Calibrations must cover pages 41–52 exactly once');

  const groups = calibrations.flatMap((item) => item.questionGroups);
  assert.equal(groups.length, 7, 'Expected exactly seven question groups');
  assert.deepEqual(
    groups.map((group) => group.range),
    ['1–5', '6–10', '11–13', '14–22', '23–26', '27–31', '32–40'],
    'Unexpected question-group ranges',
  );

  const answerNumbers = calibrations
    .flatMap((item) => Object.keys(item.answers).map(Number))
    .sort((a, b) => a - b);
  assert.deepEqual(
    answerNumbers,
    Array.from({ length: 40 }, (_, index) => index + 1),
    'Official answers must cover questions 1–40 exactly once',
  );

  for (const calibration of calibrations) {
    assert.equal(calibration.answerKeyPage, answerKeyPage);
    assert.deepEqual(calibration.images, [], `Passage ${calibration.passage} must not contain images`);
    for (const [page, text] of Object.entries(calibration.pages)) {
      assert.ok(text.trim(), `Calibrated page ${page} is empty`);
    }
  }
}

const [calibrationTexts, pageJsonText, rawText, bankJsonText] = await Promise.all([
  Promise.all(paths.calibrations.map((file) => readFile(file, 'utf8'))),
  readFile(paths.pageJson, 'utf8'),
  readFile(paths.raw, 'utf8'),
  readFile(paths.bankJson, 'utf8'),
]);

const calibrations = calibrationTexts.map((text, index) =>
  parseJson(text, paths.calibrations[index]),
);
validateCalibrations(calibrations);

const pageDocument = parseJson(pageJsonText, paths.pageJson);
const bank = parseJson(bankJsonText, paths.bankJson);
assert.ok(Array.isArray(pageDocument.pages), 'Page JSON must contain a pages array');
assert.ok(Array.isArray(bank.tests), 'Test bank must contain a tests array');

const calibratedPageTexts = new Map();
for (const calibration of calibrations) {
  for (const [page, text] of Object.entries(calibration.pages)) {
    calibratedPageTexts.set(Number(page), text.trim());
  }
}

const answerKeyText = buildAnswerKeyText(calibrations);
calibratedPageTexts.set(answerKeyPage, answerKeyText);

for (const pageNumber of [...sourcePages, answerKeyPage]) {
  const page = pageDocument.pages.find((item) => item.page === pageNumber);
  assert.ok(page, `Page JSON is missing physical page ${pageNumber}`);
  page.text = calibratedPageTexts.get(pageNumber);
  page.engine = 'manual_visual_calibration';
  page.calibration = { ...calibrationMetadata };
}

const readingSections = [];
for (const calibration of calibrations) {
  readingSections.push(buildReadingSection(calibration));
  readingSections.push(...calibration.questionGroups.map(buildQuestionSection));
}

const questions = buildQuestions(calibrations);
const passageTitle = calibrations.map((item) => item.title).join('; ');
const readingOnlySections = readingSections.filter((section) => section.kind === 'reading');
const questionOnlySections = readingSections.filter((section) => section.kind === 'questions');

const replacementTest = {
  source: 'Cambridge IELTS 6 Test 2 manually calibrated against original PDF pages',
  draftStatus: 'calibrated',
  parseConfidence: 'manually_calibrated',
  pdf: 'data/Cambridge-IELTS-06.pdf',
  answerKeyText,
  answerKeyPages: [answerKeyPage],
  mode: 'reading',
  id: targetTestId,
  title: 'Cambridge IELTS 6 Reading Test 2',
  durationSec: 3600,
  passageTitle,
  passage: readingOnlySections
    .flatMap((section) => section.paragraphs)
    .join('\n\n'),
  rawOcrText: sourcePages.map((page) => calibratedPageTexts.get(page)).join('\n\n'),
  readingSections,
  questions,
  sourcePages,
};

const targetIndexes = bank.tests
  .map((test, index) => (test.id === targetTestId ? index : -1))
  .filter((index) => index >= 0);
assert.equal(targetIndexes.length, 1, `Expected exactly one ${targetTestId} entry`);
bank.tests[targetIndexes[0]] = replacementTest;

const updatedRaw = replaceRawPages(rawText, calibratedPageTexts);

assert.equal(readingOnlySections.length, 3, 'Expected exactly three reading sections');
assert.equal(questionOnlySections.length, 7, 'Expected exactly seven question sections');
assert.equal(readingSections.length, 10, 'Expected ten combined reading/question sections');
assert.equal(questions.length, 40, 'Expected exactly forty structured questions');
assert.deepEqual(
  questions.map((question) => question.number),
  Array.from({ length: 40 }, (_, index) => index + 1),
  'Structured questions must be numbered 1–40',
);

for (const question of questions) {
  assert.ok(question.prompt, `Question ${question.number} has no prompt`);
  assert.ok(question.groupPrompt, `Question ${question.number} has no group instruction`);
  assert.ok(question.answer, `Question ${question.number} has no official answer`);
  assert.ok(question.answerText, `Question ${question.number} has no answerText`);
  assert.ok(question.acceptedAnswers.length, `Question ${question.number} has no accepted answer`);
  assert.ok(question.evidence, `Question ${question.number} has no evidence`);
  assert.ok(question.evidenceLocation, `Question ${question.number} has no evidence location`);
  assert.equal(question.answerKeyPage, answerKeyPage);
}

for (const [page, text] of calibratedPageTexts) {
  assert.equal(
    extractRawPage(updatedRaw, page),
    text,
    `raw.md Page ${page} must exactly equal the JSON page text`,
  );
}

assert.equal(
  JSON.stringify(bank.tests.filter((test) => test.id === targetTestId)).includes('images/'),
  false,
  'The replacement test must not contain image references',
);

const pageOutput = `${JSON.stringify(pageDocument, null, 2)}\n`;
const bankOutput = `${JSON.stringify(bank, null, 2)}\n`;
const bankJsOutput = `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`;

assert.deepEqual(parseJson(bankOutput, 'generated bank output'), bank);
assert.deepEqual(parseJson(pageOutput, 'generated page output'), pageDocument);
assert.ok(
  bankJsOutput.startsWith('window.CAMBRIDGE_TEST_BANK = {'),
  'JS mirror must use the established global assignment',
);

await writeFile(paths.pageJson, pageOutput, 'utf8');
await writeFile(paths.raw, updatedRaw, 'utf8');
await writeFile(paths.bankJson, bankOutput, 'utf8');
await writeFile(paths.bankReport, bankOutput, 'utf8');
await writeFile(paths.bankJs, bankJsOutput, 'utf8');

const writtenBank = parseJson(await readFile(paths.bankJson, 'utf8'), paths.bankJson);
const writtenReport = await readFile(paths.bankReport, 'utf8');
const writtenJs = await readFile(paths.bankJs, 'utf8');
assert.deepEqual(writtenBank, bank, 'Written primary bank differs from the validated bank');
assert.equal(writtenReport, bankOutput, 'Report JSON must exactly mirror the primary JSON');
assert.equal(writtenJs, bankJsOutput, 'JS mirror differs from the validated bank wrapper');

console.log(JSON.stringify({
  testId: targetTestId,
  calibratedPages: sourcePages,
  answerKeyPage,
  readingSections: readingOnlySections.length,
  questionSections: questionOnlySections.length,
  questions: questions.length,
  images: 0,
  rawPagesMatched: calibratedPageTexts.size,
  mirrors: {
    json: paths.bankJson,
    report: paths.bankReport,
    js: paths.bankJs,
  },
}, null, 2));
