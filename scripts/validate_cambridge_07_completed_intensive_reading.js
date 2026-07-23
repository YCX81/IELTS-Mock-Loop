const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const groupDir = path.join(repoRoot, "data", "generated", "intensive-reading", "cambridge-07-09");

const specs = [
  {
    file: "Cambridge-IELTS-07-Test-1-Passage-1-双语精读.md",
    title: "Let's Go Bats",
    images: [
      ["Cambridge IELTS 07 Test 1 Passage 1 Page 22", "images/cambridge-ielts-07-test-1-passage-1-page-022.png"],
      ["Cambridge IELTS 07 Test 1 Passage 1 Page 23", "images/cambridge-ielts-07-test-1-passage-1-page-023.png"],
      ["Cambridge IELTS 07 Test 1 Passage 1 Page 24", "images/cambridge-ielts-07-test-1-passage-1-page-024.png"],
      ["Cambridge IELTS 07 Test 1 Passage 1 Page 25", "images/cambridge-ielts-07-test-1-passage-1-page-025.png"],
      ["Cambridge IELTS 07 Test 1 Answer Key Page 157", "images/cambridge-ielts-07-answer-key-page-157.png"]
    ],
    answers: {
      1: "B",
      2: "A",
      3: "A",
      4: "E",
      5: "D",
      6: "phantom",
      7: "echoes/obstacles",
      8: "depth",
      9: "submarines",
      10: "natural selection",
      11: "radio waves/echoes",
      12: "mathematical theories",
      13: "zoologist"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-1-Passage-2-双语精读.md",
    title: "Making Every Drop Count",
    images: [
      ["Cambridge IELTS 07 Test 1 Passage 2 Page 26", "images/cambridge-ielts-07-test-1-passage-2-page-026.png"],
      ["Cambridge IELTS 07 Test 1 Passage 2 Page 27", "images/cambridge-ielts-07-test-1-passage-2-page-027.png"],
      ["Cambridge IELTS 07 Test 1 Passage 2 Page 28", "images/cambridge-ielts-07-test-1-passage-2-page-028.png"],
      ["Cambridge IELTS 07 Test 1 Passage 2 Page 29", "images/cambridge-ielts-07-test-1-passage-2-page-029.png"],
      ["Cambridge IELTS 07 Test 1 Answer Key Page 157", "images/cambridge-ielts-07-answer-key-page-157.png"]
    ],
    answers: {
      14: "xi",
      15: "vii",
      16: "v",
      17: "i",
      18: "ix",
      19: "ii",
      20: "x",
      21: "NO",
      22: "YES",
      23: "NOT GIVEN",
      24: "NO",
      25: "YES",
      26: "NOT GIVEN"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-1-Passage-3-双语精读.md",
    title: "Educating Psyche",
    images: [
      ["Cambridge IELTS 07 Test 1 Passage 3 Page 30", "images/cambridge-ielts-07-test-1-passage-3-page-030.png"],
      ["Cambridge IELTS 07 Test 1 Passage 3 Page 31", "images/cambridge-ielts-07-test-1-passage-3-page-031.png"],
      ["Cambridge IELTS 07 Test 1 Passage 3 Page 32", "images/cambridge-ielts-07-test-1-passage-3-page-032.png"],
      ["Cambridge IELTS 07 Test 1 Passage 3 Page 33", "images/cambridge-ielts-07-test-1-passage-3-page-033.png"],
      ["Cambridge IELTS 07 Test 1 Answer Key Page 157", "images/cambridge-ielts-07-answer-key-page-157.png"]
    ],
    answers: {
      27: "D",
      28: "A",
      29: "B",
      30: "C",
      31: "FALSE",
      32: "FALSE",
      33: "TRUE",
      34: "NOT GIVEN",
      35: "NOT GIVEN",
      36: "TRUE",
      37: "F",
      38: "H",
      39: "K",
      40: "G"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-2-Passage-1-双语精读.md",
    title: "Why pagodas don't fall down",
    images: [
      ["Cambridge IELTS 07 Test 2 Passage 1 Page 44", "images/cambridge-ielts-07-test-2-passage-1-page-044.png"],
      ["Cambridge IELTS 07 Test 2 Passage 1 Page 45", "images/cambridge-ielts-07-test-2-passage-1-page-045.png"],
      ["Cambridge IELTS 07 Test 2 Passage 1 Page 46", "images/cambridge-ielts-07-test-2-passage-1-page-046.png"],
      ["Cambridge IELTS 07 Test 2 Passage 1 Page 47", "images/cambridge-ielts-07-test-2-passage-1-page-047.png"],
      ["Cambridge IELTS 07 Test 2 Answer Key Page 159", "images/cambridge-ielts-07-answer-key-page-159.png"]
    ],
    answers: {
      1: "YES",
      2: "NO",
      3: "NOT GIVEN",
      4: "YES",
      5: "B",
      6: "A",
      7: "B",
      8: "C",
      9: "A",
      10: "C",
      11: "D",
      12: "C",
      13: "C"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-2-Passage-2-双语精读.md",
    title: "The True Cost of Food",
    images: [
      ["Cambridge IELTS 07 Test 2 Passage 2 Page 48", "images/cambridge-ielts-07-test-2-passage-2-page-048.png"],
      ["Cambridge IELTS 07 Test 2 Passage 2 Page 49", "images/cambridge-ielts-07-test-2-passage-2-page-049.png"],
      ["Cambridge IELTS 07 Test 2 Passage 2 Page 50", "images/cambridge-ielts-07-test-2-passage-2-page-050.png"],
      ["Cambridge IELTS 07 Test 2 Passage 2 Page 51", "images/cambridge-ielts-07-test-2-passage-2-page-051.png"],
      ["Cambridge IELTS 07 Test 2 Answer Key Page 159", "images/cambridge-ielts-07-answer-key-page-159.png"]
    ],
    answers: {
      14: "E",
      15: "B",
      16: "C",
      17: "B",
      18: "YES",
      19: "NOT GIVEN",
      20: "NO",
      21: "YES",
      22: "food bills/costs",
      23: "(modern) intensive farming",
      24: "organic farming",
      25: "Greener Food Standard",
      26: "farmers and consumers"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-2-Passage-3-双语精读.md",
    title: "Makete Integrated Rural Transport Project",
    images: [
      ["Cambridge IELTS 07 Test 2 Passage 3 Page 52", "images/cambridge-ielts-07-test-2-passage-3-page-052.png"],
      ["Cambridge IELTS 07 Test 2 Passage 3 Page 53", "images/cambridge-ielts-07-test-2-passage-3-page-053.png"],
      ["Cambridge IELTS 07 Test 2 Passage 3 Page 54", "images/cambridge-ielts-07-test-2-passage-3-page-054.png"],
      ["Cambridge IELTS 07 Test 2 Passage 3 Page 55", "images/cambridge-ielts-07-test-2-passage-3-page-055.png"],
      ["Cambridge IELTS 07 Test 2 Passage 3 Page 56", "images/cambridge-ielts-07-test-2-passage-3-page-056.png"],
      ["Cambridge IELTS 07 Test 2 Answer Key Page 159", "images/cambridge-ielts-07-answer-key-page-159.png"]
    ],
    answers: {
      27: "ii",
      28: "v",
      29: "x",
      30: "i",
      31: "NO",
      32: "YES",
      33: "NO",
      34: "YES",
      35: "NOT GIVEN",
      36: "D",
      37: "I",
      38: "G",
      39: "E",
      40: "B"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-3-Passage-1-双语精读.md",
    title: "Ant Intelligence",
    images: [
      ["Cambridge IELTS 07 Test 3 Passage 1 Page 69", "images/cambridge-ielts-07-test-3-passage-1-page-069.png"],
      ["Cambridge IELTS 07 Test 3 Passage 1 Page 70", "images/cambridge-ielts-07-test-3-passage-1-page-070.png"],
      ["Cambridge IELTS 07 Test 3 Passage 1 Page 71", "images/cambridge-ielts-07-test-3-passage-1-page-071.png"],
      ["Cambridge IELTS 07 Test 3 Passage 1 Page 72", "images/cambridge-ielts-07-test-3-passage-1-page-072.png"],
      ["Cambridge IELTS 07 Test 3 Answer Key Page 161", "images/cambridge-ielts-07-answer-key-page-161.png"]
    ],
    answers: {
      1: "FALSE",
      2: "TRUE",
      3: "NOT GIVEN",
      4: "TRUE",
      5: "FALSE",
      6: "NOT GIVEN",
      7: "C",
      8: "M",
      9: "F",
      10: "D",
      11: "N",
      12: "O",
      13: "E"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-3-Passage-2-双语精读.md",
    title: "Population movements and genetics",
    images: [
      ["Cambridge IELTS 07 Test 3 Passage 2 Page 73", "images/cambridge-ielts-07-test-3-passage-2-page-073.png"],
      ["Cambridge IELTS 07 Test 3 Passage 2 Page 74", "images/cambridge-ielts-07-test-3-passage-2-page-074.png"],
      ["Cambridge IELTS 07 Test 3 Passage 2 Page 75", "images/cambridge-ielts-07-test-3-passage-2-page-075.png"],
      ["Cambridge IELTS 07 Test 3 Passage 2 Page 76", "images/cambridge-ielts-07-test-3-passage-2-page-076.png"],
      ["Cambridge IELTS 07 Test 3 Passage 2 Page 77", "images/cambridge-ielts-07-test-3-passage-2-page-077.png"],
      ["Cambridge IELTS 07 Test 3 Answer Key Page 161", "images/cambridge-ielts-07-answer-key-page-161.png"]
    ],
    answers: {
      14: "iv",
      15: "vii",
      16: "x",
      17: "i",
      18: "vi",
      19: "ii",
      20: "E",
      21: "D",
      22: "C",
      23: "B",
      24: "A",
      25: "A",
      26: "A"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-3-Passage-3-双语精读.md",
    title: "Plans to protect the forests of Europe",
    images: [
      ["Cambridge IELTS 07 Test 3 Passage 3 Page 78", "images/cambridge-ielts-07-test-3-passage-3-page-078.png"],
      ["Cambridge IELTS 07 Test 3 Passage 3 Page 79", "images/cambridge-ielts-07-test-3-passage-3-page-079.png"],
      ["Cambridge IELTS 07 Test 3 Passage 3 Page 80", "images/cambridge-ielts-07-test-3-passage-3-page-080.png"],
      ["Cambridge IELTS 07 Test 3 Passage 3 Page 81", "images/cambridge-ielts-07-test-3-passage-3-page-081.png"],
      ["Cambridge IELTS 07 Test 3 Answer Key Page 161", "images/cambridge-ielts-07-answer-key-page-161.png"]
    ],
    answers: {
      27: "NOT GIVEN",
      28: "FALSE",
      29: "TRUE",
      30: "FALSE",
      31: "FALSE",
      32: "FALSE",
      33: "TRUE",
      34: "J",
      35: "A",
      36: "E",
      37: "B",
      38: "G",
      39: "D",
      40: "B"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-4-Passage-1-双语精读.md",
    title: "Pulling strings to build pyramids",
    images: [
      ["Cambridge IELTS 07 Test 4 Passage 1 Page 93", "images/cambridge-ielts-07-test-4-passage-1-page-093.png"],
      ["Cambridge IELTS 07 Test 4 Passage 1 Page 94", "images/cambridge-ielts-07-test-4-passage-1-page-094.png"],
      ["Cambridge IELTS 07 Test 4 Passage 1 Page 95", "images/cambridge-ielts-07-test-4-passage-1-page-095.png"],
      ["Cambridge IELTS 07 Test 4 Answer Key Page 163", "images/cambridge-ielts-07-answer-key-page-163.png"]
    ],
    answers: {
      1: "TRUE",
      2: "FALSE",
      3: "NOT GIVEN",
      4: "TRUE",
      5: "FALSE",
      6: "NOT GIVEN",
      7: "TRUE",
      8: "(wooden) pulleys",
      9: "stone",
      10: "(accomplished) sailors",
      11: "(modern) glider",
      12: "flight",
      13: "messages"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-4-Passage-2-双语精读.md",
    title: "Endless Harvest",
    images: [
      ["Cambridge IELTS 07 Test 4 Passage 2 Page 96", "images/cambridge-ielts-07-test-4-passage-2-page-096.png"],
      ["Cambridge IELTS 07 Test 4 Passage 2 Page 97", "images/cambridge-ielts-07-test-4-passage-2-page-097.png"],
      ["Cambridge IELTS 07 Test 4 Passage 2 Page 98", "images/cambridge-ielts-07-test-4-passage-2-page-098.png"],
      ["Cambridge IELTS 07 Test 4 Passage 2 Page 99", "images/cambridge-ielts-07-test-4-passage-2-page-099.png"],
      ["Cambridge IELTS 07 Test 4 Answer Key Page 163", "images/cambridge-ielts-07-answer-key-page-163.png"]
    ],
    answers: {
      14: "FALSE",
      15: "NOT GIVEN",
      16: "TRUE",
      17: "NOT GIVEN",
      18: "TRUE",
      19: "TRUE",
      20: "FALSE",
      21: "G",
      22: "E",
      23: "B",
      24: "A",
      25: "K",
      26: "F"
    }
  },
  {
    file: "Cambridge-IELTS-07-Test-4-Passage-3-双语精读.md",
    title: "Effects of Noise",
    images: [
      ["Cambridge IELTS 07 Test 4 Passage 3 Page 100", "images/cambridge-ielts-07-test-4-passage-3-page-100.png"],
      ["Cambridge IELTS 07 Test 4 Passage 3 Page 101", "images/cambridge-ielts-07-test-4-passage-3-page-101.png"],
      ["Cambridge IELTS 07 Test 4 Passage 3 Page 102", "images/cambridge-ielts-07-test-4-passage-3-page-102.png"],
      ["Cambridge IELTS 07 Test 4 Passage 3 Page 103", "images/cambridge-ielts-07-test-4-passage-3-page-103.png"],
      ["Cambridge IELTS 07 Test 4 Passage 3 Page 104", "images/cambridge-ielts-07-test-4-passage-3-page-104.png"],
      ["Cambridge IELTS 07 Test 4 Answer Key Page 163", "images/cambridge-ielts-07-answer-key-page-163.png"]
    ],
    answers: {
      27: "D",
      28: "C",
      29: "A",
      30: "B",
      31: "D",
      32: "F",
      33: "I",
      34: "B",
      35: "A",
      36: "D",
      37: "A",
      38: "E",
      39: "B",
      40: "C"
    }
  }
];

const banned = [
  /双语精读短版/,
  /答案键摘要/,
  /materialExtension:/,
  /素材延申-lite/,
  /本文依据本地题库/,
  /Endangered_language/i
];
const errors = [];

function fail(message) {
  errors.push(message);
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) {
    fail(`${label}: missing ${needle}`);
  }
}

function parseAnswerRows(markdown) {
  const rows = {};
  for (const match of markdown.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|/gm)) {
    rows[Number(match[1])] = normalize(match[2]);
  }
  return rows;
}

function assertNoBanned(markdown, spec) {
  for (const pattern of banned) {
    if (pattern.test(markdown)) {
      fail(`${spec.file}: stale-template marker found: ${pattern}`);
    }
  }
}

function assertSections(markdown, spec) {
  assertIncludes(markdown, `## ${spec.title}`, spec.file);
  assertIncludes(markdown, "## 01 逐句精读", spec.file);
  assertIncludes(markdown, "## 02 题目与选项精讲", spec.file);
  assertIncludes(markdown, "## 03 B1+ 词汇深讲总表", spec.file);
  assertIncludes(markdown, "## 04 IELTS 阅读提醒", spec.file);
  assertIncludes(markdown, "## 05 答案汇总", spec.file);
}

function assertImages(markdown, spec, filePath) {
  if (/!\[[^\]]*\]\([^)]*(?:answer-)?page-\d{3}\.png\)/i.test(markdown)) {
    fail(`${spec.file}: full-page source screenshots must not be embedded`);
  }
}

function assertAnswers(markdown, spec) {
  const rows = parseAnswerRows(markdown);
  for (const [question, answer] of Object.entries(spec.answers)) {
    if (rows[Number(question)] !== answer) {
      fail(`${spec.file}: answer ${question} expected ${answer}, got ${rows[Number(question)] || "<missing>"}`);
    }
  }
}

for (const spec of specs) {
  const filePath = path.join(groupDir, spec.file);
  if (!fs.existsSync(filePath)) {
    fail(`${spec.file}: missing file`);
    continue;
  }

  const markdown = fs.readFileSync(filePath, "utf8");
  assertNoBanned(markdown, spec);
  assertSections(markdown, spec);
  assertImages(markdown, spec, filePath);
  assertAnswers(markdown, spec);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${specs.length} Cambridge IELTS 07 completed intensive-reading files.`);
