import fs from "node:fs";

const bankPath = "data/cambridge-test-bank.json";
const reportPath = "data/generated/reports/cambridge-test-bank.json";
const scriptPath = "data/cambridge-test-bank.js";

const patches = [
  { book: "09", page: 73, test: 3, section: 1, type: "image" },
  { book: "10", page: 12, test: 1, section: 3, type: "table" },
  { book: "11", page: 22, test: 1, section: 1, type: "image" },
  { book: "13", page: 19, test: 1, section: 0, type: "table" },
  { book: "13", page: 61, test: 3, section: 0, type: "table" },
  { book: "15", page: 21, test: 1, section: 3, type: "table" },
];

function extractBlock(text, type) {
  const lines = text.split(/\r?\n/);
  if (type === "image") {
    const image = lines.find((line) => /^!\[[^\]]*]\([^)]+\)$/.test(line.trim()));
    if (!image) throw new Error("Image marker not found");
    return image.trim();
  }

  const tableLines = lines.filter((line) => line.trim().startsWith("|"));
  if (tableLines.length < 2) throw new Error("Markdown table not found");
  return tableLines.join("\n");
}

const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));

for (const patch of patches) {
  const pageData = JSON.parse(
    fs.readFileSync(
      `data/generated/page-json/cambridge-ielts-${patch.book}.pages.json`,
      "utf8",
    ),
  );
  const page = pageData.pages.find((entry) => entry.page === patch.page);
  if (!page) throw new Error(`C${patch.book} page ${patch.page} not found`);

  const block = extractBlock(page.text, patch.type);
  const testId = `cambridge-${patch.book}-reading-test-${patch.test}`;
  const test = bank.tests.find((entry) => entry.id === testId);
  if (!test) throw new Error(`${testId} not found`);

  for (const section of test.readingSections) {
    section.paragraphs = (section.paragraphs ?? []).filter(
      (paragraph) =>
        typeof paragraph !== "string" || paragraph.trim() !== block,
    );
  }

  const section = test.readingSections[patch.section];
  if (!section) throw new Error(`${testId} section ${patch.section} not found`);
  section.paragraphs.push(block);

  if (!test.rawOcrText.includes(block)) {
    test.rawOcrText = `${test.rawOcrText.trimEnd()}\n\n${block}`;
  }

  console.log(
    `Reconciled C${patch.book} p${patch.page} ${patch.type} into ${testId}: ${section.title}`,
  );
}

for (const test of bank.tests.filter((entry) =>
  entry.id.startsWith("cambridge-09-reading-test-"),
)) {
  for (const question of test.questions || []) {
    if (Array.isArray(question.options)) {
      question.options = question.options.map((option) =>
        option === "FALES" ? "FALSE" : option,
      );
    }
    for (const option of question.optionDetails || []) {
      if (option.label === "FALES") option.label = "FALSE";
    }
  }
}

const json = `${JSON.stringify(bank, null, 2)}\n`;
fs.writeFileSync(bankPath, json);
fs.writeFileSync(reportPath, json);
fs.writeFileSync(scriptPath, `window.CAMBRIDGE_TEST_BANK = ${json.trim()};\n`);

const c15PagesPath =
  "data/generated/page-json/cambridge-ielts-15.pages.json";
const c15Pages = JSON.parse(fs.readFileSync(c15PagesPath, "utf8"));
for (const pageNumber of [
  82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 128,
]) {
  const page = c15Pages.pages.find(
    (entry) => Number(entry.page) === pageNumber,
  );
  if (!page) throw new Error(`C15 page ${pageNumber} not found`);
  if (page.calibration?.reason) continue;
  page.calibration = {
    status: "manually_calibrated",
    book: 15,
    test: 4,
    method: "manual visual page-by-page readback",
  };
}
fs.writeFileSync(c15PagesPath, `${JSON.stringify(c15Pages, null, 2)}\n`);
console.log("Corrected Cambridge 15 Test 4 page calibration metadata");
