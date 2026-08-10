const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { parseIntensiveReadingMarkdown } = require("../intensive-reading-parser.js");

const repoRoot = path.resolve(__dirname, "..");
const catalog = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, "data", "generated", "intensive-reading", "canonical-catalog.json"),
    "utf8"
  )
);

assert.equal(catalog.items.length, 216, "quality gate must cover every canonical lesson");

const strengthenedLessonIds = new Set([
  "cambridge-04-reading-test-3-passage-1",
  "cambridge-05-reading-test-1-passage-2",
  "cambridge-06-reading-test-2-passage-2",
  "cambridge-07-reading-test-3-passage-1",
  "cambridge-07-reading-test-4-passage-1",
  "cambridge-07-reading-test-4-passage-2",
  "cambridge-08-reading-test-1-passage-1",
  "cambridge-09-reading-test-1-passage-1",
  "cambridge-09-reading-test-1-passage-2",
  "cambridge-09-reading-test-1-passage-3",
  "cambridge-09-reading-test-2-passage-1",
  "cambridge-09-reading-test-2-passage-2",
  "cambridge-09-reading-test-2-passage-3",
  "cambridge-09-reading-test-3-passage-1",
  "cambridge-09-reading-test-3-passage-2",
  "cambridge-09-reading-test-3-passage-3",
  "cambridge-09-reading-test-4-passage-1",
  "cambridge-09-reading-test-4-passage-2",
  "cambridge-09-reading-test-4-passage-3",
  "cambridge-14-reading-test-4-passage-1",
  "cambridge-16-reading-test-3-passage-3",
  "cambridge-17-reading-test-4-passage-2",
  "cambridge-18-reading-test-1-passage-2",
  "cambridge-18-reading-test-2-passage-2",
  "cambridge-20-reading-test-2-passage-2",
]);
assert.equal(strengthenedLessonIds.size, 25);

const failures = [];
for (const item of catalog.items) {
  const lesson = parseIntensiveReadingMarkdown(
    fs.readFileSync(path.join(repoRoot, ...item.canonicalPath.split("/")), "utf8"),
    { idPrefix: item.id }
  );

  const structuralUnits = lesson.units.filter((unit) => /^(?:Section|Paragraph)\s+[A-Z]$/i.test(unit.english));
  if (structuralUnits.length) {
    failures.push(`${item.id}: structural labels parsed as units (${structuralUnits.length})`);
  }
  if (lesson.deepDives.length < 3 || lesson.deepDives.length > 5) {
    failures.push(`${item.id}: expected 3-5 A-layer deep dives, found ${lesson.deepDives.length}`);
  }
  for (const dive of lesson.deepDives) {
    if (!dive.content.trim()) failures.push(`${item.id}: empty A-layer deep dive ${dive.title}`);
    if (!lesson.units.some((unit) => unit.id === dive.unitId)) {
      failures.push(`${item.id}: orphan A-layer deep dive ${dive.title}`);
    }
    if (strengthenedLessonIds.has(item.id)) {
      const chineseCharacterCount = (dive.content.match(/[\u3400-\u9fff]/g) || []).length;
      const migrationExampleCount = (
        dive.content.match(/[A-Z][^.!?\n]{12,}[.!?]/g) || []
      ).length;
      const explainsArticleRole =
        /(?:语境作用|文章|作者|本句|原句|标题|这里|作用|突出|强调|承接|推动|回扣|写出|写成|说明)/.test(
          dive.content
        );
      const explainsUsageBoundary =
        /(?:近义|相近|相比|普通|不同|语气|边界|不适合|不宜|不能|表示|辨析|更)/.test(
          dive.content
        );
      if (
        dive.content.length < 200 ||
        chineseCharacterCount < 80 ||
        migrationExampleCount < 2 ||
        !explainsArticleRole ||
        !explainsUsageBoundary
      ) {
        failures.push(`${item.id}: incomplete strengthened A-layer deep dive ${dive.title}`);
      }
    }
  }
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log("PASS: all 216 canonical lessons expose 3-5 non-orphaned A-layer deep dives without structural-label units.");
