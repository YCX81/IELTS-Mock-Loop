import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const calibrationDir = path.join(root, 'work', 'calibration', 'cambridge-10', 'test-3');
const paths = {
  calibrations: [1, 2, 3].map((passage) => path.join(calibrationDir, `passage-${passage}.json`)),
  pageJson: path.join(root, 'data', 'generated', 'page-json', 'cambridge-ielts-10.pages.json'),
  raw: path.join(root, 'data', 'generated', 'text-pages', 'cambridge-ielts-10.raw.md'),
  bankJson: path.join(root, 'data', 'cambridge-test-bank.json'),
  bankReport: path.join(root, 'data', 'generated', 'reports', 'cambridge-test-bank.json'),
  bankJs: path.join(root, 'data', 'cambridge-test-bank.js'),
};

const targetTestId = 'cambridge-10-reading-test-3';
const sourcePages = Array.from({ length: 13 }, (_, index) => index + 56);
const answerKeyPage = 148;
const expectedRanges = ['1–4', '5–10', '11–13', '14–18', '19–22', '23–25', '26', '27–31', '32–35', '36–40'];
const readingPages = { 1: [57, 58], 2: [60, 61], 3: [64, 65] };
const questionPages = {
  '1–4': [56], '5–10': [59], '11–13': [59],
  '14–18': [62], '19–22': [62], '23–25': [63], '26': [63],
  '27–31': [66], '32–35': [67], '36–40': [68],
};
const categoryOptions = {
  true_false_not_given: [
    { label: 'TRUE', text: 'the statement agrees with the information' },
    { label: 'FALSE', text: 'the statement contradicts the information' },
    { label: 'NOT GIVEN', text: 'there is no information on this' },
  ],
  yes_no_not_given: [
    { label: 'YES', text: 'the statement agrees with the claims of the writer' },
    { label: 'NO', text: 'the statement contradicts the claims of the writer' },
    { label: 'NOT GIVEN', text: 'it is impossible to say what the writer thinks about this' },
  ],
};

function parseJson(text, label) {
  try { return JSON.parse(text); }
  catch (error) { throw new Error(`Invalid JSON in ${label}: ${error.message}`); }
}

function paragraphText(paragraph) {
  return typeof paragraph === 'string' ? paragraph : String(paragraph.text);
}

function bankParagraph(paragraph) {
  return typeof paragraph === 'string' ? paragraph : (paragraph.label ? `${paragraph.label}\n${paragraph.text}` : String(paragraph.text));
}

function entries(value) {
  if (Array.isArray(value)) return value.map((item) => ({ label: String(item.label ?? item.id), text: String(item.text) }));
  return Object.entries(value ?? {}).map(([label, text]) => ({ label: String(label), text: String(text) }));
}

function questionsFor(group) {
  const source = group.questions ?? group.prompts;
  if (Array.isArray(source)) return source.map((item) => ({ ...item, number: Number(item.number), prompt: String(item.prompt ?? item.text) }));
  return Object.entries(source ?? {}).map(([number, prompt]) => ({ number: Number(number), prompt: String(prompt) }));
}

function instructionsFor(group) {
  if (Array.isArray(group.instructions)) return group.instructions.map(String);
  return group.instruction ? [String(group.instruction)] : [];
}

function answerEntries(answers) {
  if (Array.isArray(answers)) return answers.map((item) => [Number(item.number), item]);
  return Object.entries(answers ?? {}).map(([number, item]) => [Number(number), item]);
}

function acceptedAnswers(raw) {
  if (Array.isArray(raw)) return raw.map(String);
  if (raw && typeof raw === 'object') return (raw.acceptedAnswers ?? raw.acceptableAnswers ?? [raw.answer ?? raw.letter]).map(String);
  return [String(raw)];
}

function answerValue(raw) {
  return acceptedAnswers(raw)[0];
}

function sharedOptions(group) {
  const explicit = entries(group.options ?? group.headings ?? group.endings ?? group.categories);
  return explicit.length ? explicit : (categoryOptions[group.type] ?? []);
}

function optionsForQuestion(group, question) {
  const local = entries(question.options);
  return local.length ? local : sharedOptions(group);
}

function questionDetail(calibration, group, question, rawAnswer) {
  const explicit = calibration.questionDetails?.[String(question.number)] ?? calibration.questionDetails?.[question.number];
  if (explicit) return explicit;
  if (rawAnswer && typeof rawAnswer === 'object' && !Array.isArray(rawAnswer) && rawAnswer.evidence) return rawAnswer;
  return question;
}

function renderExample(example) {
  if (!example) return null;
  if (typeof example === 'string') return `Example ${example}`;
  return `Example ${example.paragraph ?? example.prompt ?? ''} ${example.answer ?? ''}`.trim();
}

