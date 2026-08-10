const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  extractIntensiveReadingSummary,
  parseIntensiveReadingMarkdown,
} = require("../intensive-reading-parser.js");

// Real format: Cambridge 04 uses ### numeric units and bold English sentences.
const boldSentenceSample = `# 儿童眼中的热带雨林｜Cambridge IELTS 4 Test 1 Passage 1 双语精读

这篇文章先讨论儿童怎样从媒体形成热带雨林观念。

作者随后说明学校为什么需要帮助儿童检验这些观念。

## 01 逐句精读

### 1

**Adults and children are frequently confronted with statements about the alarming rate of loss of tropical rainforests.**

成人和儿童经常接触到关于热带雨林正以惊人速度消失的说法。

句子主干是 Adults and children are confronted with statements。

#### A层深挖 1：be confronted with

这个表达强调不得不面对某个问题，比普通的 see 更有压力感。

### 2

**It is also possible that some of these ideas will be mistaken.**

其中一些观念也可能是错误的。

这里用 possible 保留了判断分寸。

## 02 题目与选项精讲

### Questions 1–8：TRUE / FALSE / NOT GIVEN

Question 1 asks about media coverage.

## 03 全文回收

文章最终把媒体输入、错误观念与课堂纠正连在一起。`;

const boldModel = parseIntensiveReadingMarkdown(boldSentenceSample, {
  idPrefix: "cambridge-04-test-1-passage-1",
});

assert.equal(
  boldModel.title,
  "儿童眼中的热带雨林｜Cambridge IELTS 4 Test 1 Passage 1 双语精读"
);
assert.match(boldModel.lead, /媒体形成热带雨林观念/);
assert.match(boldModel.lead, /学校为什么需要/);
assert.equal(boldModel.sections.length, 1);
assert.equal(boldModel.units.length, 2);
assert.deepEqual(
  {
    id: boldModel.units[0].id,
    english: boldModel.units[0].english,
    chinese: boldModel.units[0].chinese,
    explanation: boldModel.units[0].explanation,
  },
  {
    id: "cambridge-04-test-1-passage-1-unit-1",
    english:
      "Adults and children are frequently confronted with statements about the alarming rate of loss of tropical rainforests.",
    chinese: "成人和儿童经常接触到关于热带雨林正以惊人速度消失的说法。",
    explanation: "句子主干是 Adults and children are confronted with statements。",
  }
);
assert.equal(boldModel.deepDives.length, 1);
assert.equal(boldModel.deepDives[0].unitId, boldModel.units[0].id);
assert.equal(boldModel.deepDives[0].title, "A层深挖 1：be confronted with");
assert.match(boldModel.deepDives[0].content, /不得不面对某个问题/);
assert.equal(boldModel.questionSection.title, "02 题目与选项精讲");
assert.match(boldModel.questionSection.content, /TRUE \/ FALSE \/ NOT GIVEN/);
assert.equal(boldModel.takeaways.length, 1);
assert.equal(boldModel.takeaways[0].title, "03 全文回收");

// Real format: Cambridge 11 uses #### numeric units and blockquoted English.
const quotedSentenceSample = `# Easter Island｜双语精读

## 01 完整逐句精读

### Paragraph A

#### 1

> Easter Island, or Rapa Nui as it is known locally, is home to several hundred ancient human statues – the moai.

复活节岛，当地称为拉帕努伊，是数百尊古代人像——摩艾石像——的所在地。

- 主干是 Easter Island is home to several hundred ancient human statues。
- be home to 表示“是……的所在地”。

#### 2

> After this remote Pacific island was settled by the Polynesians, it remained isolated for centuries.

这座偏远的太平洋岛屿被波利尼西亚人定居后，仍与世隔绝了数百年。

- After 从句交代先发生的定居，主句说明长期隔绝。`;

const quotedModel = parseIntensiveReadingMarkdown(quotedSentenceSample);
assert.equal(quotedModel.paragraphs.length, 1);
assert.equal(quotedModel.paragraphs[0].title, "Paragraph A");
assert.equal(quotedModel.paragraphs[0].units.length, 2);
assert.equal(quotedModel.units[0].id, "unit-1");
assert.equal(
  quotedModel.units[0].english,
  "Easter Island, or Rapa Nui as it is known locally, is home to several hundred ancient human statues – the moai."
);
assert.match(quotedModel.units[0].explanation, /主干是 Easter Island/);
assert.match(quotedModel.units[0].explanation, /be home to/);
assert.equal(quotedModel.units[0].paragraphId, quotedModel.paragraphs[0].id);

