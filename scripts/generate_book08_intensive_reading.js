const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const bankPath = path.join(repoRoot, "data", "generated", "reports", "cambridge-test-bank.json");
const outDir = path.join(repoRoot, "data", "generated", "intensive-reading", "cambridge-07-09");
const recoveredDir = path.join(outDir, "recovered-sources");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function cleanText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sanitizeStem(value) {
  return String(value || "")
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPassageSection(section) {
  return /^Reading Passage\s+[123]\b/i.test(String(section.title || ""));
}

function passageNumber(section, fallback) {
  const match = String(section.title || "").match(/Reading Passage\s+(\d+)/i);
  return match ? Number(match[1]) : fallback + 1;
}

function titleFromParagraphs(paragraphs, fallback) {
  const candidates = paragraphs
    .map((paragraph) => String(paragraph || "").trim())
    .filter(Boolean)
    .filter((paragraph) => !/^You should spend about 20 minutes/i.test(paragraph))
    .filter((paragraph) => !/^Questions?\s+\d+/i.test(paragraph));
  const first = candidates[0] || fallback;
  const sentence = first.split(/[.!?]\s/)[0];
  return sentence.length > 90 ? sentence.slice(0, 90).trim() : sentence;
}

function questionRangeFromTitle(title) {
  const text = String(title || "");
  const pair = text.match(/Questions?\s+(\d+)\s*(?:-|and|to)\s*(\d+)/i);
  if (pair) return { start: Number(pair[1]), end: Number(pair[2]) };
  const single = text.match(/Question\s+(\d+)/i);
  if (single) return { start: Number(single[1]), end: Number(single[1]) };
  return null;
}

function questionSectionsFor(test, passageNo) {
  const lower = passageNo === 1 ? 1 : passageNo === 2 ? 14 : 27;
  const upper = passageNo === 1 ? 13 : passageNo === 2 ? 26 : 40;
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

function trimInstruction(paragraphs) {
  return paragraphs
    .map((paragraph) => String(paragraph || "").trim())
    .filter(Boolean)
    .filter((paragraph, index) => !(index === 0 && /^You should spend about 20 minutes/i.test(paragraph)));
}

function pickExpressions(text) {
  const candidates = [
    "a growing body of evidence",
    "by contrast",
    "in response to",
    "a significant proportion",
    "underlying assumption",
    "a marked difference",
    "to some extent",
    "the extent to which",
    "a key factor",
    "be associated with",
    "be attributed to",
    "give rise to",
    "shed light on",
    "take into account",
    "in the long term",
    "a wide range of"
  ];
  const lower = text.toLowerCase();
  const found = candidates.filter((item) => lower.includes(item.toLowerCase()));
  return [...found, "作者的限定语", "题干改写"].slice(0, 3);
}

function paragraphSummary(paragraph, index) {
  const text = paragraph.replace(/\s+/g, " ").trim();
  const short = text.length > 260 ? `${text.slice(0, 260)}...` : text;
  if (index === 0) {
    return `这一段先把话题放到读者面前。中文可以先顺成：${short}`;
  }
  if (/\bhowever|but|yet|although|despite\b/i.test(text)) {
    return `这一段要看转折。中文先抓住“前面承认什么，后面真正改写什么”：${short}`;
  }
  if (/\b\d+%|\b\d{4}\b|study|research|experiment|evidence/i.test(text)) {
    return `这一段主要承担证据功能。读题时要留意数字、研究对象和结论边界：${short}`;
  }
  return `这一段推进主线。先不要逐词翻，先看它怎样承接上段并为题目定位服务：${short}`;
}

function renderQuestions(questionSections) {
  if (!questionSections.length) return "本 passage 没有关联到结构化题目块；复盘时建议回 raw text 核对题号。";
  return questionSections
    .map((section) => {
      const bullets = section.paragraphs.slice(0, 8).map((paragraph) => `- ${paragraph.replace(/\s+/g, " ").trim()}`).join("\n");
      return `### ${section.title}\n\n${bullets}\n\n中文处理：先判断题型，再找同义替换。匹配题看信息功能，选择题先压缩每个选项的判断，填空题优先检查词数、单复数和题干语法。`;
    })
    .join("\n\n");
}

function renderPassage(test, passage, questionSections) {
  const bodyParagraphs = trimInstruction(passage.paragraphs);
  const bodyText = bodyParagraphs.join("\n\n");
  const title = titleFromParagraphs(bodyParagraphs, passage.title);
  const expressions = pickExpressions(bodyText);
  const sourceNote = passage.recoveredPath
    ? `本篇由 raw text 修复生成，恢复源：${path.relative(repoRoot, passage.recoveredPath).replace(/\\/g, "/")}。`
    : "本篇来自结构化 reading section。";

  return `# Cambridge IELTS 08 Test ${test.testNo} Passage ${passage.passageNo}：${title}｜双语精读短版

这是一版覆盖优先的短版精读。它不追求把每个词都讲成词典，而是服务于做题复盘：先抓文章主线，再抓会影响定位、判断和同义替换的表达。

${sourceNote} 当前素材延申标记为 \`needs_web_enrichment\`：未编造外部出处，后续可以再联网补强 1-2 个 A 层表达。

## 01 段落主线与自然译意

${bodyParagraphs.map((paragraph, index) => `### ${index + 1}\n\n${paragraph}\n\n${paragraphSummary(paragraph, index)}`).join("\n\n")}

## 02 高价值表达

${expressions.map((expression, index) => {
  if (expression === "作者的限定语") {
    return `${index + 1}. \`may / can / tend to / suggest\`\n\n这类限定语在 IELTS 里非常关键。中文理解时不要把“可能、倾向于、提示”读成绝对结论；题目若改成 always / prove / completely，通常就需要警惕。`;
  }
  if (expression === "题干改写") {
    return `${index + 1}. 题干改写\n\n做题时不要期待题干复用原文。把题干里的普通词还原成原文里的功能词：原因、结果、比较、让步、范围，通常比逐词搜索更稳。`;
  }
  return `${index + 1}. \`${expression}\`\n\n这个表达要放回本篇语境理解。它不是孤立词组，而是在帮助作者连接证据和结论。迁移时可以用于教育、科技、公共政策或职场话题：\`${expression}\` often signals a relationship that is broader than one isolated detail.`;
}).join("\n\n")}

## 03 题目与选项双语解释摘要

${renderQuestions(questionSections)}

## 04 IELTS 风险

本篇最容易错在三处：第一，题目把局部例子扩大成全文结论；第二，把作者谨慎的限定语改成绝对判断；第三，把段落中的时间顺序或对比关系改写成因果关系。复盘时建议把每道题的题干和原文证据各划出一个同义替换点。

## 05 Anki 候选

- Front: 本篇一个核心同义替换是什么？ Back: 用题干表达和原文表达各写一遍，并说明对象和范围是否一致。
- Front: 如何判断 TRUE/FALSE/NOT GIVEN 中的范围偷换？ Back: 检查题干是否把 may/can/some 改成 always/all/prove。
- Front: 本篇一个可迁移表达如何造句？ Back: 选一个学习或职场场景，用上 \`${expressions[0] || "a key factor"}\`。
`;
}

function recoverFromPassageArray(test, passageNo) {
  const items = Array.isArray(test.passage) ? test.passage : [];
  const pattern = new RegExp(`Reading Passage\\s+${passageNo}\\b`, "i");
  const item = items.find((entry) => pattern.test(String(entry || "")));
  if (!item) return null;
  const text = cleanText(String(item));
  const paragraphs = text.split(/\n{2,}|\n(?=[A-Z][^\n]{10,})/).map(cleanText).filter(Boolean);
  return paragraphs.length ? paragraphs : [text];
}

function main() {
  const bank = readJson(bankPath);
  const tests = (bank.tests || [])
    .filter((test) => test.mode === "reading" && /^cambridge-08-reading-test-/.test(test.id))
    .map((test) => ({
      ...test,
      testNo: Number((test.id.match(/reading-test-(\d+)/) || [])[1])
    }))
    .sort((a, b) => a.testNo - b.testNo);

  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(recoveredDir, { recursive: true });

  const records = [];
  const skipped = [];

  for (const test of tests) {
    const structured = (test.readingSections || []).filter(isPassageSection);
    const byNo = new Map(structured.map((section, index) => [passageNumber(section, index), section]));

    for (const passageNo of [1, 2, 3]) {
      let source = "structured";
      let paragraphs = Array.isArray(byNo.get(passageNo)?.paragraphs) ? byNo.get(passageNo).paragraphs : [];
      let recoveredPath = "";

      if (!paragraphs.length || paragraphs.join(" ").length < 500) {
        const recovered = recoverFromPassageArray(test, passageNo);
        if (recovered) {
          source = "recovered";
          paragraphs = recovered;
          recoveredPath = path.join(recoveredDir, `recovered-08-test-${test.testNo}-passage-${passageNo}.md`);
          fs.writeFileSync(recoveredPath, `${recovered.join("\n\n")}\n`, "utf8");
        }
      }

      if (!paragraphs.length) {
        skipped.push({ test: test.testNo, passage: passageNo, reason: "missing source text" });
        continue;
      }

      const passage = {
        title: `Reading Passage ${passageNo}`,
        passageNo,
        paragraphs,
        recoveredPath
      };
      const questionSections = questionSectionsFor(test, passageNo);
      const title = titleFromParagraphs(trimInstruction(paragraphs), `Passage ${passageNo}`);
      const fileName = `Cambridge-IELTS-08-Test-${String(test.testNo).padStart(2, "0")}-Passage-${String(passageNo).padStart(2, "0")}-${sanitizeStem(title)}.md`;
      const filePath = path.join(outDir, fileName);
      fs.writeFileSync(filePath, renderPassage(test, passage, questionSections), "utf8");

      records.push({
        test: test.testNo,
        passage: passageNo,
        file: path.relative(repoRoot, filePath).replace(/\\/g, "/"),
        source,
        recoveredPath: recoveredPath ? path.relative(repoRoot, recoveredPath).replace(/\\/g, "/") : "",
        paragraphCount: paragraphs.length,
        questionSectionCount: questionSections.length,
        materialExtension: "needs_web_enrichment"
      });
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    book: "08",
    generatedCount: records.length,
    recoveredCount: records.filter((record) => record.source === "recovered").length,
    skippedCount: skipped.length,
    files: records,
    skipped
  };
  fs.writeFileSync(path.join(outDir, "manifest-08.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`generated=${records.length} recovered=${manifest.recoveredCount} skipped=${skipped.length}`);
}

main();
