const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const GENERATED = path.join(ROOT, "data", "generated");
const REPORT_DIR = path.join(GENERATED, "reports");
const TEST_BANK = path.join(REPORT_DIR, "cambridge-test-bank.json");
const JSON_REPORT = path.join(REPORT_DIR, "cambridge-structure-validation.json");
const MD_REPORT = path.join(REPORT_DIR, "cambridge-structure-validation.md");
const CALIBRATION_LEDGER = path.join(REPORT_DIR, "cambridge-ocr-calibration.json");

const books = Array.from({ length: 18 }, (_, index) => String(index + 4).padStart(2, "0"));
const priorityByBook = {
  "04": "critical",
  "05": "critical",
  "10": "critical",
  "20": "critical",
  "06": "high",
  "07": "high",
  "08": "high",
  "09": "high",
  "14": "high",
};

const residualPatterns = [
  ["SOCIAL PROGERAMME", /\bSOCIAL PROGERAMME\b/g],
  ["sing mane", /\bsing mane\b/g],
  ["table blew", /\btable blew\b/gi],
  ["NO MORE THSN", /\bNO MORE THSN\b/g],
  ["FALES", /\bFALES\b/g],
  ["boxes I-range", /\bboxes\s+I[2-9]\b/g],
  ["PART Questions missing number", /\bPART\s+Questions\s+\d{1,2}\s*[-–—]\s*\d{1,2}\b/gi],
  ["candidate split", /\bcan didates?\b/g],
  ["language OCR", /\bIanguage\b|\bIan guage\b/g],
  ["children title apostrophe OCR", /\bCHILDREN[，,]\s*S PLAY\b|\bchildren[，,]\s*s play\b/g],
  ["kingdom OCR", /\bldngdom\b/g],
];

const suspiciousRangePatterns = [
  ["Questions glued range", /\bQuestions\s+([1-9])([1-9])\b(?!\s*[-–—]|\s+and\s+|\s+to\s+)/g],
  ["Questions long glued range", /\bQuestions\s+\d{3,4}(?!\s*[-–—]|\s+and\s+|\s+to\s+)/g],
  ["boxes capital-I range", /\bboxes\s+I[2-9]\b/g],
  ["singular box split", /\bbox\s+[1-9]-[1-9]\b/gi],
  ["over-split paired range", /\b(?:Questions|boxes)\s+[1-9]-[1-9]\s+and\s+[1-9]\d?\b/gi],
  ["over-split range", /\b(?:Questions|boxes)\s+[1-9]-[1-9]\s*[-–—]\s*\d{1,2}\b/gi],
  ["invalid 31-10 range", /\bQuestions\s+31\s*[-–—]\s*10\b/g],
  ["malformed equals range", /\b(?:Questions|boxes)\s+\d{1,3}\s*[-–—]\s*\d{1,3}\s*=\s*\d{1,3}\b/gi],
];

const imageReviewPattern =
  /\b(?:Label the (?:map|diagram|plan)|(?:map|plan|diagram|flow-?chart|chart)\s+(?:below|shows|of)|Riverside plan|Population studies chart)\b/i;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function calibratedPageSet() {
  if (!fs.existsSync(CALIBRATION_LEDGER)) return new Set();
  const ledger = readJson(CALIBRATION_LEDGER);
  return new Set(
    (ledger.entries || [])
      .filter((entry) => entry.status === "calibrated")
      .map((entry) => `${entry.book}-${entry.page}`),
  );
}

function pageFile(book) {
  return path.join(GENERATED, "page-json", `cambridge-ielts-${book}.pages.json`);
}

function rawFile(book) {
  return path.join(GENERATED, "text-pages", `cambridge-ielts-${book}.raw.md`);
}

function loadBookSource(book) {
  const rawText = readIfExists(rawFile(book));
  const pages = fs.existsSync(pageFile(book)) ? readJson(pageFile(book)).pages || [] : [];
  const pageText = pages.map((page) => String(page.text || "")).join("\n");
  return { rawText, pages, text: `${rawText}\n${pageText}` };
}

function collectMatches(text, patterns, limit = 30) {
  const findings = [];
  for (const [name, pattern] of patterns) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const re = new RegExp(pattern.source, flags);
    for (const match of text.matchAll(re)) {
      if (name === "Questions glued range") {
        const start = Number(match[1]);
        const end = Number(match[2]);
        if (!(start < end)) continue;
      }
      findings.push({ name, value: match[0] });
      if (findings.length >= limit) return findings;
    }
  }
  return findings;
}

function pageMatches(pages, pattern) {
  const matches = [];
  for (const page of pages) {
    const text = String(page.text || "");
    if (pattern.test(text)) matches.push(page.page);
  }
  return matches;
}

function shortPages(pages) {
  return pages
    .filter((page) => {
      const compact = String(page.text || "").replace(/\s+/g, "");
      return compact.length > 0 && compact.length < 25;
    })
    .map((page) => ({ page: page.page, text: String(page.text || "").replace(/\s+/g, " ") }));
}

