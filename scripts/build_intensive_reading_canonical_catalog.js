const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const intensiveRoot = path.join(repoRoot, "data", "generated", "intensive-reading");
const jsonPath = path.join(intensiveRoot, "canonical-catalog.json");
const browserPath = path.join(repoRoot, "data", "intensive-reading-catalog.js");
const auditPath = path.join(repoRoot, "reports", "intensive-reading-canonical-audit.md");

const selectionPolicy = [
  "Prefer a completed intensive-reading document outside recovered-sources.",
  "Then prefer a filename explicitly marked 双语精读.",
  "Then prefer documents with a title, Chinese learning content, more learning-section markers, and more English source words.",
  "Break any remaining tie by byte size and repository-relative path.",
];

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function walkMarkdownFiles(dirPath) {
  const files = [];
  for (const entry of fs
    .readdirSync(dirPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name, "en"))) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function passageCoordinates(filePath) {
  const fileName = path.basename(filePath);
  const standard = fileName.match(
    /Cambridge-IELTS-(\d{1,2})-Test-(\d{1,2})-Passage-(\d{1,2})/i
  );
  const recovered = fileName.match(/recovered-(\d{1,2})-test-(\d{1,2})-passage-(\d{1,2})/i);
  const match = standard || recovered;
  if (!match) return null;

  const bookNumber = Number(match[1]);
  const testNo = Number(match[2]);
  const passageNo = Number(match[3]);
  if (
    bookNumber < 4 ||
    bookNumber > 21 ||
    testNo < 1 ||
    testNo > 4 ||
    passageNo < 1 ||
    passageNo > 3
  ) {
    return null;
  }

  const book = String(bookNumber).padStart(2, "0");
  return {
    id: `cambridge-${book}-reading-test-${testNo}-passage-${passageNo}`,
    book,
    testNo,
    passageNo,
  };
}