// Real format: Cambridge 10 uses a standalone number followed by a plain English line.
const plainSentenceSample = `# 艺术博物馆及其公众｜Cambridge IELTS 10 Test 2 Passage 3 双语精读

## 01 逐句精读
### 导语

1

The fact that people go to the Louvre museum in Paris to see the original painting Mona Lisa leads us to question the role of museums.

人们前往巴黎卢浮宫观看《蒙娜丽莎》原作，这促使我们质疑博物馆的作用。

主干是 The fact leads us to question the role of museums。

### 正文第 1 段

2

One of the most famous works of art in the world is Leonardo da Vinci's Mona Lisa.

世界上最著名的艺术作品之一，是列奥纳多·达·芬奇的《蒙娜丽莎》。

这句话先建立读者共同熟悉的背景。`;

const plainModel = parseIntensiveReadingMarkdown(plainSentenceSample);
assert.equal(plainModel.units.length, 2);
assert.equal(plainModel.paragraphs.length, 2);
assert.equal(plainModel.paragraphs[0].title, "导语");
assert.equal(plainModel.paragraphs[1].title, "正文第 1 段");
assert.match(plainModel.units[0].english, /^The fact that people go to the Louvre/);
assert.match(plainModel.units[1].chinese, /列奥纳多/);

// Real format: Cambridge 19 may put the unit number inside the bold English line.
const inlineNumberSample = `# How tennis rackets have changed｜网球拍经历了怎样的变化

## 01 逐句精读

### 第一段

**1. In 2016, the British professional tennis player Andy Murray was ranked as the world’s number one.**

2016 年，英国职业网球选手 Andy Murray 登上世界第一。

**词汇与表达：**

rank as 表示“被列为”。

**2. It was an incredible achievement by any standard.**

无论按什么标准衡量，这都是一项了不起的成就。

这里的 by any standard 强调结论经得起不同尺度衡量。`;

const inlineModel = parseIntensiveReadingMarkdown(inlineNumberSample);
assert.equal(inlineModel.units.length, 2);
assert.equal(
  inlineModel.units[0].english,
  "In 2016, the British professional tennis player Andy Murray was ranked as the world’s number one."
);
assert.equal(inlineModel.units[0].chinese, "2016 年，英国职业网球选手 Andy Murray 登上世界第一。");
assert.match(inlineModel.units[0].explanation, /词汇与表达/);
assert.match(inlineModel.units[0].explanation, /rank as/);

// Real format variants also label the source/translation and embed "句" in a heading.
const labelledSentenceSample = `# Gifted children and learning

## 01 逐句精读

### 句 1（段落 A）

**原文：** Internationally, giftedness is most frequently determined by a score on a general intelligence test.

**翻译：** 在国际上，天赋最常通过一般智力测验的分数来判定。

**主干与修饰：** giftedness is determined by a score。

### 句 2（段落 A）

**原句**：Children’s educational environment contributes to the IQ score.

**译文**：儿童所处的教育环境会影响其 IQ 分数。

这里的 contribute to 表示“促成、影响”。

### 句 3

**英文：** Excellence does not emerge without appropriate help.

**翻译：** 没有恰当的帮助，卓越便不会显现。`;

const labelledModel = parseIntensiveReadingMarkdown(labelledSentenceSample);
assert.equal(labelledModel.units.length, 3);
assert.equal(
  labelledModel.units[0].english,
  "Internationally, giftedness is most frequently determined by a score on a general intelligence test."
);
assert.equal(labelledModel.units[0].chinese, "在国际上，天赋最常通过一般智力测验的分数来判定。");
assert.match(labelledModel.units[0].explanation, /giftedness is determined/);
assert.equal(
  labelledModel.units[1].english,
  "Children’s educational environment contributes to the IQ score."
);
assert.equal(labelledModel.units[2].english, "Excellence does not emerge without appropriate help.");

