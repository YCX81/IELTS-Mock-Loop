# Cambridge IELTS 15 Test 1 Passage 2 交叉盲审（首轮）

- 审计者：Passage 1 生成者，未参与 Passage 2 生成。
- 校准来源：`passages.json`、`questions.json`、`test-bank-entry.json`。
- 受审文件：`Cambridge-IELTS-15-Test-1-Passage-2-双语精读.md`。
- 审计边界：本轮只审计，未修改受审稿。

## 结构与原文核对

- 句子数：32/32。
- 句号顺序：1–32 连续，无重复、无缺号。
- 英文原句：32 句均与校准 `sentences[].text` 逐字符一致，顺序一致。
- 题号：14–26 连续完整。
- 硬计数：`A层深挖` 3 次；Cambridge Dictionary HTTPS 链接 3 条；全文图片 0 张。
- 三个深挖的本句义、画面/构词、语气边界、文中作用、两个迁移例句与近义辨析均存在。

## 必须修正的问题

### P2-BR-01｜题目模块缺少官方总体指令和四个原书分组标题

当前第 623 行只用中文概括“第 14–26 题均依据……”，没有完整收录校准来源中的总体指令：

`You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.`

同时，题目模块没有作为独立原书标题显示 `Questions 14–18`、`Questions 19–22`、`Questions 23 and 24`、`Questions 25 and 26`。虽然部分指令已散落在第 14、19、23、25 题中，但这不满足“全部题目指令/所有标题”的覆盖要求。

**修正方式：** 在题目精讲开头增加官方总体指令及自然中译；在第 14、19、23、25 题前分别增加四个原书分组标题，然后保留每组的完整英文指令和中译。

### P2-BR-02｜第 19–22 题的官方摘要未完整收录

当前稿仅在每题下摘录紧邻空格的片段，没有完整呈现标题 `The impact of driverless cars` 下的两段摘要。缺失的上下文包括：

- 第 19 空之后的 `so the introduction of driverless vehicles will result in greater safety. In addition to the direct benefits of automation, it may bring other advantages. For example, ...`
- 第 20 空之后的 `especially in towns and cities, resulting in fewer cars on the road.`
- 第二段开头 `According to the University of Michigan Transportation Research Institute, ...`
- 第 21 空与第 22 空之间的 `However, this would mean that ...`
- 第 22 空之后的 `This would lead to a higher turnover of vehicles, and therefore no reduction in automotive manufacturing.`

摘要的逻辑连接本身就是题目内容；只列局部题干会遗失代词回指、因果关系和表格中的干扰信息。

**修正方式：** 在第 19 题前一次性收录官方摘要标题、两个完整英文段落及完整中译；保留空号 19–22，然后再逐题分析。

### P2-BR-03｜多个句单元漏掉明确的 B1+ 重复词/短语独立标注

下列项目均出现在英文原句中，但本句词汇清单没有以独立词条给出 CEFR：

1. 句 6：`Vehicles` (B1) 重复出现，但本句只解释 `limited`、`self-driving`、`capability` 等，没有再次标注 `vehicle`。
2. 句 7：表示时间起点的 `since` (B1) 未独立标注。这里不能被句法段中提到 `since` 代替，因为强制规则要求每个 B1+ 项具有独立 CEFR 标注。
3. 句 13：`such as` (B1) 和 `may be able to` (B1) 未独立标注；前者在句 27 已讲，但重复出现必须每次再讲。
4. 句 18：`vehicles` (B1) 在 `fewer than 30 percent of the vehicles currently used` 与 `would be required` 的主语中出现，本句没有独立 `vehicle` 条目。
5. 句 25：`vehicle` (B1) 在 `a single vehicle`、`a range of vehicles` 及代词 `one` 的指代对象中构成关键对比，却未标注。
6. 句 26：`vehicles` (B1) 重复出现，本句词汇清单未标注。
7. 句 27：`vehicles` (B1) 再次出现，清单只标了 `specialised`，未将 `specialised vehicles` 或 `vehicle` 作为完整重复项标注。
8. 句 29：`no longer` (B1) 与 `be required` (B1) 未独立标注。此外，句首一般性的 `the vehicle` (B1) 只被后面的专业词条 `vehicle operation` / `automated vehicle` 间接覆盖，按“每次重复”规则仍应明确标注。

**修正方式：** 在上述每个句单元的词汇清单中补入独立条目、本句义和正确 CEFR，不能只在句法段中顺带提到。

### P2-BR-04｜句 24 的 `prompt` 词义分级明显偏低

受审稿将 `prompt` 在“促使/引发”义下标为 (B2)。Cambridge Dictionary 对 `prompt someone to do something` 的 CAUSE 义项标为 C2：`https://dictionary.cambridge.org/dictionary/english/prompt-to`。本句 `Automation may prompt other changes ...` 正是该“引发”义，不是 B2 的“提示某人记起”义。

