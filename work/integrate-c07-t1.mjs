import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyC07CalibrationLedger } from './c07-calibration-ledger.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');

const paths = {
  calibrations: [1, 2, 3].map((passage) =>
    path.join(root, 'work', `c07-t1-p${passage}-calibration.json`),
  ),
  pageJson: path.join(
    root,
    'data',
    'generated',
    'page-json',
    'cambridge-ielts-07.pages.json',
  ),
  raw: path.join(
    root,
    'data',
    'generated',
    'text-pages',
    'cambridge-ielts-07.raw.md',
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

const targetTestId = 'cambridge-07-reading-test-1';
const sourcePages = Array.from({ length: 12 }, (_, index) => index + 22);
const answerKeyPage = 157;
const expectedGroupRanges = Object.freeze([
  '1–5',
  '6–9',
  '10–13',
  '14–20',
  '21–26',
  '27–30',
  '31–36',
  '37–40',
]);
const calibrationMetadata = Object.freeze({
  status: 'manually_calibrated',
  source: 'original PDF visual inspection',
  date: '2026-07-21',
});

const semanticImageLinksById = Object.freeze({});

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${label}: ${error.message}`);
  }
}

function parseBankJs(text, label) {
  const match = /^\s*window\.CAMBRIDGE_TEST_BANK\s*=\s*([\s\S]*);\s*$/.exec(text);
  assert.ok(match, `${label} must use window.CAMBRIDGE_TEST_BANK assignment`);
  return parseJson(match[1], label);
}

function parseRange(range) {
  const match = /^(\d+)(?:[–-](\d+))?$/.exec(String(range));
  assert.ok(match, `Invalid question range: ${range}`);
  const first = Number(match[1]);
  const last = Number(match[2] ?? match[1]);
  assert.ok(first <= last, `Question range is reversed: ${range}`);
  return { first, last };
}

function rangeNumbers(range) {
  const { first, last } = parseRange(range);
  return Array.from({ length: last - first + 1 }, (_, index) => first + index);
}

function questionHeading(range) {
  const normalized = String(range).replace(/-/g, '–');
  return `${rangeNumbers(normalized).length === 1 ? 'Question' : 'Questions'} ${normalized}`;
}

function asEntries(value) {
  if (Array.isArray(value)) {
    return value.map((item) => typeof item === 'string'
      ? { label: item, text: `Paragraph ${item}` }
      : { label: String(item.label), text: String(item.text) });
  }

  return Object.entries(value ?? {}).map(([label, text]) => ({
    label: String(label),
    text: String(text),
  }));
}

function asPrompts(value) {
  if (Array.isArray(value)) {
    return value.map((item) => ({
      ...item,
      number: Number(item.number),
      text: String(item.text ?? item.prompt),
      ...(item.options ? { options: asEntries(item.options) } : {}),
    }));
  }

  return Object.entries(value ?? {}).map(([number, text]) => ({
    number: Number(number),
    text: String(text),
  }));
}

function groupPrompts(group) {
  if (group.questions && !Array.isArray(group.questions)) {
    return Object.entries(group.questions).map(([number, item]) => ({
      number: Number(number),
      text: String(item.prompt ?? item.text),
      options: asEntries(item.options),
    }));
  }
  const prompts = asPrompts(group.prompts);
  if (prompts.length) return prompts;
  if (group.prompt) {
    return rangeNumbers(group.range).map((number) => ({
      number,
      text: String(group.prompt),
    }));
  }
  return [];
}

function groupPages(group) {
  const pages = group.sourcePages ?? [group.sourcePage ?? group.page];
  const normalized = pages.filter((page) => page !== undefined).map(Number);
  assert.ok(normalized.length, `Questions ${group.range} has no source page`);
  return [...new Set(normalized)].sort((a, b) => a - b);
}

function calibrationTitle(calibration) {
  if (Object.hasOwn(calibration, 'articleTitle')) {
    return calibration.articleTitle;
  }
  return calibration.title ?? null;
}

function calibrationSubtitle(calibration) {
  return calibration.articleSubtitle ?? calibration.subtitle ?? null;
}

function answerKeyPhysicalPage(calibration) {
  if (typeof calibration.answerKeyPage === 'number') {
    return calibration.answerKeyPage;
  }
  if (calibration.answerKeyPage?.physicalPage) {
    return Number(calibration.answerKeyPage.physicalPage);
  }
  if (calibration.answerKey?.actualPdfPhysicalPage) {
    return Number(calibration.answerKey.actualPdfPhysicalPage);
  }
  return null;
}

function imageCandidates(calibration) {
  if (Array.isArray(calibration.images)) return calibration.images;
  if (Array.isArray(calibration.semanticImageDecision?.images)) {
    return calibration.semanticImageDecision.images;
  }
  if (Array.isArray(calibration.imageAssessment?.images)) {
    return calibration.imageAssessment.images;
  }
  return [];
}

function normalizeImages(calibration) {
  return imageCandidates(calibration).map((image) => {
    const mapped = semanticImageLinksById[image.id];
    const link = image.link ?? image.path ?? image.relativePath ?? mapped?.link;
    assert.ok(link, `Semantic image ${image.id} is missing a link/path`);
    assert.ok(mapped?.workspacePath, `Semantic image ${image.id} is missing a workspace path`);
    const { workspacePath: _workspacePath, ...publicImage } = image;
    return {
      ...publicImage,
      link,
    };
  });
}

function analysisByNumber(calibration) {
  const analyses = calibration.answerEvidence ?? calibration.questionAnalysis ?? [];
  return new Map(analyses.map((item) => [Number(item.number), item]));
}

function optionsForPrompt(group, prompt) {
  return prompt.options?.length ? prompt.options : asEntries(group.options);
}

function normalizeEvidence(rawEvidence, analysis) {
  const evidence = rawEvidence ?? analysis?.evidence;
  assert.notEqual(evidence, undefined, `Question ${analysis?.number ?? '?'} has no evidence`);

  if (typeof evidence === 'string') {
    return { text: evidence };
  }

  assert.equal(typeof evidence, 'object', 'Evidence must be a string or object');
  assert.ok(evidence.text, 'Structured evidence must contain text');
  return { ...evidence, text: String(evidence.text) };
}

function evidenceLocation(calibration, evidence, analysis) {
  const pages = evidence.sourcePages
    ?? (evidence.sourcePage ? [evidence.sourcePage] : null)
    ?? (analysis?.evidencePage ? [analysis.evidencePage] : null);
  const paragraph = evidence.section ?? analysis?.paragraph ?? null;
  const pageText = pages?.length
    ? `page${pages.length > 1 ? 's' : ''} ${pages.join('–')}`
    : 'calibrated passage text';
  const paragraphText = paragraph ? `, ${paragraph}` : '';
  return `Cambridge IELTS 7 Test 1, Reading Passage ${calibration.passage}, ${pageText}${paragraphText}`;
}

function acceptedAnswerVariants(answer) {
  const optionalPrefix = /^\(([^)]+)\)\s+(.+)$/.exec(answer);
  if (optionalPrefix) return [`${optionalPrefix[1]} ${optionalPrefix[2]}`, optionalPrefix[2]];
  if (answer.includes('/')) return answer.split('/').map((item) => item.trim()).filter(Boolean);
  return [answer];
}

function answerRecord(calibration, group, prompt, analysisMap) {
  const number = Number(prompt.number);
  const raw = calibration.answers?.[String(number)];
  assert.notEqual(raw, undefined, `Missing official answer for question ${number}`);
  const richAnswer = raw && typeof raw === 'object' ? raw : null;
  const answer = String(richAnswer?.answer ?? richAnswer?.letter ?? raw).trim();
  assert.ok(answer, `Official answer for question ${number} is empty`);

  const analysis = analysisMap.get(number);
  const evidence = normalizeEvidence(richAnswer?.evidence, analysis);
  const distractors = richAnswer?.distractors
    ?? richAnswer?.distractorAnalysis
    ?? analysis?.distractors
    ?? analysis?.distractorAnalysis;
  assert.notEqual(distractors, undefined, `Question ${number} has no distractor analysis`);

  const options = optionsForPrompt(group, prompt);
  const answerText = richAnswer?.answerText
    ?? richAnswer?.text
    ?? options.find((option) => option.label === answer)?.text
    ?? answer;

  return {
    answer,
    answerText: String(answerText),
    acceptedAnswers: analysis?.acceptedAnswers ?? acceptedAnswerVariants(answer),
    evidence: evidence.text,
    evidenceData: evidence,
    evidenceLocation: evidenceLocation(calibration, evidence, analysis),
    reason: richAnswer?.reason ?? analysis?.reason ?? null,
    distractors,
  };
}

function renderFlowChart(group) {
  const chart = group.flowChart;
  assert.ok(chart, `Questions ${group.range} is missing flowChart data`);
  const branches = Object.entries(chart.branches ?? {});
  assert.ok(branches.length >= 2, `Questions ${group.range} must preserve both flow-chart branches`);
  return [
    group.title,
    chart.start,
    '↓',
    chart.step1,
    '↓',
    chart.step2,
    '↙                         ↘',
    ...branches.flatMap(([label, text]) => [`${label}:`, text]),
  ].filter(Boolean);
}

function renderQuestionGroup(group) {
  const lines = [questionHeading(group.range), ...group.instructions];
  const prompts = groupPrompts(group);
  const options = asEntries(group.options);

  switch (group.type) {
    case 'matching_headings':
      lines.push('List of Headings');
      lines.push(...options.map(({ label, text }) => `${label} ${text}`));
      if (group.example) {
        lines.push(
          group.example.exampleLabel ?? 'Example',
          `${group.example.prompt} ${group.example.answerLabel ?? 'Answer'} ${group.example.answer}`,
        );
      }
      lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
      break;
    case 'paragraph_matching':
      lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
      break;
    case 'matching_features':
      lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
      lines.push('List of Descriptions');
      lines.push(...options.map(({ label, text }) => `${label} ${text}`));
      break;
    case 'classification':
      lines.push(...options.map(({ label, text }) => `${label} ${text}`));
      lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
      break;
    case 'yes_no_not_given':
      lines.push(...options.map(({ label, text }) => `${label} ${text}`));
      lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
      break;
    case 'multiple_choice':
    case 'multiple_choice_best_title':
      for (const prompt of prompts) {
        lines.push(`${prompt.number} ${prompt.text}`);
        lines.push(...optionsForPrompt(group, prompt).map(
          ({ label, text }) => `${label} ${text}`,
        ));
      }
      break;    case 'summary_completion_with_list':
      if (group.summaryTitle) lines.push(group.summaryTitle);
      if (group.summary) lines.push(group.summary);
      if (group.summaryText) lines.push(group.summaryText);
      lines.push(...(group.summaryParagraphs ?? []));
      lines.push(...options.map(({ label, text }) => `${label} ${text}`));
      break;
    case 'summary_completion':
      if (group.summaryTitle) lines.push(group.summaryTitle);
      if (group.summaryText) lines.push(group.summaryText);
      lines.push(...(group.summaryParagraphs ?? []));
      break;
    case 'multiple_response':
      lines.push(group.prompt);
      lines.push(...options.map(({ label, text }) => `${label} ${text}`));
      break;
    case 'flow_chart_completion':
      lines.push(...renderFlowChart(group));
      break;
    case 'matching_information':
      lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
      break;
    default:
      lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
      lines.push(...options.map(({ label, text }) => `${label} ${text}`));
      break;
  }

  return lines.join('\n');
}

function readingParagraphs(calibration) {
  const paragraphs = [];
  const title = calibrationTitle(calibration);
  if (title) paragraphs.push(title);
  const subtitle = calibrationSubtitle(calibration);
  if (subtitle) paragraphs.push(subtitle);

  if (Array.isArray(calibration.sections) && calibration.sections.length) {
    if (calibration.standfirst && calibration.standfirst !== subtitle) paragraphs.push(calibration.standfirst);
    if (calibration.authorNote) paragraphs.push(calibration.authorNote);
    for (const section of calibration.sections) {
      if (section.label) paragraphs.push(section.label);
      paragraphs.push(...(section.paragraphs ?? []).map(String));
    }
  } else {
    const headings = new Map(
      (calibration.sectionHeadings ?? []).map((heading) => [
        Number(heading.beforeBodyParagraph),
        heading.text,
      ]),
    );
    let previousLabel = null;
    calibration.bodyParagraphs.forEach((paragraph, index) => {
      const heading = headings.get(index + 1);
      if (heading) paragraphs.push(heading);
      if (typeof paragraph === 'string') {
        paragraphs.push(paragraph);
        return;
      }
      if (paragraph.label && paragraph.label !== previousLabel) paragraphs.push(paragraph.label);
      paragraphs.push(String(paragraph.text));
      previousLabel = paragraph.label ?? null;
    });
  }

  for (const footnote of calibration.footnotes ?? []) {
    paragraphs.push(`${footnote.marker} ${footnote.text}`);
  }
  return paragraphs;
}

function readingPages(calibration) {
  const questionPages = new Set(
    calibration.questionGroups.flatMap((group) => groupPages(group)),
  );
  const pages = calibration.sourcePages.filter((page) => !questionPages.has(page));
  assert.ok(pages.length, `Passage ${calibration.passage} has no body pages`);
  return pages;
}

function buildReadingSection(calibration, images) {
  return {
    kind: 'reading',
    title: `Reading Passage ${calibration.passage}`,
    articleTitle: calibrationTitle(calibration),
    articleTitleStatus: calibration.articleTitleStatus ?? null,
    subtitle: calibrationSubtitle(calibration),
    pages: readingPages(calibration),
    paragraphs: readingParagraphs(calibration),
    sectionHeadings: calibration.sectionHeadings ?? [],
    footnotes: calibration.footnotes ?? [],
    images,
  };
}

function buildQuestionSection(group, passageImages) {
  const images = group.type === 'flow_chart_completion' ? passageImages : [];
  return {
    kind: 'questions',
    title: questionHeading(group.range),
    type: group.type,
    pages: groupPages(group),
    paragraphs: [renderQuestionGroup(group)],
    instructions: [...group.instructions],
    prompts: groupPrompts(group),
    options: asEntries(group.options),
    example: group.example ?? null,
    flowChart: group.flowChart ?? null,
    images,
    imageLinks: images.map((image) => image.link),
  };
}

function buildQuestions(calibrations, imagesByPassage) {
  const questions = [];

  for (const calibration of calibrations) {
    const analysisMap = analysisByNumber(calibration);
    for (const group of calibration.questionGroups) {
      const prompts = groupPrompts(group);
      const context = renderQuestionGroup(group);
      const passageImages = group.type === 'flow_chart_completion'
        ? imagesByPassage.get(calibration.passage)
        : [];

      for (const prompt of prompts) {
        const options = optionsForPrompt(group, prompt);
        const official = answerRecord(calibration, group, prompt, analysisMap);
        questions.push({
          id: `C07-T1-P${calibration.passage}-Q${prompt.number}`,
          number: prompt.number,
          passage: calibration.passage,
          type: group.type,
          prompt: prompt.text,
          groupPrompt: group.instructions.join(' '),
          options,
          independentOptions: options.map((option) => ({ ...option })),
          ...official,
          sourcePages: groupPages(group),
          answerKeyPage,
          questionContext: context,
          rowContext: group.title ?? null,
          flowChart: group.flowChart ?? null,
          semanticImages: passageImages,
          imageLinks: passageImages.map((image) => image.link),
          answerSetId: group.type === 'multiple_response' ? `C07-T1-P${calibration.passage}-Q${group.range}` : null,
        });
      }
    }
  }

  return questions.sort((a, b) => a.number - b.number);
}

function buildAnswerKeyText(calibrations) {
  const lines = ['Answer key', 'ACADEMIC READING'];

  for (const calibration of calibrations) {
    const numbers = Object.keys(calibration.answers).map(Number).sort((a, b) => a - b);
    lines.push(
      '',
      `Reading Passage ${calibration.passage}, Questions ${numbers[0]}–${numbers.at(-1)}`,
    );
    for (const number of numbers) {
      const raw = calibration.answers[String(number)];
      const answer = raw && typeof raw === 'object'
        ? String(raw.answer ?? raw.letter)
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
    replacements.push({
      start,
      end,
      value: `${text}${trailingNewlines || '\n\n'}`,
    });
  }

  let result = rawText;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    result = result.slice(0, replacement.start)
      + replacement.value
      + result.slice(replacement.end);
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

function calibratedPages(calibration) {
  const candidate = calibration.pages && !Array.isArray(calibration.pages)
    ? calibration.pages
    : calibration.rawPages;
  assert.ok(candidate && !Array.isArray(candidate), `Passage ${calibration.passage} must provide calibrated page texts`);
  return candidate;
}

function validateExactPageTexts(calibrations) {
  const seenPages = [];
  for (const calibration of calibrations) {
    const pageTexts = calibratedPages(calibration);
    for (const page of calibration.sourcePages) {
      assert.equal(typeof pageTexts[String(page)], 'string');
      assert.ok(
        pageTexts[String(page)].trim(),
        `Passage ${calibration.passage} physical page ${page} has empty calibrated text`,
      );
      seenPages.push(page);
    }
  }
  assert.deepEqual(
    seenPages.sort((a, b) => a - b),
    sourcePages,
    'Calibration pages must cover physical pages 22–33 exactly once',
  );
}

function validateCalibrations(calibrations) {
  assert.deepEqual(
    calibrations.map((item) => item.passage),
    [1, 2, 3],
    'Calibration files must describe Passages 1, 2 and 3 in order',
  );

  for (const calibration of calibrations) {
    assert.equal(calibration.book, 7, `Passage ${calibration.passage} has wrong book`);
    assert.equal(calibration.test, 1, `Passage ${calibration.passage} has wrong test`);
    assert.equal(
      answerKeyPhysicalPage(calibration),
      answerKeyPage,
      `Passage ${calibration.passage} must identify physical answer page 157`,
    );
    assert.ok(Array.isArray(calibration.bodyParagraphs));
    assert.ok(calibration.bodyParagraphs.length, `Passage ${calibration.passage} has no body`);
    assert.ok(Array.isArray(calibration.questionGroups));
  }

  validateExactPageTexts(calibrations);

  const groups = calibrations.flatMap((item) => item.questionGroups);
  assert.deepEqual(
    groups.map((group) => String(group.range).replace(/-/g, '–')),
    expectedGroupRanges,
    'Unexpected Test 1 question-group ranges or order',
  );

  const promptNumbers = [];
  for (const group of groups) {
    assert.ok(group.type, `Questions ${group.range} has no type`);
    assert.ok(Array.isArray(group.instructions) && group.instructions.length);
    assert.ok(group.instructions.every((instruction) => String(instruction).trim()));
    const prompts = groupPrompts(group);
    assert.deepEqual(
      prompts.map((prompt) => prompt.number),
      rangeNumbers(group.range),
      `Questions ${group.range} prompts are incomplete or out of order`,
    );
    assert.ok(prompts.every((prompt) => prompt.text.trim()));
    for (const prompt of prompts) {
      if (group.type === 'multiple_choice') {
        assert.equal(
          optionsForPrompt(group, prompt).length,
          4,
          `Question ${prompt.number} must have four independent options`,
        );
      }
    }
    if (group.type === 'flow_chart_completion') {
      renderFlowChart(group);
    }
    promptNumbers.push(...prompts.map((prompt) => prompt.number));
  }
  assert.deepEqual(
    promptNumbers,
    Array.from({ length: 40 }, (_, index) => index + 1),
    'Question prompts must cover 1–40 exactly once',
  );

  const answerNumbers = calibrations
    .flatMap((item) => Object.keys(item.answers ?? {}).map(Number))
    .sort((a, b) => a - b);
  assert.deepEqual(
    answerNumbers,
    Array.from({ length: 40 }, (_, index) => index + 1),
    'Official answers must cover questions 1–40 exactly once',
  );
  for (const calibration of calibrations) {
    for (const [number, raw] of Object.entries(calibration.answers)) {
      const value = raw && typeof raw === 'object'
        ? raw.answer ?? raw.letter
        : raw;
      assert.ok(String(value ?? '').trim(), `Official answer ${number} is empty`);
    }
  }
}

async function validateSemanticImages(calibrations) {
  const imagesByPassage = new Map(
    calibrations.map((calibration) => [
      calibration.passage,
      normalizeImages(calibration),
    ]),
  );
  for (const passage of [1, 2, 3]) {
    assert.equal(imagesByPassage.get(passage).length, 0, `Passage ${passage} must not require images`);
  }
  return imagesByPassage;
}

const [
  calibrationTexts,
  pageJsonText,
  rawText,
  bankJsonText,
  bankReportText,
  bankJsText,
] = await Promise.all([
  Promise.all(paths.calibrations.map((file) => readFile(file, 'utf8'))),
  readFile(paths.pageJson, 'utf8'),
  readFile(paths.raw, 'utf8'),
  readFile(paths.bankJson, 'utf8'),
  readFile(paths.bankReport, 'utf8'),
  readFile(paths.bankJs, 'utf8'),
]);

const calibrations = calibrationTexts.map((text, index) =>
  parseJson(text, paths.calibrations[index]),
);

// All strict preflight checks occur before any shared output is mutated.
validateCalibrations(calibrations);
const imagesByPassage = await validateSemanticImages(calibrations);

const pageDocument = parseJson(pageJsonText, paths.pageJson);
const primaryBank = parseJson(bankJsonText, paths.bankJson);
const reportBank = parseJson(bankReportText, paths.bankReport);
const jsBank = parseBankJs(bankJsText, paths.bankJs);
assert.deepEqual(
  reportBank,
  primaryBank,
  'Existing report bank mirror differs from the primary bank; refusing to integrate',
);
assert.deepEqual(
  jsBank,
  primaryBank,
  'Existing JS bank mirror differs from the primary bank; refusing to integrate',
);
assert.ok(Array.isArray(pageDocument.pages), 'Page JSON must contain a pages array');
assert.ok(Array.isArray(primaryBank.tests), 'Test bank must contain a tests array');

const calibratedPageTexts = new Map();
for (const calibration of calibrations) {
  for (const page of calibration.sourcePages) {
    calibratedPageTexts.set(page, calibratedPages(calibration)[String(page)].trim());
  }
}

const generatedAnswerKeyText = buildAnswerKeyText(calibrations);
const answerKeyText = calibratedPages(calibrations[0])[String(answerKeyPage)]?.trim();
assert.ok(answerKeyText, 'Passage 1 calibration must preserve physical answer page 157');
const normalizedAnswerPage = answerKeyText.replace(/\s+/g, ' ');
const pairedAnswerNumbers = new Set();
for (const calibration of calibrations) {
  for (const group of calibration.questionGroups.filter((item) => item.type === 'multiple_response')) {
    const numbers = rangeNumbers(group.range);
    const answers = numbers.map((number) => {
      const raw = calibration.answers[String(number)];
      return String(raw && typeof raw === 'object' ? raw.answer ?? raw.letter : raw);
    });
    const printedPair = `${numbers.join('&')} IN EITHER ORDER ${answers.join(' ')}`;
    assert.ok(
      normalizedAnswerPage.includes(printedPair),
      `Calibrated answer page 157 is missing paired answer: ${printedPair}`,
    );
    numbers.forEach((number) => pairedAnswerNumbers.add(number));
  }
}
for (const line of generatedAnswerKeyText.split('\n').filter((item) => /^\d+\s/.test(item))) {
  const number = Number(line.match(/^\d+/)?.[0]);
  if (pairedAnswerNumbers.has(number)) continue;
  assert.ok(
    normalizedAnswerPage.includes(line),
    `Calibrated answer page 157 is missing: ${line}`,
  );
}
calibratedPageTexts.set(answerKeyPage, answerKeyText);
assert.deepEqual(
  [...calibratedPageTexts.keys()].sort((a, b) => a - b),
  [...sourcePages, answerKeyPage],
  'Page replacement set must be physical pages 22–33 plus answer page 157',
);

for (const pageNumber of [...sourcePages, answerKeyPage]) {
  const page = pageDocument.pages.find((item) => item.page === pageNumber);
  assert.ok(page, `Page JSON is missing physical page ${pageNumber}`);
  const applied = applyC07CalibrationLedger(
    root,
    pageNumber,
    calibratedPageTexts.get(pageNumber),
    calibrationMetadata,
  );
  calibratedPageTexts.set(pageNumber, applied.text);
  page.text = applied.text;
  page.engine = 'manual_visual_calibration';
  page.calibration = applied.calibration;
}

const readingSections = [];
for (const calibration of calibrations) {
  const images = imagesByPassage.get(calibration.passage);
  readingSections.push(buildReadingSection(calibration, images));
  readingSections.push(
    ...calibration.questionGroups.map((group) =>
      buildQuestionSection(group, images),
    ),
  );
}

const questions = buildQuestions(calibrations, imagesByPassage);
const readingOnlySections = readingSections.filter((section) => section.kind === 'reading');
const questionOnlySections = readingSections.filter((section) => section.kind === 'questions');
const semanticImages = calibrations.flatMap((calibration) =>
  imagesByPassage.get(calibration.passage),
);
const passageTitles = calibrations.map((calibration) => ({
  passage: calibration.passage,
  title: calibrationTitle(calibration),
  titleStatus: calibration.articleTitleStatus ?? 'present_in_source',
}));

assert.equal(readingOnlySections.length, 3, 'Expected exactly three reading sections');
assert.equal(questionOnlySections.length, 8, 'Expected exactly eight question sections');
assert.equal(readingSections.length, 11, 'Expected eleven combined reading/question sections');
assert.equal(questions.length, 40, 'Expected exactly forty structured questions');
assert.deepEqual(
  questions.map((question) => question.number),
  Array.from({ length: 40 }, (_, index) => index + 1),
  'Structured questions must be numbered 1–40',
);
for (const question of questions) {
  assert.ok(question.type, `Question ${question.number} has no type`);
  assert.ok(question.prompt, `Question ${question.number} has no prompt`);
  assert.ok(question.groupPrompt, `Question ${question.number} has no instruction`);
  assert.ok(question.answer, `Question ${question.number} has no official answer`);
  assert.ok(question.answerText, `Question ${question.number} has no answerText`);
  assert.ok(question.acceptedAnswers.length, `Question ${question.number} has no accepted answer`);
  assert.ok(question.evidence, `Question ${question.number} has no evidence`);
  assert.ok(question.evidenceLocation, `Question ${question.number} has no evidence location`);
  assert.notEqual(question.distractors, undefined);
  assert.equal(question.answerKeyPage, answerKeyPage);
}

const replacementTest = {
  source: 'Cambridge IELTS 7 Test 1 manually calibrated against original PDF pages',
  draftStatus: 'calibrated',
  parseConfidence: 'manually_calibrated',
  calibration: { ...calibrationMetadata },
  pdf: 'data/Cambridge-IELTS-07.pdf',
  answerKeyText,
  answerKeyPages: [answerKeyPage],
  answerKeyPrintedPage: 153,
  mode: 'reading',
  id: targetTestId,
  title: 'Cambridge IELTS 7 Reading Test 1',
  durationSec: 3600,
  passageTitle: passageTitles
    .map(({ passage, title }) => title ?? `Reading Passage ${passage} (untitled)`)
    .join('; '),
  passageTitles,
  passage: readingOnlySections
    .flatMap((section) => section.paragraphs)
    .join('\n\n'),
  rawOcrText: sourcePages
    .map((page) => calibratedPageTexts.get(page))
    .join('\n\n'),
  readingSections,
  questions,
  questionText: questionOnlySections
    .flatMap((section) => section.paragraphs)
    .join('\n\n'),
  sourcePages,
  semanticImagesRequired: false,
  images: semanticImages,
  imageLinks: semanticImages.map((image) => image.link),
  calibratedPassages: calibrations.map((calibration) => ({
    passage: calibration.passage,
    title: calibrationTitle(calibration),
    titleStatus: calibration.articleTitleStatus ?? 'present_in_source',
    sourcePages: calibration.sourcePages,
    answerKeyPage,
    images: imagesByPassage.get(calibration.passage),
  })),
};

const targetIndexes = primaryBank.tests
  .map((test, index) => (test.id === targetTestId ? index : -1))
  .filter((index) => index >= 0);
assert.equal(targetIndexes.length, 1, `Expected exactly one ${targetTestId} entry`);
primaryBank.tests[targetIndexes[0]] = replacementTest;

const updatedRaw = replaceRawPages(rawText, calibratedPageTexts);
for (const [page, text] of calibratedPageTexts) {
  assert.equal(
    extractRawPage(updatedRaw, page),
    text,
    `raw.md Page ${page} must exactly equal the calibrated JSON page text`,
  );
}

const pageOutput = `${JSON.stringify(pageDocument, null, 2)}\n`;
const bankOutput = `${JSON.stringify(primaryBank, null, 2)}\n`;
const bankReportOutput = bankOutput;
const bankJsOutput = `window.CAMBRIDGE_TEST_BANK = ${bankOutput.trim()};\n`;

assert.deepEqual(parseJson(pageOutput, 'generated page output'), pageDocument);
assert.equal(
  bankReportOutput,
  bankOutput,
  'Primary and report bank JSON payloads must be byte-identical',
);
assert.deepEqual(parseJson(bankOutput, 'generated primary bank output'), primaryBank);
assert.deepEqual(parseJson(bankReportOutput, 'generated report bank output'), primaryBank);
assert.deepEqual(parseBankJs(bankJsOutput, 'generated JS bank output'), primaryBank);

if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify({
    dryRun: true,
    testId: targetTestId,
    calibratedPages: sourcePages,
    answerKeyPage,
    readingSections: readingOnlySections.length,
    questionSections: questionOnlySections.length,
    questions: questions.length,
    semanticImages: semanticImages.length,
    rawPagesMatched: calibratedPageTexts.size,
  }, null, 2));
  process.exit(0);
}

// Writes are intentionally sequential to avoid concurrent truncation of bank mirrors.
await writeFile(paths.pageJson, pageOutput, 'utf8');
await writeFile(paths.raw, updatedRaw, 'utf8');
await writeFile(paths.bankJson, bankOutput, 'utf8');
await writeFile(paths.bankReport, bankReportOutput, 'utf8');
await writeFile(paths.bankJs, bankJsOutput, 'utf8');

const writtenPageText = await readFile(paths.pageJson, 'utf8');
const writtenRaw = await readFile(paths.raw, 'utf8');
const writtenPrimaryText = await readFile(paths.bankJson, 'utf8');
const writtenReportText = await readFile(paths.bankReport, 'utf8');
const writtenJsText = await readFile(paths.bankJs, 'utf8');
assert.equal(writtenPageText, pageOutput, 'Written page JSON differs from validated output');
assert.equal(writtenRaw, updatedRaw, 'Written raw.md differs from validated output');
assert.equal(writtenPrimaryText, bankOutput, 'Written primary bank differs from validated output');
assert.equal(writtenReportText, bankOutput, 'Written report bank differs from primary bank');
assert.deepEqual(parseJson(writtenPrimaryText, paths.bankJson), primaryBank);
assert.deepEqual(parseJson(writtenReportText, paths.bankReport), primaryBank);
assert.deepEqual(parseBankJs(writtenJsText, paths.bankJs), primaryBank);

console.log(JSON.stringify({
  testId: targetTestId,
  calibratedPages: sourcePages,
  answerKeyPage,
  readingSections: readingOnlySections.length,
  questionSections: questionOnlySections.length,
  questions: questions.length,
  semanticImages: semanticImages.map(({ id, link }) => ({ id, link })),
  rawPagesMatched: calibratedPageTexts.size,
  mirrors: {
    json: paths.bankJson,
    report: paths.bankReport,
    js: paths.bankJs,
  },
}, null, 2));