// Real format: some books use a bold number as the marker.
const boldNumberSample = `# Why being bored is stimulating

## 正文逐句精读

### A

**1**

We all know how it feels – time stretches out.

我们都知道那是什么感觉——时间仿佛被拉长。

这句话用 stretch 写主观时间感。`;

const boldNumberModel = parseIntensiveReadingMarkdown(boldNumberSample);
assert.equal(boldNumberModel.units.length, 1);
assert.equal(boldNumberModel.units[0].english, "We all know how it feels – time stretches out.");

// Real format: newer files may make every "句 N" an H2 block.
const h2UnitSample = `# 软木：一种树皮，如何撑起两千年的材料史

这篇文章从软木的物理特性写起。

## 句 1

Cork – the thick bark of the cork oak tree – is a remarkable material.

软木——即软木橡树厚厚的树皮——是一种非凡的材料。

主干是 Cork is a remarkable material。

### A层深挖：cork

cork 既可指树皮材料，也可指瓶塞。

## 句 2

It is tough, elastic, buoyant, and fire-resistant.

它坚韧、有弹性、能浮在水上并且耐火。

并列形容词集中列出材料性能。`;

const h2UnitModel = parseIntensiveReadingMarkdown(h2UnitSample);
assert.equal(h2UnitModel.lead, "这篇文章从软木的物理特性写起。");
assert.equal(h2UnitModel.units.length, 2);
assert.equal(h2UnitModel.sections.length, 2);
assert.equal(h2UnitModel.paragraphs.length, 2);
assert.equal(h2UnitModel.units[0].english, "Cork – the thick bark of the cork oak tree – is a remarkable material.");
assert.equal(h2UnitModel.deepDives[0].unitId, h2UnitModel.units[0].id);

// Real format: a #### heading can contain both the number and English sentence.
const sentenceHeadingSample = `# Oxytocin

## 阅读正文精读

### Paragraph A

#### 1. Oxytocin is a chemical, a hormone produced in the pituitary gland in the brain.

**翻译：** 催产素是一种化学物质，是一种由脑内垂体产生的激素。

**主干、修饰与作用：** 主干为 Oxytocin is a chemical。

#### 2（A2）

> It was through animal studies that scientists first became aware of oxytocin.

科学家最初正是通过动物研究认识到催产素。`;

const sentenceHeadingModel = parseIntensiveReadingMarkdown(sentenceHeadingSample);
assert.equal(sentenceHeadingModel.units.length, 2);
assert.equal(
  sentenceHeadingModel.units[0].english,
  "Oxytocin is a chemical, a hormone produced in the pituitary gland in the brain."
);
assert.equal(sentenceHeadingModel.units[0].chinese, "催产素是一种化学物质，是一种由脑内垂体产生的激素。");
assert.equal(
  sentenceHeadingModel.units[1].english,
  "It was through animal studies that scientists first became aware of oxytocin."
);

// Real format: several lessons put an A-layer deep dive in its own H2 block.
const h2DeepDiveSample = `# Gifted children

## 正文逐句精读

### 句 1

**英文：** IQ tests cannot identify the processes of learning and thinking.

**翻译：** IQ 测验无法识别学习和思考的过程。

## A层深挖 1：相关不等于单一因果

研究中的 relationship 只说明变量相关，并未声称某一因素是唯一原因。

### 句 2

**英文：** Excellence does not emerge without appropriate help.

**翻译：** 没有恰当的帮助，卓越便不会显现。`;

const h2DeepDiveModel = parseIntensiveReadingMarkdown(h2DeepDiveSample);
assert.equal(h2DeepDiveModel.units.length, 2);
assert.equal(h2DeepDiveModel.deepDives.length, 1);
assert.equal(h2DeepDiveModel.deepDives[0].unitId, h2DeepDiveModel.units[0].id);
assert.match(h2DeepDiveModel.deepDives[0].content, /relationship 只说明变量相关/);
assert.doesNotMatch(h2DeepDiveModel.deepDives[0].content, /Excellence does not emerge/);

