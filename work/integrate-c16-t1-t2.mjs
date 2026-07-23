import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bankPaths = {
  primary: path.join(root, 'data', 'cambridge-test-bank.json'),
  report: path.join(root, 'data', 'generated', 'reports', 'cambridge-test-bank.json'),
  js: path.join(root, 'data', 'cambridge-test-bank.js'),
};
const manifestPath = path.join(
  root,
  'data',
  'generated',
  'intensive-reading',
  'cambridge-16-18',
  'manifest.json',
);
const lessonDirectory = path.join(
  root,
  'data',
  'generated',
  'intensive-reading',
  'cambridge-16-18',
);
const targets = [
  {
    test: 1,
    id: 'cambridge-16-reading-test-1',
    sourcePages: range(18, 30),
    answerKeyPage: 124,
    answerKeyPrintedPage: 122,
  },
  {
    test: 2,
    id: 'cambridge-16-reading-test-2',
    sourcePages: range(40, 53),
    answerKeyPage: 126,
    answerKeyPrintedPage: 124,
  },
];
const expectedGroupRanges = {
  1: ['1–7', '8–13', '14–20', '21–24', '25–26', '27–30', '31–34', '35–40'],
  2: ['1–8', '9–13', '14–16', '17–20', '21–26', '27–30', '31–35', '36–40'],
};
const metadata = Object.freeze({
  status: 'manually_calibrated',
  source: 'original PDF visual inspection',
  date: '2026-07-23',
});

