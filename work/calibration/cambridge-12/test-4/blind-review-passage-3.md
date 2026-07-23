# Cambridge IELTS 12 Test 4 Passage 3 独立盲审（初审）

## 审核身份与范围

- 审核者未参与 Passage 3 生成，且未修改 `passage-3.json` 或 Passage 3 精读正文。
- 人工对照物理第 88 页（总指令、Questions 27–33、headings）、第 89–90 页（标题及 A–G 正文）、第 91 页（Questions 34–40）和第 123 页（官方答案）。页面 OCR 只用于辅助辨认，结论按原书版面、JSON 与 Markdown 三方逐项核对。
- 本文件是初审报告；下列问题修正并经针对性复核前，不签署“零遗留问题”。

## 初审发现

### P3-BR-01（高）重复 B1+ 覆盖不完整

精读没有满足“每次出现都独立讲解”的硬规则。至少缺少以下本句词项：

- 句 1：`a number of`，本句义为“若干、多次”，B1+。
- 句 8：`once`，本句是“过去、从前”的 B1 义项。
- 句 15、17、18、25、30：公司治理义的 `board/boards` 为 C1；这些句中均没有独立词条。前句或复合词中讲过 `professional board`、`board decision-making` 不能替代本句重复讲解。
- 句 21：`simply` 在 `is simply seeking` 中为 B2（仅仅/强调）且漏讲。
- 句 26：`increased` / `increase` 为 B1，本句漏讲。
- 句 31：`challenging times` 中 `times` 表示“当前时代/时势”，不能只讲 `challenging`；应把整个表达作为 B1+ 词块解释。

### P3-BR-02（中）两处 CEFR 明显偏低

- 句 24：`board member` 标为 B1；其中公司治理义 `board` 的 Cambridge 级别为 C1，整项至少应按 C1 公司治理专业表达处理。
- 句 29：名词 `academic`（高校教师/研究人员、学者）标为 B1；Cambridge Learner’s Dictionary 将 `academic` 词条列为 B2，应改为 B2。

### P3-BR-03（中）句 15 译文把语气错误强化

原文 `it would be important to establish clear guidelines` 表示“制定明确准则会很重要/很有必要”，现译文写成“因此必须……制定明确准则”，把 `would be important` 强化为强制义“必须”。应改为“因此有必要/很重要的是制定明确准则”。

### P3-BR-04（中）句 21 句法关系错误

现讲解称 `who` 引出并列动作 `moves、engaging、is seeking`。实际并列谓语只有 `moves ... and is ... seeking`；`engaging` 受介词 `without` 支配，是伴随/方式性的动名词结构，不与两个谓语并列。应据此修正句法说明。

### P3-BR-05（中）句 27 词义讲解与原文语境冲突

词条把 `speak out against` 解释为“公开反对”，但原文紧接 `in the privacy of the committee`，明确是在委员会私下场合反对。此处应解释为“直言反对/明确表示反对”，并说明通常可含公开发声义，但本句被 `in the privacy ...` 限定为内部直言。

### P3-BR-06（中）三个 A 层均未达到深挖要求

数量和链接虽正确，但 `post-mortem`、`step on someone’s toes`、`glare` 三个 A 层都只有 1 个迁移例句，没有至少 2 个双语迁移例句，也没有 2–3 个近义表达差别和明确使用边界。应补足深挖内容，同时保持 A 层恰好 3 个、Cambridge 链接恰好 3 条。

## 已通过项目与证据

- 物理页：正文第 89–90 页；题目第 88、91 页；官方答案第 123 页。JSON 的 `section.sourcePages=[89,90]`、`questionPages=[88,91]`、`answerKeyPage=123` 正确；顶层相关页覆盖 88–91。
- 原文结构：A–G 共 7 段；JSON 与 Markdown 均为 31 个完整句子，编号 1–31 连续，顺序一致；Markdown 的 31 条英文逐字符等于 JSON 句子文本。跨页位置正确：A–D 在第 89 页，E–G 在第 90 页。
- 原书逐字核验：标题 `UK companies need more effective boards of directors`、31 句正文、段落标签、破折号/撇号/引号及书名均未发现转录差异。
- 版式硬指标：A 层标题 3 个，Cambridge Dictionary 链接 3 条，图片 0 张；无整页截图模块。
- 题库结构：3 个题组、14 题，题号 27–40 连续。Questions 27–33 的八个 headings（i–viii）及翻译完整；Questions 34–37 的 YES/NO/NOT GIVEN 三标签及翻译完整；Questions 38–40 的 ONE WORD ONLY 限制完整。
- 官方答案与第 123 页一致：27 iv，28 ii，29 vi，30 viii，31 vii，32 i，33 iii，34 YES，35 NOT GIVEN，36 NO，37 NO，38 information，39 financial，40 shareholders/investors。第 40 题两个官方变体均已结构化并在精读中呈现。
- 题解：每题均有题干、翻译、官方答案、连续逐字证据、定位和干扰项分析；27–33 对全部八个 headings 逐项排除，34–37 对三个判断标签逐项排除，38–40 说明字数限制与误填项。程序复核确认 14 段证据均为 31 句正文的连续原文子串，且 JSON 与 Markdown 的证据逐字符相同。
- 翻译与句法除 P3-BR-03 至 P3-BR-05 外，未发现其他确定性错误。