// Legacy completed lessons may keep their three A-layer explanations in a
// standalone section after the sentence-by-sentence reading. Explicit sentence
// numbers should reconnect those explanations to the intended source units.
const standaloneDeepDiveSample = `# A prepared mind

## 正文逐句精读

### 1

Chance favours the prepared mind.

机会眷顾有准备的头脑。

### 2

The team lost no time in testing the result.

团队立刻开始检验结果。

### 3

They eventually went back to the drawing board.

他们最终回到起点重新设计。

## 核心表达深挖

### A层深挖：句 1 — favour the prepared mind

这个表达把偶然与准备连接起来。The discovery favoured a prepared team. 这项发现眷顾了有准备的团队。Good opportunities often favour the prepared mind. 好机会往往眷顾有准备的头脑。

### A层深挖：句 2 — lose no time in doing

这个结构强调马上行动。The school lost no time in issuing a notice. 学校立即发布通知。The editor lost no time in correcting the error. 编辑立即更正错误。

### A层深挖：句 3 — go back to the drawing board

这个表达表示需要从设计阶段重新开始。The pilot failed, so we went back to the drawing board. 试点失败了，所以我们从头设计。If the interface remains confusing, the team must go back to the drawing board. 如果界面仍然难懂，团队就必须推倒重来。`;

const standaloneDeepDiveModel = parseIntensiveReadingMarkdown(standaloneDeepDiveSample);
assert.equal(standaloneDeepDiveModel.deepDives.length, 3);
assert.deepEqual(
  standaloneDeepDiveModel.deepDives.map((dive) => dive.unitId),
  standaloneDeepDiveModel.units.map((unit) => unit.id)
);

// A title-level A-layer note may appear before the first numbered sentence.
// It should remain available and attach to the first usable reading unit.
const leadingDeepDiveSample = `# Endless Harvest｜无尽的收获

**A层深挖 1/3：endless harvest**

这个标题把可持续收获写成一种需要制度维持的承诺。Good soil management can create an endless harvest. 良好的土壤管理能够带来持续收获。No platform can expect an endless harvest of attention. 平台不能期待注意力永不枯竭。

## 原文逐句展开

### 第一段

#### 1

For centuries, salmon have provided food for communities.

几个世纪以来，鲑鱼一直为社区提供食物。`;

const leadingDeepDiveModel = parseIntensiveReadingMarkdown(leadingDeepDiveSample);
assert.equal(leadingDeepDiveModel.deepDives.length, 1);
assert.equal(leadingDeepDiveModel.deepDives[0].unitId, leadingDeepDiveModel.units[0].id);

// Structural labels following a translated title are paragraph headings, not
// English study units of their own.
const structuralHeadingSample = `# Scarce resources

## 01 逐句精读

### 标题

**The Problem of Scarce Resources**

稀缺资源问题。

### Section A

**1. Health-care resources must be allocated fairly.**

医疗资源必须得到公平分配。

### Section B

**2. Every system has to set priorities.**

每个体系都必须确定优先事项。`;

const structuralHeadingModel = parseIntensiveReadingMarkdown(structuralHeadingSample);
assert.deepEqual(
  structuralHeadingModel.units.map((unit) => unit.english),
  [
    "The Problem of Scarce Resources",
    "Health-care resources must be allocated fairly.",
    "Every system has to set priorities.",
  ]
);

// Boundary and safety behavior: sparse content degrades safely and raw HTML/code is never emitted.
const unsafeSample = `# <em>Safe lesson</em><script>globalThis.pwned = true</script>

<iframe src="https://example.invalid"></iframe>

## 01 逐句精读

### 1

\`\`\`html
<script>globalThis.pwned = true</script>
\`\`\`

**A real sentence remains.**

<span onclick="globalThis.pwned = true">这句译文仍然保留。</span>

<img src=x onerror="globalThis.pwned = true">解释仍然保留。`;

delete globalThis.pwned;
const unsafeModel = parseIntensiveReadingMarkdown(unsafeSample);
assert.equal(globalThis.pwned, undefined);
assert.equal(unsafeModel.title, "Safe lesson");
assert.equal(unsafeModel.units.length, 1);
assert.equal(unsafeModel.units[0].english, "A real sentence remains.");
assert.equal(unsafeModel.units[0].chinese, "这句译文仍然保留。");
assert.match(unsafeModel.units[0].explanation, /解释仍然保留/);
assert.doesNotMatch(JSON.stringify(unsafeModel), /<script|<iframe|<img|onclick|onerror/i);