**修正方式：** 将句 24 的 `prompt` 改标为 `(C2)`，保留“促使、引发”的语境释义。

## 本轮未发现问题的项目

- 32 句的中文翻译总体自然、忠实，未发现改变原意的硬错。
- 32 句的主干、修饰关系与表达作用总体准确，未发现会误导读者的句法硬错。
- 第 14–18 题的答案 C/B/E/G/D 及定位证据正确。
- 第 19–22 题的答案 `human error`、`car-sharing`/`car sharing`、`ownership`、`mileage` 与字数限制正确。
- 第 23–24 题的选项 A–E、翻译、答案对 C/D（顺序任意）及干扰项排除正确。
- 第 25–26 题的选项 A–E、翻译、答案对 A/E（顺序任意）及干扰项排除正确。

## 首轮结论

发现 4 类可执行问题：题目总指令/分组标题缺失 1 类，摘要题上下文缺失 1 类，B1+ 独立覆盖缺口 8 个句单元，明显 CEFR 分级错误 1 处。因此本轮结论为“不通过，需修正后针对性复审”。

## 针对性复核

复核方式：作为首轮原审计者，对 P2-BR-01 至 P2-BR-04 逐项重检，并重新运行句界、题号和硬计数回归检查。本轮未修改 Passage 2 正文。

### 原问题复核结果

1. **P2-BR-01 已修复：** 官方总体英文指令已完整出现；`Questions 14–18`、`Questions 19–22`、`Questions 23 and 24`、`Questions 25 and 26` 四个原书分组标题及对应指令均已补全。
2. **P2-BR-02 已修复：** `The impact of driverless cars` 标题、包含 19–22 四个空的两段官方摘要及完整中译已补全；两段英文均与 `questions.json` 中的 `summary` 逐字符一致。
3. **P2-BR-03 已修复：** 句 6 `vehicle`、句 7 `since`、句 13 `such as` / `may be able to`、句 18 `vehicle`、句 25 `vehicle`、句 26 `vehicle`、句 27 `vehicle`、句 29 `vehicle` / `no longer` / `be required` 均已在各自句单元中以独立词条补上本句义和 CEFR。
4. **P2-BR-04 已修复：** 句 24 中“促使/引发”义的 `prompt` 已从 (B2) 改为 (C2)。

### 回归检查

- 32/32 句，句号 1–32 连续；英文与校准 `sentences[].text` 逐字符零差异。
- 题号 14–26 连续完整。
- `A层深挖` 仍为 3 次；Cambridge Dictionary HTTPS 链接仍为 3 条；全文其他 HTTPS 链接 0 条。
- 图片仍为 0 张。

### 遗留问题 P2-FU-01｜总指令中译行误留字面量 `+`

总体指令下方当前显示为：

`+中文：你应当用大约 20 分钟完成第 14–26 题，这些题目以以下 Reading Passage 2 为依据。`

行首 `+` 是补丁遗留符，会作为字面文本出现在成品中，不属于正文。

**修正方式：** 仅删除该行最前方的一个 `+`，保留余下中译不变。

### 针对性复核结论

首轮 4 类问题已全部解决，且未破坏原句、题号、深挖、链接和图片计数。但本轮发现 1 处修复遗留的行首补丁符号，因此当前结论为“仅剩 1 处字面量格式问题，删除后可判定零遗留”。

## 最终零遗留复核

复核方式：作为首轮及针对性复核的原审计者，只审查 Passage 2 正文，不修改正文；针对 `P2-FU-01`、首轮 `P2-BR-01` 至 `P2-BR-04` 及全部硬计数重新检查。

- **P2-FU-01 已修复：** 总体指令中译现以 `中文：` 正常开头，行首字面量 `+` 已消失；全文不存在其他行首补丁符号。
- **首轮四类问题无回归：** 官方总体指令与四个分组标题完整；19–22 两段官方摘要均与 `questions.json` 逐字符一致；首轮列出的所有 B1+ 独立词条仍位于各自句单元；句 24 的 `prompt` 仍标为 `(C2)`，不存在旧的 `(B2)` 标注。
- **正文回归：** 32/32 句，编号 1–32 连续，英文与校准来源逐字符零差异。
- **题目回归：** 题号 14–26 连续完整。
- **硬计数回归：** A层深挖 3 个；Cambridge Dictionary HTTPS 链接 3 条，全文 HTTPS 链接总数亦为 3；图片 0 张。
- **格式回归：** 无行尾空白，无行首 `+`。

### 最终结论

P2 首轮问题、针对性复核遗留问题均已修复，最终复核为 **零遗留问题，通过**。