## 初审结论

初审发现 6 组实际问题（重复词汇覆盖、CEFR、翻译、句法、语境词义、A 层深度）。正文转录、结构、题目与官方答案通过。状态：**待生成者修正，尚未零遗留**。

## 生成者修正记录（2026-07-21）

- 已补齐 s1 a number of、s8 once、s15/s17/s18/s25/s30 board、s21 simply、s26 increase、s31 challenging times 等所有重复或遗漏的 B1+ 项。
- 已将 s24 board member 调整为 C1（公司治理专业表达），将 s29 名词 academic 调整为 B2。
- 已把 s15 译文的“必须”改为“有必要”，与 would be important 的情态强度一致。
- 已改正 s21 句法：并列谓语仅为 moves ... 与 is ... seeking；without engaging ... 为介词支配的动名词结构，作伴随/方式状语。
- 已按委员会内部语境重写 s27 speak out against 的释义，消除与 in the privacy of the committee 的冲突。
- 三个 A 层均已扩写结构/机制、近义边界及至少两个双语迁移例句，仍严格保留三条 Cambridge Dictionary 链接。
- 生成者已重新执行英文句序、题目、答案、证据、词汇、A 层、链接和图片计数自检，并提交原审计者针对性复核。
## 原审计者针对性复核（第 1 轮）

### 已关闭问题

- P3-BR-01：关闭。逐句确认 s1 `a number of`、s8 `once`、s15/s17/s18/s25/s30 `board`、s21 `simply`、s26 `increase`、s31 `challenging times` 均已在对应句内独立补讲。
- P3-BR-02：关闭。s24 `board member` 已改为 C1 公司治理专业表达；s29 名词 `academic` 已改为 B2。
- P3-BR-03：关闭。s15 已由“必须”改为“有必要”，与 `would be important` 的情态强度一致。
- P3-BR-04：关闭。s21 已明确并列谓语为 `moves ...` 与 `is ... seeking`，并正确说明 `without engaging ...` 是介词支配的动名词结构。
- P3-BR-05：关闭。s27 已说明 `speak out against` 在本句受 `in the privacy of the committee` 限定，表示委员会内部直言反对。
- P3-BR-06：深度要求已满足：三个 A 层均有至少两个双语迁移例句、表达机制、近义差别和使用边界；数量仍为 3，Cambridge 链接仍为 3。

### 精确残留问题

- P3-BR-07（低，A 层措辞）：`glare` 深挖中写“本句的 `the glare of publicity`”，但本句原文实际是 `in the full glare of press attention`。这是扩写时引入的原句误称；应把该处改为实际原文词块（可写“本句的 `in the full glare of press attention`”），不要把近义搭配 `the glare of publicity` 称为“本句”。

### 回归结果

- A–G 七段、31 句仍完整；Markdown 31 条英文与 JSON 逐字符一致。
- Q27–40 共 14 题仍连续完整；14 段证据均为正文连续逐字子串，且 JSON 与 Markdown 证据逐字符一致；答案序列及 Q40 `shareholders/investors` 双变体未变化。
- A 层 3 个、Cambridge Dictionary 链接 3 条、图片 0 张；`git diff --check` 通过。

第 1 轮复核结论：六组原问题均已实质修正，但发现 1 处扩写引入的低级别措辞残留 P3-BR-07，因此当前仍不签“零遗留”。
- P3-BR-07：已将 glare A 层中误写的 the glare of publicity 精确改为原文 in the full glare of press attention；未改动其他内容。

## 原审计者最终针对性复核（第 2 轮）

- P3-BR-07：关闭。`glare` 深挖已准确写为“本句的 `in the full glare of press attention`”，不再把近义搭配 `the glare of publicity` 误称为原句。
- 回归复核：A–G 七段、31 句完整，Markdown 英文与 JSON 逐字符一致；Q27–40 共 14 题连续完整，所有证据仍是正文连续逐字子串；答案及 Q40 `shareholders/investors` 双变体不变；A 层 3 个、Cambridge Dictionary 链接 3 条、图片 0 张；`git diff --check` 通过。

最终结论：P3-BR-01 至 P3-BR-07 全部关闭，**零遗留问题，通过盲审**。