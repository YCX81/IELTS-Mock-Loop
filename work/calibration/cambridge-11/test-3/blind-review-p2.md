# Cambridge IELTS 11 Test 3 Passage 2 独立盲审

## 审查范围与来源

- 审查者未参与 Passage 2 生成，未读取旧精读正文。
- 已逐页人工查看原书渲染：PDF 物理页 67–70（书内印刷页 69–72）及答案物理页 127（书内印刷页 129）。
- 对照 `passage-2.json` 与新生成的 Passage 2 双语精读 Markdown；未修改正文或 JSON。

## 已通过项目

- 原书正文共 38 个完整句子；JSON 与 Markdown 均为 38 句，顺序一致，英文逐字符比较为 0 差异。
- 双栏阅读顺序正确；物理页 67→68 的 Dingle/aphids 跨页句、物理页 68 左→右栏的 pronghorn 跨栏句均正确合并。未发现原文漏句、并句、错标点或字符改写。
- `passage-2.json` 为 `manually_calibrated`，含 7 个逻辑段落、3 个 question sections、13 道题；`sourcePages` 为 67–70，`answerKeyPage` 为 127。
- Questions 14–26 的总体指令、TRUE/FALSE/NOT GIVEN 三标签、Questions 19–22 全部 A–G 句尾、Questions 23–26 完整 summary 与 `ONE WORD ONLY` 限制均与原书一致。
- 官方答案与答案页一致：14 FALSE，15 TRUE，16 NOT GIVEN，17 TRUE，18 FALSE，19 G，20 C，21 A，22 E，23 speed，24 plains，25 bottlenecks，26 corridor/passageway。第 26 题的两个可接受变体已正确结构化，题解也明确答题纸只能填写其中一个词。
- 每题证据、定位和干扰项排除均成立，未发现实质题解错误。
- 结构指标正确：恰好 3 个“A层深挖”、3 条 Cambridge Dictionary 链接、0 张图片；五个二级章节齐全。

## 发现的问题

### P1-01｜严重｜仍有 B1+ 漏讲及同句重复项未逐次讲解

按“每个完整句子中的全部 B1+、每一次重复均独立讲解”复扫，至少存在以下明确漏项：

- 句 1：`however` (B2) 未讲解。
- 句 16：`home area` 在引号内出现两次，词汇栏只列一次；稿件自己将该项标为 B2，第二次必须再次独立列出。
- 句 20：`remain` (B1) 未讲解。
- 句 24：`share ... with ...` (B1) 未讲解。
- 句 26：让步连词 `though` (B1) 未讲解。

修订时应以全部 38 句重新扫描，不能只机械补这五处；尤其要检查同一句中的重复词组。

### P1-02｜严重｜多处 CEFR 与 Cambridge Dictionary 明确级别不符

可直接确认的错级包括：

- 句 1、15：`define` 应为 B2，现均标 B1。
- 句 4：`identify` 在“确定/识别出五项特征”这一义项为 B2，现标 B1。
- 句 14：`coastline` 应为 C2，现标 B1。
- 句 15：`complex` 应为 B2，现标 B1。
- 句 27：`narrow`（宽度小）应为 B1，现标为“基础词（A1/A2）”。

以上说明 CEFR 仍需全量复核，而非只修局部。专业项总体已有领域标签；复核时还应检查 `invariance`、`constriction` 等在本语境中作为迁徙通道技术描述时是否需要补充领域。

### P2-01｜中等｜句 16 中文“自称简单”造成修饰对象歧义

原文 `prefers what he calls a simple, practical definition suited to his beasts` 的 `what he calls` 是“他所称的/他称之为”，修饰 `definition`。现译“他更喜欢一种自称简单、实用且适合这些动物的定义”在中文中容易理解成 Joel Berger “自称简单、实用”，或定义自己“自称”。建议改为“他更倾向于一种他称之为简单、实用且适合这些动物的定义”等明确结构。

## 结论

原文转录、句序、结构化题库、官方答案、题解与版式指标均通过；词汇覆盖/CEFR 和一处翻译尚有遗留。当前共 2 项严重、1 项中等问题。修正后应由本审查者对 P1-01、P1-02、P2-01 做针对性复核，达到零遗留后再关闭本篇。

## 第一次针对性复核（2026-07-21）

- 更正原审计记录：P1-01 中“句 20 的 `remain` 未讲解”是审查者误报。重新对照原书图片、`passage-2.json` 与 Markdown 后确认，句 20 原文为 `Dingle is an evolutionary biologist who studies insects.`，三处均不存在 `remain`。现正式撤回该条，不需要也不得为此改动来源文本。
- P1-01 其余项目已关闭：句 1 已补 `however` (B2)；句 16 两次 `home area` 已分别列为第 1 次和第 2 次；句 24 已补 `share ... with ...` (B1)；句 26 已补 `though` (B1)。复扫未发现这些修订引入新的同句重复项遗漏。
- P1-02 已关闭：句 1、15 的 `define` 均为 B2；句 4 的 `identify` 为 B2；句 14 的 `coastline` 为 C2（地理专业词）；句 15 的 `complex` 为 B2；句 27 的 `narrow` 为 B1。
- P2-01 已关闭：句 16 已译明为“他所称的”，句法说明也明确 `what he calls` 修饰 `definition`，不再产生“自称简单”的歧义。
- 回归复核通过：38 个完整句子的数量、顺序及英文逐字符一致性未变化；Questions 14–26 的指令、选项、答案、证据与干扰项说明未发生回归；仍为恰好 3 个 A 层深挖、3 条 Cambridge Dictionary 链接、0 张图片，五个二级章节齐全。

最终复核结果：原报告中的 2 项严重问题、1 项中等问题均已关闭；撤回 1 条审查误报，当前零遗留问题。
