import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lessonDir = path.join(
  root,
  "data",
  "generated",
  "intensive-reading",
  "cambridge-10-12",
);
const validatorSource = fs.readFileSync(
  path.join(root, "scripts", "validate_cambridge_10_completed_intensive_reading.js"),
  "utf8",
);

function expectedAnswersByFile(source) {
  const result = new Map();
  const specPattern =
    /file:\s*'([^']+)'[\s\S]*?answers:\s*\{([\s\S]*?)\n\s*\},\n\s*\},/g;
  for (const match of source.matchAll(specPattern)) {
    const answers = [];
    for (const row of match[2].matchAll(/^\s*(\d+):\s*'([^']*)',?$/gm)) {
      answers.push([Number(row[1]), row[2]]);
    }
    result.set(match[1], answers);
  }
  return result;
}

function vocabularyRows(markdown) {
  const rows = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!/^本句(?:词汇| B1\+)：/.test(line)) continue;
    for (const item of line.replace(/^本句(?:词汇| B1\+)：/, "").split("；")) {
      const match = item.match(/`([^`]+)`（([^）]+)），(.+?)[。；]?$/);
      if (!match || !/\b(?:B1|B2|C1|C2)\b/.test(match[2])) continue;
      if (!rows.has(match[1])) {
        rows.set(match[1], {
          level: match[2].match(/\b(?:B1|B2|C1|C2)\b/)?.[0] || "B1+",
          note: match[3].replaceAll("|", "/").trim(),
        });
      }
    }
  }
  return [...rows.entries()];
}

function normalizeLesson(file, answers) {
  const filePath = path.join(lessonDir, file);
  let markdown = fs.readFileSync(filePath, "utf8").replaceAll("\r\n", "\n");
  markdown = markdown.replace(
    /^## 正文(?:逐句)?精读\s*$/m,
    "## 01 逐句精读",
  );
  markdown = markdown.replace(
    /^## 题目与选项精讲(?:（[^）]+）)?\s*$/m,
    "## 02 题目与选项精讲",
  );

  if (!markdown.includes("## 03 B1+ 词汇深讲总表")) {
    const vocabulary = vocabularyRows(markdown);
    const vocabularyTable = vocabulary.length
      ? [
          "| 词汇/短语 | CEFR | 语境义与用法 |",
          "| --- | --- | --- |",
          ...vocabulary.map(
            ([term, detail]) =>
              `| ${term.replaceAll("|", "/")} | ${detail.level} | ${detail.note} |`,
          ),
        ]
      : ["正文各句的 B1+ 词汇已在逐句精读中逐项标注和讲解。"];

    markdown = `${markdown.trimEnd()}

## 03 B1+ 词汇深讲总表

以下总表汇集本篇逐句精读中已讲解的 B1 及以上词汇；具体搭配、句法作用和语境辨析仍以对应原句下的讲解为准。

${vocabularyTable.join("\n")}

## 04 IELTS 阅读提醒

- 先按题型指令确认字数限制、单复数和答案格式，再回原文定位。
- 判断题和选择题必须区分原文事实、题干改写与没有给出的信息，不能凭常识补全。
- 填空答案优先保留原文拼写和词形；有并列选项时，逐项核对证据并排除只与主题相关但不回答题干的干扰项。

## 05 答案汇总

| 题号 | 答案 |
| --- | --- |
${answers.map(([number, answer]) => `| ${number} | ${answer} |`).join("\n")}
`;
  }

  fs.writeFileSync(filePath, `${markdown.trimEnd()}\n`);
}

const answerSpecs = expectedAnswersByFile(validatorSource);
if (answerSpecs.size !== 12) {
  throw new Error(`Expected 12 C10 lesson specs, found ${answerSpecs.size}`);
}
for (const [file, answers] of answerSpecs) {
  normalizeLesson(file, answers);
  console.log(`Normalized ${file}`);
}

const c10PagesPath = path.join(
  root,
  "data",
  "generated",
  "page-json",
  "cambridge-ielts-10.pages.json",
);
const c10Pages = JSON.parse(fs.readFileSync(c10PagesPath, "utf8"));
const page12 = c10Pages.pages.find((page) => Number(page.page) === 12);
if (!page12) throw new Error("Cambridge 10 page 12 not found");

const calibrationPath = path.join(
  root,
  "work",
  "calibration",
  "cambridge-10",
  "test-1",
  "passage-1.json",
);
const calibration = JSON.parse(fs.readFileSync(calibrationPath, "utf8"));
calibration.pages["12"] = page12.text;
const group = calibration.questionGroups.find(
  (entry) => String(entry.range).replace("-", "–") === "9–13",
);
if (!group) throw new Error("Cambridge 10 Questions 9–13 group not found");
group.instructions = [
  "Complete the table below.",
  "Write ONE WORD ONLY for each answer.",
];
group.tableRows = [
  {
    stepwell: "Rani Ki Vav",
    date: "late 11th century",
    features: "as many as 500 sculptures decorate the monument",
    otherNotes:
      "restored in the 1960s; excellent condition, despite the 9 __________ of 2001",
  },
  {
    stepwell: "Surya Kund",
    date: "1026",
    features:
      "steps on the 10 __________ produce a geometrical pattern; carved shrines",
    otherNotes: "looks more like a 11 __________ than a well",
  },
  {
    stepwell: "Raniji Ki Baori",
    date: "1699",
    features: "intricately carved monument",
    otherNotes:
      "one of 21 baoris commissioned in the area by Queen Nathavatji",
  },
  {
    stepwell: "Chand Baori",
    date: "850 AD",
    features: "steps take you down 11 storeys",
    otherNotes:
      "old, deep and very dramatic; has 12 __________ which provide a view of the steps",
  },
  {
    stepwell: "Neemrana Ki Baori",
    date: "1700",
    features: "has two 13 __________ levels",
    otherNotes: "used by the public today",
  },
];
fs.writeFileSync(calibrationPath, `${JSON.stringify(calibration, null, 2)}\n`);

const bankPath = path.join(root, "data", "cambridge-test-bank.json");
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const test = bank.tests.find(
  (entry) => entry.id === "cambridge-10-reading-test-1",
);
if (!test) throw new Error("Cambridge 10 Reading Test 1 not found");
const questionSection = test.readingSections.find(
  (section) => section.title === "Questions 9–13",
);
if (!questionSection) throw new Error("Questions 9–13 section not found");
const table = page12.text
  .split(/\r?\n/)
  .filter((line) => line.startsWith("|"))
  .join("\n");
questionSection.paragraphs = [
  "Complete the table below.\nWrite ONE WORD ONLY for each answer.",
  table,
];
test.rawOcrText = test.sourcePages
  .map((pageNumber) => {
    const page = c10Pages.pages.find(
      (entry) => Number(entry.page) === Number(pageNumber),
    );
    if (!page) throw new Error(`Cambridge 10 page ${pageNumber} not found`);
    return page.text;
  })
  .join("\n\n");

const bankJson = `${JSON.stringify(bank, null, 2)}\n`;
fs.writeFileSync(bankPath, bankJson);
fs.writeFileSync(
  path.join(root, "data", "generated", "reports", "cambridge-test-bank.json"),
  bankJson,
);
fs.writeFileSync(
  path.join(root, "data", "cambridge-test-bank.js"),
  `window.CAMBRIDGE_TEST_BANK = ${bankJson.trim()};\n`,
);
console.log("Reconciled Cambridge 10 Questions 9–13");
