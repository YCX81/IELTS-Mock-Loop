const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const GENERATED = path.join(ROOT, "data", "generated");
const TEXT_PAGES = path.join(GENERATED, "text-pages");
const PAGE_JSON = path.join(GENERATED, "page-json");
const REPORTS = path.join(GENERATED, "reports");
const ANSWER_PAGES = path.join(GENERATED, "answer-pages");

const IELTS06_PAGE_160_TEXT = `Answer key
GENERAL TRAINING TEST A
READING

Section 1, Questions 1-14
1 B
2 F
3 D
4 A
5 FALSE
6 NOT GIVEN
7 NOT GIVEN
8 TRUE
9 TRUE
10 C
11 B
12 F
13 I
14 H

Section 2, Questions 15-27
15 B
16 G
17 F
18 E
19 A
20 F
21 G
22 C
23 B
24 A
25 A
26 B
27 B

Section 3, Questions 28-40
28 ix
29 vi
30 iv
31 ii
32 vii
33 viii
34 iii
35 prosperous
36 population
37 (modern) technology
38 leaks
39 management
40 water deficit

If you score ...
0-17
you are unlikely to get an acceptable score under examination conditions and we recommend that you spend a lot of time improving your English before you take IELTS.
18-29
you may get an acceptable score under examination conditions but we recommend that you think about having more practice or lessons before you take IELTS.
30-40
you are likely to get an acceptable score under examination conditions but remember that different institutions will find different scores acceptable.

159`;

const IELTS06_PAGE_161_TEXT = `Answer key
GENERAL TRAINING TEST B
READING

Section 1, Questions 1-14
1 IN EITHER ORDER; BOTH REQUIRED FOR ONE MARK
Saturday (and) Tuesday
2 IN EITHER ORDER; BOTH REQUIRED FOR ONE MARK
Saturday (and) Thursday
3 B
4 H
5 G
6 A
7 I
8 J
9 TRUE
10 NOT GIVEN
11 TRUE
12 TRUE
13 FALSE
14 FALSE

Section 2, Questions 15-27
15 xi
16 iv
17 v
18 ix
19 viii
20 ii
21 vii
22 K
23 C
24 I
25 H
26 G
27 L

Section 3, Questions 28-40
28 J
29 D
30 F
31 K
32 A
33 E
34 G
35 C
36 A
37 B
38 D
39 (over) a thousand
40 11 metres/meters

If you score ...
0-16
you are unlikely to get an acceptable score under examination conditions and we recommend that you spend a lot of time improving your English before you take IELTS.
17-28
you may get an acceptable score under examination conditions but we recommend that you think about having more practice or lessons before you take IELTS.
29-40
you are likely to get an acceptable score under examination conditions but remember that different institutions will find different scores acceptable.

160`;

const IELTS10_PAGE_5_TEXT = `Questions 13-20
Complete the notes below.
Write NO MORE THAN TWO WORDS for each answer.

Joining the leisure club

Personal Assessment
- New members should describe any 13 ______ .
- The 14 ______ will be explained to you before you use the equipment.
- You will be given a six-week 15 ______ .

Types of membership
- There is a compulsory \u00a390 16 ______ fee for members.
- Gold members are given 17 ______ to all the LP clubs.
- Premier members are given priority during 18 ______ hours.
- Premier members can bring some 19 ______ every month.
- Members should always take their 20 ______ with them.

13`;

const IELTS10_BANK_INSERT = `Questions 13-20
Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.

Joining the leisure club

Personal Assessment
New members should describe any 13 ______ .
The 14 ______ will be explained to you before you use the equipment.
You will be given a six-week 15 ______ .

Types of membership
There is a compulsory \u00a390 16 ______ fee for members.
Gold members are given 17 ______ to all the LP clubs.
Premier members are given priority during 18 ______ hours.
Premier members can bring some 19 ______ every month.
Members should always take their 20 ______ with them.`;

