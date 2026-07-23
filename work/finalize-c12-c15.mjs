import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonDirs = {
  12: "data/generated/intensive-reading/cambridge-10-12",
  13: "data/generated/intensive-reading/cambridge-13-15",
  14: "data/generated/intensive-reading/cambridge-13-15",
  15: "data/generated/intensive-reading/cambridge-13-15",
};
const manifestPaths = {
  12: "data/generated/intensive-reading/cambridge-10-12/manifest.json",
  13: "data/generated/intensive-reading/cambridge-13-15/manifest-13.json",
  14: "data/generated/intensive-reading/cambridge-13-15/manifest-14.json",
  15: "data/generated/intensive-reading/cambridge-13-15/manifest-15.json",
};
const expectedAnswerPages = {
  12: [117, 119, 121, 123],
  13: [118, 120, 122, 124],
  14: [120, 122, 124, 126],
  15: [122, 124, 126, 128],
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

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Number.isInteger))].sort((a, b) => a - b);
}

function canonicalRelativePath(book, test, passage) {
  return `${lessonDirs[book]}/Cambridge-IELTS-${book}-Test-${test}-Passage-${passage}-双语精读.md`;
}

function splitLessonBody(text) {
  const questionHeading =
    /^#{1,4}\s+.*(?:题目与选项精讲|题目精讲|Questions\s+\d+\s*[–-]\s*\d+.*精讲).*$/m;
  const match = questionHeading.exec(text);
  return match ? text.slice(0, match.index) : text;
}

function sequentialNumbers(values) {
  const unique = [...new Set(values)];
  return (
    unique.length > 0 &&
    unique.every((value, index) => value === index + 1)
  );
}

function detectSentenceNumbers(text, relativePath) {
  const body = splitLessonBody(text);
  const patterns = [
    /^##\s+句\s*(\d+)\s*$/gm,
    /^##\s+(\d+)\s*$/gm,
    /^###\s+句\s*(\d+)\s*$/gm,
    /^####\s+句\s*(\d+)\s*$/gm,
    /^###\s+(\d+)\s*$/gm,
    /^####\s+(\d+)\s*$/gm,
    /^####\s+(\d+)[.、]\s+.*$/gm,
    /^\*\*(\d+)\*\*\s*$/gm,
    /^(\d+)\s*$/gm,
  ];

  for (const pattern of patterns) {
    const values = [...body.matchAll(pattern)].map((match) => Number(match[1]));
    if (sequentialNumbers(values)) return values;
  }

  throw new Error(`Cannot find a continuous sentence sequence in ${relativePath}`);
}

function countLessonMetrics(relativePath) {
  const text = fs.readFileSync(absolute(relativePath), "utf8");
  const sentenceNumbers = detectSentenceNumbers(text, relativePath);
  const links = (text.match(/https:\/\/dictionary\.cambridge\.org\//g) ?? []).length;
  const deepDives = (text.match(/A\s*层深挖/g) ?? []).length;
  const images = (text.match(/!\[[^\]]*]\([^)]*\)/g) ?? []).length;

  assert.equal(links, 3, `${relativePath}: Cambridge links`);
  assert.equal(deepDives, 3, `${relativePath}: A-layer deep dives`);
  assert.equal(images, 0, `${relativePath}: images`);

  return {
    text,
    sentenceCount: sentenceNumbers.length,
    links,
    deepDives,
    images,
  };
}

function getReadingTests(bank, book) {
  return Array.from({ length: 4 }, (_, index) => {
    const testNumber = index + 1;
    const id = `cambridge-${book}-reading-test-${testNumber}`;
    const test = bank.tests.find((item) => item.id === id);
    assert(test, `Missing bank test ${id}`);
    return test;
  });
}

function readingSectionCount(test) {
  return (test.readingSections ?? []).filter((section) => {
    const kind = String(section.kind ?? "");
    return /reading/.test(kind) && !/question/.test(kind);
  }).length;
}

function calibrationPath(book, test, passage) {
  return `work/calibration/cambridge-${book}/test-${test}/passage-${passage}.json`;
}

function loadPassageCalibration(book, test, passage) {
  if (book !== 15) return readJson(calibrationPath(book, test, passage));

  const passages = readJson(
    `work/calibration/cambridge-15/test-${test}/passages.json`,
  ).passages;
  const questions = readJson(
    `work/calibration/cambridge-15/test-${test}/questions.json`,
  ).questionSections;
  const testCalibration = readJson(
    `work/calibration/cambridge-15/test-${test}/calibration.json`,
  );
  const calibratedPassage = passages.find((item) => item.passage === passage);
  assert(calibratedPassage, `Missing C15 T${test} P${passage} passage calibration`);

  return {
    ...calibratedPassage,
    questionSectionCount: questions.filter(
      (section) => section.passage === passage,
    ).length,
    answerKeyPage:
      calibratedPassage.answerKeyPage ?? testCalibration.answerKeyPage,
  };
}

