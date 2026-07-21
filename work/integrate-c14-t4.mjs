import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const calibrationDir = path.join(root, 'work', 'calibration', 'cambridge-14', 'test-4');
const paths = {
  calibrations: [1, 2, 3].map((p) => path.join(calibrationDir, `passage-${p}.json`)),
  pageJson: path.join(root, 'data', 'generated', 'page-json', 'cambridge-ielts-14.pages.json'),
  raw: path.join(root, 'data', 'generated', 'text-pages', 'cambridge-ielts-14.raw.md'),
  bankJson: path.join(root, 'data', 'cambridge-test-bank.json'),
  bankReport: path.join(root, 'data', 'generated', 'reports', 'cambridge-test-bank.json'),
  bankJs: path.join(root, 'data', 'cambridge-test-bank.js'),
};

const testId = 'cambridge-14-reading-test-4';
const sourcePages = Array.from({ length: 12 }, (_, i) => i + 82);
const answerKeyPage = 126;
const expectedRanges = ['1–8', '9–13', '14–17', '18–22', '23–24', '25–26', '27–33', '34–39', '40'];
const readingPages = { 1: [82, 83], 2: [86, 87], 3: [90, 91] };
const questionPages = {
  '1–8': [84], '9–13': [85], '14–17': [88], '18–22': [88], '23–24': [89],
  '25–26': [89], '27–33': [92], '34–39': [93], '40': [93],
};
const standardOptions = {
  true_false_not_given: [
    { label: 'TRUE', text: 'the statement agrees with the information' },
    { label: 'FALSE', text: 'the statement contradicts the information' },
    { label: 'NOT GIVEN', text: 'there is no information on this' },
  ],
  matching_information: Array.from({ length: 9 }, (_, i) => ({
    label: String.fromCharCode(65 + i), text: `Section ${String.fromCharCode(65 + i)}`,
  })),
};

function parseJson(text, label) {
  try { return JSON.parse(text); }
  catch (error) { throw new Error(`Invalid JSON in ${label}: ${error.message}`); }
}

function parseJsBank(source) {
  const prefix = 'window.CAMBRIDGE_TEST_BANK = ';
  const trimmed = source.trim();
  assert.ok(trimmed.startsWith(prefix) && trimmed.endsWith(';'), 'Unexpected JS bank wrapper');
  return parseJson(trimmed.slice(prefix.length, -1), paths.bankJs);
}

function canonicalRange(value) {
  return String(value).replace(/\s*(?:-|–|—)\s*/gu, '–');
}

function flattenedSourcePages(calibration) {
  if (Array.isArray(calibration.sourcePages)) return calibration.sourcePages.map(Number);
  return [...(calibration.sourcePages?.passage ?? []), ...(calibration.sourcePages?.questions ?? [])].map(Number);
}

function pageEntries(calibration) {
  if (calibration.pageTexts) {
    return Object.entries(calibration.pageTexts).map(([page, text]) => [Number(page), String(text)]);
  }
  return calibration.pages.map((item) => [Number(item.page), String(item.text)]);
}

function answerEntries(calibration) {
  if (Array.isArray(calibration.answers)) {
    return calibration.answers.map((item) => [Number(item.number), item]);
  }
  return Object.entries(calibration.answers).map(([number, answer]) => [Number(number), answer]);
}

function asOption(item, index) {
  if (typeof item === 'string') return { label: String.fromCharCode(65 + index), text: item };
  return { label: String(item.label ?? item.letter ?? item.roman), text: String(item.text) };
}

function normalizeGroup(group) {
  const type = group.type === 'note_completion' ? 'notes_completion' : group.type;
  const options = (group.options ?? standardOptions[type] ?? []).map(asOption);
  return {
    ...group,
    range: canonicalRange(group.range),
    type,
    instructions: Array.isArray(group.instructions) ? group.instructions.map(String) : [String(group.instructions)],
    options,
    prompts: (group.questions ?? group.prompts).map((q) => ({
      ...q, number: Number(q.number), text: String(q.text ?? q.prompt),
    })),
  };
}

function normalizeParagraph(paragraph) {
  if (typeof paragraph === 'string') return paragraph;
  const label = paragraph.label ?? paragraph.section;
  return label ? `${label}\n${paragraph.text}` : String(paragraph.text);
}