const IELTS10_SECTION_PARAGRAPHS = [
  "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
  "Joining the leisure club",
  "Personal Assessment",
  "New members should describe any 13 ______ .",
  "The 14 ______ will be explained to you before you use the equipment.",
  "You will be given a six-week 15 ______ .",
  "Types of membership",
  "There is a compulsory \u00a390 16 ______ fee for members.",
  "Gold members are given 17 ______ to all the LP clubs.",
  "Premier members are given priority during 18 ______ hours.",
  "Premier members can bring some 19 ______ every month.",
  "Members should always take their 20 ______ with them.",
];

const IELTS10_PROMPTS = new Map([
  [13, "New members should describe any 13 ______ ."],
  [14, "The 14 ______ will be explained to you before you use the equipment."],
  [15, "You will be given a six-week 15 ______ ."],
  [16, "There is a compulsory \u00a390 16 ______ fee for members."],
  [17, "Gold members are given 17 ______ to all the LP clubs."],
  [18, "Premier members are given priority during 18 ______ hours."],
  [19, "Premier members can bring some 19 ______ every month."],
  [20, "Members should always take their 20 ______ with them."],
]);

const IELTS20_ANSWER_PAGE_NUMBERS = [10, 46, 63, 85, 102, 109, 121, 137, 144];
const IELTS20_ANSWER_JSON_REL = "data/generated/answer-pages/cambridge-ielts-20.answer-pages.json";

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, "/");
}

function pad3(page) {
  return String(page).padStart(3, "0");
}

function markerForAnswerPage(page) {
  return `[Moved answer page. See ${IELTS20_ANSWER_JSON_REL}#page-${pad3(page)}]`;
}

function replaceMarkdownPage(text, page, body) {
  const headingPattern = /^## Page \d+\r?$/gm;
  const headings = [...text.matchAll(headingPattern)].map((match) => ({
    page: Number(match[0].match(/\d+/)[0]),
    index: match.index,
  }));
  const currentIndex = headings.findIndex((heading) => heading.page === page);
  if (currentIndex < 0) {
    throw new Error(`Could not find markdown page ${page}`);
  }
  const start = headings[currentIndex].index;
  const end = currentIndex + 1 < headings.length ? headings[currentIndex + 1].index : text.length;
  const prefix = text.slice(0, start);
  const suffix = text.slice(end).replace(/^\r?\n+/, "");
  const replacement = `## Page ${page}\n\n${body.replace(/\n+$/, "")}`;
  return `${prefix}${replacement}${suffix ? `\n\n${suffix}` : "\n"}`;
}

function ensureTextBeforeSection3(text, insertText) {
  if (/Joining the leisure club/i.test(text)) return text;
  const marker = /\n\n(?:Test\s+\d+\n)?(?:Section|SECTION)\s+3\b/;
  const match = marker.exec(text);
  if (!match) {
    throw new Error("Could not find Section 3 insertion point");
  }
  return `${text.slice(0, match.index).trimEnd()}\n\n${insertText.trim()}\n${text.slice(match.index)}`;
}

function repairIelts10RawAndPages() {
  const rawFile = path.join(TEXT_PAGES, "cambridge-ielts-10.raw.md");
  const pagesFile = path.join(PAGE_JSON, "cambridge-ielts-10.pages.json");
  const pagesDoc = readJson(pagesFile);
  let changed = 0;

  const rawBefore = readText(rawFile);
  const rawAfter = replaceMarkdownPage(rawBefore, 5, IELTS10_PAGE_5_TEXT);
  if (rawAfter !== rawBefore) {
    writeText(rawFile, rawAfter);
    changed += 1;
  }

  const page5 = (pagesDoc.pages || []).find((page) => page.page === 5);
  if (!page5) throw new Error("Missing IELTS 10 page-json page 5");
  if (page5.text !== IELTS10_PAGE_5_TEXT) {
    page5.text = IELTS10_PAGE_5_TEXT;
    writeJson(pagesFile, pagesDoc);
    changed += 1;
  }

  return changed;
}

