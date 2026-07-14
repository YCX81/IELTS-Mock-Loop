const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const GENERATED = path.join(ROOT, "data", "generated");
const TARGET_DIRS = [
  path.join(GENERATED, "text-pages"),
  path.join(GENERATED, "page-json"),
];
const TARGET_REPORTS = [
  path.join(GENERATED, "reports", "cambridge-test-bank.json"),
  path.join(GENERATED, "reports", "cambridge-structured-debug.json"),
];

const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--check");

const noiseLinePatterns = [
  /^TopSage\.com$/i,
  /^www\.TopSage\.com$/i,
  /^@?Mirs\/ELTS$/i,
  /^CAMBRIDGE$/i,
  /^Cambridge University Press & Assessment$/i,
  /Cambridge University Press & Assessment.*ielts-thudang\.com/i,
  /ielts-thudang\.com/i,
  /^978-[\d-]+.*IELTS\s+20\s+Academic Student'?s Book/i,
  /IELTS 20 Academic Student'?s Book with Answers with Audio/i,
  /本资料仅用于学习交流参考/,
  /沪江留学CLUB/,
  /LiuxueClub/i,
  /打算申请出国留学/,
  /快乐加倍/,
  /效率加倍/,
  /^\s*QQ\s*[:：]/i,
  /^p\.\s*\d+\s*$/i,
  /^→\s*$/,
  /^S\s*$/,
];

