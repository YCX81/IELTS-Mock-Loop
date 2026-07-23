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
  '本文正文来自结构化 bank',
  'sourcePages=',
  'partial source',
  '节选恢复版',
  'System.Collections',
  '$expr',
  '.path)',
];

const specs = [
  {
    file: 'Cambridge-IELTS-11-Test-1-Passage-1-双语精读.md',
    images: [
      'cambridge-ielts-11-test-1-passage-1-page-016.png',
      'cambridge-ielts-11-test-1-passage-1-page-017.png',
      'cambridge-ielts-11-test-1-passage-1-page-018.png',
      'cambridge-ielts-11-answer-key-page-123.png',
    ],
    answers: {
      1: 'tomatoes',
      2: 'urban centres/centers',
      3: 'energy',
      4: 'fossil fuel',
      5: 'artificial',
      6: '(stacked) trays',
      7: '(urban) rooftops',
      8: 'NOT GIVEN',
      9: 'TRUE',
      10: 'FALSE',
      11: 'TRUE',
      12: 'FALSE',
      13: 'TRUE',
    },
  },
  {
    file: 'Cambridge-IELTS-11-Test-1-Passage-2-双语精读.md',
    images: [
      'cambridge-ielts-11-test-1-passage-2-page-019.png',
      'cambridge-ielts-11-test-1-passage-2-page-020.png',
      'cambridge-ielts-11-test-1-passage-2-page-021.png',
      'cambridge-ielts-11-test-1-passage-2-page-022.png',
      'cambridge-ielts-11-answer-key-page-123.png',
    ],
    answers: {
      14: 'FALSE',
      15: 'NOT GIVEN',
      16: 'TRUE',
      17: 'NOT GIVEN',
      18: 'FALSE',
      19: 'TRUE',
      20: 'gates',
      21: 'clamp',
      22: 'axle',
      23: 'cogs',
      24: 'aqueduct',
      25: 'wall',
      26: 'locks',
    },
  },
  {
    file: 'Cambridge-IELTS-11-Test-1-Passage-3-双语精读.md',
    images: [
      'cambridge-ielts-11-test-1-passage-3-page-023.png',
      'cambridge-ielts-11-test-1-passage-3-page-024.png',
      'cambridge-ielts-11-test-1-passage-3-page-025.png',
      'cambridge-ielts-11-test-1-passage-3-page-026.png',
      'cambridge-ielts-11-test-1-passage-3-page-027.png',
      'cambridge-ielts-11-answer-key-page-123.png',
    ],
    answers: {
      27: 'D',
      28: 'B',
      29: 'A',
      30: 'sunshade',
      31: 'iron',
      32: 'algae',
      33: 'clouds',
      34: 'cables',
      35: 'snow',
      36: 'rivers',
      37: 'B',
      38: 'D',
      39: 'C',
      40: 'A',
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

console.log(`Validated ${specs.length} Cambridge IELTS 11 completed intensive-reading files.`);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
