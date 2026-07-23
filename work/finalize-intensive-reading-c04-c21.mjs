import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonRoot = path.join(root, "data/generated/intensive-reading");
const writeManifests = process.argv.includes("--write-manifests");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function parseBankJs() {
  const source = fs
    .readFileSync(path.join(root, "data/cambridge-test-bank.js"), "utf8")
    .trim();
  const prefix = "window.CAMBRIDGE_TEST_BANK = ";
  assert(source.startsWith(prefix), "Unexpected bank JS prefix");
  return JSON.parse(source.slice(prefix.length).replace(/;\s*$/, ""));
}

function sentenceNumbers(text, file) {
  const questionHeading =
    /^#{1,4}\s+.*(?:题目与选项精讲|Questions?\s+\d|Question\s+\d).*$/m.exec(
      text,
    );
  const body = questionHeading ? text.slice(0, questionHeading.index) : text;
  const patterns = [
    /^#{2,4}\s+句\s*0*(\d+)(?:\s*[（(].*)?\s*$/gm,
    /^#{2,4}\s+0*(\d+)\s*[（(][A-Z]\d+[）)]\s*$/gm,
    /^#{2,4}\s+(?:句\s*)?0*(\d+)(?:[.、]\s+.*)?\s*$/gm,
    /^\*\*0*(\d+)\.\s+.+\*\*\s*$/gm,
    /^\*\*(?:句\s*)?0*(\d+)\*\*\s*$/gm,
    /^0*(\d+)\s*$/gm,
  ];

  for (const pattern of patterns) {
    const values = [...body.matchAll(pattern)].map((match) => Number(match[1]));
    if (
      values.length > 0 &&
      values.every((value, index) => value === index + 1)
    ) {
      return values;
    }
  }
  throw new Error(`${file}: no exact 1..N body sentence sequence`);
}

function lessonMetrics(absolutePath) {
  if (writeManifests) {
    const original = fs.readFileSync(absolutePath, "utf8");
    const normalized = original.replaceAll("A 层深挖", "A层深挖");
    if (normalized !== original) fs.writeFileSync(absolutePath, normalized, "utf8");
  }
  const buffer = fs.readFileSync(absolutePath);
  const text = buffer.toString("utf8");
  const relativePath = path.relative(root, absolutePath).replaceAll("\\", "/");
  const numbers = sentenceNumbers(text, relativePath);
  const links = (text.match(/https:\/\/dictionary\.cambridge\.org\//g) ?? [])
    .length;
  const deepDives = (text.match(/A层深挖/g) ?? []).length;
  const markdownImages = (
    text.match(/!\[[^\]]*]\((?:[^()]|\([^)]*\))*\)/g) ?? []
  );
  const htmlImages = text.match(/<img\b[^>]*>/gi) ?? [];
  const allImages = [...markdownImages, ...htmlImages];
  const pageImages = allImages.filter((value) =>
    /(?:page-\d{3}\.(?:png|jpe?g|webp)|answer-page-\d+|正文第|原书页面)/i.test(
      value,
    ),
  );
  const internalNotes = (
    text.match(
      /^#{1,6}\s+.*(?:内部(?:校准|审校|核验)|校准记录|审校说明|核验说明).*$/gim,
    ) ?? []
  ).length;

  assert.equal(links, 3, `${relativePath}: Cambridge links`);
  assert.equal(deepDives, 3, `${relativePath}: A-layer deep dives`);
  assert.equal(pageImages.length, 0, `${relativePath}: whole-page image`);
  assert.equal(internalNotes, 0, `${relativePath}: internal audit notes`);
  assert(
    /(?:题目与选项精讲|Questions?\s+\d|Question\s+\d)/.test(text),
    `${relativePath}: missing question explanations`,
  );

  return {
    relativePath,
    sentenceCount: numbers.length,
    links,
    deepDives,
    images: allImages.length,
    sha256: sha256(buffer),
  };
}

function discoverLessons() {
  const lessons = [];
  for (const directoryName of fs.readdirSync(lessonRoot)) {
    if (!/^cambridge-\d{2}-\d{2}$/.test(directoryName)) continue;
    const directory = path.join(lessonRoot, directoryName);
    for (const name of fs.readdirSync(directory)) {
      if (!name.endsWith(".md")) continue;
      const match =
        /^Cambridge-IELTS-(\d+)-Test-(\d+)-Passage-(\d+)-.+\.md$/.exec(name);
      if (!match) continue;
      const book = Number(match[1]);
      if (book < 4 || book > 21) continue;
      lessons.push({
        book,
        test: Number(match[2]),
        passage: Number(match[3]),
        name,
        absolutePath: path.join(directory, name),
      });
    }
  }
  return lessons;
}