const replacements = [
  // Repair over-split paired headings such as "Questions 1-9 and 20" back to "Questions 19 and 20".
  [/\b(Questions|boxes)\s+([1-9])-([1-9])\s+and\s+([1-9]\d?)\b/gi, (match, label, tens, ones, end) => {
    const start = Number(`${tens}${ones}`);
    const finish = Number(end);
    if (start >= 1 && start < finish && finish <= 40) return `${label} ${start} and ${finish}`;
    return match;
  }],
  // Repair over-split ranges such as "Questions 1-4-26" back to "Questions 14-26".
  [/\b(Questions|boxes)\s+([1-9])-([1-9])\s*[-–—]\s*(\d{1,2})\b/gi, (_, label, tens, ones, end) => `${label} ${tens}${ones}-${end}`],
  // Undo accidental range splitting on singular answer-sheet boxes: "box 1-4" means "box 14".
  [/\bbox\s+([1-9])-([1-9])\b/gi, (_, tens, ones) => `box ${tens}${ones}`],
  // OCR often reads "boxes 13" as "boxes I3" in plural range instructions.
  [/\bboxes\s+I([2-9])\b/g, (_, end) => `boxes 1-${end}`],

  // Inline watermark remnants can survive inside structured JSON paragraphs.
  [/\s*(?:www\.)?TopSage\.com\s*/gi, " "],
  [/\s*@?Mirs\/ELTS\s*/g, " "],
  [/\s*(?:C|c)?ambridge University Press & Assessment\s+https:\/\/ielts-thudang\.com\/?\s*/g, " "],
  [/\s*https:\/\/ielts-thudang\.com\/?\s*/g, " "],

  // Common instruction/header OCR.
  [/SOCIAL PROGERAMME/g, "SOCIAL PROGRAMME"],
  [/\bsing mane\b/g, "sign name"],
  [/\btable blew\b/gi, "table below"],
  [/\bNO MORE THSN\b/g, "NO MORE THAN"],
  [/\bANDIOR\b/g, "AND/OR"],
  [/\b(?:ansWer|anSWer)\b/g, "answer"],
  [/\bTwO\b/g, "TWO"],
  [/\b(?:JELTS|JEL\s+TS|lELTS|lEL\s+TS|IEL\s+TS|MirslELTS)\b/g, "IELTS"],
  [/\bshouid\b/gi, matchCase("should")],
  [/\bFALES\b/g, "FALSE"],
  [/\bFAISE\b/g, "FALSE"],
  [/\bFAL5E\b/g, "FALSE"],
  [/\bN0T GIVEN\b/g, "NOT GIVEN"],
  [/\bNO MOFE\b/g, "NO MORE"],
  [/\bMOFE THAN\b/g, "MORE THAN"],

  // Contextual corrections from verified Cambridge IELTS 04-06/20 pages.
  [/\btress evaporate\b/gi, matchCase("trees evaporate")],
  [/\balarming rat(\s+)of loss\b/gi, (_, gap) => `alarming rate${gap}of loss`],
  [/\bprevious studied of pupils\b/gi, matchCase("previous studies of pupils")],
  [/\brage of ways\b/gi, matchCase("range of ways")],
  [/\bthese sills can be developed\b/gi, matchCase("these skills can be developed")],
  [/\bessential fore these\b/gi, matchCase("essential for these")],
  [/\bUseof\s+daclities\b/gi, matchCase("Use of facilities")],
  [/\btri\.\s*ss\.on\b/gi, "trial session"],
  [/\bspea to Davi\b/gi, "speak to David"],
  [/\b10\s+o book a\b/gi, "10 To book a"],
  [/\bPART\s+Questions\s+1\s*[-–—]\s*10\b/gi, "PART 1 Questions 1-10"],
  [/\bPART\s+Questions\s+11\s*[-–—]\s*20\b/gi, "PART 2 Questions 11-20"],
  [/\bPART\s+Questions\s+21\s*[-–—]\s*30\b/gi, "PART 3 Questions 21-30"],
  [/\bPART\s+Questions\s+31\s*[-–—]\s*40\b/gi, "PART 4 Questions 31-40"],
  [/\bPART 4 Question\s+31\s*-\s*10\b/gi, "PART 4 Questions 31-40"],
  [/\bPART 4 Questions\s+31\s*[-–—]\s*10\b/gi, "PART 4 Questions 31-40"],
  [/\bQuestions\s+31\s*[-–—]\s*10\b/g, "Questions 31-40"],
  [/\bQuestions\s+77\s*[-–—]\s*20\b/g, "Questions 11-20"],
  [/\bQuestions\s+2\s*[-–—]\s*7\s*=\s*26\b/g, "Questions 21-26"],
  [/\bQuestions\s+1\s*[-–—]\s*139\b/g, "Questions 1-13"],
  [/\bQuestions\s+74\s*[-–—]\s*26\b/g, "Questions 14-26"],
  [/\bmore 43(_+)/g, "more 34$1"],
  [/\barriver\b/g, "a river"],
  [/\bwasd1:1elared\b/g, "was declared"],

  // High-confidence printed-text corrections.
  [/\bHoweer\b/g, "However"],
  [/\bDictronary\b/g, "Dictionary"],
  [/\bDictionory\b/g, "Dictionary"],
  [/\bnight and wrong usage\b/g, "right and wrong usage"],
  [/\bPussage I\b/g, "Passage 1"],
  [/\bGcorge Bernard Shaw\b/g, "George Bernard Shaw"],
  [/\bCHILDREN[，,]\s*S PLAY\b/g, "CHILDREN'S PLAY"],
  [/\bchildren[，,]\s*s play\b/g, "children's play"],
  [/\bldngdom\b/g, "kingdom"],
  [/\bcan didate\b/g, "candidate"],
  [/\bcan didates\b/g, "candidates"],
  [/\bIanguage\b/g, "language"],
  [/\bIan guage\b/g, "language"],
  [/\bReadi ng\b/g, "Reading"],
  [/\bassessi ng\b/g, "assessing"],
  [/\bdesig ned\b/g, "designed"],
  [/\bEn glish\b/g, "English"],
  [/\bListe ning\b/g, "Listening"],
  [/\bcommun icate\b/g, "communicate"],
  [/\ban swer\b/g, "answer"],
  [/\ban swers\b/g, "answers"],
  [/\bwritte n\b/g, "written"],
  [/\bin dividual\b/g, "individual"],
  [/\bin eluded\b/g, "included"],
  [/\bpun ctuation\b/g, "punctuation"],
  [/\bcon trolled\b/g, "controlled"],
  [/\bcomp orients\b/g, "components"],
  [/\bfollowi ng\b/g, "following"],
  [/\bspelli ng\b/g, "spelling"],
  [/\bexami ner\b/g, "examiner"],
  [/\bdiscussi on\b/g, "discussion"],
  [/\bgen eral\b/g, "general"],
  [/\bn eed\b/g, "need"],
  [/\bcon sists\b/g, "consists"],
  [/\bnu merals\b/g, "numerals"],
  [/\bth a n\b/g, "than"],
  [/\bCandidates the n answer\b/g, "Candidates then answer"],
  [/\bbetween four mnd five minutes\b/g, "between four and five minutes"],
  [/\bw 川 give\b/g, "will give"],
  [/\bMODELANSWER\b/g, "MODEL ANSWER"],
  [/\bSAMPLEANSWER\b/g, "SAMPLE ANSWER"],
  [/\bWRITSNG\b/g, "WRITING"],
  [/\bWRBTDNG\b/g, "WRITING"],
  [/\bWRSTBNG\b/g, "WRITING"],
  [/\bWR5T8NG\b/g, "WRITING"],
  [/\bleqislation\b/g, "legislation"],
  [/\bleqislative\b/g, "legislative"],

  // Previously identified source OCR typos.
  [/\bmuitiple\b/gi, matchCase("multiple")],
  [/\bopirions\b/gi, matchCase("opinions")],
  [/\becetares\b/gi, matchCase("hectares")],
  [/\bmany ot the\b/gi, "many of the"],
  [/\bsinçe\b/gi, matchCase("since")],
  [/£100,o00/g, "£100,000"],
  [/\bTHEI\b/g, "THE"],
  [/\b6o0\b/g, "600"],
  [/\bfarnine\b/gi, matchCase("famine")],
  [/\bEPRl\b/g, "EPRI"],
  [/\$100,000each/g, "$100,000 each"],
  [/\bdirectedt\b/gi, matchCase("directed at")],
  [/\bord er\b/gi, matchCase("order")],
  [/\bRISING SUM\b/g, "RISING SUN"],
  [/\bdeai\b/gi, matchCase("deal")],
  [/\busefuly\b/gi, matchCase("usefully")],
  [/\bworid\b/gi, matchCase("world")],
  [/\bprobem\b/gi, matchCase("problem")],
  [/\bevoolutin\b/gi, matchCase("evolution")],
  [/\beguipment\b/gi, matchCase("equipment")],
];