const sparseModel = parseIntensiveReadingMarkdown(`### 1

> English survives even when optional fields are absent.`);
assert.equal(sparseModel.title, "");
assert.equal(sparseModel.units.length, 1);
assert.equal(sparseModel.units[0].english, "English survives even when optional fields are absent.");
assert.equal(sparseModel.units[0].chinese, "");
assert.equal(sparseModel.units[0].explanation, "");
assert.equal(sparseModel.questionSection, null);
const orphanDiveModel = parseIntensiveReadingMarkdown(`## 01 精读

### 1

#### A层深挖：missing source sentence

这段深挖没有可关联的英文句子。`);
assert.equal(orphanDiveModel.units.length, 0);
assert.equal(orphanDiveModel.deepDives.length, 0);
assert.deepEqual(parseIntensiveReadingMarkdown(null), {
  schemaVersion: 1,
  title: "",
  lead: "",
  sections: [],
  paragraphs: [],
  units: [],
  deepDives: [],
  questionSection: null,
  takeaways: [],
});

const immutableOptions = Object.freeze({ idPrefix: "stable-prefix", title: "Fallback title" });
const immutableInput = "# Input title\n\n## 01 精读\n\n### 1\n\nA sentence.";
const inputBefore = immutableInput;
parseIntensiveReadingMarkdown(immutableInput, immutableOptions);
assert.equal(immutableInput, inputBefore);
assert.deepEqual(immutableOptions, { idPrefix: "stable-prefix", title: "Fallback title" });

const summary = extractIntensiveReadingSummary(boldModel);
assert.deepEqual(summary, {
  title: boldModel.title,
  unitCount: 2,
  paragraphCount: 1,
  deepDiveCount: 1,
  hasQuestions: true,
  takeawayCount: 1,
});

// Integration coverage: every currently shipped canonical lesson must yield usable units.
const corpusRoot = path.resolve(__dirname, "..", "data", "generated", "intensive-reading");
const corpusFiles = [];
function collectCorpusFiles(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "recovered-sources") collectCorpusFiles(absolute);
      return;
    }
    if (/^Cambridge-IELTS-\d+-Test-\d+-Passage-\d+.*\.md$/i.test(entry.name)) {
      corpusFiles.push(absolute);
    }
  });
}
collectCorpusFiles(corpusRoot);
assert.equal(corpusFiles.length, 216, "Cambridge 04–21 should expose exactly 216 canonical lessons");
corpusFiles.forEach((file) => {
  const lesson = parseIntensiveReadingMarkdown(fs.readFileSync(file, "utf8"), {
    idPrefix: path.basename(file, ".md"),
  });
  assert.ok(lesson.units.length > 0, `${path.basename(file)} should yield sentence units`);
  assert.equal(new Set(lesson.units.map((unit) => unit.id)).size, lesson.units.length);
  assert.equal(
    lesson.sections.reduce((count, section) => count + section.units.length, 0),
    lesson.units.length,
    "section units should cover the flat unit list exactly once"
  );
  assert.equal(
    lesson.paragraphs.reduce((count, paragraph) => count + paragraph.units.length, 0),
    lesson.units.length,
    "paragraph units should cover the flat unit list exactly once"
  );
  lesson.units.forEach((unit) => {
    assert.ok(unit.id);
    assert.ok(unit.english);
    assert.equal(typeof unit.chinese, "string");
    assert.equal(typeof unit.explanation, "string");
    assert.ok(lesson.sections.some((section) => section.id === unit.sectionId));
    assert.ok(lesson.paragraphs.some((paragraph) => paragraph.id === unit.paragraphId));
  });
  lesson.deepDives.forEach((dive) => {
    assert.ok(lesson.units.some((unit) => unit.id === dive.unitId), "deep dives must not be orphaned");
  });
});

console.log(
  `PASS: intensive-reading parser normalizes all ${corpusFiles.length} canonical lessons plus bold, quote, plain, inline-number, sparse, and HTML-safety cases.`
);