function answerRecord(calibration, prompt, group) {
  const mapRecord = answerEntries(calibration).find(([n]) => n === prompt.number)?.[1];
  assert.notEqual(mapRecord, undefined, `Missing answer ${prompt.number}`);
  const objectRecord = typeof mapRecord === 'object' ? mapRecord : { answer: mapRecord };
  const answer = String(prompt.answer ?? objectRecord.answer ?? objectRecord.letter);
  const acceptedAnswers = (prompt.acceptableAnswers ?? prompt.acceptedAnswers
    ?? objectRecord.acceptableAnswers ?? objectRecord.acceptedAnswers ?? [answer]).map(String);
  const optionText = group.options.find((option) => option.label === answer)?.text;
  const evidence = prompt.evidence ?? objectRecord.evidence;
  const evidenceLocation = prompt.evidenceLocation ?? prompt.location
    ?? objectRecord.evidenceLocation ?? objectRecord.location;
  const distractors = prompt.distractors ?? prompt.distractorRationale ?? prompt.distractorBasis
    ?? objectRecord.distractors ?? objectRecord.distractorRationale ?? objectRecord.distractorBasis;
  assert.ok(evidence, `Question ${prompt.number} lacks evidence`);
  assert.ok(evidenceLocation, `Question ${prompt.number} lacks evidence location`);
  assert.ok(distractors, `Question ${prompt.number} lacks distractor rationale`);
  return { answer, answerText: optionText ?? answer, acceptedAnswers, evidence: String(evidence),
    evidenceLocation: String(evidenceLocation), distractors };
}

function renderGroup(group) {
  const lines = [`Questions ${group.range}`, ...group.instructions];
  if (group.title) lines.push(String(group.title));
  if (group.sectionLabels) lines.push(...group.sectionLabels.map(String));
  if (group.content) lines.push(String(group.content));
  if (group.summary) lines.push(String(group.summary));
  if (group.optionsTitle) lines.push(String(group.optionsTitle));
  if (group.options.length) lines.push(...group.options.map((o) => `${o.label} ${o.text}`));
  lines.push(...group.prompts.map((q) => `${q.number} ${q.text}`));
  return lines.join('\n');
}

function wordLimit(group, prompt) {
  const explicit = prompt.wordLimit ?? group.wordLimit;
  const valid = explicit && String(explicit).match(/^(ONE WORD ONLY|NO MORE THAN [A-Z]+ WORDS?(?: AND\/OR A NUMBER)?)$/u)?.[1];
  if (valid) return valid;
  return group.instructions.map((line) => line.match(/(ONE WORD ONLY|NO MORE THAN [A-Z]+ WORDS?(?: AND\/OR A NUMBER)?)/u)?.[1]).find(Boolean) ?? null;
}

function buildQuestions(calibrations) {
  return calibrations.flatMap((calibration) => calibration.questionGroups.flatMap((group) => {
    const context = renderGroup(group);
    return group.prompts.map((prompt) => ({
      id: `C14-T4-P${calibration.passage}-Q${prompt.number}`,
      number: prompt.number,
      passage: calibration.passage,
      type: group.type,
      prompt: prompt.text,
      groupPrompt: group.instructions.join(' '),
      options: group.options.map((item) => ({ ...item })),
      independentOptions: group.options.map((item) => ({ ...item })),
      ...answerRecord(calibration, prompt, group),
      sourcePages: [...questionPages[group.range]],
      answerKeyPage,
      questionContext: context,
      rowContext: group.content ?? group.summary ?? null,
      wordLimit: wordLimit(group, prompt),
      answerSetId: null,
    }));
  })).sort((a, b) => a.number - b.number);
}

function buildReadingSection(calibration) {
  return {
    kind: 'reading', title: `Reading Passage ${calibration.passage}`,
    pages: [...readingPages[calibration.passage]], instructions: [calibration.overallInstruction],
    paragraphs: [...(calibration.title ? [calibration.title] : []), ...(calibration.subtitle ? [calibration.subtitle] : []),
      ...calibration.bodyParagraphs.map(normalizeParagraph),
      ...(calibration.footnotes ?? []).map((f) => `${f.marker ? `${f.marker} ` : ''}${f.text}`)],
  };
}

