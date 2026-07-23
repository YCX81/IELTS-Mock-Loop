import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');

const paths = {
  calibrations: [1, 2, 3].map((passage) =>
    path.join(
      root,
      'work',
      'calibration',
      'cambridge-14',
      'test-1',
      `passage-${passage}.json`,
    ),
  ),
  pageJson: path.join(
    root,
    'data',
    'generated',
    'page-json',
    'cambridge-ielts-14.pages.json',
  ),
  raw: path.join(
    root,
    'data',
    'generated',
    'text-pages',
    'cambridge-ielts-14.raw.md',
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

const targetTestId = 'cambridge-14-reading-test-1';
const sourcePages = Array.from({ length: 13 }, (_, index) => index + 16);
const answerKeyPage = 120;
const expectedRanges = Object.freeze([
  '1–8',
  '9–13',
  '14–18',
  '19–20',
  '21–22',
  '23–26',
  '27–31',
  '32–35',
  '36–40',
]);

const calibrationMetadata = Object.freeze({
  status: 'manually_calibrated',
  source: 'original PDF visual inspection',
  date: '2026-07-21',
});

const passageSourcePages = Object.freeze({
  1: [16, 17, 18, 19],
  2: [20, 21, 22, 23, 24],
  3: [25, 26, 27, 28],
});

const readingPageByPassage = Object.freeze({
  1: [16, 17],
  2: [20, 21],
  3: [25, 26],
});

const questionPageByRange = Object.freeze({
  '1–8': 18,
  '9–13': 19,
  '14–18': 22,
  '19–20': 22,
  '21–22': 23,
  '23–26': 24,
  '27–31': 27,
  '32–35': 28,
  '36–40': 28,
});

const questionTypeByRange = Object.freeze({
  '1–8': 'notes_completion',
  '9–13': 'true_false_not_given',
  '14–18': 'matching_information',
  '19–20': 'multiple_choice_multiple_answers',
  '21–22': 'multiple_choice_multiple_answers',
  '23–26': 'summary_completion',
  '27–31': 'matching_features',
  '32–35': 'yes_no_not_given',
  '36–40': 'summary_completion',
});

const expectedSimpleAnswers = Object.freeze({
  1: 'creativity',
  2: 'rules',
  3: 'cities',
  6: 'competition',
  7: 'evidence',
  8: 'life',
  9: 'TRUE',
  10: 'TRUE',
  11: 'NOT GIVEN',
  12: 'FALSE',
  13: 'TRUE',
  14: 'E',
  15: 'C',
  16: 'F',
  17: 'C',
  18: 'A',
  23: 'activists',
  24: 'consumerism',
  25: 'leaflets',
  26: 'police',
  27: 'E',
  28: 'D',
  29: 'B',
  30: 'D',
  31: 'C',
  32: 'YES',
  33: 'NO',
  34: 'NO',
  35: 'NOT GIVEN',
  36: 'restaurants',
  37: 'performance',
  38: 'turnover',
  39: 'goals',
  40: 'characteristics',
});

const unorderedAnswersByQuestion = Object.freeze({
  4: ['traffic', 'crime'],
  5: ['traffic', 'crime'],
  19: ['B', 'D'],
  20: ['B', 'D'],
  21: ['D', 'E'],
  22: ['D', 'E'],
});

const answerSetIdByQuestion = Object.freeze({
  4: 'C14-T1-Q4-5',
  5: 'C14-T1-Q4-5',
  19: 'C14-T1-Q19-20',
  20: 'C14-T1-Q19-20',
  21: 'C14-T1-Q21-22',
  22: 'C14-T1-Q21-22',
});

const evidenceByQuestion = Object.freeze({
  1: "Alice's fantasy play is described as helping her take her first steps towards her capacity for creativity.",
  2: 'When Alice settles down with a board game, she learns the need to follow rules and take turns.',
  3: 'Whitebread points out that over half the people in the world now live in cities.',
  4: 'Outdoor play is curtailed by perceptions of risk connected with traffic.',
  5: 'Parents increasingly wish to protect children from becoming victims of crime.',
  6: 'The emphasis on “earlier is better” is leading to greater competition in academic learning and schools.',
  7: 'International bodies often lack the evidence on which to base policies about children’s play.',
  8: 'Researchers want data about the long-term impact of play on the child’s later life.',
  9: 'Self-regulation has been shown to be a key predictor of academic performance.',
  10: 'Observing children at play can assist diagnosis of neurodevelopmental disorders such as autism.',
  11: 'The passage reports better writing after doll play but makes no comparison between girls and boys.',
  12: 'With Lego building, not a single child said they did not know what to write during the project.',
  13: 'Whitebread says the importance of play has been lost in recent decades and it is now treated as trivial or negative.',
  14: 'The 1999 Amsterdam system was prone to vandalism and theft, with bikes regularly going missing.',
  15: 'The council rejected the proposal because it regarded bicycles as belonging to the past and cars as the future.',
  16: 'Schimmelpennink says he did not benefit financially because he never filed for a patent.',
  17: 'His calculation showed each white-bike kilometre would cost the municipality only 10% of its public-transport contribution.',
  18: 'Provo presented the first scheme as an answer to the perceived threats of air pollution and consumerism.',
  19: 'The 1999 plan became possible after attitudes grew more environmentally conscious and the Danish experiment proved feasibility.',
  20: 'The project failed after Postbank abolished the pivotal chip card and the business partner lost interest.',
  21: 'Underground passengers need additional transport to reach their final destination, supporting a bike-sharing scheme.',
  22: 'Amsterdam is regarded as one of the world’s two most cycle-friendly capitals.',
  23: 'Provo is identified as a group of Dutch activists who wanted to change society.',
  24: 'The perceived threats motivating Provo were air pollution and consumerism.',
  25: 'Provo distributed leaflets describing the dangers of cars and inviting use of the white bikes.',
  26: 'The police removed the white bikes almost as soon as they were distributed.',
  27: 'Enz and Siguaw are cited for the need to understand what motivates employees at different career stages so competent staff can be retained.',
  28: 'Ng and Sorensen found that supportive managerial actions make employees feel more obligated to stay with the company.',
  29: 'Lucas says hospitality HR practices do not foster constructive relations or draw out employees’ full potential.',
  30: 'Ng and Sorensen showed that motivating employees to work together increases their obligation to stay.',
  31: 'Maroudas et al. list inadequate benefits, poor conditions, morale and attitudes as well as low compensation among turnover causes.',
  32: 'Poor employee morale and attitudes are explicitly listed among reasons for high turnover.',
  33: 'The writer states that no evidence supports a predisposition to view the work environment negatively.',
  34: 'Herzberg’s account says fulfilling extrinsic needs only reduces dissatisfaction; it does not create satisfaction.',
  35: 'The passage recommends adequate breaks but does not state that staff should choose when to take them.',
  36: 'Tews, Michel and Stafford studied staff from a chain of themed restaurants in the United States.',
  37: 'The study found that fun activities had a favourable impact on performance.',
  38: 'Manager support for fun had a favourable impact in reducing turnover.',
  39: 'Fun must be carefully aligned with organizational goals.',
  40: 'Fun must also be aligned with employee characteristics.',
});

const evidenceLocationByQuestion = Object.freeze({
  1: 'Cambridge IELTS 14 Test 1, Reading Passage 1, opening example (page 16)',
  2: 'Cambridge IELTS 14 Test 1, Reading Passage 1, opening example (page 16)',
  3: 'Cambridge IELTS 14 Test 1, Reading Passage 1, paragraph on changing times (page 16)',
  4: 'Cambridge IELTS 14 Test 1, Reading Passage 1, paragraph on changing times (page 16)',
  5: 'Cambridge IELTS 14 Test 1, Reading Passage 1, paragraph on changing times (page 16)',
  6: 'Cambridge IELTS 14 Test 1, Reading Passage 1, paragraph on changing times (page 16)',
  7: 'Cambridge IELTS 14 Test 1, Reading Passage 1, international-policy paragraph (page 16)',
  8: 'Cambridge IELTS 14 Test 1, Reading Passage 1, Gibson paragraph (page 17)',
  9: 'Cambridge IELTS 14 Test 1, Reading Passage 1, self-regulation paragraph (page 17)',
  10: 'Cambridge IELTS 14 Test 1, Reading Passage 1, Gibson research paragraph (page 17)',
  11: 'Cambridge IELTS 14 Test 1, Reading Passage 1, writing-research paragraph (page 17)',
  12: 'Cambridge IELTS 14 Test 1, Reading Passage 1, Lego study paragraph (page 17)',
  13: 'Cambridge IELTS 14 Test 1, Reading Passage 1, concluding paragraph (page 17)',
  14: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph E (page 21)',
  15: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph C (page 20)',
  16: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph F (page 21)',
  17: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph C (page 20)',
  18: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph A (page 20)',
  19: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph E (page 21)',
  20: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph E (page 21)',
  21: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph G (page 21)',
  22: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph G (page 21)',
  23: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph A (page 20)',
  24: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph A (page 20)',
  25: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph A (page 20)',
  26: 'Cambridge IELTS 14 Test 1, Reading Passage 2, paragraph B (page 20)',
  27: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Enz and Siguaw discussion (page 26)',
  28: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Ng and Sorensen discussion (page 25)',
  29: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Lucas discussion (page 25)',
  30: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Ng and Sorensen discussion (page 25)',
  31: 'Cambridge IELTS 14 Test 1, Reading Passage 3, turnover discussion citing Maroudas et al. (page 25)',
  32: 'Cambridge IELTS 14 Test 1, Reading Passage 3, turnover discussion (page 25)',
  33: 'Cambridge IELTS 14 Test 1, Reading Passage 3, workplace-perception discussion (pages 25–26)',
  34: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Herzberg discussion (page 26)',
  35: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Deery recommendations (page 26)',
  36: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Tews, Michel and Stafford study (page 26)',
  37: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Tews, Michel and Stafford findings (page 26)',
  38: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Tews, Michel and Stafford findings (page 26)',
  39: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Tews, Michel and Stafford findings (page 26)',
  40: 'Cambridge IELTS 14 Test 1, Reading Passage 3, Tews, Michel and Stafford findings (page 26)',
});

const standardOptionsByType = Object.freeze({
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
  matching_information: Array.from({ length: 7 }, (_, index) => ({
    label: String.fromCharCode(65 + index),
    text: `Paragraph ${String.fromCharCode(65 + index)}`,
  })),
});

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${label}: ${error.message}`);
  }
}

function canonicalRange(value) {
  return String(value).replace(/\s*(?:-|–|—)\s*/u, '–');
}

function asInstructions(value) {
  if (Array.isArray(value)) return value.map(String);
  assert.equal(typeof value, 'string', 'Question-group instructions must be a string or array');
  return value.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
}

function asEntries(value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (typeof item === 'string') {
        return { label: String.fromCharCode(65 + index), text: item };
      }
      return {
        label: String(item.label ?? item.letter),
        text: String(item.text),
      };
    });
  }
  return Object.entries(value ?? {}).map(([label, text]) => ({
    label: String(label),
    text: String(text),
  }));
}

function asPrompts(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item !== 'object' || item === null) {
        throw new Error('Array prompts must contain objects with number and text fields');
      }
      return {
        ...item,
        number: Number(item.number),
        text: String(item.text ?? item.prompt),
      };
    });
  }
  return Object.entries(value ?? {}).map(([number, text]) => ({
    number: Number(number),
    text: String(text),
  }));
}

function normalizedGroup(group) {
  const range = canonicalRange(group.range);
  const type = questionTypeByRange[range];
  assert.ok(type, `No question type configured for range ${range}`);
  if (group.type) {
    const declaredType = group.type === 'note_completion'
      ? 'notes_completion'
      : group.type;
    assert.equal(declaredType, type, `Unexpected question type for Questions ${range}`);
  }
  let options = asEntries(group.options);
  if (options.length === 0 && standardOptionsByType[type]) {
    options = standardOptionsByType[type].map((option) => ({ ...option }));
  }
  return {
    ...group,
    range,
    type,
    instructions: asInstructions(group.instructions),
    options,
    prompts: asPrompts(group.prompts ?? group.questions),
  };
}

function normalizeBodyParagraph(paragraph) {
  if (typeof paragraph === 'string') return paragraph;
  const text = String(paragraph.text);
  return paragraph.label ? `${paragraph.label}\n${text}` : text;
}

function calibrationPageEntries(calibration) {
  const pageData = calibration.pageTexts ?? calibration.pages;
  if (Array.isArray(pageData)) {
    return pageData.map((item) => {
      assert.ok(
        item && item.page !== undefined && item.text !== undefined,
        `Passage ${calibration.passage} pages[] entries require page and calibrated text`,
      );
      return [Number(item.page), String(item.text)];
    });
  }
  return Object.entries(pageData ?? {}).map(([page, text]) => [
    Number(page),
    String(text),
  ]);
}

function renderQuestionGroup(group) {
  const lines = [`Questions ${group.range}`, ...group.instructions];
  const promptLines = group.prompts.map(({ number, text }) => `${number} ${text}`);
  const optionLines = group.options.map(({ label, text }) => `${label} ${text}`);
  const contentLines = Array.isArray(group.content)
    ? group.content.map(String)
    : group.content
      ? [String(group.content)]
      : [];

  if (group.title) lines.push(String(group.title));
  if (contentLines.length) lines.push(...contentLines);
  if (group.summary) lines.push(String(group.summary));

  if (group.type === 'matching_features') {
    lines.push(
      ...promptLines,
      String(group.optionsTitle ?? 'List of Researchers'),
      ...optionLines,
    );
  } else if (
    group.type === 'true_false_not_given'
    || group.type === 'yes_no_not_given'
  ) {
    lines.push(...optionLines, ...promptLines);
  } else if (group.type === 'multiple_choice_multiple_answers') {
    if (group.stem) lines.push(String(group.stem));
    lines.push(...optionLines);
  } else if (group.type === 'matching_information') {
    lines.push(...promptLines);
  } else if (contentLines.length === 0 && !group.summary) {
    lines.push(...promptLines);
  }

  return lines.join('\n');
}

function rawAnswerValue(raw) {
  if (raw && typeof raw === 'object') {
    return String(raw.letter ?? raw.answer);
  }
  return String(raw);
}

function answerEntries(calibration) {
  if (Array.isArray(calibration.answers)) {
    return calibration.answers.map((record) => [
      Number(record.number),
      record,
    ]);
  }
  return Object.entries(calibration.answers ?? {}).map(([number, record]) => [
    Number(number),
    record,
  ]);
}

function answerFor(calibration, number) {
  return answerEntries(calibration)
    .find(([candidate]) => candidate === number)?.[1];
}

function flattenedSourcePages(calibration) {
  if (Array.isArray(calibration.sourcePages)) {
    return calibration.sourcePages.map(Number);
  }
  return [
    ...(calibration.sourcePages?.passage ?? []),
    ...(calibration.sourcePages?.questions ?? []),
  ].map(Number);
}

function distractorRationale(type, acceptedAnswers) {
  if (type === 'notes_completion' || type === 'summary_completion') {
    return 'Reject wording that is not copied exactly from the passage, violates the ONE WORD ONLY limit, or does not fit the grammar and meaning of the gap.';
  }
  if (type === 'true_false_not_given' || type === 'yes_no_not_given') {
    return 'The two unaccepted labels fail because one would require a direct contradiction and the other a complete absence of relevant information; the cited evidence establishes the keyed relationship.';
  }
  if (type === 'matching_information') {
    return 'The other paragraph letters do not contain the specific detail in the prompt; the cited paragraph does.';
  }
  if (type === 'matching_features') {
    return 'The other researchers are associated with different findings in the passage; the cited source is the one that makes this claim.';
  }
  return `Only ${acceptedAnswers.join(' or ')} is supported by the cited passage; the remaining options are absent, contradicted, or describe a different scheme.`;
}

function answerRecord(calibration, number, options, type, promptRecord) {
  const raw = answerFor(calibration, number);
  assert.notEqual(raw, undefined, `Missing official answer for question ${number}`);
  const answer = rawAnswerValue(raw);
  const unordered = unorderedAnswersByQuestion[number];
  const suppliedAccepted = raw && typeof raw === 'object'
    ? raw.acceptedAnswers ?? raw.acceptableAnswers
    : promptRecord.acceptedAnswers ?? promptRecord.acceptableAnswers;
  const acceptedAnswers = Array.isArray(suppliedAccepted)
    ? suppliedAccepted.map(String)
    : unordered ?? [answer];
  const optionText = options.find((item) => item.label === answer)?.text;

  return {
    answer,
    answerText: String(
      raw && typeof raw === 'object' && raw.text !== undefined
        ? raw.text
        : optionText ?? answer,
    ),
    acceptedAnswers,
    evidence: String(
      raw && typeof raw === 'object' && raw.evidence
        ? raw.evidence
        : promptRecord.evidence ?? evidenceByQuestion[number],
    ),
    evidenceLocation: String(
      raw && typeof raw === 'object' && (raw.evidenceLocation ?? raw.location)
        ? raw.evidenceLocation ?? raw.location
        : promptRecord.evidenceLocation
          ?? promptRecord.location
          ?? evidenceLocationByQuestion[number],
    ),
    distractors: raw && typeof raw === 'object'
      && (raw.distractors ?? raw.distractorBasis) !== undefined
      ? raw.distractors ?? raw.distractorBasis
      : promptRecord.distractors
        ?? promptRecord.distractorBasis
        ?? distractorRationale(type, acceptedAnswers),
  };
}

function buildReadingSection(calibration) {
  return {
    kind: 'reading',
    title: `Reading Passage ${calibration.passage}`,
    pages: [...readingPageByPassage[calibration.passage]],
    instructions: [String(calibration.overallInstruction)],
    paragraphs: [
      calibration.title,
      ...(calibration.subtitle ? [String(calibration.subtitle)] : []),
      ...calibration.bodyParagraphs.map(normalizeBodyParagraph),
      ...(calibration.footnotes ?? []).map((footnote) =>
        `${footnote.marker ? `${footnote.marker} ` : ''}${footnote.text}`),
    ],
  };
}

function buildQuestionSection(group) {
  return {
    kind: 'questions',
    title: `Questions ${group.range}`,
    pages: [questionPageByRange[group.range]],
    instructions: [...group.instructions],
    questionGroupTitle: group.title ?? null,
    optionsTitle: group.optionsTitle ?? null,
    paragraphs: [renderQuestionGroup(group)],
  };
}

function buildQuestions(calibrations) {
  const questions = [];

  for (const calibration of calibrations) {
    for (const group of calibration.questionGroups) {
      const context = renderQuestionGroup(group);
      for (const promptRecord of group.prompts) {
        const { number, text: prompt } = promptRecord;
        const official = answerRecord(
          calibration,
          number,
          group.options,
          group.type,
          promptRecord,
        );
        if (promptRecord.answer !== undefined) {
          assert.ok(
            official.acceptedAnswers.some(
              (candidate) => candidate.toLowerCase()
                === String(promptRecord.answer).toLowerCase(),
            ),
            `Question ${number} prompt answer disagrees with the official answer map`,
          );
        }
        questions.push({
          id: `C14-T1-P${calibration.passage}-Q${number}`,
          number,
          passage: calibration.passage,
          type: group.type,
          prompt,
          groupPrompt: group.instructions.join(' '),
          options: group.options.map((option) => ({ ...option })),
          independentOptions: group.options.map((option) => ({ ...option })),
          ...official,
          sourcePages: [questionPageByRange[group.range]],
          answerKeyPage,
          questionContext: context,
          rowContext: group.summary ?? group.stem ?? null,
          wordLimit: promptRecord.wordLimit
            ?? group.instructions
              .map((instruction) =>
                instruction.match(
                  /(ONE WORD ONLY|NO MORE THAN [A-Z]+ WORDS?(?: AND\/OR A NUMBER)?)/u,
                )?.[1])
              .find(Boolean)
            ?? null,
          answerSetId: answerSetIdByQuestion[number] ?? null,
        });
      }
    }
  }

  return questions.sort((left, right) => left.number - right.number);
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
    const trailingNewlines = match[2].match(/(?:\r?\n)*$/u)?.[0] ?? '';
    replacements.push({
      start,
      end,
      value: `${text}${trailingNewlines || '\n\n'}`,
    });
  }

  let result = rawText;
  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    result = result.slice(0, replacement.start)
      + replacement.value
      + result.slice(replacement.end);
  }
  return result;
}

function extractRawPages(rawText) {
  const pages = new Map();
  const pattern = /^## Page (\d+)\s*\r?\n([\s\S]*?)(?=^## Page \d+\s*$|(?![\s\S]))/gmu;
  for (const match of rawText.matchAll(pattern)) {
    pages.set(Number(match[1]), match[2].trim().replace(/\r\n/gu, '\n'));
  }
  return pages;
}

function parseJsBank(source) {
  const prefix = 'window.CAMBRIDGE_TEST_BANK = ';
  const trimmed = source.trim();
  assert.ok(
    trimmed.startsWith(prefix) && trimmed.endsWith(';'),
    'JS mirror must use the established window.CAMBRIDGE_TEST_BANK assignment',
  );
  return parseJson(trimmed.slice(prefix.length, -1), paths.bankJs);
}

function validateOfficialAnswers(calibrations) {
  const answers = new Map();
  for (const calibration of calibrations) {
    for (const [number, raw] of answerEntries(calibration)) {
      assert.equal(answers.has(number), false, `Duplicate official answer for question ${number}`);
      answers.set(number, rawAnswerValue(raw));
    }
  }

  assert.deepEqual(
    [...answers.keys()].sort((left, right) => left - right),
    Array.from({ length: 40 }, (_, index) => index + 1),
    'Official answers must cover questions 1–40 exactly once',
  );

  for (const [numberText, expected] of Object.entries(expectedSimpleAnswers)) {
    const number = Number(numberText);
    assert.equal(
      answers.get(number).toLowerCase(),
      expected.toLowerCase(),
      `Unexpected official answer for question ${number}`,
    );
  }
  for (const [numberText, accepted] of Object.entries(unorderedAnswersByQuestion)) {
    const number = Number(numberText);
    assert.ok(
      accepted.some((candidate) => candidate.toLowerCase() === answers.get(number).toLowerCase()),
      `Question ${number} must use one of the official in-either-order answers`,
    );
  }
}

function validateCalibrations(calibrations) {
  assert.deepEqual(
    calibrations.map((item) => item.passage),
    [1, 2, 3],
    'Calibration files must describe Passages 1, 2 and 3 in order',
  );

  for (const calibration of calibrations) {
    assert.equal(calibration.answerKeyPage, answerKeyPage);
    assert.equal(typeof calibration.title, 'string');
    assert.ok(calibration.title.trim(), `Passage ${calibration.passage} has no title`);
    assert.equal(typeof calibration.overallInstruction, 'string');
    assert.ok(
      calibration.overallInstruction.trim(),
      `Passage ${calibration.passage} has no overall instruction`,
    );
    assert.ok(
      Array.isArray(calibration.bodyParagraphs) && calibration.bodyParagraphs.length > 0,
      `Passage ${calibration.passage} has no body paragraphs`,
    );
    assert.deepEqual(
      flattenedSourcePages(calibration),
      passageSourcePages[calibration.passage],
      `Passage ${calibration.passage} has unexpected sourcePages`,
    );
    assert.deepEqual(
      calibration.images ?? [],
      [],
      `Passage ${calibration.passage} must not contain images`,
    );
    assert.equal(calibration.book, 14, 'Calibration book must be 14');
    assert.equal(calibration.test, 1, 'Calibration test must be 1');
    assert.equal(
      calibration.status,
      'manually_calibrated',
      `Passage ${calibration.passage} status must be manually_calibrated`,
    );
    assert.equal(typeof (calibration.pageTexts ?? calibration.pages), 'object');
  }

  const calibratedSourcePages = calibrations
    .flatMap((item) => calibrationPageEntries(item).map(([page]) => page))
    .filter((page) => page !== answerKeyPage)
    .sort((left, right) => left - right);
  assert.deepEqual(
    calibratedSourcePages,
    sourcePages,
    'Calibrations must cover physical pages 16–28 exactly once',
  );

  const groups = calibrations
    .flatMap((calibration) => calibration.questionGroups.map(normalizedGroup));
  assert.equal(groups.length, 9, 'Expected exactly nine question groups');
  assert.deepEqual(
    groups.map((group) => group.range),
    expectedRanges,
    'Unexpected question-group ranges or order',
  );

  const promptNumbers = groups
    .flatMap((group) => group.prompts.map((prompt) => prompt.number))
    .sort((left, right) => left - right);
  assert.deepEqual(
    promptNumbers,
    Array.from({ length: 40 }, (_, index) => index + 1),
    'Question prompts must cover 1–40 exactly once',
  );

  for (const group of groups) {
    assert.ok(group.instructions.length, `Questions ${group.range} has no instructions`);
    for (const prompt of group.prompts) {
      assert.ok(prompt.text.trim(), `Question ${prompt.number} has no prompt text`);
    }
  }

  validateOfficialAnswers(calibrations);
  return groups;
}

function answerKeyTextFrom(calibrations) {
  const pageCandidates = calibrations
    .map((calibration) =>
      calibrationPageEntries(calibration)
        .find(([page]) => page === answerKeyPage)?.[1].trim())
    .filter(Boolean);
  const fallbackCandidates = calibrations
    .flatMap((calibration) => [
      calibration.answerPageText,
      calibration.answerKeyText,
    ])
    .filter(Boolean)
    .map((text) => String(text).trim());
  const unique = [...new Set(
    pageCandidates.length > 0 ? pageCandidates : fallbackCandidates,
  )];
  assert.equal(
    unique.length,
    1,
    'Exactly one calibrated full-page transcription for answer-key page 120 is required',
  );
  return unique[0];
}

function buildStructuredAnswerKeyText(calibrations) {
  const lines = ['Answer key', 'ACADEMIC READING', 'TEST 1', 'READING'];
  for (const calibration of calibrations) {
    const numbers = answerEntries(calibration).map(([number]) => number).sort((a, b) => a - b);
    lines.push(
      '',
      `Reading Passage ${calibration.passage}, Questions ${numbers[0]}–${numbers.at(-1)}`,
    );
    for (const number of numbers) {
      const accepted = unorderedAnswersByQuestion[number];
      lines.push(
        `${number} ${accepted
          ? accepted.join(' / ')
          : rawAnswerValue(answerFor(calibration, number))}`,
      );
    }
  }
  return lines.join('\n');
}

function validateRawAgainstPageJson(rawText, pageDocument) {
  const rawPages = extractRawPages(rawText);
  assert.equal(
    rawPages.size,
    pageDocument.pages.length,
    'raw.md and pages.json must contain the same number of physical pages',
  );
  for (const page of pageDocument.pages) {
    assert.ok(rawPages.has(Number(page.page)), `raw.md is missing Page ${page.page}`);
    assert.equal(
      rawPages.get(Number(page.page)),
      String(page.text).trim().replace(/\r\n/gu, '\n'),
      `raw.md Page ${page.page} must exactly equal pages.json`,
    );
  }
}

const [calibrationTexts, pageJsonText, rawText, bankJsonText] = await Promise.all([
  Promise.all(paths.calibrations.map((file) => readFile(file, 'utf8'))),
  readFile(paths.pageJson, 'utf8'),
  readFile(paths.raw, 'utf8'),
  readFile(paths.bankJson, 'utf8'),
]);

const calibrations = calibrationTexts.map((text, index) =>
  parseJson(text, paths.calibrations[index]));
const normalizedGroups = validateCalibrations(calibrations);
let groupIndex = 0;
for (const calibration of calibrations) {
  calibration.questionGroups = calibration.questionGroups.map(() => normalizedGroups[groupIndex++]);
}

const pageDocument = parseJson(pageJsonText, paths.pageJson);
const bank = parseJson(bankJsonText, paths.bankJson);
assert.ok(Array.isArray(pageDocument.pages), 'Page JSON must contain a pages array');
assert.ok(Array.isArray(bank.tests), 'Test bank must contain a tests array');

const calibratedPageTexts = new Map();
for (const calibration of calibrations) {
  for (const [page, text] of calibrationPageEntries(calibration)) {
    if (page !== answerKeyPage) calibratedPageTexts.set(page, String(text).trim());
  }
}
const calibratedAnswerPageText = answerKeyTextFrom(calibrations);
const answerKeyText = buildStructuredAnswerKeyText(calibrations);
calibratedPageTexts.set(answerKeyPage, calibratedAnswerPageText);

for (const pageNumber of [...sourcePages, answerKeyPage]) {
  const page = pageDocument.pages.find((item) => Number(item.page) === pageNumber);
  assert.ok(page, `Page JSON is missing physical page ${pageNumber}`);
  const text = calibratedPageTexts.get(pageNumber);
  assert.ok(text, `Calibrated physical page ${pageNumber} is empty`);
  page.text = text;
  page.engine = 'manual_visual_calibration';
  page.calibration = { ...calibrationMetadata };
}

const readingSections = [];
for (const calibration of calibrations) {
  readingSections.push(buildReadingSection(calibration));
  readingSections.push(...calibration.questionGroups.map(buildQuestionSection));
}

const questions = buildQuestions(calibrations);
const readingOnlySections = readingSections.filter((section) => section.kind === 'reading');
const questionOnlySections = readingSections.filter((section) => section.kind === 'questions');
const passageTitle = calibrations.map((item) => item.title).join('; ');

const replacementTest = {
  source: 'Cambridge IELTS 14 Test 1 manually calibrated against original PDF pages',
  draftStatus: 'manually_calibrated',
  parseConfidence: 'manually_calibrated',
  pdf: 'data/Cambridge-IELTS-14.pdf',
  answerKeyText,
  answerKeyPages: [answerKeyPage],
  mode: 'reading',
  id: targetTestId,
  title: 'Cambridge IELTS 14 Reading Test 1',
  durationSec: 3600,
  passageTitle,
  passage: readingOnlySections.flatMap((section) => section.paragraphs).join('\n\n'),
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
assert.equal(questionOnlySections.length, 9, 'Expected exactly nine question sections');
assert.equal(readingSections.length, 12, 'Expected twelve combined reading/question sections');
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
  assert.ok(question.acceptedAnswers.length, `Question ${question.number} has no accepted answers`);
  assert.ok(question.evidence, `Question ${question.number} has no evidence`);
  assert.ok(question.evidenceLocation, `Question ${question.number} has no evidence location`);
  assert.ok(question.distractors, `Question ${question.number} has no distractor rationale`);
  assert.deepEqual(question.sourcePages, [questionPageByRange[
    expectedRanges.find((range) => {
      const [first, last] = range.split('–').map(Number);
      return question.number >= first && question.number <= last;
    })
  ]]);
  assert.equal(question.answerKeyPage, answerKeyPage);
}

validateRawAgainstPageJson(updatedRaw, pageDocument);
assert.equal(
  JSON.stringify(replacementTest).includes('images/'),
  false,
  'The replacement test must not contain image references',
);

const pageOutput = `${JSON.stringify(pageDocument, null, 2)}\n`;
const bankOutput = `${JSON.stringify(bank, null, 2)}\n`;
const bankJsOutput = `window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank, null, 2)};\n`;

assert.deepEqual(parseJson(pageOutput, 'generated page output'), pageDocument);
assert.deepEqual(parseJson(bankOutput, 'generated bank output'), bank);
assert.deepEqual(parseJsBank(bankJsOutput), bank);

await writeFile(paths.pageJson, pageOutput, 'utf8');
await writeFile(paths.raw, updatedRaw, 'utf8');
await writeFile(paths.bankJson, bankOutput, 'utf8');
await writeFile(paths.bankReport, bankOutput, 'utf8');
await writeFile(paths.bankJs, bankJsOutput, 'utf8');

const [writtenPageText, writtenRaw, writtenBankText, writtenReport, writtenJs] =
  await Promise.all([
    readFile(paths.pageJson, 'utf8'),
    readFile(paths.raw, 'utf8'),
    readFile(paths.bankJson, 'utf8'),
    readFile(paths.bankReport, 'utf8'),
    readFile(paths.bankJs, 'utf8'),
  ]);
const writtenPageDocument = parseJson(writtenPageText, paths.pageJson);
const writtenBank = parseJson(writtenBankText, paths.bankJson);
const writtenReportBank = parseJson(writtenReport, paths.bankReport);
const writtenJsBank = parseJsBank(writtenJs);

validateRawAgainstPageJson(writtenRaw, writtenPageDocument);
assert.deepEqual(writtenBank, bank, 'Written primary bank differs from validated output');
assert.deepEqual(writtenReportBank, writtenBank, 'Report JSON must mirror primary JSON');
assert.deepEqual(writtenJsBank, writtenBank, 'JS bank must mirror primary JSON');

console.log(JSON.stringify({
  testId: targetTestId,
  calibratedPages: sourcePages,
  answerKeyPage,
  readingSections: readingOnlySections.length,
  questionSections: questionOnlySections.length,
  questions: questions.length,
  images: 0,
  rawPagesMatched: writtenPageDocument.pages.length,
  mirrorsIdentical: true,
}, null, 2));


















