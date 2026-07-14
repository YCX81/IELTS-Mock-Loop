const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = process.cwd();
const REPORT = path.join(ROOT, "data", "generated", "reports", "cambridge-structure-validation.json");
const OUT_DIR = path.join(ROOT, "data", "generated", "image-review");
const POPPLER_BIN = process.env.CAMBRIDGE_PDFTOPPM || "pdftoppm";
const PDFINFO_BIN = process.env.CAMBRIDGE_PDFINFO || "pdfinfo";
const DPI = Number(process.env.CAMBRIDGE_PDF_REVIEW_DPI || "180");
const pageCountCache = new Map();

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, "/");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function pdfPath(book) {
  return path.join(ROOT, "data", `Cambridge-IELTS-${book}.pdf`);
}

function pageCount(book) {
  if (pageCountCache.has(book)) return pageCountCache.get(book);
  const pdf = pdfPath(book);
  const result = spawnSync(PDFINFO_BIN, [pdf], { cwd: ROOT, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`pdfinfo failed for IELTS ${book}: ${result.error || result.stderr || result.stdout || "no output"}`);
  }
  const match = String(result.stdout || "").match(/^Pages:\s+(\d+)/m);
  if (!match) throw new Error(`Could not read page count for IELTS ${book}`);
  const count = Number(match[1]);
  pageCountCache.set(book, count);
  return count;
}

function collectTargets(report) {
  const targets = [];
  for (const book of report.books || []) {
    const pages = new Map();
    for (const page of book.imageReviewPages || []) {
      add(pages, page, "image_review");
      add(pages, Number(page) + 1, "image_review_following_page");
    }
    for (const item of book.shortPages || []) add(pages, item.page, "short_or_blank_page");
    for (const page of book.answerPagesInBody || []) add(pages, page, "answer_page_in_body");
    for (const [page, reasons] of pages) {
      targets.push({
        book: book.book,
        page: Number(page),
        reasons: [...reasons].sort(),
      });
    }
  }
  return targets.sort((a, b) => a.book.localeCompare(b.book) || a.page - b.page);
}

function add(pages, page, reason) {
  const number = Number(page);
  if (!Number.isInteger(number) || number < 1) return;
  if (!pages.has(number)) pages.set(number, new Set());
  pages.get(number).add(reason);
}

function outputFile(book, page) {
  return path.join(OUT_DIR, `cambridge-ielts-${book}`, `page-${String(page).padStart(3, "0")}.png`);
}

function renderTarget(target) {
  const pdf = pdfPath(target.book);
  if (!fs.existsSync(pdf)) throw new Error(`Missing ${rel(pdf)}`);
  const outFile = outputFile(target.book, target.page);
  ensureDir(path.dirname(outFile));
  if (fs.existsSync(outFile)) return { ...target, image: rel(outFile), status: "exists" };

  const prefix = path.join(path.dirname(outFile), `render-page-${String(target.page).padStart(3, "0")}`);
  for (const stale of fs.readdirSync(path.dirname(outFile))) {
    if (stale.startsWith(path.basename(prefix)) && stale.endsWith(".png")) {
      fs.unlinkSync(path.join(path.dirname(outFile), stale));
    }
  }

  const result = spawnSync(
    POPPLER_BIN,
    ["-f", String(target.page), "-l", String(target.page), "-r", String(DPI), "-png", pdf, prefix],
    { cwd: ROOT, encoding: "utf8" }
  );
  if (result.status !== 0) {
    throw new Error(
      `pdftoppm failed for IELTS ${target.book} page ${target.page}: ${result.error || result.stderr || result.stdout || "no output"}`
    );
  }

  const rendered = fs
    .readdirSync(path.dirname(outFile))
    .filter((name) => name.startsWith(path.basename(prefix)) && name.endsWith(".png"))
    .map((name) => path.join(path.dirname(outFile), name));
  if (rendered.length !== 1) {
    throw new Error(`Expected one rendered file for IELTS ${target.book} page ${target.page}, got ${rendered.length}`);
  }
  fs.renameSync(rendered[0], outFile);
  return { ...target, image: rel(outFile), status: "rendered" };
}

function writeManifest(items) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    dpi: DPI,
    count: items.length,
    items,
  };
  const jsonPath = path.join(OUT_DIR, "cambridge-pdf-review-manifest.json");
  fs.writeFileSync(jsonPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const lines = [
    "# Cambridge IELTS PDF Review Images",
    "",
    `Generated at: ${manifest.generatedAt}`,
    `DPI: ${DPI}`,
    `Images: ${items.length}`,
    "",
    "| Book | Page | Reasons | Image |",
    "| --- | ---: | --- | --- |",
  ];
  for (const item of items) {
    lines.push(
      `| ${item.book} | ${item.page} | ${item.reasons.join(", ")} | ${item.image.replace(/\\/g, "/")} |`
    );
  }
  const mdPath = path.join(OUT_DIR, "cambridge-pdf-review-manifest.md");
  fs.writeFileSync(mdPath, `${lines.join("\n")}\n`);
  return { jsonPath, mdPath };
}

function main() {
  if (!fs.existsSync(REPORT)) throw new Error(`Missing ${rel(REPORT)}`);
  if (!fs.existsSync(POPPLER_BIN)) throw new Error(`Missing ${POPPLER_BIN}`);
  ensureDir(OUT_DIR);
  const report = JSON.parse(fs.readFileSync(REPORT, "utf8"));
  const targets = collectTargets(report).filter((target) => target.page <= pageCount(target.book));
  const rendered = targets.map(renderTarget);
  const files = writeManifest(rendered);
  const newCount = rendered.filter((item) => item.status === "rendered").length;
  console.log(`rendered ${newCount}, existing ${rendered.length - newCount}, total ${rendered.length}`);
  console.log(`manifest ${rel(files.jsonPath)}`);
  console.log(`manifest ${rel(files.mdPath)}`);
}

main();
