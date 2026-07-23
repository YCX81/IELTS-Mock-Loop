const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const bankPath = path.join(repoRoot, "data", "generated", "reports", "cambridge-test-bank.json");
const outDir = path.join(repoRoot, "data", "generated", "intensive-reading");
const outPath = path.join(outDir, "coverage-manifest.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function wordCount(text) {
  return (String(text || "").match(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g) || []).length;
}

function questionRangeFromTitle(title) {
  const text = String(title || "");
  const pair = text.match(/Questions?\s+(\d+)\s*(?:[-–—]|and|to)\s*(\d+)/i);
  if (pair) return { start: Number(pair[1]), end: Number(pair[2]) };
  const single = text.match(/Question\s+(\d+)/i);
  if (single) return { start: Number(single[1]), end: Number(single[1]) };
  return null;
}

function passageNumber(section, fallbackIndex) {
  const match = String(section.title || "").match(/Reading Passage\s+(\d+)/i);
  return match ? Number(match[1]) : fallbackIndex + 1;
}

function isPassageSection(section) {
  return /^Reading Passage\s+[123]\b/i.test(String(section.title || ""));
}

function groupQuestionSections(test, passageNo) {
  const lower = passageNo === 1 ? 1 : passageNo === 2 ? 14 : 28;
  const upper = passageNo === 1 ? 13 : passageNo === 2 ? 27 : 40;
  return (test.readingSections || [])
    .filter((section) => String(section.kind || "") === "questions" || /^Questions?\b/i.test(String(section.title || "")))
    .map((section) => ({ section, range: questionRangeFromTitle(section.title) }))
    .filter(({ range }) => range && range.end >= lower && range.start <= upper)
    .map(({ section, range }) => ({
      title: section.title || "",
      range,
      paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs : []
    }));
}

function sanitizeFileStem(value) {
  return String(value || "")
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildManifest() {
  const bank = readJson(bankPath);
  const tests = (bank.tests || []).filter((test) => test.mode === "reading");
  const tasks = [];
  const gaps = [];

  for (const test of tests) {
    const book = (String(test.id).match(/cambridge-(\d+)/) || [])[1] || "unknown";
    const testNo = (String(test.id).match(/reading-test-(\d+)/) || [])[1] || "unknown";
    const passages = (test.readingSections || []).filter(isPassageSection);
    const seenPassageNumbers = new Set();

    passages.forEach((section, index) => {
      const number = passageNumber(section, index);
      seenPassageNumbers.add(number);
      const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
      const questionSections = groupQuestionSections(test, number);
      const titleFromBody = paragraphs.find((paragraph) => {
        const clean = String(paragraph || "").trim();
        return clean && !/^You should spend about 20 minutes/i.test(clean);
      }) || section.title || "";
      const fileStem = sanitizeFileStem(`Cambridge-IELTS-${book}-Test-${testNo}-Passage-${number}-双语精读`);

      tasks.push({
        id: `${test.id}-passage-${number}`,
        book,
        testId: test.id,
        testTitle: test.title,
        testNo: Number(testNo),
        passageNo: number,
        source: test.source || "",
        pdf: test.pdf || "",
        pages: section.pages || [],
        title: section.title || `Reading Passage ${number}`,
        inferredTitle: titleFromBody,
        paragraphCount: paragraphs.length,
        wordCount: wordCount(paragraphs.join(" ")),
        questionSections: questionSections.map((item) => ({
          title: item.title,
          range: item.range,
          paragraphCount: item.paragraphs.length,
          preview: item.paragraphs.slice(0, 3)
        })),
        outputFile: `data/generated/intensive-reading/cambridge-${book.padStart(2, "0")}/${fileStem}.md`
      });
    });

    for (const expected of [1, 2, 3]) {
      if (!seenPassageNumbers.has(expected)) {
        gaps.push({
          testId: test.id,
          testTitle: test.title,
          book,
          testNo: Number(testNo),
          missingPassageNo: expected,
          rawTextCandidate: `data/generated/text-pages/cambridge-ielts-${book.padStart(2, "0")}.raw.md`,
          reason: "structured bank lacks a standard Reading Passage section"
        });
      }
    }
  }

  const byBook = {};
  for (const task of tasks) {
    byBook[task.book] ||= { passages: 0, words: 0, gaps: 0 };
    byBook[task.book].passages += 1;
    byBook[task.book].words += task.wordCount;
  }
  for (const gap of gaps) {
    byBook[gap.book] ||= { passages: 0, words: 0, gaps: 0 };
    byBook[gap.book].gaps += 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    source: path.relative(repoRoot, bankPath).replace(/\\/g, "/"),
    expectedReadingTests: tests.length,
    expectedPassages: tests.length * 3,
    structuredPassages: tasks.length,
    structuredGaps: gaps.length,
    totalWords: tasks.reduce((sum, task) => sum + task.wordCount, 0),
    byBook,
    tasks,
    gaps
  };
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(buildManifest(), null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