function collectInvalidRanges(text, limit = 30) {
  const findings = [];
  const pattern = /\b(Questions|boxes)\s+(\d{1,3})\s*[-–—]\s*(\d{1,3})\b/gi;
  for (const match of text.matchAll(pattern)) {
    const start = Number(match[2]);
    const end = Number(match[3]);
    if (start >= 1 && start <= end && end <= 40) continue;
    findings.push({ name: "invalid question range", value: match[0] });
    if (findings.length >= limit) break;
  }
  return findings;
}

function expectedNumbers() {
  return Array.from({ length: 40 }, (_, index) => index + 1);
}

function continuityForTest(test) {
  const numbers = (test.questions || []).map((question) => question.number).filter(Number.isInteger);
  const unique = [...new Set(numbers)].sort((a, b) => a - b);
  const expected = expectedNumbers();
  const missing = expected.filter((number) => !unique.includes(number));
  const extra = unique.filter((number) => number < 1 || number > 40);
  const duplicates = numbers.filter((number, index) => numbers.indexOf(number) !== index);
  return {
    id: test.id,
    mode: test.mode,
    questionCount: numbers.length,
    missing,
    extra,
    duplicates: [...new Set(duplicates)].sort((a, b) => a - b),
    ok: numbers.length === 40 && missing.length === 0 && extra.length === 0 && duplicates.length === 0,
  };
}

function testBankContinuity(book, tests) {
  const bookTests = tests.filter((test) => String(test.id || "").includes(`cambridge-${book}-`));
  const checked = bookTests
    .filter((test) => test.mode === "listening" || test.mode === "reading")
    .map(continuityForTest);
  const bad = checked.filter((item) => !item.ok);
  const byMode = {
    listening: checked.filter((item) => item.mode === "listening").length,
    reading: checked.filter((item) => item.mode === "reading").length,
  };
  return {
    byMode,
    ok: bad.length === 0 && byMode.listening === 4 && byMode.reading === 4,
    bad,
  };
}

function knownSourceIssues(book, text) {
  const issues = [];
  if (book === "04") {
    if (!/SOCIAL PROGRAMME/.test(text)) issues.push("verified IELTS 04 SOCIAL PROGRAMME not found");
    if (!/\bsign name\b/.test(text)) issues.push("verified IELTS 04 sign name not found");
    if (!/\btable below\b/i.test(text)) issues.push("verified IELTS 04 table below not found");
  }
  if (book === "05") {
    if (/\bQuestions\s+13\b(?!\s*[-–—])/.test(text)) issues.push("IELTS 05 has residual Questions 13 glued range");
    if (/\bQuestions\s+47\b(?!\s*[-–—])/.test(text)) issues.push("IELTS 05 has residual Questions 47 glued range");
    if (/\bboxes\s+I3\b/.test(text)) issues.push("IELTS 05 has residual boxes I3");
  }
  if (book === "09" && /\bFALES\b/.test(text)) {
    issues.push("IELTS 09 has residual FALES enum");
  }
  if (book === "10") {
    if (!/Joining the leisure club/i.test(text) || !/\bQuestions\s+13\s*[-–—]\s*20\b/i.test(text)) {
      issues.push("IELTS 10 Test 1 Listening Section 2 Q13-20 is still absent from OCR source");
    }
  }
  if (book === "14") {
    if (/\bldngdom\b|CHILDREN[，,]\s*S PLAY|\bcan didates?\b|\bIanguage\b/.test(text)) {
      issues.push("IELTS 14 has residual confirmed text OCR defects");
    }
  }
  if (book === "20") {
    if (/\bPART\s+Questions\s+11\s*[-–—]\s*20\b/i.test(text)) {
      issues.push("IELTS 20 has residual PART Questions 11-20 marker");
    }
  }
  return issues;
}

function compactList(items, limit = 3) {
  if (!items.length) return "";
  const head = items.slice(0, limit);
  const rest = items.length - head.length;
  return `${head.join("; ")}${rest ? `; +${rest} more` : ""}`;
}

