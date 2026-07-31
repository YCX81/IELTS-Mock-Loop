const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert.match(index, /data-view="intensive"/, "the primary navigation should expose intensive reading");
assert.match(index, /data\/intensive-reading-catalog\.js/, "the canonical 216-passage catalog should load");
assert.match(index, /intensive-reading-parser\.js/, "the Markdown parser should load before the app");
assert.match(index, /intensive-reading-utils\.js/, "the learning-state utilities should load before the app");

[
  "renderIntensiveReading",
  "openIntensivePassage",
  "renderIntensiveLibrary",
  "renderIntensiveStudy",
  "renderIntensiveDueQueue",
  "renderIntensiveProgressOverview",
  "renderIntensiveExpressionBank",
  "intensiveTimedReadMetrics",
].forEach((name) => {
  assert.match(app, new RegExp(`function ${name}\\b`), `${name} should be implemented`);
});

[
  "open-intensive-passage",
  "set-intensive-display",
  "reveal-intensive-unit",
  "complete-intensive-stage",
  "rate-intensive-review",
  "save-intensive-expression",
  "close-intensive-passage",
  "export-intensive-expressions",
].forEach((action) => {
  assert.match(app, new RegExp(`action === "${action}"`), `${action} should be handled`);
});

assert.match(app, /data-action="set-intensive-level"/, "learners should be able to select a support level");
assert.match(app, /阅读速度/, "timed reading should report a learning-facing speed metric");
assert.match(app, /durationSec < 60/, "very short timed-reading attempts should not produce misleading WPM");
assert.match(app, /句 \$\{index \+ 1\}/, "reader labels should be learning-facing rather than internal IDs");
assert.match(app, /个人表达库/, "saved expressions should be reviewable outside one passage");

[
  ".intensive-layout",
  ".intensive-reader",
  ".intensive-unit",
  ".intensive-due-list",
  ".intensive-stage-progress",
].forEach((selector) => {
  assert.ok(styles.includes(selector), `${selector} should have an explicit style contract`);
});

console.log("PASS: intensive reading is wired into navigation, canonical content, active study, review, and responsive UI.");
