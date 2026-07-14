const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const GENERATED = path.join(ROOT, "data", "generated");

const fatalPatterns = [
  ["SOCIAL PROGERAMME", /\bSOCIAL PROGERAMME\b/g],
  ["sing mane", /\bsing mane\b/g],
  ["table blew", /\btable blew\b/gi],
  ["NO MORE THSN", /\bNO MORE THSN\b/g],
  ["FALES", /\bFALES\b/g],
  ["ANDIOR", /\bANDIOR\b/g],
  ["answer case OCR", /\b(?:ansWer|anSWer)\b/g],
  ["TwO", /\bTwO\b/g],
  ["IELTS OCR variants", /\b(?:JELTS|JEL\s+TS|lELTS|lEL\s+TS|IEL\s+TS|MirslELTS)\b/g],
  ["Question singular range", /\bQuestion\s*\d{1,2}\s*[-–—]\s*\d{1,2}\b/g],
  ["Question 31 -10", /\bQuestions?\s+31\s*[-–—]\s*10\b/g],
  ["PART Questions missing number", /\bPART\s+Questions\s+\d{1,2}\s*[-–—]\s*\d{1,2}\b/gi],
  ["malformed equals question range", /\b(?:Questions|boxes)\s+\d{1,3}\s*[-–—]\s*\d{1,3}\s*=\s*\d{1,3}\b/gi],
  ["glued 3-4 digit question range", /\bQuestions\s+\d{3,4}(?!\s*[-–—]|\s+and\s+|\s+to\s+)/g],
  ["glued 2 digit ascending question range", /\bQuestions\s+([1-9])([1-9])\b(?!\s*[-–—]|\s+and\s+|\s+to\s+)/g],
  ["glued boxes range", /\bboxes\s+\d{3,4}(?!\s*[-–—]|\s+and\s+|\s+to\s+)/gi],
  ["boxes capital-I range", /\bboxes\s+I[2-9]\b/g],
  ["singular box split", /\bbox\s+[1-9]-[1-9]\b/gi],
  ["over-split paired question range", /\b(?:Questions|boxes)\s+[1-9]-[1-9]\s+and\s+[1-9]\d?\b/gi],
  ["over-split question range", /\b(?:Questions|boxes)\s+[1-9]-[1-9]\s*[-–—]\s*\d{1,2}\b/gi],
  ["Useof daclities", /\bUseof\s+daclities\b/gi],
  ["trial session OCR", /\btri\.\s*ss\.on\b/gi],
  ["candidate split", /\bcan didates?\b/g],
  ["language capital-I OCR", /\bIanguage\b|\bIan guage\b/g],
  ["children title apostrophe OCR", /\bCHILDREN[，,]\s*S PLAY\b|\bchildren[，,]\s*s play\b/g],
  ["kingdom OCR", /\bldngdom\b/g],
  ["printed word splits", /\bReadi ng\b|\bassessi ng\b|\bdesig ned\b|\bEn glish\b|\bListe ning\b|\bcommun icate\b|\ban swers?\b|\bwritte n\b|\bin dividual\b|\bin eluded\b|\bpun ctuation\b|\bcon trolled\b|\bcomp orients\b|\bfollowi ng\b|\bspelli ng\b|\bexami ner\b|\bdiscussi on\b|\bgen eral\b|\bn eed\b|\bcon sists\b|\bnu merals\b|\bth a n\b|\bCandidates the n answer\b|\bbetween four mnd five minutes\b|\bw 川 give\b/g],
  ["known context OCR", /\balarming rat\s+of loss\b|\bprevious studied of pupils\b|\brage of ways\b|\bthese sills can be developed\b|\bessential fore these\b/gi],
  ["known typo set", /\bmuitiple\b|\bopirions\b|\becetares\b|\bmany ot the\b|\bsinçe\b|£100,o00|\bTHEI\b|\b6o0\b|\bfarnine\b|\bEPRl\b|\$100,000each|\bdirectedt\b|\bord er\b|\bRISING SUM\b|\bdeai\b|\busefuly\b|\bworid\b|\bprobem\b|\bevoolutin\b|\beguipment\b|\bleqislation\b|\bNO MOFE\b|\bMOFE THAN\b/gi],
  ["watermark/noise", /TopSage\.com|沪江留学CLUB|LiuxueClub|本资料仅用于学习交流参考|打算申请出国留学|快乐加倍|效率加倍|@?Mirs\/ELTS|ielts-thudang\.com|IELTS 20 Academic Student'?s Book with Answers with Audio/g],
];

const structuralWarningPatterns = [
  ["possible answer page in body", /\bAnswer:\s*$/gm],
  ["garbled answer key", /\b(?:88883886|LOU<<|BOEE)\b/g],
  ["obvious OCR garbage", /[也愉匕恰眦卩滋訥]{4,}/g],
];

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
  const files = [
    ...listFiles(path.join(GENERATED, "text-pages"), (file) => /\.raw\.md$/i.test(file)),
    ...listFiles(path.join(GENERATED, "page-json"), (file) => /\.pages\.json$/i.test(file)),
    path.join(GENERATED, "reports", "cambridge-test-bank.json"),
    path.join(GENERATED, "reports", "cambridge-structured-debug.json"),
  ];
  return files.filter((file) => fs.existsSync(file)).sort();
}