function calibrationQuestionSectionCount(book, calibration) {
  if (book === 15) return calibration.questionSectionCount;
  if (Array.isArray(calibration.questionSections)) {
    return calibration.questionSections.length;
  }
  if (Array.isArray(calibration.questionGroups)) {
    return calibration.questionGroups.length;
  }
  if (Array.isArray(calibration.section?.questionGroups)) {
    return calibration.section.questionGroups.length;
  }
  throw new Error("Calibration has no question-section collection");
}

function calibrationPages(calibration, bankTest) {
  const pageCandidates = [];

  if (Array.isArray(calibration.sourcePages)) {
    pageCandidates.push(...calibration.sourcePages);
  } else if (
    calibration.sourcePages &&
    typeof calibration.sourcePages === "object"
  ) {
    pageCandidates.push(
      ...(calibration.sourcePages.passage ?? []),
      ...(calibration.sourcePages.questions ?? []),
    );
  }
  if (Array.isArray(calibration.bodySourcePages)) {
    pageCandidates.push(...calibration.bodySourcePages);
  }
  if (Array.isArray(calibration.questionPages)) {
    pageCandidates.push(...calibration.questionPages);
  }
  if (Array.isArray(calibration.section?.pages)) {
    pageCandidates.push(...calibration.section.pages);
  }
  if (Array.isArray(calibration.section?.questionPages)) {
    pageCandidates.push(...calibration.section.questionPages);
  }
  if (Array.isArray(calibration.pages)) {
    pageCandidates.push(
      ...calibration.pages.map((item) =>
        Number.isInteger(item) ? item : item.page ?? item.physicalPage,
      ),
    );
  } else if (calibration.pages && typeof calibration.pages === "object") {
    pageCandidates.push(
      ...(calibration.pages.passage ?? []),
      ...(calibration.pages.questions ?? []),
    );
  }
  if (Array.isArray(calibration.pageTexts)) {
    pageCandidates.push(
      ...calibration.pageTexts.map((item) => item.page ?? item.physicalPage),
    );
  }

  const bankPages = new Set(bankTest.sourcePages ?? []);
  const pages = uniqueSorted(pageCandidates).filter((page) => bankPages.has(page));
  assert(pages.length > 0, `No calibrated source pages for ${bankTest.id}`);
  return pages;
}

function calibrationTitle(calibration) {
  return calibration.title ?? calibration.section?.title ?? null;
}

function buildEntries(bank, book) {
  const tests = getReadingTests(bank, book);
  const entries = [];

  for (let test = 1; test <= 4; test += 1) {
    const bankTest = tests[test - 1];
    for (let passage = 1; passage <= 3; passage += 1) {
      const calibration = loadPassageCalibration(book, test, passage);
      const file = canonicalRelativePath(book, test, passage);
      assert(fs.existsSync(absolute(file)), `Missing canonical lesson ${file}`);
      const metrics = countLessonMetrics(file);
      const questionRange =
        passage === 1 ? [1, 13] : passage === 2 ? [14, 26] : [27, 40];
      const answerKeyPage =
        calibration.answerKeyPage ?? expectedAnswerPages[book][test - 1];

      assert.equal(
        answerKeyPage,
        expectedAnswerPages[book][test - 1],
        `Calibration answer page C${book} T${test} P${passage}`,
      );

      entries.push({
        key: `${book}-${test}-${passage}`,
        book,
        test,
        passage,
        title: calibrationTitle(calibration),
        file,
        sentenceCount: metrics.sentenceCount,
        questionRange,
        questionSectionCount: calibrationQuestionSectionCount(book, calibration),
        sourcePages: calibrationPages(calibration, bankTest),
        answerKeyPage,
        sha256: sha256(metrics.text),
        links: metrics.links,
        deepDives: metrics.deepDives,
        images: metrics.images,
        partial: false,
      });
    }
  }

  assert.equal(entries.length, 12, `C${book} manifest entry count`);
  return entries;
}

function writeManifests(entriesByBook) {
  const oldC12Manifest = readJson(manifestPaths[12]);
  const preserved = oldC12Manifest.files.filter(
    (entry) => Number(entry.book) !== 12,
  );
  assert.equal(preserved.length, 24, "C10-C11 manifest entries must be preserved");

  const c12Manifest = {
    ...oldC12Manifest,
    generatedAt: new Date().toISOString(),
    files: [...preserved, ...entriesByBook[12]],
    repairs: (oldC12Manifest.repairs ?? []).filter(
      (entry) => !String(entry.key ?? "").startsWith("12-"),
    ),
    summary: {
      ...oldC12Manifest.summary,
      generatedPassageFiles: 36,
      recoveredSources: (oldC12Manifest.repairs ?? []).filter(
        (entry) => !String(entry.key ?? "").startsWith("12-"),
      ).length,
      books: ["10", "11", "12"],
    },
  };
  writeJson(manifestPaths[12], c12Manifest);

  for (const book of [13, 14, 15]) {
    writeJson(manifestPaths[book], {
      generatedAt: new Date().toISOString(),
      book,
      generatedCount: 12,
      recoveredCount: 0,
      skippedCount: 0,
      sourceBank: "data/cambridge-test-bank.json",
      outputDir: lessonDirs[book],
      files: entriesByBook[book],
      skipped: [],
    });
  }
}

