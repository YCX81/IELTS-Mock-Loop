const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const GENERATED = path.join(ROOT, "data", "generated");
const LEDGER_FILE = path.join(GENERATED, "reports", "cambridge-ocr-calibration.json");
const BANK_FILE = path.join(GENERATED, "reports", "cambridge-test-bank.json");

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function pageMarkdown(raw, pageNumber) {
  const pattern = new RegExp(
    `^## Page ${pageNumber}\\r?$([\\s\\S]*?)(?=^## Page \\d+\\r?$|(?![\\s\\S]))`,
    "m",
  );
  return raw.match(pattern)?.[1]?.trim() || "";
}

function normalizeText(text) {
  return String(text || "").replace(/\r\n/g, "\n").trim();
}

function normalizeComparableText(text) {
  return normalizeText(text)
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ");
}

function imageMarker(entry) {
  return `![Cambridge IELTS ${entry.book} page ${String(entry.page).padStart(3, "0")} figure](${entry.image})`;
}

function representativeTableRow(text) {
  return String(text || "")
    .split(/\r?\n/)
    .filter((line) => /^\|.*\|$/.test(line.trim()) && !/^\|[\s|:-]+\|$/.test(line.trim()))
    .sort((a, b) => b.length - a.length)[0];
}

function representativeText(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 24 && !line.startsWith("!["))
    .sort((a, b) => b.length - a.length)[0];
}

function fail(errors, entry, message) {
  errors.push(`Cambridge ${entry.book} page ${entry.page}: ${message}`);
}

function main() {
  const ledger = readJson(LEDGER_FILE);
  const bank = readJson(BANK_FILE);
  const errors = [];
  const stats = {
    ledgerEntries: ledger.entries.length,
    embeddedImages: 0,
    structuredTables: 0,
    propagatedQuestionPages: 0,
    supplementalPages: 0,
  };

  for (const entry of ledger.entries) {
    const pagesFile = path.join(GENERATED, "page-json", `cambridge-ielts-${entry.book}.pages.json`);
    const rawFile = path.join(GENERATED, "text-pages", `cambridge-ielts-${entry.book}.raw.md`);
    const pagesDoc = readJson(pagesFile);
    const raw = readText(rawFile);
    const page = (pagesDoc.pages || []).find((item) => Number(item.page) === Number(entry.page));

    if (!page) {
      fail(errors, entry, "missing from page JSON");
      continue;
    }
    if (!page.calibration || page.calibration.status !== entry.status || page.calibration.reason !== entry.reason) {
      fail(errors, entry, "page JSON calibration metadata differs from the ledger");
    }

    const rawPage = pageMarkdown(raw, entry.page);
    if (!rawPage) fail(errors, entry, "missing from raw Markdown");
    if (normalizeText(rawPage) !== normalizeText(page.text)) {
      fail(errors, entry, "raw Markdown and page JSON text differ");
    }

    if (entry.image) {
      const imageFile = path.join(ROOT, ...entry.image.split("/"));
      if (!fs.existsSync(imageFile)) fail(errors, entry, `missing image file ${entry.image}`);
    }

    if (entry.embeddedInText) {
      stats.embeddedImages += 1;
      const marker = imageMarker(entry);
      if (!String(page.text || "").includes(marker)) fail(errors, entry, "image marker missing from page JSON text");
      if (!rawPage.includes(marker)) fail(errors, entry, "image marker missing from raw Markdown");
    }

    if (entry.reason === "structured_table_repair") {
      if (representativeTableRow(page.text)) stats.structuredTables += 1;
    }

    if (entry.reason.startsWith("false_positive")) continue;

    const matchingTests = bank.tests.filter((test) => {
      const bookMatch = String(test.id || "").startsWith(`cambridge-${entry.book}-`);
      return bookMatch && Array.isArray(test.sourcePages) && test.sourcePages.includes(entry.page);
    });
    if (!matchingTests.length) {
      stats.supplementalPages += 1;
      continue;
    }

    const generatedText = matchingTests.map((test) => JSON.stringify(test)).join("\n");
    if (entry.embeddedInText && !generatedText.includes(imageMarker(entry))) {
      fail(errors, entry, "embedded image did not propagate to the generated test bank");
      continue;
    }
    if (entry.reason === "structured_table_repair") {
      const row = representativeTableRow(page.text);
      if (row && !normalizeComparableText(generatedText).includes(normalizeComparableText(row))) {
        fail(errors, entry, "Markdown table did not propagate to the generated test bank");
        continue;
      }
    }
    stats.propagatedQuestionPages += 1;
  }

  if (errors.length) {
    console.error(`FAIL: ${errors.length} calibration propagation issue(s)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `OK: ${stats.ledgerEntries} calibrated pages; ${stats.embeddedImages} embedded images; ` +
      `${stats.structuredTables} structured tables; ${stats.propagatedQuestionPages} question pages propagated; ` +
      `${stats.supplementalPages} supplemental pages retained outside the Academic test bank`,
  );
}

main();
