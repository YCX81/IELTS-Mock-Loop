const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");
const {
  compareCandidates,
  passageCoordinates,
} = require("./build_intensive_reading_canonical_catalog.js");

const repoRoot = path.resolve(__dirname, "..");
const buildScript = path.join(__dirname, "build_intensive_reading_canonical_catalog.js");
const jsonPath = path.join(
  repoRoot,
  "data",
  "generated",
  "intensive-reading",
  "canonical-catalog.json"
);
const browserPath = path.join(repoRoot, "data", "intensive-reading-catalog.js");
const auditPath = path.join(repoRoot, "reports", "intensive-reading-canonical-audit.md");

function build() {
  execFileSync(process.execPath, [buildScript], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

function expectedIds() {
  const ids = [];
  for (let book = 4; book <= 21; book += 1) {
    for (let testNo = 1; testNo <= 4; testNo += 1) {
      for (let passageNo = 1; passageNo <= 3; passageNo += 1) {
        ids.push(
          `cambridge-${String(book).padStart(2, "0")}-reading-test-${testNo}-passage-${passageNo}`
        );
      }
    }
  }
  return ids;
}

assert.deepStrictEqual(
  passageCoordinates(
    "data/generated/intensive-reading/cambridge-07-09/Cambridge-IELTS-09-Test-01-Passage-02-Article.md"
  ),
  {
    id: "cambridge-09-reading-test-1-passage-2",
    book: "09",
    testNo: 1,
    passageNo: 2,
  },
  "zero-padded completed filenames should map to the stable ID"
);
assert.deepStrictEqual(
  passageCoordinates(
    "data/generated/intensive-reading/cambridge-16-18/recovered-sources/recovered-18-test-3-passage-2.md"
  ),
  {
    id: "cambridge-18-reading-test-3-passage-2",
    book: "18",
    testNo: 3,
    passageNo: 2,
  },
  "short recovered filenames should map to the same stable ID"
);
assert.strictEqual(
  passageCoordinates("data/generated/intensive-reading/README.md"),
  null,
  "index/report Markdown should not become a passage candidate"
);
assert.strictEqual(
  passageCoordinates("Cambridge-IELTS-22-Test-1-Passage-1-双语精读.md"),
  null,
  "out-of-scope books should not enter the Cambridge 04-21 catalog"
);

const rankedCandidates = [
  {
    path: "z-recovered.md",
    sourceKind: "recovered-source",
    explicitBilingual: true,
    hasTitle: true,
    hasChinese: true,
    learningSectionCount: 99,
    englishWordCount: 9999,
    byteSize: 999999,
  },
  {
    path: "a-completed.md",
    sourceKind: "completed-document",
    explicitBilingual: false,
    hasTitle: true,
    hasChinese: true,
    learningSectionCount: 1,
    englishWordCount: 100,
    byteSize: 1000,
  },
].sort(compareCandidates);
assert.strictEqual(
  rankedCandidates[0].path,
  "a-completed.md",
  "a completed learning document should outrank a recovered source regardless of source size"
);

build();

const firstJsonBytes = fs.readFileSync(jsonPath, "utf8");
const firstBrowserBytes = fs.readFileSync(browserPath, "utf8");
const firstAuditBytes = fs.readFileSync(auditPath, "utf8");

build();

assert.strictEqual(
  fs.readFileSync(jsonPath, "utf8"),
  firstJsonBytes,
  "JSON catalog must be byte-for-byte deterministic"
);
assert.strictEqual(
  fs.readFileSync(browserPath, "utf8"),
  firstBrowserBytes,
  "browser catalog must be byte-for-byte deterministic"
);
assert.strictEqual(
  fs.readFileSync(auditPath, "utf8"),
  firstAuditBytes,
  "audit report must be byte-for-byte deterministic"
);

const catalog = JSON.parse(firstJsonBytes);
assert.deepStrictEqual(
  Object.keys(catalog),
  ["summary", "items"],
  "catalog should expose the same compact contract in JSON and the browser"
);
assert.strictEqual(catalog.items.length, 216, "catalog must have exactly 216 canonical passages");

const ids = catalog.items.map((item) => item.id);
assert.strictEqual(new Set(ids).size, 216, "canonical passage IDs must be unique");
assert.deepStrictEqual(ids, expectedIds(), "catalog must cover Cambridge 04-21 in stable order");

const canonicalPaths = catalog.items.map((item) => item.canonicalPath);
assert.strictEqual(
  new Set(canonicalPaths).size,
  216,
  "the same file must not be selected for two canonical passages"
);

for (const item of catalog.items) {
  assert.match(
    item.id,
    /^cambridge-\d{2}-reading-test-[1-4]-passage-[1-3]$/,
    `${item.id} should use the canonical ID format`
  );
  assert.strictEqual(typeof item.title, "string", `${item.id} should expose a title`);
  assert(item.title.trim(), `${item.id} should expose a non-empty title`);
  assert(!item.canonicalPath.includes("\\"), `${item.id} canonical path must use forward slashes`);
  assert(
    !item.canonicalPath.includes("/recovered-sources/"),
    `${item.id} should prefer a completed reading document over a recovered source`
  );
  assert(
    fs.existsSync(path.join(repoRoot, ...item.canonicalPath.split("/"))),
    `${item.id} canonical document should exist`
  );
  assert(Array.isArray(item.alternates), `${item.id} should record alternates`);
  assert.strictEqual(
    item.duplicate,
    item.alternates.length > 0,
    `${item.id} duplicate flag should reflect its alternates`
  );

  const itemPaths = [item.canonicalPath, ...item.alternates];
  assert.strictEqual(
    new Set(itemPaths).size,
    itemPaths.length,
    `${item.id} should not repeat a candidate path`
  );
  for (const alternate of item.alternates) {
    assert(!alternate.includes("\\"), `${item.id} alternate path must use forward slashes`);
    assert(
      fs.existsSync(path.join(repoRoot, ...alternate.split("/"))),
      `${item.id} alternate document should exist`
    );
  }
}

const duplicateItems = catalog.items.filter((item) => item.duplicate);
const alternateCount = catalog.items.reduce((sum, item) => sum + item.alternates.length, 0);
assert.strictEqual(catalog.summary.expectedCount, 216);
assert.strictEqual(catalog.summary.canonicalCount, 216);
assert.strictEqual(catalog.summary.missingCount, 0);
assert.deepStrictEqual(catalog.summary.missingIds, []);
assert.strictEqual(catalog.summary.duplicateIdCount, duplicateItems.length);
assert.strictEqual(catalog.summary.alternateFileCount, alternateCount);
assert.strictEqual(catalog.summary.candidateFileCount, 216 + alternateCount);
assert.deepStrictEqual(
  catalog.summary.duplicateIds,
  duplicateItems.map((item) => item.id),
  "summary should identify every duplicate group"
);

const browserContext = { window: {} };
vm.runInNewContext(firstBrowserBytes, browserContext, {
  filename: "data/intensive-reading-catalog.js",
});
assert.strictEqual(
  JSON.stringify(browserContext.window.IELTS_INTENSIVE_READING_CATALOG),
  JSON.stringify(catalog),
  "browser catalog must carry exactly the same data as canonical-catalog.json"
);

assert.match(firstAuditBytes, /Canonical passages \| 216/);
assert.match(firstAuditBytes, /Missing canonical IDs \| 0/);
assert.match(firstAuditBytes, new RegExp(`Duplicate ID groups \\| ${duplicateItems.length}`));
assert.match(firstAuditBytes, /Selection policy/);

console.log(
  `PASS: ${catalog.items.length} canonical intensive-reading passages cover Cambridge 04-21; ` +
    `${duplicateItems.length} duplicate groups and ${alternateCount} alternates are audited.`
);
