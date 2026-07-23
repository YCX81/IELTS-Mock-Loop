import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const c09LessonDir =
  "data/generated/intensive-reading/cambridge-07-09";
const c10c11LessonDir =
  "data/generated/intensive-reading/cambridge-10-12";
const c09WorktreeLessonDir =
  "worktrees/cambridge-09/data/generated/intensive-reading/cambridge-07-09";
const c09ManifestPath = `${c09LessonDir}/manifest-09.json`;
const c10c12ManifestPath = `${c10c11LessonDir}/manifest.json`;
const expectedAnswerPages = {
  9: [148, 150, 152, 154],
  10: [144, 146, 148, 150],
  11: [123, 125, 127, 129],
};

function absolute(relativePath) {
  return path.join(root, ...relativePath.split("/"));
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(absolute(relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(absolute(relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function parseBankJs() {
  const source = fs
    .readFileSync(absolute("data/cambridge-test-bank.js"), "utf8")
    .trim();
  const prefix = "window.CAMBRIDGE_TEST_BANK = ";
  assert(source.startsWith(prefix), "Unexpected bank JS prefix");
  return JSON.parse(source.slice(prefix.length).replace(/;\s*$/, ""));
}

function getBankTest(bank, book, test) {
  const id = `cambridge-${String(book).padStart(2, "0")}-reading-test-${test}`;
  const result = bank.tests.find((item) => item.id === id);
  assert(result, `Missing bank test ${id}`);
  return result;
}

function getReadingSections(test) {
  return (test.readingSections ?? []).filter((section) => {
    const kind = String(section.kind ?? "");
    return /reading/i.test(kind) && !/question/i.test(kind);
  });
}

function questionRange(passage) {
  if (passage === 1) return [1, 13];
  if (passage === 2) return [14, 26];
  return [27, 40];
}

function calibrationPath(book, test, passage) {
  const suffix = book === 9 ? "-intensive" : "";
  return `work/calibration/cambridge-${String(book).padStart(
    2,
    "0",
  )}/test-${test}/passage-${passage}${suffix}.json`;
}

function testCalibrationPath(book, test) {
  return `work/calibration/cambridge-${String(book).padStart(
    2,
    "0",
  )}/test-${test}/test.json`;
}

function c09CanonicalNames() {
  const directory = absolute(c09WorktreeLessonDir);
  assert(fs.existsSync(directory), "Missing Cambridge 9 authoritative worktree");
  const names = fs
    .readdirSync(directory)
    .filter(
      (name) =>
        name.startsWith("Cambridge-IELTS-09-Test-") && name.endsWith(".md"),
    )
    .sort();
  assert.equal(names.length, 12, "C9 worktree canonical filename count");
  return names;
}

function c09Coordinates(name) {
  const match =
    /^Cambridge-IELTS-09-Test-(\d{2})-Passage-(\d{2})-.+\.md$/.exec(name);
  assert(match, `Unexpected C9 canonical filename: ${name}`);
  return { test: Number(match[1]), passage: Number(match[2]) };
}

function c09CanonicalMap() {
  const entries = c09CanonicalNames().map((name) => {
    const coordinates = c09Coordinates(name);
    return [`${coordinates.test}-${coordinates.passage}`, name];
  });
  const result = new Map(entries);
  assert.equal(result.size, 12, "C9 canonical test/passage coordinate count");
  return result;
}

function canonicalRelativePath(book, test, passage, c09Names) {
  if (book === 9) {
    const name = c09Names.get(`${test}-${passage}`);
    assert(name, `Missing C9 canonical name for T${test} P${passage}`);
    return `${c09LessonDir}/${name}`;
  }
  return `${c10c11LessonDir}/Cambridge-IELTS-${book}-Test-${test}-Passage-${passage}-双语精读.md`;
}

function sentenceNumbers(text, relativePath) {
  const questionHeading = /^#{1,4}\s+.*题目与选项精讲.*$/m.exec(text);
  const lessonBody = questionHeading ? text.slice(0, questionHeading.index) : text;
  const patterns = [
    /^#{2,4}\s+句\s*0*(\d+)(?:\s*[（(].*)?\s*$/gm,
    /^#{2,4}\s+(?:句\s*)?0*(\d+)(?:[.、]\s+.*)?\s*$/gm,
    /^\*\*(?:句\s*)?0*(\d+)\*\*\s*$/gm,
    /^0*(\d+)\s*$/gm,
  ];

  for (const pattern of patterns) {
    const values = [...lessonBody.matchAll(pattern)].map((match) =>
      Number(match[1]),
    );
    const expected = Array.from(
      { length: values.length },
      (_, index) => index + 1,
    );
    if (values.length > 0 && values.every((value, index) => value === expected[index])) {
      return values;
    }
  }

  throw new Error(`${relativePath}: no exact 1..N sentence sequence`);
}

function lessonMetrics(relativePath) {
  const buffer = fs.readFileSync(absolute(relativePath));
  const text = buffer.toString("utf8");
  const numbers = sentenceNumbers(text, relativePath);
  const links = (text.match(/https:\/\/dictionary\.cambridge\.org\//g) ?? [])
    .length;
  const deepDives = (text.match(/A\s*层深挖/g) ?? []).length;
  const markdownImages = (
    text.match(/!\[[^\]]*]\((?:[^()]|\([^)]*\))*\)/g) ?? []
  ).length;
  const htmlImages = (text.match(/<img\b[^>]*>/gi) ?? []).length;
  const images = markdownImages + htmlImages;

  assert.equal(links, 3, `${relativePath}: Cambridge links`);
  assert.equal(deepDives, 3, `${relativePath}: A-layer deep dives`);

  return {
    sentenceCount: numbers.length,
    links,
    deepDives,
    images,
    sha256: sha256(buffer),
    mtimeMs: fs.statSync(absolute(relativePath)).mtimeMs,
  };
}

function calibrationQuestionSectionCount(calibration) {
  const sections =
    calibration.questionGroups ??
    calibration.questionSections ??
    calibration.section?.questionGroups;
  assert(
    Array.isArray(sections) ||
      (sections && typeof sections === "object"),
    "Calibration has no question sections",
  );
  return Array.isArray(sections) ? sections.length : Object.keys(sections).length;
}

function uniquePages(values) {
  return [...new Set(values.filter(Number.isInteger))].sort((a, b) => a - b);
}

function calibrationSourcePages(calibration) {
  const sourcePages = calibration.sourcePages;
  if (Array.isArray(sourcePages)) return uniquePages(sourcePages);
  if (sourcePages && typeof sourcePages === "object") {
    return uniquePages([
      ...(sourcePages.passage ?? []),
      ...(sourcePages.questions ?? []),
    ]);
  }
  return uniquePages([
    ...(calibration.passagePages ?? calibration.bodyPages ?? []),
    ...(calibration.questionPages ?? []),
  ]);
}

function calibrationAnswerPage(calibration) {
  return (
    calibration.answerKeyPage ??
    calibration.sourcePages?.answerKeyPage ??
    null
  );
}

function assertExpectedImages(book, test, passage, images) {
  const expected = (
    (book === 9 && test === 3 && passage === 2)
    || (book === 11 && test === 1 && passage === 2)
    || (book === 11 && test === 2 && passage === 1)
  ) ? 1 : 0;
  assert.equal(
    images,
    expected,
    `C${book} T${test} P${passage}: semantic image count`,
  );
}

function buildEntries(bank, book, c09Names) {
  const entries = [];

  for (let test = 1; test <= 4; test += 1) {
    const bankTest = getBankTest(bank, book, test);
    const readingSections = getReadingSections(bankTest);
    assert.equal(readingSections.length, 3, `${bankTest.id}: reading count`);
    const testCalibration =
      book === 9 ? readJson(testCalibrationPath(book, test)) : null;

    for (let passage = 1; passage <= 3; passage += 1) {
      const calibration = readJson(calibrationPath(book, test, passage));
      const file = canonicalRelativePath(book, test, passage, c09Names);
      assert(fs.existsSync(absolute(file)), `Missing canonical lesson ${file}`);
      const metrics = lessonMetrics(file);
      assertExpectedImages(book, test, passage, metrics.images);

      if (book === 9) {
        assert.equal(
          metrics.sentenceCount,
          calibration.sentences.length,
          `C9 T${test} P${passage}: lesson/calibration sentence count`,
        );
      }

      const sourcePages =
        book === 9
          ? uniquePages(readingSections[passage - 1].pages ?? [])
          : calibrationSourcePages(calibration);
      assert(sourcePages.length > 0, `C${book} T${test} P${passage}: pages`);

      const answerKeyPage =
        book === 9
          ? testCalibration.answerKeyPage
          : calibrationAnswerPage(calibration);
      assert.equal(
        answerKeyPage,
        expectedAnswerPages[book][test - 1],
        `C${book} T${test} P${passage}: answer page`,
      );

      entries.push({
        key: `${book}-${test}-${passage}`,
        book,
        test,
        passage,
        title: calibration.title ?? null,
        file,
        sentenceCount: metrics.sentenceCount,
        questionRange: questionRange(passage),
        questionSectionCount: calibrationQuestionSectionCount(calibration),
        sourcePages,
        answerKeyPage,
        sha256: metrics.sha256,
        links: metrics.links,
        deepDives: metrics.deepDives,
        images: metrics.images,
        partial: false,
        _mtimeMs: metrics.mtimeMs,
      });
    }
  }

  assert.equal(entries.length, 12, `C${book} entry count`);
  return entries;
}

function publicEntries(entries) {
  return entries.map(({ _mtimeMs, ...entry }) => entry);
}

function stableGeneratedAt(entries) {
  return new Date(Math.max(...entries.map((entry) => entry._mtimeMs))).toISOString();
}

function removeC09Duplicates(c09Names) {
  // Windows preserves filename casing but resolves paths case-insensitively.
  // Two canonical C9 names differ from their existing copies only by case.
  const keep = new Set(
    [...c09Names.values()].map((name) => name.toLocaleLowerCase("en-US")),
  );
  const directory = absolute(c09LessonDir);
  const duplicates = fs
    .readdirSync(directory)
    .filter(
      (name) =>
        name.startsWith("Cambridge-IELTS-09-Test-") &&
        name.endsWith(".md") &&
        !keep.has(name.toLocaleLowerCase("en-US")),
    )
    .sort();
  assert(
    duplicates.length === 0 || duplicates.length === 17,
    `Expected 0 or 17 C9 duplicate lessons, found ${duplicates.length}`,
  );
  for (const name of duplicates) fs.unlinkSync(path.join(directory, name));
  return duplicates;
}

function normalizeC09FilenameCase(c09Names) {
  const directory = absolute(c09LessonDir);
  const existing = fs.readdirSync(directory);
  const renamed = [];

  for (const canonicalName of c09Names.values()) {
    const actualName = existing.find(
      (name) =>
        name.toLocaleLowerCase("en-US") ===
        canonicalName.toLocaleLowerCase("en-US"),
    );
    assert(actualName, `Missing C9 canonical lesson: ${canonicalName}`);
    if (actualName === canonicalName) continue;

    const temporaryName = `${actualName}.case-normalization.tmp`;
    assert(
      !fs.existsSync(path.join(directory, temporaryName)),
      `Temporary filename already exists: ${temporaryName}`,
    );
    fs.renameSync(
      path.join(directory, actualName),
      path.join(directory, temporaryName),
    );
    fs.renameSync(
      path.join(directory, temporaryName),
      path.join(directory, canonicalName),
    );
    renamed.push({ from: actualName, to: canonicalName });
  }

  return renamed;
}

function writeManifests(entriesByBook) {
  const c09Entries = publicEntries(entriesByBook[9]);
  writeJson(c09ManifestPath, {
    generatedAt: stableGeneratedAt(entriesByBook[9]),
    book: 9,
    generatedCount: 12,
    recoveredCount: 0,
    skippedCount: 0,
    sourceBank: "data/cambridge-test-bank.json",
    outputDir: c09LessonDir,
    files: c09Entries,
    entries: c09Entries,
    skipped: [],
  });

  const oldManifest = readJson(c10c12ManifestPath);
  const c12Entries = (oldManifest.files ?? []).filter(
    (entry) => Number(entry.book) === 12,
  );
  assert.equal(c12Entries.length, 12, "C12 entries must be preserved");
  const c10Entries = publicEntries(entriesByBook[10]);
  const c11Entries = publicEntries(entriesByBook[11]);
  const allEntries = [...c10Entries, ...c11Entries, ...c12Entries];
  writeJson(c10c12ManifestPath, {
    generatedAt: stableGeneratedAt([
      ...entriesByBook[10],
      ...entriesByBook[11],
    ]),
    scope: "Cambridge IELTS 10-12 Reading passages",
    sourceBank: "data/cambridge-test-bank.json",
    outputDir: c10c11LessonDir,
    files: allEntries,
    repairs: [],
    skipped: [],
    summary: {
      generatedPassageFiles: 36,
      recoveredSources: 0,
      partialRecoveries: 0,
      skipped: 0,
      books: [10, 11, 12],
    },
  });
}

function assertBank(bank) {
  for (const book of [9, 10, 11]) {
    for (let test = 1; test <= 4; test += 1) {
      const bankTest = getBankTest(bank, book, test);
      assert.equal(
        getReadingSections(bankTest).length,
        3,
        `${bankTest.id}: reading sections`,
      );
      assert.equal(bankTest.questions?.length, 40, `${bankTest.id}: questions`);
      const numbers = bankTest.questions.map((question) =>
        Number(question.number ?? question.questionNumber),
      );
      assert.deepEqual(
        numbers,
        Array.from({ length: 40 }, (_, index) => index + 1),
        `${bankTest.id}: question numbers`,
      );
      assert.deepEqual(
        bankTest.answerKeyPages,
        [expectedAnswerPages[book][test - 1]],
        `${bankTest.id}: exact answer page`,
      );
    }
  }
}

function assertFinalState(entriesByBook, c09Names) {
  const c09Files = fs
    .readdirSync(absolute(c09LessonDir))
    .filter(
      (name) =>
        name.startsWith("Cambridge-IELTS-09-Test-") && name.endsWith(".md"),
    )
    .sort();
  assert.deepEqual(
    c09Files,
    [...c09Names.values()].sort(),
    "C9 directory must contain exactly the 12 canonical lessons",
  );

  const c09Manifest = readJson(c09ManifestPath);
  assert.equal(c09Manifest.files.length, 12, "C9 manifest file count");
  assert.deepEqual(
    c09Manifest.files,
    publicEntries(entriesByBook[9]),
    "C9 manifest content",
  );
  assert.deepEqual(
    c09Manifest.entries,
    c09Manifest.files,
    "C9 manifest files/entries aliases",
  );

  const c10c12Manifest = readJson(c10c12ManifestPath);
  for (const book of [10, 11, 12]) {
    assert.equal(
      c10c12Manifest.files.filter((entry) => Number(entry.book) === book).length,
      12,
      `C${book} manifest count`,
    );
  }
  assert.deepEqual(
    c10c12Manifest.files.filter((entry) => Number(entry.book) === 10),
    publicEntries(entriesByBook[10]),
    "C10 manifest content",
  );
  assert.deepEqual(
    c10c12Manifest.files.filter((entry) => Number(entry.book) === 11),
    publicEntries(entriesByBook[11]),
    "C11 manifest content",
  );

  for (const book of [9, 10, 11]) {
    for (const entry of publicEntries(entriesByBook[book])) {
      assert(fs.existsSync(absolute(entry.file)), `Missing ${entry.file}`);
      const metrics = lessonMetrics(entry.file);
      assert.equal(metrics.sentenceCount, entry.sentenceCount, `${entry.key}: sentences`);
      assert.equal(metrics.sha256, entry.sha256, `${entry.key}: SHA-256`);
      assert.equal(entry.partial, false, `${entry.key}: partial`);
      assertExpectedImages(book, entry.test, entry.passage, entry.images);
    }
  }
}

const canonicalBank = readJson("data/cambridge-test-bank.json");
const reportBank = readJson("data/generated/reports/cambridge-test-bank.json");
const jsBank = parseBankJs();
assert.deepEqual(reportBank, canonicalBank, "Canonical/report bank mirrors");
assert.deepEqual(jsBank, canonicalBank, "Canonical/JS bank mirrors");

const c09Names = c09CanonicalMap();
const normalizedFilenames = normalizeC09FilenameCase(c09Names);
const entriesByBook = Object.fromEntries(
  [9, 10, 11].map((book) => [
    book,
    buildEntries(canonicalBank, book, c09Names),
  ]),
);
const removedDuplicates = removeC09Duplicates(c09Names);
writeManifests(entriesByBook);
assertFinalState(entriesByBook, c09Names);
assertBank(canonicalBank);

console.log(
  JSON.stringify(
    {
      books: Object.fromEntries(
        [9, 10, 11].map((book) => [
          book,
          {
            entries: entriesByBook[book].length,
            sentences: entriesByBook[book].reduce(
              (sum, entry) => sum + entry.sentenceCount,
              0,
            ),
            images: entriesByBook[book].reduce(
              (sum, entry) => sum + entry.images,
              0,
            ),
          },
        ]),
      ),
      canonicalFiles: 36,
      c09DuplicateFilesRemoved: removedDuplicates.length,
      c09FilenameCaseNormalized: normalizedFilenames.length,
      c09MarkdownFiles: 12,
      bankTests: 12,
      bankMirrorsEqual: true,
    },
    null,
    2,
  ),
);