function collectMatches(file, text, patterns) {
  const findings = [];
  for (const [name, pattern] of patterns) {
    const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    for (const match of text.matchAll(re)) {
      if (name === "glued 2 digit ascending question range") {
        const start = Number(match[1]);
        const end = Number(match[2]);
        if (!(start < end)) continue;
      }
      const index = match.index || 0;
      const line = text.slice(0, index).split(/\r?\n/).length;
      const snippet = text.slice(Math.max(0, index - 80), Math.min(text.length, index + 160)).replace(/\s+/g, " ");
      findings.push({
        file: path.relative(ROOT, file).replace(/\\/g, "/"),
        line,
        name,
        value: match[0],
        snippet,
      });
    }
  }
  return findings;
}

function validateJsonFiles(files) {
  const jsonFiles = files.filter((file) => /\.json$/i.test(file));
  for (const file of jsonFiles) JSON.parse(fs.readFileSync(file, "utf8"));
  return jsonFiles.length;
}

function collectShortPageWarnings(files) {
  const warnings = [];
  for (const file of files.filter((item) => /\.pages\.json$/i.test(item))) {
    const doc = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const page of doc.pages || []) {
      const text = String(page.text || "");
      const compact = text.replace(/\s+/g, "");
      if (compact.length > 0 && compact.length < 25) {
        warnings.push({
          file: path.relative(ROOT, file).replace(/\\/g, "/"),
          line: 1,
          name: "short page",
          value: `page ${page.page}`,
          snippet: text.replace(/\s+/g, " "),
        });
      }
    }
  }
  return warnings;
}

function collectInvalidQuestionRangeFindings(file, text) {
  const findings = [];
  const pattern = /\b(Questions|boxes)\s+(\d{1,3})\s*[-–—]\s*(\d{1,3})\b/gi;
  for (const match of text.matchAll(pattern)) {
    const start = Number(match[2]);
    const end = Number(match[3]);
    if (start >= 1 && start <= end && end <= 40) continue;
    const index = match.index || 0;
    const line = text.slice(0, index).split(/\r?\n/).length;
    findings.push({
      file: path.relative(ROOT, file).replace(/\\/g, "/"),
      line,
      name: "invalid question range",
      value: match[0],
      snippet: text.slice(Math.max(0, index - 80), Math.min(text.length, index + 160)).replace(/\s+/g, " "),
    });
  }
  return findings;
}

const files = targetFiles();
const jsonCount = validateJsonFiles(files);
const fatalFindings = [];
const warnings = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  fatalFindings.push(...collectMatches(file, text, fatalPatterns));
  fatalFindings.push(...collectInvalidQuestionRangeFindings(file, text));
  warnings.push(...collectMatches(file, text, structuralWarningPatterns));
}
warnings.push(...collectShortPageWarnings(files));

if (fatalFindings.length) {
  console.error(`OCR source validation failed: ${fatalFindings.length} fatal findings`);
  for (const finding of fatalFindings.slice(0, 80)) {
    console.error(`${finding.file}:${finding.line} [${finding.name}] ${JSON.stringify(finding.value)} ${finding.snippet}`);
  }
  if (fatalFindings.length > 80) console.error(`... ${fatalFindings.length - 80} more`);
  process.exit(1);
}

console.log(`OCR source validation passed: ${files.length} files, ${jsonCount} JSON files parsed`);
if (warnings.length) {
  console.log(`Structural warnings: ${warnings.length}`);
  for (const warning of warnings.slice(0, 80)) {
    console.log(`${warning.file}:${warning.line} [${warning.name}] ${JSON.stringify(warning.value)} ${warning.snippet}`);
  }
  if (warnings.length > 80) console.log(`... ${warnings.length - 80} more`);
}
