# Cambridge IELTS 15 Test 1 Passage 3 交叉盲审（首轮）

- 审计者：Passage 2 生成者，未参与 Passage 3 生成。
- 校准来源：`passages.json`、`questions.json`、`test-bank-entry.json`。
- 受审文件：`Cambridge-IELTS-15-Test-1-Passage-3-双语精读.md`。
- 审计边界：本轮只审计，未修改受审稿。

## 结构与原文核对

- 句子数：37/37。
- 句号顺序：1–37 连续，无重复、无缺号。
- 英文原句：37 句均与校准 `sentences[].text` 逐字符一致，顺序一致。
- 题号：27–40 连续完整。
- 硬计数：`A层深挖` 3 次；Cambridge Dictionary HTTPS 链接 3 条；全文图片 0 张。
- 三个深挖均包含本句义、表达画面或构词、语气边界、文中作用、两个迁移例句和近义辨析。

## 必须修正的问题

### P3-BR-01｜句 30 中文译文出现“共同独居”的语义冲突

原句：

`I’ve lived for months alone with isolated groups of people all around the world, even two ‘uncontacted tribes’.`

当前译文为“我曾在世界各地与世隔绝的人群共同独居数月，其中甚至包括两个‘未接触部落’”。“共同独居”在中文里自相矛盾，也没有准确表现 `alone with`：作者是独自一人与这些群体共同生活，并不是与群体一起“独居”。

**修正方式：** 改为自然且不增义的表达，例如“我曾独自一人与世界各地与世隔绝的群体共同生活数月，其中甚至包括两个‘未接触部落’。”

### P3-BR-02｜句 21 对关系从句结构的说明不准确

原稿称“中间两个由 `who` 连接的说明交代经历与时代”。原句实际只有一个显式关系代词 `who`；它同时支配并列谓语 `crossed ...` 与 `belongs ...`。`and belongs` 不是第二个由 `who` 引出的从句。

**修正方式：** 明确说明“`who` 引导非限制性定语从句，其中 `crossed` 与 `belongs` 是由 `and` 并列、共用主语 `who` 的两个谓语”，再保留虚拟条件句分析。

### P3-BR-03｜20 个句单元仍有明确的 B1+ 项未独立标级

以下词或短语出现在相应英文原句中，但词汇清单未按“每次重复也重新讲解”的要求给出独立 CEFR 条目。句法段中顺带提到、或由另一个较长词条间接包含，均不能替代独立标级：

1. 句 2：`human` (B1)。
2. 句 4：`just as` (B1)。
3. 句 5：`explorer` (B1)、`caveman` (B2)、`perhaps` (B1)。其中前两项均为本篇重复出现。
4. 句 6：`however` (B1)、`whether ... or ...` (B1)。
5. 句 7：`novel` (B1)、`character` (B1)。
6. 句 9：`author` (B1)。
7. 句 10：`explorer` (B1)，原句出现两次，但本句未列该词。
8. 句 11：`see oneself as` (B2)、`figure` (B1)、`certain` (B1)。
9. 句 12：`exploration` (B2)，此前已经出现，本句仍须重新讲解。
10. 句 13：`explorer` (B1)。
11. 句 14：`exploration` (B2)、`discovery` (B1)、`somehow` (B2)、`planet` (B1)、`include` (B1)。
12. 句 17：`explorer` (B1)。
13. 句 18：`explorer` (B1)、`human` (B1)。`explorer` 在本句出现两次。
14. 句 19：`exploration` (B2)。
15. 句 20：`simply` (B1)、`explorer` (B1)。`simply` 后来在句 26 被标注，但本句也必须独立解释。
16. 句 22：`exploration` (B2)。
17. 句 24：`exploration` (B2)、`scientist` (B1)。
18. 句 26：`discover` (B1)。
19. 句 35：`exploration` (B2)、`habit` (B1)。
20. 句 37：`interest` (B1)，本句的动词形式 `interests me` 应重新标注，不能只依赖句 28 的 `be interested in`。

**修正方式：** 在每个对应句单元中逐项补入独立词条、CEFR 和本句义；不要合并到其他句，也不要只在句法说明中提及。

### P3-BR-04｜句 9 的 `surely` 分级明显偏低

原稿把表示确信的 `surely` 标为 `(B1)`。Cambridge Dictionary 将该义项标为 B2；本句 `This is surely an act of exploration` 正是“确定或近乎确定”的用法。

**修正方式：** 将句 9 的 `surely` 改为 `(B2)`，保留“当然、无疑”的语境释义。官方词条：`https://dictionary.cambridge.org/dictionary/english/surely`。

## 题目模块核对结果

- 官方总体指令完整，且有准确中译。
- 三个原书题组标题 `Questions 27–32`、`Questions 33–37`、`Questions 38–40` 均存在；所有组题指令完整。
- 第 27–32 题的 A–D 选项、翻译、答案 A/C/C/D/A/B、证据、定位及干扰项均正确完整。
- `List of Explorers` 的 A–E 五个人物标签、姓名与中译完整；第 33–37 题答案 E/A/D/E/B、证据、定位及干扰项均正确。
- 第 38–40 题完整摘要、标题和 `NO MORE THAN TWO WORDS` 字数限制存在；答案及可接受变体分别为 `expeditions / unique expeditions`、`uncontacted / isolated`、`surface / land surface`，均与校准题库一致。
- 未发现漏题、漏选项、漏人物标签、答案错误、证据错配或字数限制错误。

## 首轮结论

结构、原文和全部题目模块通过；正文语言层面发现 4 类可执行问题：1 处不自然且有语义冲突的翻译、1 处句法表述错误、20 个句单元的 B1+ 独立覆盖缺口、1 处明确 CEFR 分级错误。因此本轮结论为“不通过，需修正后由本审计者针对性复审”。
## 修正后针对性复核

- 复核者：首轮同一审计者。
- 复核边界：只核对首轮四类问题及结构回归，不修改正文。

逐项结果：

1. **P3-BR-01 已修复。** 句 30 现译为“我曾独自一人与世界各地与世隔绝的群体共同生活数月……”，已消除“共同独居”的语义冲突，并准确表达 `alone with`。
2. **P3-BR-02 已修复。** 句 21 已明确说明 `who` 引导一个非限制性定语从句，`crossed` 与 `belongs` 由 `and` 并列并共用主语 `who`；虚拟条件句分析保持正确。
3. **P3-BR-03 已全部修复。** 首轮报告列出的 20 个句单元及全部目标项均已逐句独立补入：句 2、4、5、6、7、9、10、11、12、13、14、17、18、19、20、22、24、26、35、37 均通过针对性词条断言，无缺项。
4. **P3-BR-04 已修复。** 句 9 的 `surely` 已由 `(B1)` 改为 `(B2)`，本句义仍为“当然、无疑”。

回归检查：

- 37 个 `### 句 N` 连续完整，英文仍与校准 `P3-S1`–`P3-S37` 逐字符一致。
- 第 27–40 题连续完整；总体指令、三组指令、全部选项与人物标签、答案及变体、证据、定位、干扰项和字数限制均保持完整。
- `A层深挖` 3 次；Cambridge Dictionary HTTPS 链接 3 条；全文图片 0 张。
- 针对性自动断言与人工复核均为零错误。

### 最终复核结论

首轮报告所列问题已全部修正，未发现新增回归问题。**零遗留问题，通过。**