function repairIelts06AnswerKeyPages() {
  const rawFile = path.join(TEXT_PAGES, "cambridge-ielts-06.raw.md");
  const pagesFile = path.join(PAGE_JSON, "cambridge-ielts-06.pages.json");
  const pagesDoc = readJson(pagesFile);
  const replacements = new Map([
    [160, IELTS06_PAGE_160_TEXT],
    [161, IELTS06_PAGE_161_TEXT],
  ]);
  let changed = 0;

  let raw = readText(rawFile);
  for (const [page, text] of replacements) {
    raw = replaceMarkdownPage(raw, page, text);
  }
  if (raw !== readText(rawFile)) {
    writeText(rawFile, raw);
    changed += 1;
  }

  for (const [pageNumber, text] of replacements) {
    const page = (pagesDoc.pages || []).find((item) => item.page === pageNumber);
    if (!page) throw new Error(`Missing IELTS 06 page-json page ${pageNumber}`);
    if (page.text !== text) {
      page.text = text;
      page.image = `data/generated/image-review/cambridge-ielts-06/page-${pad3(pageNumber)}.png`;
      page.verifiedFromPdf = true;
      changed += 1;
    }
  }
  writeJson(pagesFile, pagesDoc);
  return changed;
}

function repairIelts10TestBank(bank) {
  const test = (bank.tests || []).find((item) => item.id === "cambridge-10-listening-test-1");
  if (!test) throw new Error("Missing cambridge-10-listening-test-1");
  let changed = 0;

  for (const key of ["questionText", "rawOcrText"]) {
    if (typeof test[key] !== "string") continue;
    const next = ensureTextBeforeSection3(test[key], IELTS10_BANK_INSERT);
    if (next !== test[key]) {
      test[key] = next;
      changed += 1;
    }
  }

  const sections = test.listeningSections || [];
  const hasQ13To20 = sections.some((section) => /Questions\s+13\s*[-–]\s*20/i.test(String(section.title || "")));
  if (!hasQ13To20) {
    const q11Index = sections.findIndex((section) => /Questions\s+11\s*[-–]\s*12/i.test(String(section.title || "")));
    const insertAt = q11Index >= 0 ? q11Index + 1 : sections.findIndex((section) => /Section\s+3/i.test(String(section.title || "")));
    sections.splice(insertAt >= 0 ? insertAt : sections.length, 0, {
      title: "Questions 13-20",
      paragraphs: IELTS10_SECTION_PARAGRAPHS,
    });
    test.listeningSections = sections;
    changed += 1;
  }

  for (const question of test.questions || []) {
    const prompt = IELTS10_PROMPTS.get(question.number);
    if (!prompt) continue;
    if (!question.prompt || /^Answer\s+\d+$/i.test(question.prompt)) {
      question.prompt = prompt;
      changed += 1;
    }
  }

  return changed;
}

function loadExistingAnswerPages(file) {
  if (!fs.existsSync(file)) return new Map();
  const doc = readJson(file);
  return new Map((doc.pages || []).map((page) => [page.page, page]));
}

function buildIelts20AnswerPages(pagesDoc) {
  const answerFile = path.join(ANSWER_PAGES, "cambridge-ielts-20.answer-pages.json");
  const existing = loadExistingAnswerPages(answerFile);
  const pagesByNumber = new Map((pagesDoc.pages || []).map((page) => [page.page, page]));

  const pages = IELTS20_ANSWER_PAGE_NUMBERS.map((pageNumber) => {
    const page = pagesByNumber.get(pageNumber);
    const existingPage = existing.get(pageNumber);
    const currentText = String(page?.text || "");
    const text = /\bAnswer:\s*/.test(currentText) ? currentText : String(existingPage?.text || currentText);
    return {
      page: pageNumber,
      text,
      image: `data/generated/image-review/cambridge-ielts-20/page-${pad3(pageNumber)}.png`,
      sourcePageJson: "data/generated/page-json/cambridge-ielts-20.pages.json",
    };
  });

  const doc = {
    source: "cambridge-ielts-20",
    reason: "Answer pages were interleaved with OCR body pages and are separated before question JSON parsing.",
    pages,
  };

  writeJson(answerFile, doc);
  writeText(
    path.join(ANSWER_PAGES, "cambridge-ielts-20.answer-pages.md"),
    [
      "# Cambridge IELTS 20 Moved Answer Pages",
      "",
      "These pages were split out of the body OCR because they were interleaved with test content.",
      "",
      ...pages.flatMap((page) => [
        `## Page ${page.page}`,
        "",
        `Image: ${page.image}`,
        "",
        page.text.trimEnd(),
        "",
      ]),
    ].join("\n")
  );

  return pages;
}