function escapeTable(value) {
  return String(value || "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function summarizeBook(book, tests, calibratedPages) {
  const source = loadBookSource(book);
  const continuity = testBankContinuity(book, tests);
  const residuals = collectMatches(source.text, residualPatterns);
  const suspiciousRanges = collectMatches(source.text, suspiciousRangePatterns);
  const invalidRanges = collectInvalidRanges(source.text);
  const answersInBody = pageMatches(source.pages, /\bAnswer:\s*$/m);
  const garbledAnswerKey = collectMatches(source.text, [["garbled answer key", /\b(?:88883886|LOU<<|BOEE)\b/g]]);
  const shortPageList = shortPages(source.pages);
  const imagePages = pageMatches(source.pages, imageReviewPattern).filter(
    (page) => !calibratedPages.has(`${book}-${page}`),
  );
  const knownIssues = knownSourceIssues(book, source.text);
  const sourceStyle = Number(book) <= 14 ? "SECTION" : "PART";
  const partSectionIssues = [];
  if (Number(book) >= 15 && /\bPART\s+Questions\s+\d/i.test(source.text)) {
    partSectionIssues.push("PART label missing number before Questions");
  }

  const blockingIssues = [
    ...knownIssues,
    ...residuals.map((item) => `residual ${item.name}: ${item.value}`),
    ...suspiciousRanges.map((item) => `suspicious ${item.name}: ${item.value}`),
    ...invalidRanges.map((item) => `${item.name}: ${item.value}`),
    ...partSectionIssues,
  ];
  if (book === "20" && answersInBody.length) {
    blockingIssues.push(`answer pages interleaved at pages ${answersInBody.join(", ")}`);
  }
  if (book === "06" && garbledAnswerKey.length) {
    blockingIssues.push("garbled answer-key OCR remains");
  }
  if (!continuity.ok) {
    blockingIssues.push("generated JSON listening/reading Q1-40 continuity failed");
  }

  const warnings = [];
  if (shortPageList.length) warnings.push(`${shortPageList.length} short/blank-like pages`);
  if (imagePages.length) warnings.push(`${imagePages.length} image-dependent pages need review`);
  if (answersInBody.length && book !== "20") warnings.push(`${answersInBody.length} answer marker pages`);
  if (garbledAnswerKey.length && book !== "06") warnings.push(`${garbledAnswerKey.length} garbled answer-key markers`);

  const status = blockingIssues.length ? "blocked" : warnings.length ? "review" : "pass";
  return {
    book,
    priority: priorityByBook[book] || "normal",
    expectedListeningLabel: sourceStyle,
    status,
    generatedJsonContinuity: continuity,
    blockingIssues,
    warnings,
    shortPages: shortPageList,
    answerPagesInBody: answersInBody,
    imageReviewPages: [...new Set(imagePages)],
    residuals,
    suspiciousRanges,
    invalidRanges,
  };
}

function buildMarkdown(report) {
  const lines = [];
  lines.push("# Cambridge IELTS OCR Structure Validation");
  lines.push("");
  lines.push(`Generated at: ${report.generatedAt}`);
  lines.push("");
  lines.push("Scope: raw markdown, page JSON, and generated test-bank JSON. JSON continuity checks only verify generated question arrays; source issues below still block trustworthy conversion.");
  lines.push("");
  lines.push("| Book | Priority | Status | JSON Q1-40 continuity | Blocking issues | Image review | Warnings |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const book of report.books) {
    const continuity = book.generatedJsonContinuity.ok
      ? `OK L${book.generatedJsonContinuity.byMode.listening}/R${book.generatedJsonContinuity.byMode.reading}`
      : `FAIL ${book.generatedJsonContinuity.bad.length}`;
    lines.push(
      [
        book.book,
        book.priority,
        book.status,
        continuity,
        compactList(book.blockingIssues, 2) || "-",
        book.imageReviewPages.length ? `${book.imageReviewPages.length} pages` : "-",
        compactList(book.warnings, 2) || "-",
      ]
        .map(escapeTable)
        .join(" | ")
        .replace(/^/, "| ")
        .replace(/$/, " |")
    );
  }
  lines.push("");
  lines.push("Priority interpretation:");
  lines.push("- blocked: do not trust direct raw-to-JSON conversion until the listed issue is fixed or manually reviewed.");
  lines.push("- review: text-level fatal OCR patterns are clean, but pages or image-dependent questions still need manual/visual verification.");
  lines.push("- pass: no current script-detected blockers or warnings.");
  lines.push("");
  lines.push("Known unresolved source blockers:");
  for (const book of report.books.filter((item) => item.blockingIssues.length)) {
    lines.push(`- IELTS ${book.book}: ${compactList(book.blockingIssues, 6)}`);
  }
  return `${lines.join("\n")}\n`;
}

function main() {
  if (!fs.existsSync(TEST_BANK)) {
    throw new Error(`Missing ${path.relative(ROOT, TEST_BANK)}`);
  }
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const bank = readJson(TEST_BANK);
  const calibratedPages = calibratedPageSet();
  const report = {
    generatedAt: new Date().toISOString(),
    books: books.map((book) => summarizeBook(book, bank.tests || [], calibratedPages)),
  };
  fs.writeFileSync(JSON_REPORT, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(MD_REPORT, buildMarkdown(report));
  const blocked = report.books.filter((book) => book.status === "blocked").length;
  const review = report.books.filter((book) => book.status === "review").length;
  console.log(`wrote ${path.relative(ROOT, JSON_REPORT).replace(/\\/g, "/")}`);
  console.log(`wrote ${path.relative(ROOT, MD_REPORT).replace(/\\/g, "/")}`);
  console.log(`structure report: ${blocked} blocked, ${review} review, ${report.books.length - blocked - review} pass`);
}

main();
