# Cambridge IELTS 11 Test 4 Passage 1｜独立盲审报告

## 审查范围与来源

- 审查者未参与 Passage 1 生成，未读取任何旧精读正文。
- 已逐页人工查看原书原始分辨率渲染：正文物理页 85–86、题目物理页 87–88、官方答案物理页 129。
- 对照 `work/calibration/cambridge-11/test-4/passage-1.json` 与新生成的 Passage 1 双语精读 Markdown；本轮未修改正文或 JSON。

## 已通过项目

- 原书正文共 39 个完整句子；JSON 与 Markdown 均为 39 句，顺序一致，英文逐字符比较为 0 差异。
- 双栏顺序正确。物理页 85→86 的 `not the only elemental forces at work` 跨页句正确合并；物理页 86 左→右栏的 `guide embryonic cells as they become ...` 跨栏句也正确合并。
- 标题、`nature and nurture` 的曲引号、各组 Danielle Reed 跨句引文、所有曲撇号和 en dash 均与原书一致；未发现漏句、并句或标点改写。
- `passage-1.json` 为 `manually_calibrated`，含 12 个逻辑段落、3 个 question sections、13 道题；`sourcePages` 为 85–88，`passagePages` 为 85–86，`questionPages` 为 87–88，`answerKeyPage` 为 129。
- Questions 1–4 的总体指令、TRUE/FALSE/NOT GIVEN 三标签和四道题干完整；Questions 5–9 的四条指令、`NB You may use any letter more than once.`、研究者 A Francis Galton / B Thomas Bouchard / C Danielle Reed 和五道陈述完整；Questions 10–13 的两条指令、摘要标题、完整摘要及 A–F 六个选项完整。
- 官方答案与物理页 129 逐项一致：1 FALSE，2 NOT GIVEN，3 NOT GIVEN，4 TRUE，5 A，6 C，7 B，8 A，9 A，10 D，11 B，12 E，13 F。题库使用 `distractorBasis` 保存逐题干扰项依据；Markdown 也逐题解释定位和排除逻辑。
- Q9 已按要求特殊核实：答案页原印清楚为 `A`，而正文第 8–10 句的 `Thomas Bouchard’s lab` 和 `Minnesota Study of Twins Reared Apart` 在语义上指向 B。JSON 与精读均忠实保留官方 `A`，明确记录冲突，没有推测性改写答案，也没有擅自把 B 加为可接受变体。
- 题目答案、证据、定位和干扰项分析整体成立；除上述原书自身的 Q9 冲突外，未发现新题解错误。
- 五个顶级功能章节精确齐全；恰好 3 个 A 层深挖、3 条 Cambridge Dictionary 链接、0 张图片。三个深挖均至少有 2 个中英双语迁移例句及 3 个近义表达边界。

## 发现的问题

### P1-01｜严重｜仍有明确的 B1+ 漏讲和同句重复项遗漏

按“每个完整句子中的全部 B1+，每次重复均须独立讲解”逐句回扫，存在以下可复现遗漏：

- 句 6：`identical twins` 在两个并列研究路径中出现两次，词汇栏只列一次；稿件自身将该项标为 B2，第二次必须独立讲解。
- 句 15：转折副词 `however` (B2) 未进入词汇栏。
- 句 19：`DNA` 在 `our DNA` 与 `a segment of DNA` 中出现两次，词汇栏只列一次；稿件自身将其标为 B2，第二次必须独立讲解。
- 句 22：对比连词 `while` (B1) 未讲解；举例表达 `such as` (B1) 也未讲解。

修订时应再次全量回扫 39 句，特别检查同句重复的专业词和连接表达，不能只机械补四处。

### P1-02｜严重｜多处 CEFR 与明确义项不符

以下错级可以直接确认：

- 句 1、6、7、18 的 `influence` 均应为 B2，当前均标 B1；句 14 的 `genetic influence` 已正确标为 B2，前后应统一。
- 句 2 的 `single` 在“一个、单一的”义项应归入 A1/A2 基础词，当前标 B1。
- 句 3 的 `such as` 应为 B1，当前标成“基础表达（A1/A2）”；句 22 同一表达则完全漏列。
- 句 11 的 `identify` 应为 B2，当前标 B1。
- 句 15 的 `lately` 应为 B2，当前标 B1。
- 句 16 的 `according to` 应为 B1，当前标成“基础表达（A1/A2）”。
- 句 18 的 `reaction` 应为 B2，当前标 B1；句 17 的 `chemical reaction` 已正确标为 B2。
- 句 32 的 `allow someone to do` 应为 B1，当前标成“基础表达（A1/A2）”。

