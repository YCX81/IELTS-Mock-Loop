import fs from "node:fs";
import path from "node:path";

const files = [
  "data/generated/page-json/cambridge-ielts-09.pages.json",
  "data/generated/text-pages/cambridge-ielts-09.raw.md",
  "data/cambridge-test-bank.json",
  "data/generated/reports/cambridge-test-bank.json",
  "data/cambridge-test-bank.js",
];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (/\.(?:json|md)$/.test(entry.name)) files.push(target);
  }
}

walk("work/calibration/cambridge-09");

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  let after = before.replaceAll("FALES", "FALSE");
  after = after
    .replaceAll("（原书将 FALSE 印作 FALSE）", "")
    .replaceAll("（原书将 FALSE 印为 FALSE）", "")
    .replaceAll("（原书印作 FALSE）", "")
    .replaceAll("（原书如此拼写）", "")
    .replaceAll("（原页拼作 FALSE）", "")
    .replaceAll("（原书拼写）", "")
    .replace(
      /原书判断标签印作“FALSE”，本文件逐字符保留该印刷形式；?/g,
      "题页使用标准判断标签“FALSE”；",
    )
    .replace(
      /题页原样印作 TRUE \/ FALSE \/ NOT GIVEN；?/g,
      "题页使用 TRUE / FALSE / NOT GIVEN；",
    );
  if (after !== before) {
    fs.writeFileSync(file, after);
    console.log(`Corrected FALSE labels in ${file}`);
  }
}