function renderQuestionGroup(group) {
  const lines = [`Questions ${group.range}`, ...instructionsFor(group)];
  if (group.context) lines.push(String(group.context));
  if (group.tableHeaders) lines.push(group.tableHeaders.join(' | '));
  for (const row of group.tableRows ?? []) lines.push(Object.values(row).join(' | '));
  const questions = questionsFor(group);
  const options = sharedOptions(group);
  const optionsFirst = group.type === 'matching_headings';
  if (group.optionHeading) lines.push(String(group.optionHeading));
  if (optionsFirst) lines.push(...options.map((option) => `${option.label} ${option.text}`));
  for (const question of questions) {
    lines.push(`${question.number} ${question.prompt}`);
    const local = entries(question.options);
    lines.push(...local.map((option) => `${option.label} ${option.text}`));
  }
  if (!optionsFirst && !questions.some((question) => entries(question.options).length)) lines.push(...options.map((option) => `${option.label} ${option.text}`));
  const example = renderExample(group.example);
  if (example) lines.push(example);
  return lines.join('\n');
}

function buildAnswerKeyText(calibrations) {
  const lines = ['Listening and Reading Answer Keys', 'ACADEMIC READING'];
  for (const calibration of calibrations) {
    const answers = answerEntries(calibration.answers).sort((a, b) => a[0] - b[0]);
    lines.push('', `Reading Passage ${calibration.passage}, Questions ${answers[0][0]}–${answers.at(-1)[0]}`);
    for (const [number, raw] of answers) lines.push(`${number} ${raw.answerKeyDisplay ?? acceptedAnswers(raw).join('/')}`);
  }
  lines.push(
    '', 'If you score...',
    '0–11',
    'you are unlikely to get an acceptable score under examination conditions and we recommend that you spend a lot of time improving your English before you take IELTS.',
    '12–27',
    'you may get an acceptable score under examination conditions but we recommend that you think about having more practice or lessons before you take IELTS.',
    '28–40',
    'you are likely to get an acceptable score under examination conditions but remember that different institutions will find different scores acceptable.',
  );
  return lines.join('\n');
}

function buildRaw(prefix, pageDocument) {
  return `${prefix.trimEnd()}\n\n${pageDocument.pages.map((page) => `## Page ${page.page}\n\n${page.text.trim()}`).join('\n\n')}\n`;
}

function extractRawPages(rawText) {
  const pages = new Map();
  const pattern = /^## Page (\d+)\s*\r?\n([\s\S]*?)(?=^## Page \d+\s*$|(?![\s\S]))/gm;
  for (const match of rawText.matchAll(pattern)) pages.set(Number(match[1]), match[2].trim());
  return pages;
}

function validateCalibrations(calibrations) {
  assert.deepEqual(calibrations.map((item) => item.passage), [1, 2, 3]);
  assert.deepEqual(calibrations.flatMap((item) => item.sourcePages), sourcePages);
  assert.deepEqual(calibrations.flatMap((item) => item.questionGroups.map((group) => group.range)), expectedRanges);
  const numbers = calibrations.flatMap((item) => answerEntries(item.answers).map(([number]) => number)).sort((a, b) => a - b);
  assert.deepEqual(numbers, Array.from({ length: 40 }, (_, index) => index + 1));
  for (const calibration of calibrations) {
    assert.equal(calibration.answerKeyPage, answerKeyPage);
    assert.equal(Array.isArray(calibration.pages), false);
    assert.deepEqual(Object.keys(calibration.pages).map(Number), calibration.sourcePages);
    assert.deepEqual(calibration.images, []);
    for (const [page, text] of Object.entries(calibration.pages)) assert.ok(text.trim(), `Page ${page} is empty`);
    const answerMap = new Map(answerEntries(calibration.answers));
    for (const group of calibration.questionGroups) {
      assert.ok(instructionsFor(group).length, `Questions ${group.range} lack instructions`);
      for (const question of questionsFor(group)) {
        const detail = questionDetail(calibration, group, question, answerMap.get(question.number));
        assert.ok(detail?.evidence, `Question ${question.number} missing evidence`);
        assert.ok(detail?.evidenceLocation, `Question ${question.number} missing evidenceLocation`);
        assert.ok(detail?.distractors !== undefined, `Question ${question.number} missing distractors`);
      }
    }
  }
}

const [calibrationTexts, pageJsonText, rawText, bankJsonText] = await Promise.all([
  Promise.all(paths.calibrations.map((file) => readFile(file, 'utf8'))),
  readFile(paths.pageJson, 'utf8'),
  readFile(paths.raw, 'utf8'),
  readFile(paths.bankJson, 'utf8'),
]);
const calibrations = calibrationTexts.map((text, index) => parseJson(text, paths.calibrations[index]));
validateCalibrations(calibrations);