这些问题同时涉及 A1/A2、B1、B2 的成组错位。修订后需对 39 句完整复扫，并继续保持专业词同时具有领域与 CEFR 标签。

### P2-01｜中等｜句 2 中文加入原文未明说的“胚胎”

原文是 `a single fertilized egg that splits into two`，只说一个受精卵分裂成两部分。现译“来自一个分裂成两个胚胎的受精卵”补入了 `embryos`，虽然符合常识，却不属于逐字符校准来源，且本任务明确禁止推测性增写。建议改为“来自一个一分为二的受精卵”等忠实表达。

### P2-02｜中等｜句 16 的 `shape who we are` 中文不自然

现译“塑造我们之所以成为现在的自己”把 `who we are` 处理成“之所以”的原因结构，中文搭配不通顺。原意是塑造人的身份、特征或今天的样子，可改为“塑造我们成为怎样的人”或“塑造今天的我们”。句法说明中的“塑造我们之所以成为现在的自己”也应同步修正。

## 结论

原文转录、39 句顺序、跨页/跨栏、题库结构、全部题目选项、官方答案、Q9 冲突记录、题解与版式指标均通过。当前仍有 2 项严重问题和 2 项中等问题，集中在 B1+ 重复覆盖、CEFR 和两处翻译表达。修正后应由本审查者针对 P1-01、P1-02、P2-01、P2-02 做针对性复核，达到零遗留后再关闭本篇。

## 第一次针对性复核（2026-07-21）

### P1-01 复核

- 句 6 的两次 `identical twin` 已按第 1 次和第 2 次分别标为 B2（遗传学专业词）。
- 句 15 已补 `however` (B2)。
- 句 19 的两次 `DNA` 已按第 1 次和第 2 次分别标为 B2（遗传学专业词）。
- 句 22 已补表示对比的 `while` (B1) 和本次出现的 `such as` (B1)。
- 对 39 句再次回扫同句重复专业词和连接表达，未发现上述问题的同类残留。

P1-01 已关闭。

### P1-02 复核

- 句 1、6、7、18 的 `influence` 均已统一为 B2；句 14 的 `genetic influence` 继续保持 B2。
- 句 2 的 `single` 已改为“基础词（A1/A2）”。
- 句 3、22 的 `such as` 均为 B1。
- 句 11 的 `identify`、句 15 的 `lately`、句 18 的 `reaction` 均已改为 B2。
- 句 16 的 `according to`、句 32 的 `allow someone to do` 均已改为 B1。
- 按原报告完整 CEFR 清单及全部 39 句复扫，未发现明显的 A1/A2、B1、B2 成组错位遗留；专业词的领域与 CEFR 双标签保持完整。

P1-02 已关闭。

### P2-01 与 P2-02 复核

- P2-01：句 2 已删除无来源的“胚胎”，改为“来自一个一分为二的受精卵”，忠实对应 `a single fertilized egg that splits into two`。
- P2-02：句 16 的 `shape who we are` 已改译为“塑造我们成为怎样的人”，词汇释义同步修正，中文自然且语义准确。

P2-01、P2-02 均已关闭。

### 回归结果

- JSON 与 Markdown 仍各为 39 个完整句子，顺序不变，英文逐字符差异为 0；原有跨页、跨栏、曲引号、曲撇号和 en dash 未发生回归。
- 题库仍为 3 个 question sections、13 道题，连续覆盖 1–13；全部指令、研究者 A–C、摘要 A–F、证据、定位和干扰项说明完整。
- Q9 仍严格保留答案页原印 `A`；JSON 和精读继续明确记录正文语义指向 B 的冲突，没有推测性改写，也没有增加答案变体。
- 五个固定 H2、3 个 A 层深挖、3 条 Cambridge Dictionary 链接、0 张图片均保持不变。
- 目标文件 `git diff --check` 通过。

最终复核结果：P1-01、P1-02、P2-01、P2-02 全部关闭，当前零遗留问题。
