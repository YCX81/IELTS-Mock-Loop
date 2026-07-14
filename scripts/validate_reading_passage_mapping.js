const fs = require("fs");

const appSource = fs.readFileSync("app.js", "utf8");
const bank = JSON.parse(fs.readFileSync("data/generated/reports/cambridge-test-bank.json", "utf8"));
const failures = [];

if (!/function readingPassageForGroup\(/.test(appSource)) {
  failures.push("app.js must use a dedicated passage-to-question-group mapper");
}
if (!/Reading Passage \\d\+/.test(appSource) && !/Reading Passage \$\{groupIndex \+ 1\}/.test(appSource)) {
  failures.push("app.js must prefer the explicitly numbered Reading Passage for each Part");
}

for (const test of bank.tests.filter((item) => item.mode === "reading")) {
  const sections = Array.isArray(test.readingSections) ? test.readingSections : [];
  for (let index = 0; index < 3; index += 1) {
    const named = sections.find(
      (section) => String(section.title || "").trim().toLowerCase() === `reading passage ${index + 1}`,
    );
    if (named && named.kind === "questions") failures.push(`${test.id}: named passage ${index + 1} is a question section`);
  }
}

const visualTest = bank.tests.find((item) => item.id === "cambridge-04-reading-test-1");
const passage3 = (visualTest?.readingSections || []).find((section) => section.title === "Reading Passage 3");
const passage3Text = JSON.stringify(passage3 || {});
if (!passage3Text.includes("page-020-reading-spinning-wheel-figure.png")) failures.push("Cambridge 4 Test 1 Passage 3 is missing Fig. 1");
if (!passage3Text.includes("SOFT-HARD") || !passage3Text.includes("DEEP-SHALLOW")) {
  failures.push("Cambridge 4 Test 1 Passage 3 is missing the Fig. 2 table");
}

if (failures.length) {
  console.error(`FAIL: ${failures.length} reading passage mapping issue(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("OK: 72 reading tests map Part 1-3 to the three named passages; Cambridge 4 visual assets retained");