function repairIelts20RawAndPages() {
  const rawFile = path.join(TEXT_PAGES, "cambridge-ielts-20.raw.md");
  const pagesFile = path.join(PAGE_JSON, "cambridge-ielts-20.pages.json");
  const pagesDoc = readJson(pagesFile);
  const movedPages = buildIelts20AnswerPages(pagesDoc);
  let changed = 0;

  let raw = readText(rawFile);
  for (const page of movedPages) {
    raw = replaceMarkdownPage(raw, page.page, `${markerForAnswerPage(page.page)}\n\n${page.page}`);
  }
  if (raw !== readText(rawFile)) {
    writeText(rawFile, raw);
    changed += 1;
  }

  for (const page of pagesDoc.pages || []) {
    if (!IELTS20_ANSWER_PAGE_NUMBERS.includes(page.page)) continue;
    const markerText = `${markerForAnswerPage(page.page)}\n\n${page.page}`;
    if (page.text !== markerText || page.role !== "answer_page") {
      page.text = markerText;
      page.role = "answer_page";
      page.movedTo = `${IELTS20_ANSWER_JSON_REL}#page-${pad3(page.page)}`;
      page.image = `data/generated/image-review/cambridge-ielts-20/page-${pad3(page.page)}.png`;
      changed += 1;
    }
  }
  writeJson(pagesFile, pagesDoc);
  return changed;
}

function truncateAnswerString(value) {
  const index = value.indexOf("Answer:");
  if (index < 0) return { value, hit: false };
  const prefix = value.slice(0, index).trimEnd();
  const replacement = `${prefix ? `${prefix}\n\n` : ""}[Moved answer page. See ${IELTS20_ANSWER_JSON_REL}]`;
  return { value: replacement, hit: true };
}

function stripAnswerSegments(value, key = "") {
  if (typeof value === "string") return truncateAnswerString(value);
  if (Array.isArray(value)) {
    const out = [];
    let hit = false;
    for (const item of value) {
      const result = stripAnswerSegments(item);
      if (!(typeof result.value === "string" && result.value.length === 0)) {
        out.push(result.value);
      }
      if (result.hit) {
        hit = true;
        break;
      }
    }
    return { value: out, hit };
  }
  if (value && typeof value === "object") {
    let hit = false;
    for (const [childKey, child] of Object.entries(value)) {
      if (childKey === "answerKeyText" || childKey === "answerKeyPages") continue;
      const result = stripAnswerSegments(child, childKey);
      value[childKey] = result.value;
      hit = hit || result.hit;
    }
    return { value, hit };
  }
  return { value, hit: false };
}

function repairIelts20TestBank(bank) {
  let changed = 0;
  for (const test of bank.tests || []) {
    if (!String(test.id || "").includes("cambridge-20-")) continue;
    const before = JSON.stringify(test);
    stripAnswerSegments(test);
    if (JSON.stringify(test) !== before) changed += 1;
  }
  return changed;
}

function main() {
  const bankFile = path.join(REPORTS, "cambridge-test-bank.json");
  const bank = readJson(bankFile);
  const changes = [];

  changes.push(["IELTS 06 answer-key pages", repairIelts06AnswerKeyPages()]);
  changes.push(["IELTS 10 raw/page-json", repairIelts10RawAndPages()]);
  changes.push(["IELTS 10 test-bank", repairIelts10TestBank(bank)]);
  changes.push(["IELTS 20 raw/page-json", repairIelts20RawAndPages()]);
  changes.push(["IELTS 20 test-bank", repairIelts20TestBank(bank)]);

  writeJson(bankFile, bank);

  for (const [label, count] of changes) {
    console.log(`${label}: ${count} change groups`);
  }
  console.log(`wrote ${rel(path.join(ANSWER_PAGES, "cambridge-ielts-20.answer-pages.json"))}`);
}

main();
