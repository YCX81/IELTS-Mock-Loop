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
    file: 'Cambridge-IELTS-08-Test-1-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-08-test-1-passage-1-page-017.png',
      'cambridge-ielts-08-test-1-passage-1-page-018.png',
      'cambridge-ielts-08-test-1-passage-1-page-019.png',
      'cambridge-ielts-08-test-1-passage-1-page-020.png',
      'cambridge-ielts-08-answer-key-page-152.png',
    ],
    answers: {
      1: 'D',
      2: 'B',
      3: 'F',
      4: 'E',
      5: 'B',
      6: 'F',
      7: 'D',
      8: 'A',
      9: "(ship's) anchor / (an/the) anchor",
      10: '(escape) wheel',
      11: 'tooth',
      12: '(long) pendulum',
      13: 'second',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-1-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-08-test-1-passage-2-page-021.png',
      'cambridge-ielts-08-test-1-passage-2-page-022.png',
      'cambridge-ielts-08-test-1-passage-2-page-023.png',
      'cambridge-ielts-08-test-1-passage-2-page-024.png',
      'cambridge-ielts-08-answer-key-page-152.png',
    ],
    answers: {
      14: 'ii',
      15: 'iii',
      16: 'v',
      17: 'iv',
      18: 'viii',
      19: 'vii',
      20: 'FALSE',
      21: 'FALSE',
      22: 'NOT GIVEN',
      23: 'TRUE',
      24: 'TRUE',
      25: 'FALSE',
      26: 'TRUE',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-1-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-08-test-1-passage-3-page-025.png',
      'cambridge-ielts-08-test-1-passage-3-page-026.png',
      'cambridge-ielts-08-test-1-passage-3-page-027.png',
      'cambridge-ielts-08-test-1-passage-3-page-028.png',
      'cambridge-ielts-08-answer-key-page-152.png',
    ],
    answers: {
      27: 'E',
      28: 'B',
      29: 'A',
      30: 'F',
      31: 'sender',
      32: 'picture / image',
      33: 'receiver',
      34: 'sensory leakage',
      35: '(outright) fraud',
      36: 'computers',
      37: 'human involvement',
      38: 'meta-analysis',
      39: 'lack of consistency',
      40: 'big / large enough',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-2-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-08-test-2-passage-1-page-040.png',
      'cambridge-ielts-08-test-2-passage-1-page-041.png',
      'cambridge-ielts-08-test-2-passage-1-page-042.png',
      'cambridge-ielts-08-test-2-passage-1-page-043.png',
      'cambridge-ielts-08-answer-key-page-154.png',
    ],
    answers: {
      1: 'spinning',
      2: '(perfectly) unblemished',
      3: 'labour/labor-intensive',
      4: 'thickness',
      5: 'marked',
      6: '(molten) glass',
      7: '(molten) tin/metal',
      8: 'rollers',
      9: 'TRUE',
      10: 'NOT GIVEN',
      11: 'FALSE',
      12: 'TRUE',
      13: 'TRUE',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-2-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-08-test-2-passage-2-page-044.png',
      'cambridge-ielts-08-test-2-passage-2-page-045.png',
      'cambridge-ielts-08-test-2-passage-2-page-046.png',
      'cambridge-ielts-08-test-2-passage-2-page-047.png',
      'cambridge-ielts-08-answer-key-page-154.png',
    ],
    answers: {
      14: 'ii',
      15: 'vii',
      16: 'ix',
      17: 'iv',
      18: 'C',
      19: 'B',
      20: 'A',
      21: 'H',
      22: 'G',
      23: 'C',
      24: 'C',
      25: 'A',
      26: 'B',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-2-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-08-test-2-passage-3-page-048.png',
      'cambridge-ielts-08-test-2-passage-3-page-049.png',
      'cambridge-ielts-08-test-2-passage-3-page-050.png',
      'cambridge-ielts-08-test-2-passage-3-page-051.png',
      'cambridge-ielts-08-answer-key-page-154.png',
    ],
    answers: {
      27: 'viii',
      28: 'ii',
      29: 'vi',
      30: 'i',
      31: 'iii',
      32: 'v',
      33: 'C',
      34: 'A',
      35: 'C',
      36: 'D',
      37: 'clothing',
      38: 'vocabulary',
      39: 'chemicals',
      40: 'cultures',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-3-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-08-test-3-passage-1-page-064.png',
      'cambridge-ielts-08-test-3-passage-1-page-065.png',
      'cambridge-ielts-08-test-3-passage-1-page-066.png',
      'cambridge-ielts-08-test-3-passage-1-page-067.png',
      'cambridge-ielts-08-test-3-passage-1-page-068.png',
      'cambridge-ielts-08-answer-key-page-156.png',
    ],
    answers: {
      1: 'D',
      2: 'A',
      3: 'A',
      4: 'power companies',
      5: 'safely',
      6: 'size',
      7: 'B',
      8: 'C',
      9: 'G',
      10: 'D',
      11: 'NO',
      12: 'YES',
      13: 'NOT GIVEN',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-3-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-08-test-3-passage-2-page-069.png',
      'cambridge-ielts-08-test-3-passage-2-page-070.png',
      'cambridge-ielts-08-test-3-passage-2-page-071.png',
      'cambridge-ielts-08-test-3-passage-2-page-072.png',
      'cambridge-ielts-08-answer-key-page-156.png',
    ],
    answers: {
      14: 'B',
      15: 'C',
      16: 'F',
      17: 'H',
      18: 'J',
      19: 'TRUE',
      20: 'FALSE',
      21: 'FALSE',
      22: 'TRUE',
      23: 'TRUE',
      24: 'NOT GIVEN',
      25: 'TRUE',
      26: 'NOT GIVEN',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-3-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-08-test-3-passage-3-page-073.png',
      'cambridge-ielts-08-test-3-passage-3-page-074.png',
      'cambridge-ielts-08-test-3-passage-3-page-075.png',
      'cambridge-ielts-08-test-3-passage-3-page-076.png',
      'cambridge-ielts-08-answer-key-page-156.png',
    ],
    answers: {
      27: 'ix',
      28: 'ii',
      29: 'vii',
      30: 'i',
      31: 'viii',
      32: 'iv',
      33: 'physical chemistry',
      34: 'thermodynamics',
      35: 'adapt',
      36: 'immortality',
      37: 'NO',
      38: 'YES',
      39: 'NOT GIVEN',
      40: 'YES',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-4-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-08-test-4-passage-1-page-087.png',
      'cambridge-ielts-08-test-4-passage-1-page-088.png',
      'cambridge-ielts-08-test-4-passage-1-page-089.png',
      'cambridge-ielts-08-test-4-passage-1-page-090.png',
      'cambridge-ielts-08-test-4-passage-1-page-091.png',
      'cambridge-ielts-08-answer-key-page-158.png',
    ],
    answers: {
      1: 'vii',
      2: 'i',
      3: 'v',
      4: 'ii',
      5: 'viii',
      6: 'YES',
      7: 'NO',
      8: 'NOT GIVEN',
      9: 'NO',
      10: 'B',
      11: 'C',
      12: 'A',
      13: 'C',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-4-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-08-test-4-passage-2-page-092.png',
      'cambridge-ielts-08-test-4-passage-2-page-093.png',
      'cambridge-ielts-08-test-4-passage-2-page-094.png',
      'cambridge-ielts-08-test-4-passage-2-page-095.png',
      'cambridge-ielts-08-answer-key-page-158.png',
    ],
    answers: {
      14: 'B',
      15: 'A',
      16: 'D',
      17: 'D',
      18: 'NOT GIVEN',
      19: 'YES',
      20: 'NO',
      21: 'YES',
      22: 'D',
      23: 'H',
      24: 'C',
      25: 'E',
      26: 'B',
    },
  },
  {
    file: 'Cambridge-IELTS-08-Test-4-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-08-test-4-passage-3-page-096.png',
      'cambridge-ielts-08-test-4-passage-3-page-097.png',
      'cambridge-ielts-08-test-4-passage-3-page-098.png',
      'cambridge-ielts-08-test-4-passage-3-page-099.png',
      'cambridge-ielts-08-answer-key-page-158.png',
    ],
    answers: {
      27: 'TRUE',
      28: 'NOT GIVEN',
      29: 'TRUE',
      30: 'FALSE',
      31: 'A',
      32: 'C',
      33: 'B',
      34: 'D',
      35: 'A',
      36: 'D',
      37: 'heat',
      38: 'leaf litter',
      39: 'screen',
      40: 'alcohol',
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
  console.log(`Validated ${specs.length} Cambridge IELTS 08 completed intensive-reading files.`);
}
