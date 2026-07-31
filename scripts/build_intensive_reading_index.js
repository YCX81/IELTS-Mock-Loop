const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const root = path.join(repoRoot, "data", "generated", "intensive-reading");
const outputPath = path.join(root, "README.md");

function rel(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function readManifest(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function numberOrBlank(value) {
  return Number.isFinite(value) ? value : "";
}

function countArray(value) {
  return Array.isArray(value) ? value.length : undefined;
}

function countRecoveredItems(items) {
  if (!Array.isArray(items)) {
    return undefined;
  }
  return items.filter((item) => item.recovered || item.recoveredPath || item.recoveredSource || item.source === "recovered" || item.sourceKind === "recovered").length;
}

function firstFinite(...values) {
  return values.find((value) => Number.isFinite(value));
}

function generatedCount(parsed) {
  if (!parsed) {
    return "";
  }
  return numberOrBlank(firstFinite(
    parsed.generatedCount,
    parsed.counts?.generatedPassageFiles,
    parsed.counts?.generated,
    parsed.summary?.markdownFiles,
    parsed.summary?.generated,
    countArray(parsed.files),
    countArray(parsed.generated),
    countArray(parsed.records),
    countArray(parsed.items),
    parsed.counts?.expectedPassageFiles,
    parsed.counts?.expected
  ));
}

function recoveredCount(parsed) {
  if (!parsed) {
    return "";
  }
  return numberOrBlank(firstFinite(
    parsed.recoveredCount,
    parsed.counts?.recoveredSourceFiles,
    parsed.counts?.recovered,
    parsed.summary?.recoveredSources,
    countArray(parsed.recovered),
    countArray(parsed.recoveredSources),
    countRecoveredItems(parsed.files),
    countRecoveredItems(parsed.generated),
    countRecoveredItems(parsed.records),
    countRecoveredItems(parsed.items)
  ));
}

function skippedCount(parsed) {
  if (!parsed) {
    return "";
  }
  return numberOrBlank(firstFinite(
    parsed.skippedCount,
    parsed.counts?.skipped,
    parsed.summary?.skipped,
    countArray(parsed.skipped),
    countArray(parsed.skippedExisting),
    countArray(parsed.skippedRecords)
  ));
}

function collect() {
  const groups = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const rows = [];
  const manifests = [];

  for (const group of groups) {
    const dir = path.join(root, group);
    const files = fs.readdirSync(dir).filter((file) => /^Cambridge-IELTS-\d+.*\.md$/.test(file)).sort();
    const byBook = {};
    for (const file of files) {
      const book = (file.match(/Cambridge-IELTS-(\d+)/) || [])[1] || "unknown";
      byBook[book] ||= [];
      byBook[book].push(file);
    }
    for (const [book, bookFiles] of Object.entries(byBook).sort()) {
      rows.push({
        group,
        book,
        count: bookFiles.length,
        first: rel(path.join(dir, bookFiles[0])),
        last: rel(path.join(dir, bookFiles[bookFiles.length - 1]))
      });
    }

    for (const manifest of fs.readdirSync(dir).filter((file) => /^manifest.*\.json$/.test(file)).sort()) {
      const fullPath = path.join(dir, manifest);
      const parsed = readManifest(fullPath);
      manifests.push({
        group,
        file: rel(fullPath),
        generatedCount: generatedCount(parsed),
        recoveredCount: recoveredCount(parsed),
        skippedCount: skippedCount(parsed)
      });
    }
  }

  return { rows, manifests };
}

const { rows, manifests } = collect();
const total = rows.reduce((sum, row) => sum + row.count, 0);
const generatedAt = new Date().toISOString();

const body = `# Cambridge IELTS Reading 双语精读索引

生成时间：${generatedAt}

本目录扫描到 ${total} 个 Markdown 文件，其中 216 篇是 Cambridge IELTS 04–21 的唯一正式 Passage（每本 4 套、每套 3 篇），其余为保留用于追溯的恢复稿、旧版本、索引或报告。学习入口以 \`canonical-catalog.json\` 为准；选择规则和重复项见 \`../../../reports/intensive-reading-canonical-audit.md\`。

## 物理文件统计（包含恢复稿与旧版本）

| Book | Count | Group | First file | Last file |
|---|---:|---|---|---|
${rows.map((row) => `| ${row.book} | ${row.count} | ${row.group} | ${row.first} | ${row.last} |`).join("\n")}

## Manifest

| Group | Manifest | Generated | Recovered | Skipped |
|---|---|---:|---:|---:|
${manifests.map((item) => `| ${item.group} | ${item.file} | ${item.generatedCount} | ${item.recoveredCount} | ${item.skippedCount} |`).join("\n")}

## 使用说明

- 完整版批次主要在 04-06、10-12、16-18、19-21；覆盖优先短版主要在 07-09、13-15。
- \`materialExtension: web_enriched\` 表示该篇已有联网素材；\`needs_web_enrichment\` 表示没有编造外部出处，后续可再联网补强。
- 这些文件是本地学习衍生产物，不要提交源 PDF、音频、OCR 缓存或大语料。
`;

fs.writeFileSync(outputPath, body, "utf8");
console.log(`Wrote ${rel(outputPath)}`);