function buildQuestionSection(group) {
  return { kind: 'questions', title: `Questions ${group.range}`, pages: [...questionPages[group.range]],
    instructions: [...group.instructions], questionGroupTitle: group.title ?? null,
    optionsTitle: group.optionsTitle ?? null, paragraphs: [renderGroup(group)] };
}



async function readAvailableBank() {
  for (const file of [paths.bankJson, paths.bankReport]) {
    try { return parseJson(await readFile(file, 'utf8'), file); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return parseJsBank(await readFile(paths.bankJs, 'utf8'));
}
function replaceRawPages(rawText, replacements) {
  let result = rawText.replace(/\r\n/gu, '\n');
  for (const [page, text] of [...replacements].sort((a, b) => b[0] - a[0])) {
    const marker = `## Page ${page}\n`;
    const start = result.indexOf(marker);
    assert.ok(start >= 0, `raw.md missing Page ${page}`);
    const contentStart = start + marker.length;
    const next = result.indexOf('\n## Page ', contentStart);
    result = `${result.slice(0, contentStart)}\n${String(text).trim()}\n${result.slice(next < 0 ? result.length : next)}`;
  }
  return result;
}

function extractRawPages(rawText) {
  const normalized = rawText.replace(/\r\n/gu, '\n');
  const pages = new Map();
  for (const match of normalized.matchAll(/^## Page (\d+)\s*$/gmu)) {
    const contentStart = match.index + match[0].length;
    const next = normalized.indexOf('\n## Page ', contentStart);
    pages.set(Number(match[1]), normalized.slice(contentStart, next < 0 ? normalized.length : next).trim());
  }
  return pages;
}

function validateRaw(rawText, pageDocument) {
  const rawPages = extractRawPages(rawText);
  assert.equal(rawPages.size, pageDocument.pages.length, 'raw/pages physical-page counts differ');
  for (const page of pageDocument.pages) {
    assert.equal(rawPages.get(Number(page.page)), String(page.text).trim().replace(/\r\n/gu, '\n'), `raw Page ${page.page} differs from pages.json`);
  }
}

const [calibrationTexts, pageText, rawText, bank] = await Promise.all([
  Promise.all(paths.calibrations.map((file) => readFile(file, 'utf8'))),
  readFile(paths.pageJson, 'utf8'), readFile(paths.raw, 'utf8'), readAvailableBank(),
]);
const calibrations = calibrationTexts.map((text, i) => parseJson(text, paths.calibrations[i]));
assert.deepEqual(calibrations.map((c) => c.passage), [1, 2, 3]);
for (const calibration of calibrations) {
  assert.equal(calibration.book, 14); assert.equal(calibration.test, 4);
  assert.equal(calibration.status, 'manually_calibrated'); assert.equal(calibration.answerKeyPage, 126);
  assert.ok(calibration.bodyParagraphs.length); assert.deepEqual(calibration.images ?? [], []);
  calibration.questionGroups = calibration.questionGroups.map(normalizeGroup);
}
assert.deepEqual(calibrations.flatMap((c) => flattenedSourcePages(c)).sort((a, b) => a - b), sourcePages);
const groups = calibrations.flatMap((c) => c.questionGroups);
assert.deepEqual(groups.map((g) => g.range), expectedRanges);
assert.equal(groups.length, 9);
assert.deepEqual(groups.flatMap((g) => g.prompts.map((q) => q.number)).sort((a, b) => a - b), Array.from({ length: 40 }, (_, i) => i + 1));

const pageDocument = parseJson(pageText, paths.pageJson);
const calibratedPages = new Map();
for (const calibration of calibrations) {
  for (const [page, text] of pageEntries(calibration)) {
    if (page === answerKeyPage && calibratedPages.has(page)) assert.equal(calibratedPages.get(page), text, 'Conflicting answer page');
    calibratedPages.set(page, text);
  }
}
const answerCandidates = calibrations.map((c) => c.answerKeyText ?? c.answerPageText).filter(Boolean).map(String);
if (!calibratedPages.has(answerKeyPage)) {
  assert.ok(answerCandidates.length); assert.equal(new Set(answerCandidates).size, 1);
  calibratedPages.set(answerKeyPage, answerCandidates[0]);
}
for (const pageNumber of [...sourcePages, answerKeyPage]) {
  const item = pageDocument.pages.find((page) => Number(page.page) === pageNumber);
  assert.ok(item && calibratedPages.has(pageNumber), `Missing calibrated page ${pageNumber}`);
  item.text = String(calibratedPages.get(pageNumber)).trim();
  item.engine = 'manual_visual_calibration';
  item.calibration = { status: 'manually_calibrated', source: 'original PDF visual inspection', date: '2026-07-21' };
}

const readingSections = calibrations.flatMap((calibration) => [buildReadingSection(calibration), ...calibration.questionGroups.map(buildQuestionSection)]);
const questions = buildQuestions(calibrations);
assert.equal(readingSections.filter((s) => s.kind === 'reading').length, 3);
assert.equal(readingSections.filter((s) => s.kind === 'questions').length, 9);
assert.equal(questions.length, 40);
for (const q of questions) {
  assert.ok(q.prompt && q.groupPrompt && q.answer && q.answerText);
  assert.ok(q.acceptedAnswers.length && q.evidence && q.evidenceLocation && q.distractors);
  assert.equal(q.answerKeyPage, answerKeyPage);
}

const readingOnly = readingSections.filter((s) => s.kind === 'reading');
const answerKeyText = ['Answer key', 'ACADEMIC READING', 'TEST 4', ...calibrations.flatMap((c) => {
  const entries = answerEntries(c).sort((a, b) => a[0] - b[0]);
  return [`Reading Passage ${c.passage}, Questions ${entries[0][0]}–${entries.at(-1)[0]}`,
    ...entries.map(([number, raw]) => `${number} ${typeof raw === 'object' ? raw.answer ?? raw.letter : raw}`)];
})].join('\n');
const replacement = {
  source: 'Cambridge IELTS 14 Test 4 manually calibrated against original PDF pages',
  draftStatus: 'manually_calibrated', parseConfidence: 'manually_calibrated',
  pdf: 'data/Cambridge-IELTS-14.pdf', answerKeyText, answerKeyPages: [answerKeyPage], mode: 'reading',
  id: testId, title: 'Cambridge IELTS 14 Reading Test 4', durationSec: 3600,
  passageTitle: calibrations.map((c) => c.title ?? `Reading Passage ${c.passage}`).join('; '),
  passage: readingOnly.flatMap((s) => s.paragraphs).join('\n\n'),
  rawOcrText: sourcePages.map((page) => calibratedPages.get(page)).join('\n\n'),
  readingSections, questions, sourcePages,
};
const indexes = bank.tests.map((test, i) => test.id === testId ? i : -1).filter((i) => i >= 0);
assert.equal(indexes.length, 1, `Expected exactly one ${testId}`);
bank.tests[indexes[0]] = replacement;

const updatedRaw = replaceRawPages(rawText, calibratedPages);
validateRaw(updatedRaw, pageDocument);
assert.equal(JSON.stringify(replacement).includes('images/'), false);
const pageOutput = `${JSON.stringify(pageDocument, null, 2)}\n`;
const bankOutput = `${JSON.stringify(bank, null, 2)}\n`;
const jsOutput = `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`;
assert.deepEqual(parseJsBank(jsOutput), bank);
await Promise.all([
  writeFile(paths.pageJson, pageOutput), writeFile(paths.raw, updatedRaw),
  writeFile(paths.bankJson, bankOutput), writeFile(paths.bankReport, bankOutput), writeFile(paths.bankJs, jsOutput),
]);
const [writtenPages, writtenRaw, writtenBank, writtenReport, writtenJs] = await Promise.all([
  readFile(paths.pageJson, 'utf8'), readFile(paths.raw, 'utf8'), readFile(paths.bankJson, 'utf8'),
  readFile(paths.bankReport, 'utf8'), readFile(paths.bankJs, 'utf8'),
]);
validateRaw(writtenRaw, parseJson(writtenPages, paths.pageJson));
const primary = parseJson(writtenBank, paths.bankJson);
assert.deepEqual(parseJson(writtenReport, paths.bankReport), primary);
assert.deepEqual(parseJsBank(writtenJs), primary);
console.log(JSON.stringify({ testId, calibratedPages: sourcePages, answerKeyPage,
  readingSections: 3, questionSections: 9, questions: 40, images: 0,
  rawPagesMatched: pageDocument.pages.length, mirrorsIdentical: true }, null, 2));


