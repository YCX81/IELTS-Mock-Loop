import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const imageExtension = /\.(?:png|jpe?g|webp|gif)$/i;

function walk(directory, predicate, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file, predicate, output);
    else if (predicate(file)) output.push(file);
  }
  return output;
}

const lessonRoot = path.join(root, "data/generated/intensive-reading");
const lessonFiles = walk(lessonRoot, (file) => file.endsWith(".md"));
const references = new Set();
const referencePaths = new Map();

const referenceSources = [
  ...lessonFiles,
  ...walk(path.join(root, "data/generated/page-json"), (file) => file.endsWith(".json")),
  ...walk(path.join(root, "data/generated/answer-pages"), (file) => /\.(?:json|md)$/i.test(file)),
  path.join(root, "data/cambridge-test-bank.json"),
  path.join(root, "data/cambridge-test-bank.js"),
  path.join(root, "data/generated/reports/cambridge-test-bank.json"),
  path.join(root, "data/cambridge-resource-index.js"),
].filter((file) => fs.existsSync(file));

for (const sourceFile of referenceSources) {
  const text = fs.readFileSync(sourceFile, "utf8");
  const sourceReferences = [
    ...[...text.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)].map((match) => match[1]),
    ...[...text.matchAll(/data\/generated\/[^"'\s)]+\.(?:png|jpe?g|webp|gif)/gi)].map((match) => match[0]),
  ];
  for (const sourceReference of sourceReferences) {
    const reference = sourceReference
      .trim()
      .replace(/^<|>$/g, "")
      .split(/[?#]/)[0];
    const absolute = reference.replaceAll("\\", "/").startsWith("data/")
      ? path.join(root, ...reference.split("/"))
      : path.resolve(path.dirname(sourceFile), reference);
    const normalized = path.normalize(absolute);
    const key = normalized.toLocaleLowerCase("en-US");
    references.add(key);
    referencePaths.set(key, normalized);
  }
}

const roots = [
  "data/generated/image-review",
  "data/generated/intensive-reading",
];
const images = roots.flatMap((relativeRoot) =>
  walk(path.join(root, relativeRoot), (file) => imageExtension.test(file)),
);
const uniqueImages = [...new Set(images.map((file) => path.normalize(file)))];
const inventory = uniqueImages.map((file) => ({
  file,
  relative: path.relative(root, file),
  bytes: fs.statSync(file).size,
  used: references.has(file.toLocaleLowerCase("en-US")),
}));

for (const relativeRoot of roots) {
  const normalizedRoot = relativeRoot.replaceAll("/", "\\").toLowerCase();
  const group = inventory.filter((item) =>
    item.relative.toLowerCase().startsWith(normalizedRoot),
  );
  const unused = group.filter((item) => !item.used);
  console.log(
    JSON.stringify({
      root: relativeRoot,
      files: group.length,
      megabytes: Number(
        (group.reduce((sum, item) => sum + item.bytes, 0) / 1_048_576).toFixed(
          1,
        ),
      ),
      referencedByCorpus: group.length - unused.length,
      unreferenced: unused.length,
      unreferencedMegabytes: Number(
        (
          unused.reduce((sum, item) => sum + item.bytes, 0) / 1_048_576
        ).toFixed(1),
      ),
    }),
  );
}

console.log("REFERENCED_IMAGES");
for (const item of inventory.filter((item) => item.used)) {
  console.log(item.relative);
}

console.log("UNREFERENCED_IMAGES");
for (const item of inventory.filter((item) => !item.used)) {
  console.log(item.relative);
}

const missingReferences = [...referencePaths.values()].filter((file) => !fs.existsSync(file));
console.log(`MISSING_IMAGE_REFERENCES=${missingReferences.length}`);
for (const file of missingReferences) {
  console.log(path.relative(root, file));
}

console.log("ROOT_IMAGES");
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (!entry.isFile() || !imageExtension.test(entry.name)) continue;
  const file = path.join(root, entry.name);
  console.log(
    `${entry.name}\t${(fs.statSync(file).size / 1_048_576).toFixed(2)} MB`,
  );
}
