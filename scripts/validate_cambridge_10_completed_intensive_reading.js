const fs = require('fs');
const path = require('path');

const root = process.cwd();
const baseDir = path.join(root, 'data', 'generated', 'intensive-reading', 'cambridge-10-12');
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
  'sourcePages=',
  'partial source',
  '节选恢复版',
  'coundwater',
  'P=ssage',
  'soiely',
  'investrent',
];

const specs = [
  {
    file: 'Cambridge-IELTS-10-Test-1-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-10-test-1-passage-1-page-009.png',
      'cambridge-ielts-10-test-1-passage-1-page-010.png',
      'cambridge-ielts-10-test-1-passage-1-page-011.png',
      'cambridge-ielts-10-test-1-passage-1-page-012.png',
      'cambridge-ielts-10-answer-key-page-144.png',
    ],
    answers: {
      1: 'FALSE',
      2: 'TRUE',
      3: 'NOT GIVEN',
      4: 'NOT GIVEN',
      5: 'TRUE',
      6: 'pavilions',
      7: 'drought',
      8: 'tourists',
      9: 'earthquake',
      10: '4/four sides',
      11: 'tank',
      12: 'verandas/verandahs',
      13: 'underwater',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-1-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-10-test-1-passage-2-page-013.png',
      'cambridge-ielts-10-test-1-passage-2-page-014.png',
      'cambridge-ielts-10-test-1-passage-2-page-015.png',
      'cambridge-ielts-10-test-1-passage-2-page-016.png',
      'cambridge-ielts-10-answer-key-page-144.png',
    ],
    answers: {
      14: 'viii',
      15: 'iii',
      16: 'xi',
      17: 'i',
      18: 'v',
      19: 'x',
      20: 'ii',
      21: 'iv',
      22: 'TRUE',
      23: 'FALSE',
      24: 'NOT GIVEN',
      25: 'NOT GIVEN',
      26: 'FALSE',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-1-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-10-test-1-passage-3-page-017.png',
      'cambridge-ielts-10-test-1-passage-3-page-018.png',
      'cambridge-ielts-10-test-1-passage-3-page-019.png',
      'cambridge-ielts-10-test-1-passage-3-page-020.png',
      'cambridge-ielts-10-test-1-passage-3-page-021.png',
      'cambridge-ielts-10-answer-key-page-144.png',
    ],
    answers: {
      27: 'C',
      28: 'A',
      29: 'D',
      30: 'B',
      31: 'G',
      32: 'E',
      33: 'A',
      34: 'F',
      35: 'B',
      36: 'NO',
      37: 'YES',
      38: 'NOT GIVEN',
      39: 'NOT GIVEN',
      40: 'NO',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-2-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-10-test-2-passage-1-page-033.png',
      'cambridge-ielts-10-test-2-passage-1-page-034.png',
      'cambridge-ielts-10-test-2-passage-1-page-035.png',
      'cambridge-ielts-10-test-2-passage-1-page-036.png',
      'cambridge-ielts-10-answer-key-page-146.png',
    ],
    answers: {
      1: 'iv',
      2: 'viii',
      3: 'vii',
      4: 'i',
      5: 'vi',
      6: 'ix',
      7: 'ii',
      8: 'NOT GIVEN',
      9: 'TRUE',
      10: 'FALSE',
      11: 'FALSE',
      12: 'NOT GIVEN',
      13: 'TRUE',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-2-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-10-test-2-passage-2-page-037.png',
      'cambridge-ielts-10-test-2-passage-2-page-038.png',
      'cambridge-ielts-10-test-2-passage-2-page-039.png',
      'cambridge-ielts-10-test-2-passage-2-page-040.png',
      'cambridge-ielts-10-answer-key-page-146.png',
    ],
    answers: {
      14: 'A',
      15: 'D',
      16: 'F',
      17: 'D',
      18: 'B',
      19: 'D',
      20: 'E',
      21: 'A',
      22: 'C',
      23: 'books (and) activities',
      24: 'internal regulation / self-regulation',
      25: 'emotional awareness',
      26: 'spoon-feeding',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-2-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-10-test-2-passage-3-page-041.png',
      'cambridge-ielts-10-test-2-passage-3-page-042.png',
      'cambridge-ielts-10-test-2-passage-3-page-043.png',
      'cambridge-ielts-10-test-2-passage-3-page-044.png',
      'cambridge-ielts-10-test-2-passage-3-page-045.png',
      'cambridge-ielts-10-test-2-passage-3-page-046.png',
      'cambridge-ielts-10-answer-key-page-146.png',
    ],
    answers: {
      27: 'B',
      28: 'H',
      29: 'L',
      30: 'G',
      31: 'D',
      32: 'C',
      33: 'D',
      34: 'A',
      35: 'D',
      36: 'NOT GIVEN',
      37: 'NO',
      38: 'YES',
      39: 'NOT GIVEN',
      40: 'NO',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-3-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-10-test-3-passage-1-page-056.png',
      'cambridge-ielts-10-test-3-passage-1-page-057.png',
      'cambridge-ielts-10-test-3-passage-1-page-058.png',
      'cambridge-ielts-10-test-3-passage-1-page-059.png',
      'cambridge-ielts-10-answer-key-page-148.png',
    ],
    answers: {
      1: 'ii',
      2: 'i',
      3: 'v',
      4: 'vii',
      5: 'TRUE',
      6: 'NOT GIVEN',
      7: 'NOT GIVEN',
      8: 'TRUE',
      9: 'NOT GIVEN',
      10: 'FALSE',
      11: 'source of income / industry',
      12: 'employer',
      13: 'domestic tourism',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-3-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-10-test-3-passage-2-page-060.png',
      'cambridge-ielts-10-test-3-passage-2-page-061.png',
      'cambridge-ielts-10-test-3-passage-2-page-062.png',
      'cambridge-ielts-10-test-3-passage-2-page-063.png',
      'cambridge-ielts-10-answer-key-page-148.png',
    ],
    answers: {
      14: 'C',
      15: 'B',
      16: 'H',
      17: 'B',
      18: 'E',
      19: 'sun(light)',
      20: 'upper',
      21: 'dry',
      22: 'north',
      23: 'FALSE',
      24: 'TRUE',
      25: 'NOT GIVEN',
      26: 'B',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-3-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-10-test-3-passage-3-page-064.png',
      'cambridge-ielts-10-test-3-passage-3-page-065.png',
      'cambridge-ielts-10-test-3-passage-3-page-066.png',
      'cambridge-ielts-10-test-3-passage-3-page-067.png',
      'cambridge-ielts-10-test-3-passage-3-page-068.png',
      'cambridge-ielts-10-answer-key-page-148.png',
    ],
    answers: {
      27: 'B',
      28: 'F',
      29: 'I',
      30: 'G',
      31: 'D',
      32: 'C',
      33: 'A',
      34: 'D',
      35: 'C',
      36: 'NO',
      37: 'YES',
      38: 'NOT GIVEN',
      39: 'YES',
      40: 'NOT GIVEN',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-4-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-10-test-4-passage-1-page-080.png',
      'cambridge-ielts-10-test-4-passage-1-page-081.png',
      'cambridge-ielts-10-test-4-passage-1-page-082.png',
      'cambridge-ielts-10-test-4-passage-1-page-083.png',
      'cambridge-ielts-10-answer-key-page-150.png',
    ],
    answers: {
      1: 'spread',
      2: '10/ten times',
      3: 'below',
      4: 'fuel',
      5: 'seasons',
      6: 'homes/housing',
      7: 'TRUE',
      8: 'FALSE',
      9: 'TRUE',
      10: 'TRUE',
      11: 'NOT GIVEN',
      12: 'FALSE',
      13: 'FALSE',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-4-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-10-test-4-passage-2-page-084.png',
      'cambridge-ielts-10-test-4-passage-2-page-085.png',
      'cambridge-ielts-10-test-4-passage-2-page-086.png',
      'cambridge-ielts-10-test-4-passage-2-page-087.png',
      'cambridge-ielts-10-test-4-passage-2-page-088.png',
      'cambridge-ielts-10-answer-key-page-150.png',
    ],
    answers: {
      14: 'transformation/change',
      15: 'young age',
      16: 'optimism',
      17: 'skills/techniques',
      18: 'negative emotions / feelings',
      19: 'E',
      20: 'C',
      21: 'G',
      22: 'A',
      23: 'E',
      24: 'C',
      25: 'G',
      26: 'H',
    },
  },
  {
    file: 'Cambridge-IELTS-10-Test-4-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-10-test-4-passage-3-page-089.png',
      'cambridge-ielts-10-test-4-passage-3-page-090.png',
      'cambridge-ielts-10-test-4-passage-3-page-091.png',
      'cambridge-ielts-10-test-4-passage-3-page-092.png',
      'cambridge-ielts-10-answer-key-page-150.png',
    ],
    answers: {
      27: 'C',
      28: 'D',
      29: 'C',
      30: 'B',
      31: 'A',
      32: 'F',
      33: 'G',
      34: 'A',
      35: 'B',
      36: 'D',
      37: 'NOT GIVEN',
      38: 'YES',
      39: 'NO',
      40: 'YES',
    },
  },
];

const errors = [];

for (const spec of specs) {
  const filePath = path.join(baseDir, spec.file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing file: ${spec.file}`);
    continue;
  }

  const text = fs.readFileSync(filePath, 'utf8');

  for (const section of requiredSections) {
    if (!text.includes(section)) {
      errors.push(`${spec.file}: missing section ${section}`);
    }
  }

  for (const marker of staleMarkers) {
    if (text.includes(marker)) {
      errors.push(`${spec.file}: stale marker found: ${marker}`);
    }
  }

  if (/!\[[^\]]*\]\([^)]*(?:answer-)?page-\d{3}\.png\)/i.test(text)) {
    errors.push(`${spec.file}: full-page source screenshots must not be embedded`);
  }

  for (const [number, answer] of Object.entries(spec.answers)) {
    const pattern = new RegExp(`\\|\\s*${number}\\s*\\|\\s*${escapeRegExp(answer)}\\s*\\|`);
    if (!pattern.test(text)) {
      errors.push(`${spec.file}: missing answer row ${number} = ${answer}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${specs.length} Cambridge IELTS 10 completed intensive-reading files.`);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