function documentMetadata(filePath) {
  const repoPath = toRepoPath(filePath);
  const content = fs.readFileSync(filePath, "utf8");
  const titleMatch = content.replace(/^\uFEFF/, "").match(/^#\s+(.+?)\s*$/m);
  const title = titleMatch ? titleMatch[1].trim() : "";
  const englishWordCount = (
    content.match(/[A-Za-z]+(?:[-'\u2019][A-Za-z]+)*/g) || []
  ).length;
  const learningSectionCount = (
    content.match(
      /^#{2,4}\s+.*(?:精读|题目|练习|复习|词汇|表达|长句|翻译|正文|原文|summary|review|vocabulary)/gim
    ) || []
  ).length;
  const recoveredSource = repoPath.includes("/recovered-sources/");
  const explicitBilingual = path.basename(filePath).includes("双语精读");

  return {
    path: repoPath,
    sourceKind: recoveredSource ? "recovered-source" : "completed-document",
    explicitBilingual,
    hasTitle: Boolean(title),
    hasChinese: /[\u3400-\u9fff]/.test(content),
    learningSectionCount,
    englishWordCount,
    byteSize: Buffer.byteLength(content, "utf8"),
    title,
  };
}

function compareCandidates(left, right) {
  const fields = [
    ["sourceKind", (value) => (value === "completed-document" ? 1 : 0)],
    ["explicitBilingual", (value) => (value ? 1 : 0)],
    ["hasTitle", (value) => (value ? 1 : 0)],
    ["hasChinese", (value) => (value ? 1 : 0)],
    ["learningSectionCount", Number],
    ["englishWordCount", Number],
    ["byteSize", Number],
  ];

  for (const [field, normalize] of fields) {
    const difference = normalize(right[field]) - normalize(left[field]);
    if (difference !== 0) return difference;
  }
  return left.path.localeCompare(right.path, "en");
}

function expectedPassages() {
  const passages = [];
  for (let bookNumber = 4; bookNumber <= 21; bookNumber += 1) {
    const book = String(bookNumber).padStart(2, "0");
    for (let testNo = 1; testNo <= 4; testNo += 1) {
      for (let passageNo = 1; passageNo <= 3; passageNo += 1) {
        passages.push({
          id: `cambridge-${book}-reading-test-${testNo}-passage-${passageNo}`,
          book,
          testNo,
          passageNo,
        });
      }
    }
  }
  return passages;
}

function buildCatalog() {
  const markdownFiles = walkMarkdownFiles(intensiveRoot);
  const candidatesById = new Map();
  const ignoredPaths = [];

  for (const filePath of markdownFiles) {
    const coordinates = passageCoordinates(filePath);
    if (!coordinates) {
      ignoredPaths.push(toRepoPath(filePath));
      continue;
    }
    const candidate = {
      ...coordinates,
      ...documentMetadata(filePath),
    };
    const candidates = candidatesById.get(coordinates.id) || [];
    candidates.push(candidate);
    candidatesById.set(coordinates.id, candidates);
  }

  const items = [];
  const missingIds = [];

  for (const expected of expectedPassages()) {
    const candidates = (candidatesById.get(expected.id) || []).sort(compareCandidates);
    if (candidates.length === 0) {
      missingIds.push(expected.id);
      continue;
    }

    const canonical = candidates[0];
    const alternates = candidates.slice(1).map((candidate) => candidate.path);
    items.push({
      id: expected.id,
      book: expected.book,
      testNo: expected.testNo,
      passageNo: expected.passageNo,
      title:
        canonical.title ||
        `Cambridge IELTS ${expected.book} Test ${expected.testNo} Passage ${expected.passageNo}`,
      displayTitle: `Cambridge IELTS ${expected.book} · Test ${expected.testNo} · Passage ${expected.passageNo}`,
      canonicalPath: canonical.path,
      sourceKind: canonical.sourceKind,
      englishWordCount: canonical.englishWordCount,
      byteSize: canonical.byteSize,
      duplicate: alternates.length > 0,
      alternates,
    });
  }

  const duplicateIds = items.filter((item) => item.duplicate).map((item) => item.id);
  const alternateFileCount = items.reduce((sum, item) => sum + item.alternates.length, 0);
  const candidateFileCount = [...candidatesById.values()].reduce(
    (sum, candidates) => sum + candidates.length,
    0
  );

  return {
    catalog: {
      summary: {
        schemaVersion: 1,
        sourceRoot: toRepoPath(intensiveRoot),
        expectedCount: 216,
        canonicalCount: items.length,
        missingCount: missingIds.length,
        missingIds,
        duplicateIdCount: duplicateIds.length,
        duplicateIds,
        alternateFileCount,
        candidateFileCount,
        completedDocumentCount: [...candidatesById.values()]
          .flat()
          .filter((candidate) => candidate.sourceKind === "completed-document").length,
        recoveredSourceCount: [...candidatesById.values()]
          .flat()
          .filter((candidate) => candidate.sourceKind === "recovered-source").length,
        scannedMarkdownCount: markdownFiles.length,
        ignoredMarkdownCount: ignoredPaths.length,
        selectionPolicy,
      },
      items,
    },
    ignoredPaths,
  };
}

function markdownCode(value) {
  return `\`${String(value).replace(/`/g, "\\`")}\``;
}

function buildAudit(catalog, ignoredPaths) {
  const { summary, items } = catalog;
  const duplicates = items.filter((item) => item.duplicate);
  const missingRows =
    summary.missingIds.length > 0
      ? summary.missingIds.map((id) => `- ${markdownCode(id)}`).join("\n")
      : "- None.";
  const duplicateRows =
    duplicates.length > 0
      ? duplicates
          .map(
            (item) =>
              `| ${markdownCode(item.id)} | ${markdownCode(item.canonicalPath)} | ` +
              `${item.alternates.map(markdownCode).join("<br>")} |`
          )
          .join("\n")
      : "| _None_ |  |  |";
  const ignoredRows = ignoredPaths.map((item) => `- ${markdownCode(item)}`).join("\n");

  return `# Intensive-reading canonical catalog audit

This report separates completed learning documents from recovered source material and index/report Markdown. No existing intensive-reading file is deleted or renamed.

## Coverage

| Metric | Count |
|---|---:|
| Expected Cambridge 04-21 passages | ${summary.expectedCount} |
| Canonical passages | ${summary.canonicalCount} |
| Missing canonical IDs | ${summary.missingCount} |
| Candidate passage files | ${summary.candidateFileCount} |
| Completed learning documents | ${summary.completedDocumentCount} |
| Recovered or legacy source files | ${summary.recoveredSourceCount} |
| Duplicate ID groups | ${summary.duplicateIdCount} |
| Alternate files | ${summary.alternateFileCount} |
| Markdown files scanned | ${summary.scannedMarkdownCount} |
| Non-passage Markdown ignored | ${summary.ignoredMarkdownCount} |

## Selection policy

${summary.selectionPolicy.map((rule, index) => `${index + 1}. ${rule}`).join("\n")}

The stable ID format is ${markdownCode(
    "cambridge-XX-reading-test-X-passage-Y"
  )}. Repository paths always use forward slashes.

## Missing

${missingRows}

## Duplicate groups and alternates

| ID | Canonical document | Alternates |
|---|---|---|
${duplicateRows}

## Ignored Markdown

These files are indexes or reports rather than passage learning documents:

${ignoredRows || "- None."}
`;
}

function writeCatalog() {
  const { catalog, ignoredPaths } = buildCatalog();
  const json = `${JSON.stringify(catalog, null, 2)}\n`;
  const browser = `window.IELTS_INTENSIVE_READING_CATALOG = ${JSON.stringify(
    catalog,
    null,
    2
  )};\n`;
  const audit = buildAudit(catalog, ignoredPaths);

  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.mkdirSync(path.dirname(browserPath), { recursive: true });
  fs.mkdirSync(path.dirname(auditPath), { recursive: true });
  fs.writeFileSync(jsonPath, json, "utf8");
  fs.writeFileSync(browserPath, browser, "utf8");
  fs.writeFileSync(auditPath, audit, "utf8");

  return catalog;
}

if (require.main === module) {
  const catalog = writeCatalog();
  console.log(
    `Wrote ${toRepoPath(jsonPath)}, ${toRepoPath(browserPath)}, and ${toRepoPath(auditPath)} ` +
      `(${catalog.summary.canonicalCount}/${catalog.summary.expectedCount} canonical passages).`
  );
}

module.exports = {
  buildCatalog,
  compareCandidates,
  passageCoordinates,
  writeCatalog,
};