function removeC13ShortLessons() {
  const directory = absolute(lessonDirs[13]);
  const shortFiles = fs
    .readdirSync(directory)
    .filter(
      (name) =>
        name.startsWith("Cambridge-IELTS-13-Test-") &&
        name.endsWith("-双语精读短版.md"),
    );
  assert(
    shortFiles.length === 0 || shortFiles.length === 12,
    `Expected 0 or 12 C13 short duplicate lessons, found ${shortFiles.length}`,
  );
  for (const name of shortFiles) fs.unlinkSync(path.join(directory, name));
}

function parseBankJs() {
  const source = fs
    .readFileSync(absolute("data/cambridge-test-bank.js"), "utf8")
    .trim();
  const prefix = "window.CAMBRIDGE_TEST_BANK = ";
  assert(source.startsWith(prefix), "Unexpected bank JS prefix");
  const jsonText = source.slice(prefix.length).replace(/;\s*$/, "");
  return JSON.parse(jsonText);
}

function assertBank(bank) {
  for (const book of [12, 13, 14, 15]) {
    const tests = getReadingTests(bank, book);
    assert.equal(tests.length, 4, `C${book} reading test count`);
    for (let index = 0; index < tests.length; index += 1) {
      const test = tests[index];
      const expectedPage = expectedAnswerPages[book][index];
      assert.equal(readingSectionCount(test), 3, `${test.id}: reading sections`);
      assert.equal(test.questions?.length, 40, `${test.id}: questions`);
      assert.deepEqual(
        test.answerKeyPages,
        [expectedPage],
        `${test.id}: exact answer-key page`,
      );
      if (test.answerKeyPage !== undefined) {
        assert.equal(
          test.answerKeyPage,
          expectedPage,
          `${test.id}: answerKeyPage`,
        );
      }
    }
  }
}

function assertManifests(entriesByBook) {
  const c12 = readJson(manifestPaths[12]);
  const c12Entries = c12.files.filter((entry) => Number(entry.book) === 12);
  assert.equal(c12Entries.length, 12, "C12 manifest count");
  assert.equal(
    (c12.repairs ?? []).filter((entry) =>
      String(entry.key ?? "").startsWith("12-"),
    ).length,
    0,
    "C12 recovered references",
  );

  for (const book of [12, 13, 14, 15]) {
    const manifest = readJson(manifestPaths[book]);
    const entries =
      book === 12
        ? manifest.files.filter((entry) => Number(entry.book) === 12)
        : manifest.files;
    assert.equal(entries.length, 12, `C${book} final manifest count`);
    assert.deepEqual(entries, entriesByBook[book], `C${book} manifest content`);
    for (const entry of entries) {
      assert(fs.existsSync(absolute(entry.file)), `Missing ${entry.file}`);
      const metrics = countLessonMetrics(entry.file);
      assert.equal(metrics.sentenceCount, entry.sentenceCount, `${entry.key}: sentences`);
      assert.equal(sha256(metrics.text), entry.sha256, `${entry.key}: SHA-256`);
      assert.equal(entry.partial, false, `${entry.key}: partial`);
    }
  }

  const shortFiles = fs
    .readdirSync(absolute(lessonDirs[13]))
    .filter(
      (name) =>
        name.startsWith("Cambridge-IELTS-13-Test-") &&
        name.endsWith("-双语精读短版.md"),
    );
  assert.equal(shortFiles.length, 0, "C13 short duplicates");
}

const canonicalBank = readJson("data/cambridge-test-bank.json");
const reportBank = readJson(
  "data/generated/reports/cambridge-test-bank.json",
);
const jsBank = parseBankJs();
assert.deepEqual(reportBank, canonicalBank, "Canonical/report bank mirrors");
assert.deepEqual(jsBank, canonicalBank, "Canonical/JS bank mirrors");

const entriesByBook = Object.fromEntries(
  [12, 13, 14, 15].map((book) => [book, buildEntries(canonicalBank, book)]),
);

writeManifests(entriesByBook);
removeC13ShortLessons();
assertManifests(entriesByBook);
assertBank(canonicalBank);

console.log(
  JSON.stringify(
    {
      books: Object.fromEntries(
        [12, 13, 14, 15].map((book) => [
          book,
          {
            entries: entriesByBook[book].length,
            sentences: entriesByBook[book].reduce(
              (sum, entry) => sum + entry.sentenceCount,
              0,
            ),
          },
        ]),
      ),
      canonicalFiles: 48,
      c13ShortFiles: 0,
      bankTests: 16,
      bankMirrorsEqual: true,
    },
    null,
    2,
  ),
);
