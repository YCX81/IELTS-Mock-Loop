# Cambridge IELTS 13 Test 3 Passage 1 独立盲审

## 审计边界

- 审计者未参与本篇生成。
- 仅对照 `source-pages.json` 的物理页 59–62、122，`passage-1.json` 与本轮新生成精读 Markdown；未读取旧精读正文。
- 正文物理页：59–60；题目物理页：61–62；官方答案物理页：122。

## 初审结论

**结论：有 5 项需修正，当前不能判定零遗留问题。**

正文来源与结构方面已通过：6 段、37 个完整句子，顺序正确；`passage-1.json` 的 37 句与校准来源正文归一化后逐字符一致（均为 4,830 字符），新 Markdown 逐句包含这 37 个英文原句且顺序一致。

题目方面已通过：Question 1–13 全覆盖；Q1–8 的表格标题、三列标签、全部行标签及 `ONE WORD ONLY` 指令完整；Q9–13 的 TRUE/FALSE/NOT GIVEN 指令、三种标签、题干、翻译、官方答案、证据、定位和两类错误判断排除完整。答案与物理页 122 一致：1 furniture，2 sugar，3 ropes，4 charcoal，5 bowls，6 hormones，7 cosmetics，8 dynamite，9 FALSE，10 FALSE，11 NOT GIVEN，12 TRUE，13 NOT GIVEN。

扩展模块计数通过：A 层恰好 3 个，Cambridge Dictionary 链接恰好 3 条，图片 0 张。三个 A 层（`be central to`、`be surmounted by`、`diametrically opposed`）均具备语境义、词源/画面、近义辨析、原文作用、两条双语例句、同义/替换表达六项。

## 可操作问题清单

### BR-P1-01｜句 3 的情态翻译和 CEFR 均不准确

- 原文：`Marco Polo apparently saw coconuts ...`
- 当前译文把 `apparently` 译成“显然”，会把“据说/看来、但并不确定”的信息降格为确定事实。
- 当前词级标为 `(B1)`；Cambridge Dictionary 将该义项标为 **B2**。
- 修正要求：译为“据说/看来马可·波罗……见过椰子”一类保留不确定性的中文；词汇项改为 `(B2)`，并使句法/作用说明明确 `apparently` 的证据距离或不确定语气。

### BR-P1-02｜`shell` 的 CEFR 在 4 次出现中均低标

- 位置：句 16、17、18、19。
- 当前四处均标为 `(B1（植物学专业词）)`。
- Cambridge Dictionary 的 “hard outer covering” 义项为 **B2**，正对应本文椰壳语境。
- 修正要求：四处分别改为 B2，且按强制专业词格式写为 `(B2，植物学专业词)`。

### BR-P1-03｜5 个重复出现的 B1+ 项没有在所在句再次独立讲解

强制规则要求每次重复出现也再次讲解。以下词已在本篇其他句中被本稿自身判为 B1/B2，但所在句词汇表遗漏：

- 句 3：`among`（B1）。
- 句 11：`trunk`（B2，植物学专业词）。
- 句 15：`produces` / `produce`（B1）与 `important`（B1）。
- 句 20：`produce`（B1）。
- 句 37：`problems` / `problem`（B1）。

修正要求：在各句词汇表中逐项补齐；不得以其已在别句出现或包含在句法讲解中代替本句独立词汇项。

### BR-P1-04｜专业词 CEFR 标签格式系统性违反强制模板

- 当前 Markdown 中共有 **119** 处形如 `(B2（植物学专业词）)`、`(C1（化学专业词）)` 的嵌套括号格式；`passage-1.json` 的对应 `level` 字段也使用同样格式。
- 强制格式是同一括号内以中文逗号连接，例如 `(B2，植物学专业词)`。
- 修正要求：将本篇 JSON 与 Markdown 的全部专业词/专业表达/专业名词标签统一为 `（CEFR，领域说明）` 的内容结构，即 Markdown 显示为 `(B2，植物学专业词)`；普通词的 `(B1)` 等保持不变。修正后重新计数，旧嵌套格式应为 0 处。

### BR-P1-05｜句 23 译文漏出了 `-based` 的语义关系

- 原文：`his nitroglycerine-based invention: dynamite`
- 当前译文：“他的硝化甘油发明：炸药”，中文不自然，也没有清楚表达“以硝化甘油为基础/基于硝化甘油”。
- 修正要求：改为“他以硝化甘油为基础的发明——炸药”或等义自然表达；保留冒号同位解释关系，并同步检查句法说明与词汇释义的一致性。

## 已核对且无须修改的项目

- 37 个英文原句的数量、分段、顺序与逐字符内容。
- Q1–13 的题号连续性、原书指令、表格标题/列名/行标签、TFNG 标签和题干。
- 13 个官方答案、可接受答案、证据句及定位。
- 每题均有定位逻辑；Q1–8 均排除了与空格语法或语义不符的邻近词；Q9–13 均明确排除另外两种 TFNG 判断。
- A 层数量与六件套完整性；Cambridge 链接数量；图片数量。

## 最终复核区

状态：**已完成针对性最终复核。**

复核时逐项检查：

- [x] BR-P1-01：句 3 `apparently` 已在 JSON 与 Markdown 中改为 B2；译为“据说”，句法说明明确其表示证据距离而非确定断言。
- [x] BR-P1-02：句 16–19 的四次 `shell` 均已改为 `(B2，植物学专业词)`，四处逐一命中。
- [x] BR-P1-03：句 3 `among`、句 11 `trunk`、句 15 `produce`/`important`、句 20 `produce`、句 37 `problem` 均已在所在句独立补讲，JSON 与 Markdown 同步。
- [x] BR-P1-04：JSON 和 Markdown 中旧式 `(CEFR（领域）)` 嵌套专业标签计数均为 0；专业项已统一为 `CEFR，领域` 字段内容和 `(CEFR，领域)` 显示格式。
- [x] BR-P1-05：句 23 已译为“他以硝化甘油为基础的发明——炸药”，句法说明也明确 `nitroglycerine-based` 与冒号同位关系。
- [x] 回归检查：37 个英文原句按原顺序逐字符命中 37/37；题号连续覆盖 1–13；答案序列仍为 `furniture, sugar, ropes, charcoal, bowls, hormones, cosmetics, dynamite, FALSE, FALSE, NOT GIVEN, TRUE, NOT GIVEN`；A 层/链接/图片仍为 3/3/0。

最终复核结论：**BR-P1-01 至 BR-P1-05 全部关闭；遗留问题 0 项，通过最终复核。**