function range(first, last) {
  return Array.from({ length: last - first + 1 }, (_, index) => first + index);
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${label}: ${error.message}`);
  }
}

function parseBankJs(text, label) {
  const match = /^\s*window\.CAMBRIDGE_TEST_BANK\s*=\s*([\s\S]*);\s*$/.exec(text);
  assert.ok(match, `${label} must assign window.CAMBRIDGE_TEST_BANK`);
  return parseJson(match[1], label);
}

function normalizeRange(value) {
  return String(value).replace(/-/g, '–');
}

function rangeNumbers(value) {
  const match = /^(\d+)(?:[–-](\d+))?$/.exec(String(value));
  assert.ok(match, `Invalid question range: ${value}`);
  return range(Number(match[1]), Number(match[2] ?? match[1]));
}

function questionHeading(value) {
  const normalized = normalizeRange(value);
  return `${rangeNumbers(normalized).length === 1 ? 'Question' : 'Questions'} ${normalized}`;
}

function asEntries(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item, index) => typeof item === 'string'
      ? { label: String(index + 1), text: item }
      : { label: String(item.label), text: String(item.text) });
  }
  return Object.entries(value).map(([label, text]) => ({
    label: String(label),
    text: String(text),
  }));
}

function normalizeType(type) {
  const normalized = String(type).toLowerCase();
  return {
    multiple_choice_single_answer: 'multiple_choice_single',
    multiple_selection_two_answers: 'multiple_response',
    summary_completion_from_word_list: 'summary_completion_with_list',
    note_completion_one_word_only: 'note_completion_one_word',
  }[normalized] ?? normalized;
}

function promptText(question) {
  const text = question.stem
    ?? question.statement
    ?? question.prompt
    ?? question.text;
  assert.ok(String(text ?? '').trim(), `Question ${question.number} has no prompt text`);
  return String(text);
}

function groupPrompts(group) {
  assert.ok(Array.isArray(group.questions), `Questions ${group.range} must contain questions`);
  return group.questions.map((question) => ({
    number: Number(question.number),
    text: promptText(question),
    options: asEntries(question.options),
  }));
}

function optionsForQuestion(group, question) {
  const ownOptions = asEntries(question.options);
  return ownOptions.length ? ownOptions : asEntries(group.options);
}

function pushText(lines, value) {
  if (Array.isArray(value)) {
    for (const item of value) pushText(lines, item);
  } else if (value && typeof value === 'object') {
    if (value.heading !== undefined) pushText(lines, value.heading);
    if (value.items !== undefined) pushText(lines, value.items);
    for (const [key, item] of Object.entries(value)) {
      if (key !== 'heading' && key !== 'items') pushText(lines, item);
    }
  } else if (value !== undefined && value !== null && String(value).trim()) {
    lines.push(String(value));
  }
}

function renderQuestionGroup(group) {
  const lines = [questionHeading(group.range)];
  pushText(lines, group.instructions);
  pushText(lines, group.listTitle);
  pushText(lines, group.tableTitle);
  pushText(lines, group.noteTitle);
  pushText(lines, group.summaryTitle);
  pushText(lines, group.stem);
  pushText(lines, group.tableContent);
  pushText(lines, group.noteText);
  pushText(lines, group.noteSections);
  pushText(lines, group.summaryText);

  const sharedOptions = asEntries(group.options);
  if (sharedOptions.length) {
    lines.push(...sharedOptions.map(({ label, text }) => `${label} ${text}`));
  }

  for (const question of group.questions) {
    const text = promptText(question);
    const prefix = new RegExp(`^${question.number}(?:\\s|[.–-])`).test(text)
      ? ''
      : `${question.number} `;
    lines.push(`${prefix}${text}`);
    if (question.options) {
      lines.push(...asEntries(question.options).map(
        ({ label, text: optionText }) => `${label} ${optionText}`,
      ));
    }
  }
  return lines.join('\n');
}

function paragraphCount(calibration) {
  return calibration.sections.reduce(
    (total, section) => total + section.paragraphs.length,
    0,
  );
}

function readingParagraphs(calibration) {
  const paragraphs = [];
  pushText(paragraphs, calibration.title);
  pushText(paragraphs, calibration.standfirst);
  pushText(paragraphs, calibration.authorNote);
  for (const section of calibration.sections) {
    pushText(paragraphs, section.label);
    pushText(paragraphs, section.paragraphs);
  }
  for (const footnote of calibration.footnotes ?? []) {
    if (typeof footnote === 'string') {
      paragraphs.push(footnote);
    } else {
      paragraphs.push(
        [footnote.marker, footnote.text].filter(Boolean).join(' '),
      );
    }
  }
  return paragraphs;
}

function buildReadingSection(calibration) {
  return {
    kind: 'reading',
    title: `Reading Passage ${calibration.passage}`,
    articleTitle: calibration.title,
    pages: [...calibration.passagePages],
    leadInstruction: calibration.leadInstruction ?? null,
    paragraphs: readingParagraphs(calibration),
    sections: calibration.sections,
    footnotes: calibration.footnotes ?? [],
    images: [],
    imageLinks: [],
  };
}

function buildQuestionSection(group) {
  return {
    kind: 'questions',
    title: questionHeading(group.range),
    type: normalizeType(group.type),
    originalType: group.type,
    pages: [...group.sourcePages],
    paragraphs: [renderQuestionGroup(group)],
    instructions: [...group.instructions],
    prompts: groupPrompts(group),
    options: asEntries(group.options),
    images: [],
    imageLinks: [],
  };
}

function normalizedAnswer(value) {
  if (Array.isArray(value)) return value.map(String);
  return String(value);
}

function answersEqual(left, right) {
  const a = normalizedAnswer(left);
  const b = normalizedAnswer(right);
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a)
      && Array.isArray(b)
      && a.length === b.length
      && a.every((item, index) => item === b[index]);
  }
  return a === b;
}

function officialAnswers(calibration) {
  const embedded = Object.fromEntries(
    calibration.questionGroups.flatMap((group) =>
      group.questions.map((question) => [String(question.number), question.answer]),
    ),
  );
  const explicit = calibration.officialAnswers ?? embedded;
  for (const [number, answer] of Object.entries(embedded)) {
    assert.ok(Object.hasOwn(explicit, number), `Official answer ${number} is missing`);
    assert.ok(
      answersEqual(explicit[number], answer),
      `Question ${number} embedded answer differs from officialAnswers`,
    );
  }
  return explicit;
}

function distractorAnalysis(group, question) {
  if (question.optionAnalysis) return question.optionAnalysis;
  const groupAnalysis = group.optionAnalysis?.[String(question.number)];
  if (groupAnalysis) return groupAnalysis;
  return null;
}

function deriveDistractors(group, question, analysis, answer) {
  if (question.distractors !== undefined) return question.distractors;
  if (question.formalDistractors !== undefined) return question.formalDistractors;
  if (!analysis) return [];
  const accepted = new Set(Array.isArray(answer) ? answer.map(String) : [String(answer)]);
  return Object.entries(analysis)
    .filter(([label, detail]) =>
      !accepted.has(label)
      && !(detail && typeof detail === 'object' && detail.correct === true)
    )
    .map(([label]) => label);
}

function answerTextFor(answer, options, question) {
  if (question.answerText) return String(question.answerText);
  const labels = Array.isArray(answer) ? answer.map(String) : [String(answer)];
  const texts = labels.map((label) =>
    options.find((option) => option.label === label)?.text ?? label
  );
  return texts.join(' / ');
}

function buildQuestions(testNumber, calibrations, answerKeyPage) {
  const questions = [];
  for (const calibration of calibrations) {
    const official = officialAnswers(calibration);
    for (const group of calibration.questionGroups) {
      const type = normalizeType(group.type);
      const context = renderQuestionGroup(group);
      const groupNumbers = rangeNumbers(group.range);
      for (const question of group.questions) {
        const number = Number(question.number);
        const answer = official[String(number)];
        const options = optionsForQuestion(group, question);
        const analysis = distractorAnalysis(group, question);
        const distractors = deriveDistractors(group, question, analysis, answer);
        const isUnordered = Array.isArray(answer);
        const acceptedAnswers = isUnordered
          ? answer.map(String)
          : [String(answer)];
        questions.push({
          id: `C16-T${testNumber}-P${calibration.passage}-Q${number}`,
          number,
          passage: calibration.passage,
          type,
          originalType: group.type,
          prompt: promptText(question),
          groupPrompt: group.instructions.join(' '),
          options,
          independentOptions: options.map((option) => ({ ...option })),
          answer: isUnordered ? acceptedAnswers.join(' / ') : acceptedAnswers[0],
          answerText: answerTextFor(answer, options, question),
          acceptedAnswers,
          acceptedAnswerMode: isUnordered ? 'unordered_answer_set' : null,
          answerSetId: isUnordered
            ? `C16-T${testNumber}-P${calibration.passage}-Q${groupNumbers[0]}-${groupNumbers.at(-1)}`
            : null,
          evidence: String(question.evidence),
          evidenceData: {
            text: String(question.evidence),
            sentenceIndices: question.evidenceSentenceIndices ?? [],
          },
          evidenceLocation: `Cambridge IELTS 16 Test ${testNumber}, Reading Passage ${calibration.passage}, page${group.sourcePages.length > 1 ? 's' : ''} ${group.sourcePages.join('–')}`,
          reason: question.rationale
            ?? question.answerAnalysis
            ?? (analysis?.[String(answer)]?.reason ?? null),
          distractors,
          distractorAnalysis: analysis,
          sourcePages: [...group.sourcePages],
          answerKeyPage,
          questionContext: context,
          semanticImages: [],
          imageLinks: [],
        });
      }
    }
  }
  return questions.sort((a, b) => a.number - b.number);
}

function answerKeyText(testNumber, calibrations) {
  const lines = ['Answer key', `TEST ${testNumber} READING`];
  for (const calibration of calibrations) {
    const answers = officialAnswers(calibration);
    const numbers = Object.keys(answers).map(Number).sort((a, b) => a - b);
    lines.push(
      '',
      `Reading Passage ${calibration.passage}, Questions ${numbers[0]}–${numbers.at(-1)}`,
    );
    const emittedSets = new Set();
    for (const number of numbers) {
      const answer = answers[String(number)];
      if (Array.isArray(answer)) {
        const key = answer.join('\u0000');
        if (emittedSets.has(key)) continue;
        emittedSets.add(key);
        const paired = numbers.filter((candidate) =>
          answersEqual(answers[String(candidate)], answer)
        );
        lines.push(`${paired.join('&')} IN EITHER ORDER ${answer.join(' ')}`);
      } else {
        lines.push(`${number} ${answer}`);
      }
    }
  }
  return lines.join('\n');
}

function semanticImages(calibration) {
  return [
    ...(calibration.images ?? []),
    ...(calibration.semanticImages ?? []),
    ...(calibration.semanticImageDecision?.images ?? []),
  ].filter((image) =>
    typeof image === 'string'
    || image.semantic !== false
  );
}

function validateCalibration(target, calibrations) {
  assert.deepEqual(
    calibrations.map((item) => [item.book, item.test, item.passage]),
    [[16, target.test, 1], [16, target.test, 2], [16, target.test, 3]],
    `Test ${target.test} calibration identity mismatch`,
  );

  const pageUnion = [...new Set(calibrations.flatMap((item) => item.sourcePages))]
    .sort((a, b) => a - b);
  assert.deepEqual(
    pageUnion,
    target.sourcePages,
    `Test ${target.test} source pages must match the required range`,
  );

  for (const calibration of calibrations) {
    assert.equal(
      calibration.answerKeyPage,
      target.answerKeyPage,
      `Test ${target.test} Passage ${calibration.passage} answer page mismatch`,
    );
    assert.ok(Array.isArray(calibration.sections) && calibration.sections.length);
    assert.ok(Array.isArray(calibration.sentences) && calibration.sentences.length);
    assert.ok(Array.isArray(calibration.passagePages) && calibration.passagePages.length);
    assert.ok(Array.isArray(calibration.questionGroups) && calibration.questionGroups.length);
    assert.equal(
      semanticImages(calibration).length,
      0,
      `Test ${target.test} Passage ${calibration.passage} unexpectedly requires an image`,
    );
    officialAnswers(calibration);
  }

  const groups = calibrations.flatMap((item) => item.questionGroups);
  assert.deepEqual(
    groups.map((group) => normalizeRange(group.range)),
    expectedGroupRanges[target.test],
    `Test ${target.test} question-group ranges mismatch`,
  );
  const questionNumbers = groups.flatMap((group) => {
    assert.ok(Array.isArray(group.instructions) && group.instructions.length);
    assert.ok(group.instructions.every((item) => String(item).trim()));
    const numbers = group.questions.map((question) => Number(question.number));
    assert.deepEqual(
      numbers,
      rangeNumbers(group.range),
      `Questions ${group.range} are incomplete or out of order`,
    );
    for (const question of group.questions) {
      assert.ok(String(question.evidence ?? '').trim(), `Question ${question.number} has no evidence`);
      promptText(question);
    }
    return numbers;
  });
  assert.deepEqual(questionNumbers, range(1, 40), `Test ${target.test} must cover Q1–40`);
}

function buildTest(target, calibrations) {
  validateCalibration(target, calibrations);
  const readingSections = [];
  for (const calibration of calibrations) {
    readingSections.push(buildReadingSection(calibration));
    readingSections.push(...calibration.questionGroups.map(buildQuestionSection));
  }
  const questions = buildQuestions(target.test, calibrations, target.answerKeyPage);
  const readingOnly = readingSections.filter((section) => section.kind === 'reading');
  const questionOnly = readingSections.filter((section) => section.kind === 'questions');
  const keyText = answerKeyText(target.test, calibrations);
  const passageTitles = calibrations.map((calibration) => ({
    passage: calibration.passage,
    title: calibration.title,
    titleStatus: 'present_in_source',
  }));

  assert.equal(readingOnly.length, 3, `Test ${target.test} must have 3 reading sections`);
  assert.equal(
    questionOnly.length,
    expectedGroupRanges[target.test].length,
    `Test ${target.test} question-section count mismatch`,
  );
  assert.equal(questions.length, 40, `Test ${target.test} must have 40 questions`);
  assert.deepEqual(questions.map((question) => question.number), range(1, 40));
  for (const question of questions) {
    assert.ok(question.answer);
    assert.ok(question.acceptedAnswers.length);
    assert.ok(question.evidence);
    assert.notEqual(question.distractors, undefined);
    assert.equal(question.answerKeyPage, target.answerKeyPage);
    assert.deepEqual(question.semanticImages, []);
  }

  return {
    source: `Cambridge IELTS 16 Test ${target.test} manually calibrated against original PDF pages`,
    draftStatus: 'calibrated',
    parseConfidence: 'manually_calibrated',
    calibration: { ...metadata },
    pdf: 'data/Cambridge-IELTS-16.pdf',
    answerKeyText: keyText,
    answerKeyPages: [target.answerKeyPage],
    answerKeyPrintedPage: target.answerKeyPrintedPage,
    mode: 'reading',
    id: target.id,
    title: `Cambridge IELTS 16 Reading Test ${target.test}`,
    durationSec: 3600,
    passageTitle: passageTitles.map((item) => item.title).join('; '),
    passageTitles,
    passage: readingOnly.flatMap((section) => section.paragraphs).join('\n\n'),
    rawOcrText: readingSections.flatMap((section) => section.paragraphs).join('\n\n'),
    readingSections,
    questions,
    questionText: questionOnly.flatMap((section) => section.paragraphs).join('\n\n'),
    sourcePages: [...target.sourcePages],
    semanticImagesRequired: false,
    images: [],
    imageLinks: [],
    calibratedPassages: calibrations.map((calibration) => ({
      passage: calibration.passage,
      title: calibration.title,
      titleStatus: 'present_in_source',
      sourcePages: [...calibration.sourcePages],
      passagePages: [...calibration.passagePages],
      questionPages: [...calibration.questionPages],
      sentenceCount: calibration.sentences.length,
      answerKeyPage: target.answerKeyPage,
      images: [],
    })),
  };
}

function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

function stableTestDigests(bank, excludedIds) {
  return bank.tests
    .filter((test) => !excludedIds.has(test.id))
    .map((test) => [test.id, digest(JSON.stringify(test))]);
}

function updateManifest(manifest, calibrationSets) {
  for (const target of targets) {
    const calibrations = calibrationSets.get(target.test);
    for (const calibration of calibrations) {
      const entry = manifest.generated.find((item) =>
        String(item.book) === '16'
        && Number(item.test) === target.test
        && Number(item.passage) === calibration.passage
      );
      assert.ok(entry, `Manifest entry missing for Test ${target.test} Passage ${calibration.passage}`);
      const relativeFile = `data/generated/intensive-reading/cambridge-16-18/Cambridge-IELTS-16-Test-${target.test}-Passage-${calibration.passage}-双语精读.md`;
      assert.equal(entry.file, relativeFile, `Unexpected lesson path for Test ${target.test} Passage ${calibration.passage}`);
      const lessonPath = path.join(
        lessonDirectory,
        `Cambridge-IELTS-16-Test-${target.test}-Passage-${calibration.passage}-双语精读.md`,
      );
      entry.file = relativeFile;
      entry.source = 'original_pdf_manually_calibrated';
      entry.recoveredPath = null;
      entry.paragraphCount = paragraphCount(calibration);
      entry.questionSectionCount = calibration.questionGroups.length;
      entry.sentenceCount = calibration.sentences.length;
      entry.sourcePages = [...calibration.sourcePages];
      entry.answerKeyPage = target.answerKeyPage;
      entry.quality_revision = 'calibrated_sentence_fidelity_cefr_questions_v3';
      entry.sha256 = lessonPath;
    }
  }
}

const calibrationPaths = targets.flatMap((target) =>
  [1, 2, 3].map((passage) => path.join(
    root,
    'work',
    `c16-t${target.test}-p${passage}-calibration.json`,
  ))
);
const [
  calibrationTexts,
  primaryText,
  reportText,
  jsText,
  manifestText,
] = await Promise.all([
  Promise.all(calibrationPaths.map((file) => readFile(file, 'utf8'))),
  readFile(bankPaths.primary, 'utf8'),
  readFile(bankPaths.report, 'utf8'),
  readFile(bankPaths.js, 'utf8'),
  readFile(manifestPath, 'utf8'),
]);

const calibrationSets = new Map();
for (const target of targets) {
  const offset = targets.indexOf(target) * 3;
  calibrationSets.set(
    target.test,
    calibrationTexts.slice(offset, offset + 3).map((text, index) =>
      parseJson(text, calibrationPaths[offset + index])
    ),
  );
}

const primaryBank = parseJson(primaryText, bankPaths.primary);
const reportBank = parseJson(reportText, bankPaths.report);
const jsBank = parseBankJs(jsText, bankPaths.js);
assert.deepEqual(reportBank, primaryBank, 'Report bank differs from primary bank before integration');
assert.deepEqual(jsBank, primaryBank, 'JS bank differs from primary bank before integration');
assert.ok(Array.isArray(primaryBank.tests), 'Bank must contain tests');

const targetIds = new Set(targets.map((target) => target.id));
const beforeNonTargetDigests = stableTestDigests(primaryBank, targetIds);
const beforeTestIds = primaryBank.tests.map((test) => test.id);
for (const target of targets) {
  const indexes = primaryBank.tests
    .map((test, index) => test.id === target.id ? index : -1)
    .filter((index) => index >= 0);
  assert.equal(indexes.length, 1, `Expected one ${target.id}`);
  primaryBank.tests[indexes[0]] = buildTest(
    target,
    calibrationSets.get(target.test),
  );
}
assert.deepEqual(primaryBank.tests.map((test) => test.id), beforeTestIds);
assert.deepEqual(
  stableTestDigests(primaryBank, targetIds),
  beforeNonTargetDigests,
  'A non-target test changed during integration',
);

const manifest = parseJson(manifestText, manifestPath);
assert.ok(Array.isArray(manifest.generated), 'C16 manifest must contain generated[]');
updateManifest(manifest, calibrationSets);
for (const entry of manifest.generated.filter((item) =>
  String(item.book) === '16' && Number(item.test) <= 2
)) {
  const absolutePath = path.join(root, entry.file);
  const lessonText = await readFile(absolutePath);
  entry.sha256 = digest(lessonText);
  assert.match(entry.sha256, /^[0-9a-f]{64}$/);
}

const bankOutput = `${JSON.stringify(primaryBank, null, 2)}\n`;
const reportOutput = bankOutput;
const jsOutput = `window.CAMBRIDGE_TEST_BANK = ${bankOutput.trim()};\n`;
const manifestOutput = `${JSON.stringify(manifest, null, 2)}\n`;
assert.deepEqual(parseJson(bankOutput, 'generated bank'), primaryBank);
assert.deepEqual(parseJson(reportOutput, 'generated report bank'), primaryBank);
assert.deepEqual(parseBankJs(jsOutput, 'generated JS bank'), primaryBank);
assert.deepEqual(parseJson(manifestOutput, 'generated C16 manifest'), manifest);

const result = {
  dryRun: process.argv.includes('--dry-run'),
  tests: targets.map((target) => {
    const test = primaryBank.tests.find((item) => item.id === target.id);
    return {
      id: target.id,
      sourcePages: test.sourcePages,
      answerKeyPages: test.answerKeyPages,
      readingSections: test.readingSections.filter((section) => section.kind === 'reading').length,
      questionSections: test.readingSections.filter((section) => section.kind === 'questions').length,
      questions: test.questions.length,
      answered: test.questions.filter((question) => question.answer).length,
      images: test.images.length,
    };
  }),
  nonTargetTestsUnchanged: true,
  mirrorsEqual: true,
  manifestEntries: manifest.generated
    .filter((item) => String(item.book) === '16' && Number(item.test) <= 2)
    .map((item) => ({
      test: item.test,
      passage: item.passage,
      sentenceCount: item.sentenceCount,
      sourcePages: item.sourcePages,
      answerKeyPage: item.answerKeyPage,
      sha256: item.sha256,
    })),
};

if (result.dryRun) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// Sequential writes avoid concurrent truncation of the three large bank mirrors.
await writeFile(bankPaths.primary, bankOutput, 'utf8');
await writeFile(bankPaths.report, reportOutput, 'utf8');
await writeFile(bankPaths.js, jsOutput, 'utf8');
await writeFile(manifestPath, manifestOutput, 'utf8');

const [writtenPrimary, writtenReport, writtenJs, writtenManifest] = await Promise.all([
  readFile(bankPaths.primary, 'utf8'),
  readFile(bankPaths.report, 'utf8'),
  readFile(bankPaths.js, 'utf8'),
  readFile(manifestPath, 'utf8'),
]);
const parsedPrimary = parseJson(writtenPrimary, bankPaths.primary);
assert.deepEqual(parseJson(writtenReport, bankPaths.report), parsedPrimary);
assert.deepEqual(parseBankJs(writtenJs, bankPaths.js), parsedPrimary);
assert.deepEqual(parseJson(writtenManifest, manifestPath), manifest);
assert.deepEqual(
  stableTestDigests(parsedPrimary, targetIds),
  beforeNonTargetDigests,
  'A non-target test changed after writing',
);

console.log(JSON.stringify(result, null, 2));
