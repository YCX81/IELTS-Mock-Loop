import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');

const paths = {
  calibrations: [1, 2, 3].map((passage) =>
    path.join(root, 'work', `c08-t2-p${passage}-calibration.json`),
  ),
  pageJson: path.join(
    root,
    'data',
    'generated',
    'page-json',
    'cambridge-ielts-08.pages.json',
  ),
  raw: path.join(
    root,
    'data',
    'generated',
    'text-pages',
    'cambridge-ielts-08.raw.md',
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

const targetTestId = 'cambridge-08-reading-test-2';
const sourcePages = Array.from({ length: 12 }, (_, index) => index + 40);
const answerKeyPage = 154;
const expectedGroupRanges = Object.freeze([
  '1–8',
  '9–13',
  '14–17',
  '18–22',
  '23–26',
  '27–32',
  '33–36',
  '37–40',
]);
const calibrationMetadata = Object.freeze({
  status: 'manually_calibrated',
  source: 'original PDF visual inspection',
  date: '2026-07-21',
});

const semanticImageLinksById = Object.freeze({
  'c08-t2-p1-q6-8-float-process': {
    link: 'data/generated/image-review/cambridge-ielts-08/page-042-reading-pilkingtons-float-process-diagram.png',
    workspacePath: path.join(
      root,
      'data',
      'generated',
      'image-review',
      'cambridge-ielts-08',
      'page-042-reading-pilkingtons-float-process-diagram.png',
    ),
  },
});

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
  if (Array.isArray(group.questions)) return asPrompts(group.questions);
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
  if (group.type === 'table_and_diagram_completion') {
    const tablePrompts = {
      1: 'Method: 1 ______',
      2: 'Spinning advantage: Glass remained 2 ______',
      3: 'Spinning disadvantage: 3 ______',
      4: 'Ribbon advantage: glass sheets of varying 4 ______',
      5: 'Ribbon disadvantage: Glass was 5 ______',
    };
    return rangeNumbers(group.range).map((number) => ({
      number,
      text: tablePrompts[number] ?? group.diagramPrompts?.[String(number)],
      rowContext: number <= 5 ? group.tableTitle : group.diagramTitle,
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
  return imageCandidates(calibration)
    .filter((image) =>
      image.semantic !== false
      && image.type !== 'semantic_table'
      && !image.dataAvailableIn
    )
    .map((image) => {
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
  return `Cambridge IELTS 8 Test 2, Reading Passage ${calibration.passage}, ${pageText}${paragraphText}`;
}

function acceptedAnswerVariants(answer) {
  const optionalPrefix = /^\(([^)]+)\)\s+(.+)$/.exec(answer);
  if (optionalPrefix) return [`${optionalPrefix[1]} ${optionalPrefix[2]}`, optionalPrefix[2]];
  if (answer.includes('/')) return answer.split('/').map((item) => item.trim()).filter(Boolean);
  return [answer];
}

function acceptedAnswersFor(analysis, answer) {
  const forms = analysis?.acceptedAnswers ?? analysis?.acceptedForms;
  if (Array.isArray(forms)) return forms.map(String);
  if (forms?.mode === 'two_blanks_in_either_order' && forms.items?.length === 2) {
    const [first, second] = forms.items.map(String);
    return [
      `${first} ${second}`, `${second} ${first}`,
      `${first} and ${second}`, `${second} and ${first}`,
      `${first}/${second}`, `${second}/${first}`,
    ];
  }
  return acceptedAnswerVariants(answer);
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
  const options = optionsForPrompt(group, prompt);
  const distractors = richAnswer?.distractors
    ?? richAnswer?.distractorAnalysis
    ?? analysis?.distractors
    ?? analysis?.distractorAnalysis
    ?? (options.length === 0 ? [] : undefined);
  assert.notEqual(distractors, undefined, `Question ${number} has no distractor analysis`);
  const answerText = richAnswer?.answerText
    ?? richAnswer?.text
    ?? options.find((option) => option.label === answer)?.text
    ?? answer;
  const calibratedForms = calibration.acceptedForms?.[String(number)];
  const acceptedAnswers = Array.isArray(calibratedForms)
    ? calibratedForms.map(String)
    : acceptedAnswersFor(
      calibratedForms ? { ...analysis, acceptedForms: calibratedForms } : analysis,
      answer,
    );
  const pairedWith = Number(/\(IN EITHER ORDER with (\d+)\)$/i.exec(answer)?.[1]) || null;

  return {
    answer,
    answerText: String(answerText),
    acceptedAnswers,
    acceptedAnswerMode: pairedWith
      ? 'paired_blanks_in_either_order'
      : calibratedForms?.mode ?? analysis?.acceptedForms?.mode ?? null,
    pairedWith,
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
      for (const example of [group.example, ...(group.examples ?? [])].filter(Boolean)) {
        lines.push(
          example.exampleLabel ?? 'Example',
          `${example.prompt} ${example.answerLabel ?? 'Answer'} ${example.answer}`,
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
    case 'matching_researchers':
      lines.push(...prompts.map(({ number, text }) => `${number} ${text}`));
      lines.push('List of Researchers');
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
    case 'multiple_choice_single':
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
    case 'table_and_diagram_completion':
      lines.push(group.tableTitle);
      lines.push(`| ${group.tableHeaders.join(' | ')} |`);
      lines.push(`| ${group.tableHeaders.map(() => '---').join(' | ')} |`);
      for (const row of group.tableRows) {
        lines.push(`| ${row.method} | ${row.advantages.join('; ')} | ${row.disadvantages.join('; ')} |`);
      }
      lines.push(group.diagramTitle);
      lines.push(...group.diagramPrintedLabels);
      lines.push(...Object.entries(group.diagramPrompts).map(([number, text]) => `${number} ${text}`));
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

  for (const table of calibration.tables ?? []) {
    const columns = table.columns.map(String);
    const markdown = [
      `| ${columns.join(' | ')} |`,
      `| ${columns.map(() => '---').join(' | ')} |`,
      ...table.rows.map((row) => `| ${row.map(String).join(' | ')} |`),
    ].join('\n');
    const reference = `Table ${table.number}`;
    const insertionIndex = paragraphs.findIndex((paragraph) =>
      String(paragraph).includes(reference)
    );
    const tableParagraphs = [`${reference}: ${table.title}`, markdown];
    paragraphs.splice(
      insertionIndex >= 0 ? insertionIndex + 1 : paragraphs.length,
      0,
      ...tableParagraphs,
    );
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
    tables: calibration.tables ?? [],
    images,
  };
}

function imagesForGroup(group, passageImages) {
  const normalizedRange = String(group.range).replace(/-/g, '–');
  return passageImages.filter((image) =>
    image.id === group.semanticImageId
    || String(image.questionRange ?? '').replace(/-/g, '–') === normalizedRange
  );
}

function buildQuestionSection(group, passageImages) {
  const images = imagesForGroup(group, passageImages);
  if (group.semanticImageId || images.length) {
    assert.equal(images.length, 1, `Questions ${group.range} must resolve one semantic image`);
  }
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
    table: group.tableTitle ? {
      title: group.tableTitle,
      headers: group.tableHeaders,
      rows: group.tableRows,
    } : null,
    diagram: group.diagramTitle ? {
      title: group.diagramTitle,
      printedLabels: group.diagramPrintedLabels,
      prompts: group.diagramPrompts,
    } : null,
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
      const passageImages = imagesForGroup(
        group,
        imagesByPassage.get(calibration.passage),
      );

      for (const prompt of prompts) {
        const options = optionsForPrompt(group, prompt);
        const official = answerRecord(calibration, group, prompt, analysisMap);
        const promptImages = passageImages.filter((image) =>
          rangeNumbers(image.questionRange ?? group.range).includes(prompt.number)
        );
        questions.push({
          id: `C08-T2-P${calibration.passage}-Q${prompt.number}`,
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
          rowContext: prompt.rowContext ?? group.tableTitle ?? group.summaryTitle ?? group.title ?? null,
          flowChart: group.flowChart ?? null,
          semanticImages: promptImages,
          imageLinks: promptImages.map((image) => image.link),
          answerSetId: group.type === 'multiple_response' || official.pairedWith
            ? `C08-T2-P${calibration.passage}-Q${Math.min(prompt.number, official.pairedWith ?? prompt.number)}-${Math.max(prompt.number, official.pairedWith ?? prompt.number)}`
            : null,
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
  const explicitPages = calibration.pages && !Array.isArray(calibration.pages)
    && calibration.sourcePages.every((page) => typeof calibration.pages[String(page)] === 'string')
    ? calibration.pages
    : null;
  const candidate = explicitPages ?? calibration.rawPages;
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
    'Calibration pages must cover physical pages 40–51 exactly once',
  );
}

function validateCalibrations(calibrations) {
  assert.deepEqual(
    calibrations.map((item) => item.passage),
    [1, 2, 3],
    'Calibration files must describe Passages 1, 2 and 3 in order',
  );

  for (const calibration of calibrations) {
    assert.equal(calibration.book, 8, `Passage ${calibration.passage} has wrong book`);
    assert.equal(calibration.test, 2, `Passage ${calibration.passage} has wrong test`);
    assert.equal(
      answerKeyPhysicalPage(calibration),
      answerKeyPage,
      `Passage ${calibration.passage} must identify physical answer page 154`,
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
    'Unexpected Test 2 question-group ranges or order',
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
      if (group.type === 'multiple_choice' || group.type === 'multiple_choice_single') {
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
  assert.equal(imagesByPassage.get(1).length, 1, 'Passage 1 must require exactly one diagram');
  assert.equal(imagesByPassage.get(2).length, 0, 'Passage 2 must not require images');
  assert.equal(imagesByPassage.get(3).length, 0, 'Passage 3 must not require images');
  const diagram = imagesByPassage.get(1)[0];
  assert.equal(diagram.id, 'c08-t2-p1-q6-8-float-process');
  const mapped = semanticImageLinksById[diagram.id];
  const bytes = await readFile(mapped.workspacePath);
  assert.ok(bytes.length > 0, 'The Questions 6–8 float-process diagram is empty');
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
for (const calibration of calibrations) {
  calibration.sourcePages = calibration.sourcePages.filter((page) => page !== answerKeyPage);
  for (const group of calibration.questionGroups ?? []) {
    group.type = String(group.type).toLowerCase();
    if (group.type === 'multiple_choice_single_answer') {
      group.type = 'multiple_choice_single';
    }
    if (group.type === 'summary_completion_from_shared_list'
      || group.type === 'summary_completion_from_word_list') {
      group.type = 'summary_completion_with_list';
    }
    if (!group.options && group.researchers) {
      group.options = group.researchers;
    }
    if (!group.options && group.definitions) {
      group.options = group.definitions;
    }
  }
}

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
const answerKeyFragments = calibrations.map((calibration) => {
  const fragment = calibratedPages(calibration)[String(answerKeyPage)]?.trim();
  assert.ok(fragment, `Passage ${calibration.passage} must preserve its physical answer-page text`);
  return fragment;
});
const answerKeyText = [
  answerKeyFragments[0],
  ...answerKeyFragments.slice(1).map((fragment) => fragment.replace(/^ACADEMIC READING\s*/i, '').trim()),
].join('\n\n');
const normalizeAnswerText = (text) => text
  .replace(/\s+/g, ' ')
  .replace(/\s*\/\s*/g, '/')
  .trim();
const normalizedAnswerPage = normalizeAnswerText(answerKeyText);
const officialAnswerFor = (number) => {
  const calibration = calibrations.find((item) => Object.hasOwn(item.answers ?? {}, String(number)));
  if (!calibration) return null;
  const numbers = Object.keys(calibration.answers).map(Number).sort((a, b) => a - b);
  const index = numbers.indexOf(number);
  return index >= 0 ? calibration.officialAnswerSequence?.[index] ?? null : null;
};
const pairedAnswerNumbers = new Set();
for (const calibration of calibrations) {
  for (const [numberText, raw] of Object.entries(calibration.answers ?? {})) {
    const answer = String(raw && typeof raw === 'object' ? raw.answer ?? raw.letter : raw);
    const pairedWith = Number(/\(IN EITHER ORDER with (\d+)\)$/i.exec(answer)?.[1]);
    if (!pairedWith) continue;
    const number = Number(numberText);
    const pair = [number, pairedWith].sort((a, b) => a - b);
    assert.ok(
      normalizedAnswerPage.includes(`${pair.join('&')} IN EITHER ORDER`),
      `Calibrated answer page 154 is missing paired answers ${pair.join('&')}`,
    );
    for (const form of calibration.acceptedForms?.[numberText] ?? []) {
      assert.ok(normalizedAnswerPage.includes(String(form)), `Answer page 154 is missing ${form}`);
    }
    pair.forEach((item) => pairedAnswerNumbers.add(item));
  }
  for (const group of calibration.questionGroups.filter((item) => item.type === 'multiple_response')) {
    const numbers = rangeNumbers(group.range);
    const answers = numbers.map((number) => {
      const raw = calibration.answers[String(number)];
      return String(raw && typeof raw === 'object' ? raw.answer ?? raw.letter : raw);
    });
    const printedPair = `${numbers.join('&')} IN EITHER ORDER ${answers.join(' ')}`;
    assert.ok(
      normalizedAnswerPage.includes(printedPair),
      `Calibrated answer page 154 is missing paired answer: ${printedPair}`,
    );
    numbers.forEach((number) => pairedAnswerNumbers.add(number));
  }
}
for (const line of generatedAnswerKeyText.split('\n').filter((item) => /^\d+\s/.test(item))) {
  const number = Number(line.match(/^\d+/)?.[0]);
  if (pairedAnswerNumbers.has(number)) continue;
  const officialAnswer = officialAnswerFor(number);
  const expectedLine = officialAnswer == null ? line : `${number} ${officialAnswer}`;

  assert.ok(
    normalizedAnswerPage.includes(normalizeAnswerText(expectedLine)),
    `Calibrated answer page 154 is missing: ${expectedLine}`,
  );
}
calibratedPageTexts.set(answerKeyPage, answerKeyText);
assert.deepEqual(
  [...calibratedPageTexts.keys()].sort((a, b) => a - b),
  [...sourcePages, answerKeyPage],
  'Page replacement set must be physical pages 40–51 plus answer page 154',
);

for (const pageNumber of [...sourcePages, answerKeyPage]) {
  const page = pageDocument.pages.find((item) => item.page === pageNumber);
  assert.ok(page, `Page JSON is missing physical page ${pageNumber}`);
  page.text = calibratedPageTexts.get(pageNumber);
  page.engine = 'manual_visual_calibration';
  page.calibration = { ...calibrationMetadata };
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
  source: 'Cambridge IELTS 8 Test 2 manually calibrated against original PDF pages',
  draftStatus: 'calibrated',
  parseConfidence: 'manually_calibrated',
  calibration: { ...calibrationMetadata },
  pdf: 'data/Cambridge-IELTS-08.pdf',
  answerKeyText,
  answerKeyPages: [answerKeyPage],
  answerKeyPrintedPage: 155,
  mode: 'reading',
  id: targetTestId,
  title: 'Cambridge IELTS 8 Reading Test 2',
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
  semanticImagesRequired: true,
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