function auditBank() {
  const canonical = readJson("data/cambridge-test-bank.json");
  const report = readJson("data/generated/reports/cambridge-test-bank.json");
  const browser = parseBankJs();
  assert.deepEqual(report, canonical, "Canonical/report bank mirrors");
  assert.deepEqual(browser, canonical, "Canonical/JS bank mirrors");

  const tests = canonical.tests.filter((test) => {
    const match = /^cambridge-(\d+)-reading-test-(\d+)$/.exec(test.id);
    return match && Number(match[1]) >= 4 && Number(match[1]) <= 21;
  });
  assert.equal(tests.length, 72, "C4-C21 test count");

  for (const test of tests) {
    const readingSections = test.readingSections.filter(
      (section) =>
        /reading/i.test(String(section.kind ?? "")) &&
        !/^(?:Overview|Questions?\b)/i.test(String(section.title ?? "")),
    );
    assert.equal(readingSections.length, 3, `${test.id}: reading passages`);
    assert.equal(test.questions.length, 40, `${test.id}: question count`);
    assert(
      typeof test.answerKeyText === "string" && test.answerKeyText.trim(),
      `${test.id}: answer-key text`,
    );
  }

  return tests.length;
}

function manifestPaths() {
  const results = [];
  for (const directoryName of fs.readdirSync(lessonRoot)) {
    if (!/^cambridge-\d{2}-\d{2}$/.test(directoryName)) continue;
    const directory = path.join(lessonRoot, directoryName);
    for (const name of fs.readdirSync(directory)) {
      if (/^manifest.*\.json$/.test(name)) results.push(path.join(directory, name));
    }
  }
  return results;
}

function refreshAndAuditManifests(metricsByPath) {
  const indexedPaths = new Set();
  let recordCount = 0;

  for (const manifestPath of manifestPaths()) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    for (const value of Object.values(manifest)) {
      if (!Array.isArray(value)) continue;
      for (const record of value) {
        if (!record || typeof record !== "object" || !record.file) continue;
        const normalized = String(record.file).replaceAll("\\", "/");
        const metrics = metricsByPath.get(normalized);
        if (!metrics) continue;
        record.sentenceCount = metrics.sentenceCount;
        record.sha256 = metrics.sha256;
        record.links = metrics.links;
        record.deepDives = metrics.deepDives;
        record.images = metrics.images;
        record.partial = false;
        indexedPaths.add(normalized);
        recordCount += 1;
      }
    }
    if (writeManifests) {
      manifest.generatedAt = new Date().toISOString();
      fs.writeFileSync(
        manifestPath,
        `${JSON.stringify(manifest, null, 2)}\n`,
        "utf8",
      );
    }
  }

  assert.equal(indexedPaths.size, 216, "Unique lessons indexed by manifests");
  for (const [relativePath, metrics] of metricsByPath) {
    assert(indexedPaths.has(relativePath), `${relativePath}: absent from manifests`);
    assert(metrics.sha256, `${relativePath}: missing hash`);
  }
  return { manifests: manifestPaths().length, recordCount };
}

const lessons = discoverLessons();
assert.equal(lessons.length, 216, "C4-C21 canonical lesson file count");
const coordinateCounts = new Map();
const metricsByPath = new Map();
const books = {};

for (const lesson of lessons) {
  const coordinate = `${lesson.book}-${lesson.test}-${lesson.passage}`;
  coordinateCounts.set(coordinate, (coordinateCounts.get(coordinate) ?? 0) + 1);
  const metrics = lessonMetrics(lesson.absolutePath);
  metricsByPath.set(metrics.relativePath, metrics);
  const summary = (books[lesson.book] ??= {
    lessons: 0,
    sentences: 0,
    images: 0,
  });
  summary.lessons += 1;
  summary.sentences += metrics.sentenceCount;
  summary.images += metrics.images;
}

for (let book = 4; book <= 21; book += 1) {
  assert.equal(books[book]?.lessons, 12, `Cambridge ${book}: lesson count`);
  for (let test = 1; test <= 4; test += 1) {
    for (let passage = 1; passage <= 3; passage += 1) {
      assert.equal(
        coordinateCounts.get(`${book}-${test}-${passage}`),
        1,
        `Cambridge ${book} Test ${test} Passage ${passage}: unique lesson`,
      );
    }
  }
}

const bankTests = auditBank();
const manifestSummary = refreshAndAuditManifests(metricsByPath);
console.log(
  JSON.stringify(
    {
      lessons: lessons.length,
      books,
      bankTests,
      bankMirrorsEqual: true,
      ...manifestSummary,
      manifestsWritten: writeManifests,
    },
    null,
    2,
  ),
);