function matchCase(replacement) {
  return (value) => {
    if (value.toUpperCase() === value) return replacement.toUpperCase();
    if (value[0] && value[0].toUpperCase() === value[0]) {
      return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
  };
}

function listFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(fullPath, predicate));
    else if (predicate(fullPath)) files.push(fullPath);
  }
  return files;
}

function targetFiles() {
  const generatedFiles = TARGET_DIRS.flatMap((dir) =>
    listFiles(dir, (file) => /\.raw\.md$|\.pages\.json$/i.test(file))
  );
  const reports = TARGET_REPORTS.filter((file) => fs.existsSync(file));
  return [...generatedFiles, ...reports].sort();
}

function stripNoiseLines(text) {
  const lines = text.split(/\r?\n/);
  const cleaned = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    return !noiseLinePatterns.some((pattern) => pattern.test(trimmed));
  });
  return cleaned.join("\n");
}

function fixQuestionRanges(text) {
  let out = text;
  out = out.replace(/\bQuestions\s+(\d{3,4})(?!\s*[-–—]|\s+and\s+|\s+to\s+)/g, (match, digits) => {
    const split = digits.length === 3 ? [digits.slice(0, 1), digits.slice(1)] : [digits.slice(0, 2), digits.slice(2)];
    const start = Number(split[0]);
    const end = Number(split[1]);
    if (start >= 1 && start < end && end <= 40) return `Questions ${start}-${end}`;
    return match;
  });
  out = out.replace(/\bboxes\s+(\d{3,4})(?!\s*[-–—]|\s+and\s+|\s+to\s+)/gi, (match, digits) => {
    const split = digits.length === 3 ? [digits.slice(0, 1), digits.slice(1)] : [digits.slice(0, 2), digits.slice(2)];
    const start = Number(split[0]);
    const end = Number(split[1]);
    if (start >= 1 && start < end && end <= 40) return `boxes ${start}-${end}`;
    return match;
  });
  out = out.replace(/\bQuestions\s+([1-9])([1-9])\b(?!\s*[-–—]|\s+and\s+|\s+to\s+)/g, (match, startDigit, endDigit) => {
    const start = Number(startDigit);
    const end = Number(endDigit);
    return start < end ? `Questions ${start}-${end}` : match;
  });
  out = out.replace(/\bboxes\s+([1-9])([1-9])\b(?!\s*[-–—]|\s+and\s+|\s+to\s+)/gi, (match, startDigit, endDigit) => {
    const start = Number(startDigit);
    const end = Number(endDigit);
    if (start >= end) return match;
    return `boxes ${start}-${end}`;
  });
  out = out.replace(/\bQuestion\s+(\d{1,2})\s*[-–—]\s*(\d{1,2})\b/g, "Questions $1-$2");
  out = out.replace(/\bQuestion(\d{1,2})\s*[-–—]\s*(\d{1,2})\b/g, "Questions $1-$2");
  return out;
}

function applyTextCorrections(text) {
  let out = stripNoiseLines(text);
  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }
  out = fixQuestionRanges(out);
  return out.replace(/[ \t]+$/gm, "").replace(/\n+$/, "\n");
}

function mutateStrings(value) {
  if (typeof value === "string") return applyTextCorrections(value);
  if (Array.isArray(value)) return value.map(mutateStrings);
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) value[key] = mutateStrings(child);
  }
  return value;
}

function cleanJson(text) {
  const parsed = JSON.parse(text);
  mutateStrings(parsed);
  return JSON.stringify(parsed, null, 2) + "\n";
}

function cleanFile(file) {
  const before = fs.readFileSync(file, "utf8");
  const after = /\.json$/i.test(file) ? cleanJson(before) : applyTextCorrections(before);
  if (after === before) return null;
  if (!dryRun) fs.writeFileSync(file, after);
  return {
    file: path.relative(ROOT, file).replace(/\\/g, "/"),
    beforeBytes: Buffer.byteLength(before),
    afterBytes: Buffer.byteLength(after),
  };
}

const changed = targetFiles().map(cleanFile).filter(Boolean);
for (const item of changed) {
  console.log(`${dryRun ? "would change" : "changed"} ${item.file} (${item.beforeBytes} -> ${item.afterBytes})`);
}
console.log(`${dryRun ? "would change" : "changed"} files: ${changed.length}`);
process.exit(dryRun && changed.length ? 1 : 0);
