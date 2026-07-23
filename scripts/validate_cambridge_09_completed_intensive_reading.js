const fs = require('fs');
const path = require('path');

const root = process.cwd();
const baseDir = path.join(root, 'data', 'generated', 'intensive-reading', 'cambridge-07-09');
const imageDir = path.join(baseDir, 'images');

const requiredSections = [
  '## 01 逐句精读',
  '## 02 题目与选项精讲',
  '## 03 B1+ 词汇深讲总表',
  '## 04 IELTS 阅读提醒',
  '## 05 答案汇总',
];

const staleMarkers = [
  '双语精读短版',
  '答案键摘要',
  'materialExtension:',
  '素材延申-lite',
  '本文依据本地题库',
  'Endangered_language',
];

const specs = [
  {
    file: 'Cambridge-IELTS-09-Test-1-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-09-test-1-passage-1-page-007.png',
      'cambridge-ielts-09-test-1-passage-1-page-008.png',
      'cambridge-ielts-09-test-1-passage-1-page-009.png',
      'cambridge-ielts-09-test-1-passage-1-page-010.png',
      'cambridge-ielts-09-test-1-passage-1-page-011.png',
      'cambridge-ielts-09-answer-key-page-148.png',
    ],
    answers: {
      1: 'FALSE',
      2: 'NOT GIVEN',
      3: 'FALSE',
      4: 'TRUE',
      5: 'NOT GIVEN',
      6: 'TRUE',
      7: 'NOT GIVEN',
      8: '(the / only) rich',
      9: 'commercial (possibilities)',
      10: 'mauve (was/is)',
      11: '(Robert) Pullar',
      12: '(in) France',
      13: 'malaria (is)',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-1-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-09-test-1-passage-2-page-012.png',
      'cambridge-ielts-09-test-1-passage-2-page-013.png',
      'cambridge-ielts-09-test-1-passage-2-page-014.png',
      'cambridge-ielts-09-test-1-passage-2-page-015.png',
      'cambridge-ielts-09-test-1-passage-2-page-016.png',
      'cambridge-ielts-09-test-1-passage-2-page-017.png',
      'cambridge-ielts-09-answer-key-page-148.png',
    ],
    answers: {
      14: 'iv',
      15: 'vii',
      16: 'i',
      17: 'ii',
      18: 'several billion years',
      19: 'radio (wave/signals)',
      20: '1000 (stars)',
      21: 'YES',
      22: 'YES',
      23: 'NOT GIVEN',
      24: 'NO',
      25: 'NOT GIVEN',
      26: 'NO',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-1-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-09-test-1-passage-3-page-018.png',
      'cambridge-ielts-09-test-1-passage-3-page-019.png',
      'cambridge-ielts-09-test-1-passage-3-page-020.png',
      'cambridge-ielts-09-test-1-passage-3-page-021.png',
      'cambridge-ielts-09-test-1-passage-3-page-022.png',
      'cambridge-ielts-09-test-1-passage-3-page-023.png',
      'cambridge-ielts-09-answer-key-page-148.png',
    ],
    answers: {
      27: 'plants',
      28: 'breathing; reproduction',
      29: 'gills',
      30: 'dolphins',
      31: 'NOT GIVEN',
      32: 'FALSE',
      33: 'TRUE',
      34: '3 measurements',
      35: '(triangular) graph',
      36: 'cluster',
      37: 'amphibious',
      38: 'half way',
      39: 'dry-land tortoises',
      40: 'D',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-2-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-09-test-2-passage-1-page-035.png',
      'cambridge-ielts-09-test-2-passage-1-page-036.png',
      'cambridge-ielts-09-test-2-passage-1-page-037.png',
      'cambridge-ielts-09-test-2-passage-1-page-038.png',
      'cambridge-ielts-09-test-2-passage-1-page-039.png',
      'cambridge-ielts-09-test-2-passage-1-page-040.png',
      'cambridge-ielts-09-answer-key-page-150.png',
    ],
    answers: {
      1: 'H',
      2: 'C',
      3: 'B',
      4: 'I',
      5: 'D',
      6: 'A',
      7: 'two decades',
      8: 'crowd (noise)',
      9: 'invisible (disabilities/disability)',
      10: 'Objective 3',
      11: 'A',
      12: 'C',
      13: 'C',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-2-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-09-test-2-passage-2-page-041.png',
      'cambridge-ielts-09-test-2-passage-2-page-042.png',
      'cambridge-ielts-09-test-2-passage-2-page-043.png',
      'cambridge-ielts-09-test-2-passage-2-page-044.png',
      'cambridge-ielts-09-test-2-passage-2-page-045.png',
      'cambridge-ielts-09-test-2-passage-2-page-046.png',
      'cambridge-ielts-09-answer-key-page-150.png',
    ],
    answers: {
      14: 'F',
      15: 'D',
      16: 'G',
      17: 'E',
      18: 'D',
      19: 'A',
      20: 'B',
      21: 'C',
      22: 'FALSE',
      23: 'FALSE',
      24: 'TRUE',
      25: 'NOT GIVEN',
      26: 'TRUE',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-2-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-09-test-2-passage-3-page-047.png',
      'cambridge-ielts-09-test-2-passage-3-page-048.png',
      'cambridge-ielts-09-test-2-passage-3-page-049.png',
      'cambridge-ielts-09-test-2-passage-3-page-050.png',
      'cambridge-ielts-09-test-2-passage-3-page-051.png',
      'cambridge-ielts-09-test-2-passage-3-page-052.png',
      'cambridge-ielts-09-answer-key-page-150.png',
    ],
    answers: {
      27: 'C',
      28: 'B',
      29: 'D',
      30: 'C',
      31: 'B',
      32: 'YES',
      33: 'YES',
      34: 'NOT GIVEN',
      35: 'NO',
      36: 'NOT GIVEN',
      37: 'NO',
      38: 'A',
      39: 'B',
      40: 'C',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-3-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-09-test-3-passage-1-page-064.png',
      'cambridge-ielts-09-test-3-passage-1-page-065.png',
      'cambridge-ielts-09-test-3-passage-1-page-066.png',
      'cambridge-ielts-09-test-3-passage-1-page-067.png',
      'cambridge-ielts-09-test-3-passage-1-page-068.png',
      'cambridge-ielts-09-answer-key-page-152.png',
    ],
    answers: {
      1: 'YES',
      2: 'NO',
      3: 'YES',
      4: 'NOT GIVEN',
      5: 'YES',
      6: 'YES',
      7: 'NO',
      8: 'YES',
      9: 'H',
      10: 'F',
      11: 'A',
      12: 'C',
      13: 'B',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-3-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-09-test-3-passage-2-page-069.png',
      'cambridge-ielts-09-test-3-passage-2-page-070.png',
      'cambridge-ielts-09-test-3-passage-2-page-071.png',
      'cambridge-ielts-09-test-3-passage-2-page-072.png',
      'cambridge-ielts-09-test-3-passage-2-page-073.png',
      'cambridge-ielts-09-answer-key-page-152.png',
    ],
    answers: {
      14: 'C',
      15: 'E',
      16: 'A',
      17: 'C',
      18: 'A',
      19: 'D',
      20: 'E',
      21: 'F',
      22: 'J',
      23: 'maintenance',
      24: 'slow (turning)',
      25: 'low pressure',
      26: 'cavitation',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-3-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-09-test-3-passage-3-page-074.png',
      'cambridge-ielts-09-test-3-passage-3-page-075.png',
      'cambridge-ielts-09-test-3-passage-3-page-076.png',
      'cambridge-ielts-09-test-3-passage-3-page-077.png',
      'cambridge-ielts-09-test-3-passage-3-page-078.png',
      'cambridge-ielts-09-test-3-passage-3-page-079.png',
      'cambridge-ielts-09-answer-key-page-152.png',
    ],
    answers: {
      27: 'D',
      28: 'F',
      29: 'B',
      30: 'E',
      31: 'A',
      32: 'C',
      33: 'Jupiter; Saturn',
      34: 'Solar System',
      35: 'sensors; circuits',
      36: 'spares',
      37: 'radio dish',
      38: 'TRUE',
      39: 'TRUE',
      40: 'FALSE',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-4-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-09-test-4-passage-1-page-093.png',
      'cambridge-ielts-09-test-4-passage-1-page-094.png',
      'cambridge-ielts-09-test-4-passage-1-page-095.png',
      'cambridge-ielts-09-test-4-passage-1-page-096.png',
      'cambridge-ielts-09-test-4-passage-1-page-097.png',
      'cambridge-ielts-09-answer-key-page-154.png',
    ],
    answers: {
      1: 'FALSE',
      2: 'NOT GIVEN',
      3: 'TRUE',
      4: 'FALSE',
      5: 'TRUE',
      6: 'NOT GIVEN',
      7: 'thorium',
      8: 'pitchblende',
      9: 'radium',
      10: 'soldiers',
      11: 'illness',
      12: 'neutron',
      13: 'leukaemia/leukemia',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-4-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-09-test-4-passage-2-page-098.png',
      'cambridge-ielts-09-test-4-passage-2-page-099.png',
      'cambridge-ielts-09-test-4-passage-2-page-100.png',
      'cambridge-ielts-09-test-4-passage-2-page-101.png',
      'cambridge-ielts-09-test-4-passage-2-page-102.png',
      'cambridge-ielts-09-test-4-passage-2-page-103.png',
      'cambridge-ielts-09-answer-key-page-154.png',
    ],
    answers: {
      14: 'G',
      15: 'C',
      16: 'G',
      17: 'D',
      18: 'H',
      19: 'E',
      20: 'D',
      21: 'B',
      22: 'E',
      23: 'C',
      24: 'mirror',
      25: 'communication',
      26: 'ownership',
    },
  },
  {
    file: 'Cambridge-IELTS-09-Test-4-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-09-test-4-passage-3-page-104.png',
      'cambridge-ielts-09-test-4-passage-3-page-105.png',
      'cambridge-ielts-09-test-4-passage-3-page-106.png',
      'cambridge-ielts-09-test-4-passage-3-page-107.png',
      'cambridge-ielts-09-test-4-passage-3-page-108.png',
      'cambridge-ielts-09-test-4-passage-3-page-109.png',
      'cambridge-ielts-09-test-4-passage-3-page-110.png',
      'cambridge-ielts-09-answer-key-page-154.png',
    ],
    answers: {
      27: 'ii',
      28: 'vi',
      29: 'i',
      30: 'iii',
      31: 'B',
      32: 'A',
      33: 'D',
      34: 'D',
      35: 'C',
      36: 'B',
      37: 'FALSE',
      38: 'NOT GIVEN',
      39: 'FALSE',
      40: 'TRUE',
    },
  },
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function normalize(value) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[。；;]+$/g, '')
    .trim();
}