const pageDocument = parseJson(pageJsonText, paths.pageJson);
const bank = parseJson(bankJsonText, paths.bankJson);
assert.ok(Array.isArray(pageDocument.pages));
assert.ok(Array.isArray(bank.tests));
const rawPrefix = rawText.slice(0, rawText.search(/^## Page 1\s*$/m));
const calibratedPageTexts = new Map();
for (const calibration of calibrations) {
  for (const [page, text] of Object.entries(calibration.pages)) calibratedPageTexts.set(Number(page), text.trim());
}
const answerKeyText = buildAnswerKeyText(calibrations);
calibratedPageTexts.set(answerKeyPage, answerKeyText);

for (const [pageNumber, text] of calibratedPageTexts) {
  const page = pageDocument.pages.find((item) => item.page === pageNumber);
  assert.ok(page, `Missing physical page ${pageNumber}`);
  page.text = text;
  page.engine = 'manual_visual_calibration';
  page.calibration = { status: 'manually_calibrated', source: 'original PDF visual inspection', date: '2026-07-21' };
}

const readingSections = [];
const questions = [];
for (const calibration of calibrations) {
  const passageParagraphs = [calibration.title];
  if (calibration.subtitle) passageParagraphs.push(calibration.subtitle);
  passageParagraphs.push(...calibration.bodyParagraphs.map(bankParagraph));
  readingSections.push({ kind: 'reading', title: `Reading Passage ${calibration.passage}`, pages: readingPages[calibration.passage], paragraphs: passageParagraphs });
  const answerMap = new Map(answerEntries(calibration.answers));

  for (const group of calibration.questionGroups) {
    const context = renderQuestionGroup(group);
    const groupPages = questionPages[group.range];
    assert.ok(groupPages, `No source page for Questions ${group.range}`);
    readingSections.push({ kind: 'questions', title: `Questions ${group.range}`, pages: groupPages, paragraphs: [context] });
    for (const question of questionsFor(group)) {
      const options = optionsForQuestion(group, question);
      const rawAnswer = answerMap.get(question.number);
      assert.notEqual(rawAnswer, undefined, `Missing answer ${question.number}`);
      const answer = answerValue(rawAnswer);
      const accepted = acceptedAnswers(rawAnswer);
      const detail = questionDetail(calibration, group, question, rawAnswer);
      questions.push({
        id: `C10-T3-P${calibration.passage}-Q${question.number}`,
        number: question.number,
        passage: calibration.passage,
        type: group.type,
        prompt: question.prompt,
        groupPrompt: instructionsFor(group).join(' '),
        options,
        independentOptions: options.map((option) => ({ ...option })),
        answer,
        answerText: String(options.find((option) => option.label === answer)?.text ?? answer),
        acceptedAnswers: accepted,
        evidence: detail.evidence,
        evidenceLocation: detail.evidenceLocation,
        distractors: detail.distractors,
        sourcePages: groupPages,
        answerKeyPage,
        questionContext: context,
        rowContext: group.context ?? null,
        answerSetId: group.answerSetId ?? null,
      });
    }
  }
}
questions.sort((a, b) => a.number - b.number);
const readingOnly = readingSections.filter((section) => section.kind === 'reading');
const questionOnly = readingSections.filter((section) => section.kind === 'questions');
assert.equal(readingOnly.length, 3);
assert.equal(questionOnly.length, 10);
assert.equal(questions.length, 40);
assert.deepEqual(questions.map((question) => question.number), Array.from({ length: 40 }, (_, index) => index + 1));

const replacementTest = {
  source: 'Cambridge IELTS 10 Test 3 manually calibrated against original PDF pages',
  draftStatus: 'manually_calibrated',
  parseConfidence: 'manually_calibrated',
  pdf: 'data/Cambridge-IELTS-10.pdf',
  answerKeyText,
  answerKeyPages: [answerKeyPage],
  mode: 'reading',
  id: targetTestId,
  title: 'Cambridge IELTS 10 Reading Test 3',
  durationSec: 3600,
  passageTitle: calibrations.map((item) => item.title).join('; '),
  passage: readingOnly.flatMap((section) => section.paragraphs).join('\n\n'),
  rawOcrText: sourcePages.map((page) => calibratedPageTexts.get(page)).join('\n\n'),
  readingSections,
  questions,
  sourcePages,
};
const indexes = bank.tests.map((test, index) => test.id === targetTestId ? index : -1).filter((index) => index >= 0);
assert.equal(indexes.length, 1, `Expected one ${targetTestId}`);
bank.tests[indexes[0]] = replacementTest;

const updatedRaw = buildRaw(rawPrefix, pageDocument);
const rawPages = extractRawPages(updatedRaw);
for (const page of pageDocument.pages) assert.equal(rawPages.get(page.page), page.text.trim(), `Page ${page.page} JSON/raw mismatch`);

const pageOutput = `${JSON.stringify(pageDocument, null, 2)}\n`;
const bankOutput = `${JSON.stringify(bank, null, 2)}\n`;
const bankJsOutput = `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`;
await writeFile(paths.pageJson, pageOutput, 'utf8');
await writeFile(paths.raw, updatedRaw, 'utf8');
await writeFile(paths.bankJson, bankOutput, 'utf8');
await writeFile(paths.bankReport, bankOutput, 'utf8');
await writeFile(paths.bankJs, bankJsOutput, 'utf8');
assert.equal(await readFile(paths.bankReport, 'utf8'), bankOutput);
assert.equal(await readFile(paths.bankJs, 'utf8'), bankJsOutput);

console.log(JSON.stringify({
  testId: targetTestId,
  calibratedPages: sourcePages,
  answerKeyPage,
  readingSections: readingOnly.length,
  questionSections: questionOnly.length,
  questions: questions.length,
  images: 0,
  mirrorsIdentical: true,
}, null, 2));
