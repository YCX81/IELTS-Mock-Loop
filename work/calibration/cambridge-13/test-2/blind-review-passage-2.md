# Cambridge IELTS 13 Test 2 Passage 2 独立盲审报告

## 审核范围与依据

- 审核对象：`Cambridge-IELTS-13-Test-2-Passage-2-双语精读.md`、`passage-2.json`。
- 唯一内容依据：`source-pages.json` 的物理页 43–46、120，以及由 `data/Cambridge-IELTS-13.pdf` 重新渲染的对应页面。
- 视觉检查：物理页 43–44 为正文 A–F，45–46 为 Questions 14–26，120 为官方答案页。逐页图像与 `source-pages.json` 一致，未发现双栏顺序、跨页、段落标签、题号、选项或答案页转录错误。

## 已通过项目

- 正文为 A–F 六段、42 个完整句子；顺序正确。
- 42 句英文与校准来源逐字符一致；`bodyParagraphs`、flat `sentences` 与精读中的英文顺序一致。
- 总体指令及三组题型指令均完整。
- Questions 14–26 共 13 题，题干、研究者名单、摘要、官方答案、证据、定位和干扰项逻辑均与原书相符。
- 官方答案依次为：14 B、15 F、16 B、17 E、18 A、19 B、20 C、21 animals、22 childbirth、23 placebo、24 game、25 strangers、26 names。
- 硬性计数正确：A 层 3 个、Cambridge Dictionary 链接 3 条、图片 0 张。
- JSON 元数据正确：`passageNumber: 2`、`status: manually_calibrated`、`sourcePages: [43,44,45,46]`、`answerKeyPage: 120`。

## 发现的问题

### 1. 三个 A 层均未达到“深挖六件套”要求

三个 A 层目前都只有“原文作用 / 语义边界 / 迁移用法 / 易错提醒 / 词典链接”的短列表，每个只有 1 个英文例句，而且没有中文翻译；均缺至少 2 个可迁移双语例句，也没有完成 2–3 个近义表达的差别说明。部分项目还缺少字面画面、构词或常见搭配，以及与普通说法的差别。

- A 层 1：`for worse as well as for better`（约第 132–138 行）。
- A 层 2：`not mutually exclusive`（约第 486–492 行）。
- A 层 3：`be co-opted for`（约第 606–612 行）。

修正要求：保留恰好 3 个 A 层和恰好 3 条 Cambridge 链接，但把每层扩成完整长讲；每层至少 2 个自然英文例句及中文译文，并自然加入 2–3 个近义/替换表达及适用差别。

### 2. 仍有明确的重复 B1+ 漏讲

- Sentence 8：`greatly` 为 B2，未列入本句词汇。
- Sentence 16：本句再次出现 `positive` (B1)，未重复讲解。
- Sentence 23：`Studies` 在“科研研究”义为 B2，未列入；`actually` 在这里强调与预期相反，属于 B1 义，也未列入。

修正要求：把上述词项分别加入对应句，不得以其他句已经讲过为由省略。

### 3. 多处 CEFR 明显误标

以下均是当前语境中的明确等级错误：

- Sentence 1：`brain` 标为 B1；器官义应为 A2，只能写 `基础词（A1/A2）`，或不列。
- Sentences 2、8、12：`study` 均标为 B1；“科研研究”名词义应为 B2。
- Sentences 11、23：`receive` 标为 B1；“收到/接受”义为 A2，只能写 `基础词（A1/A2）`，或不列。
- Sentences 20、35：`improve` 标为 B1；“改善/提高”义为 A2，只能写 `基础词（A1/A2）`，或不列。
- Sentence 24：`foreign` 标为 B1；“外国的”义为 A2，只能写 `基础词（A1/A2）`，或不列。
- Sentence 35：`explain` 标为 B1；本义为 A2，只能写 `基础词（A1/A2）`，或不列。
- Sentence 37：`perhaps` 标为 B1；表示可能性的本义为 A2，只能写 `基础词（A1/A2）`，或不列。
- Sentence 41：`agree` 标为 B1；“赞同”义为 A2，只能写 `基础词（A1/A2）`，或不列。
- Sentence 42：`probably` 标为 B1；表示“很可能”的本义为 A2，只能写 `基础词（A1/A2）`，或不列。

### 4. 三处中文译文需要修正

- Sentence 10：`they could invest money with an anonymous person` 被译成“把钱交给一名……匿名人士去投资”，容易理解为由匿名人士代为投资。应改为“可以与一名无法保证诚实的匿名人士进行金钱投资/把钱投入与匿名人士的交易中”，保留参与者本人作投资决定的含义。
- Sentence 24：`volunteers given oxytocin` 被译成“服用催产素的志愿者”。`given` 并未说明口服，且上下文实验常见为施用/吸入；应译为“接受催产素的志愿者”，避免擅自添加给药方式。
- Sentence 39：`has been co-opted for many different functions` 译为“被征用于许多不同功能”不自然。宜改为“后来被重新利用来承担许多不同功能/被改作许多不同用途”，并与 A 层中的进化生物学解释保持一致。

### 5. Questions 14–17 的分类标签缺逐项中文对应

精读仅写“可选段落标签：A、B、C、D、E、F”，没有逐项给出标签翻译。用户要求所有分类标签及翻译都在题目精讲中出现。应明确补为 `A：第 A 段`、`B：第 B 段`……`F：第 F 段`；不要增加图片。

## 结论

本轮不是零问题：共 5 组问题。正文来源、句数顺序、题目和官方答案均正确；遗留集中在 A 层展开密度、重复词覆盖、CEFR、三处译文和一组标签翻译。修正后需要由本审计者针对以上 5 组逐项复核，才能报告零遗留问题。

## 最终针对性复核

生成者完成修正后，本审计者针对原报告第 1–5 组问题逐项复核：

1. 三个 A 层均已补齐本句义、字面画面或构词/搭配、与普通说法的差别、语气和使用边界、文章作用、至少 2 条双语迁移例句，以及 3 个近义表达的适用差别；仍恰好为 3 个 A 层和 3 条 Cambridge Dictionary 链接。
2. Sentence 8 的 `greatly`、Sentence 16 的 `positive`、Sentence 23 的 `study` 与 `actually` 均已补入对应句，重复 B1+ 覆盖要求已落实。
3. 原报告列出的全部 CEFR 错标均已修正：科研义 `study` 为 B2；`brain`、`receive`、`improve`、`foreign`、`explain`、`perhaps`、`agree`、`probably` 均改用“基础词（A1/A2）”格式；未发现旧等级残留。
4. Sentences 10、24、39 的中文译文均已按报告修正，分别消除了投资施事歧义、擅加口服方式和 `co-opted` 的不自然译法。
5. Questions 14–17 已在精读中完整列出 A–F 六个分类标签及逐项中文对应；JSON 中六项 `label/text/translation` 也完整一致。

回归检查通过：正文仍为 A–F 六段、42 句，精读英文与校准 JSON 逐句逐字符一致；Questions 14–26 共 13 题，题号连续，官方答案仍为 B、F、B、E、A、B、C、animals、childbirth、placebo、game、strangers、names；图片仍为 0。

**最终结论：原报告 5 组问题全部关闭，零遗留问题。**