function parseAnswerRows(markdown) {
  const answers = new Map();
  const rowPattern = /^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|$/gm;
  let match;
  while ((match = rowPattern.exec(markdown)) !== null) {
    answers.set(Number(match[1]), normalize(match[2]));
  }
  return answers;
}

for (const spec of specs) {
  const filePath = path.join(baseDir, spec.file);
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${spec.file}`);
    continue;
  }

  const markdown = fs.readFileSync(filePath, 'utf8');

  for (const section of requiredSections) {
    if (!markdown.includes(section)) {
      fail(`${spec.file}: missing section ${section}`);
    }
  }

  for (const marker of staleMarkers) {
    if (markdown.includes(marker)) {
      fail(`${spec.file}: stale marker found: ${marker}`);
    }
  }

  if (/!\[[^\]]*\]\([^)]*(?:answer-)?page-\d{3}\.png\)/i.test(markdown)) {
    fail(`${spec.file}: full-page source screenshots must not be embedded`);
  }

  const foundAnswers = parseAnswerRows(markdown);
  for (const [question, answer] of Object.entries(spec.answers)) {
    const found = foundAnswers.get(Number(question));
    if (!found) {
      fail(`${spec.file}: missing answer row ${question}`);
      continue;
    }
    if (normalize(found) !== normalize(answer)) {
      fail(`${spec.file}: answer ${question} expected "${answer}" but found "${found}"`);
    }
  }

  console.log(`${spec.file}: OK`);
}

if (!process.exitCode) {
  console.log(`Validated ${specs.length} Cambridge IELTS 09 completed intensive-reading files.`);
}
