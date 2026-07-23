# Cambridge IELTS 10 Test 2 Passage 2 交叉盲审

## 结论

**未通过，需修正后针对性复核。** 本轮人工对照原书物理页 37–40 与答案页 146，并检查 `passage-2.json` 和 Passage 2 全新精读。正文、题目和答案总体准确，但仍发现 3 组可操作问题：Q23 双空及答案字段 schema 不统一、重复 B1+ 漏讲、两处明确 CEFR 错标。

## 审核基准

- 正文物理页：37–38
- 题目物理页：39–40
- 官方答案物理页：146
- 正文段落：A–F，共 6 段
- 正文句数：34 句
- 题号范围：14–26，共 13 题
- 官方答案：14 A；15 D；16 F；17 D；18 B；19 D；20 E；21 A；22 C；23 `books` 与 `activities`（顺序可换、两项都答对才得一分）；24 `internal regulation` / `self-regulation`；25 `emotional awareness`；26 `spoon-feeding`

## 可操作问题

### P2-01｜高｜Q23 双空和答案字段 schema 不统一

Q23 的人类可读内容是正确的：精读明确呈现 `IN EITHER ORDER; BOTH REQUIRED / FOR ONE MARK / books (and) / activities`，也说明两个空各填一个词、顺序可换且两项都必须正确。

但 JSON 同一答案存在三套不一致表达：

1. `questionGroups[].questions[23].answer` 是单个字符串 `books; activities`；
2. 同一 question 的 `acceptedAnswers` 是嵌套数组 `[["books","activities"],["activities","books"]]`，而其他题的 `acceptedAnswers` 是字符串数组；
3. 顶层 `answers` 又改用 `acceptableAnswers`，内容为分号拼接的字符串数组；另有一份重复的 `answerKey`。

这会让通用消费者无法稳定判断 `acceptedAnswers` 的元素类型，也容易使三份答案表示以后发生漂移。应选定一套 canonical schema：明确标出 `blankCount: 2`，按空保存答案或保存结构化 `acceptedAnswerSets`，并在全篇统一使用 `acceptedAnswers` 或项目约定的唯一字段名；删除或由脚本派生重复的 `answerKey`。Q24 的两个变体本身保存正确，但也应沿用同一 canonical 字段名。

### P2-02｜中｜多处重复出现的 B1+ 未在本句再次讲解

以下项目在相应英文句中出现，却未进入该句“词汇与短语”栏；其中多项已经在别句被稿件自身标为 B1+，因此不能以“前文讲过”代替本句重复讲解：

- 第 10 句：`There appears to be` / `appear to`；`compared with`（第 3 句已把 `compare with` 标为 B1）
- 第 11 句：`planning`、`choice`
- 第 13 句：`be better able to`
- 第 17 句：`methods`（第 25 句已把 `method` 标为 B1）
- 第 20 句：`Although`、`be followed by`
- 第 24 句：`especially`（第 4 句已标 B1）；`learning to learn`
- 第 28 句：`seemed to`、`effort`
- 第 34 句：`environment`、`improve`

修正后应重新对 34 句逐 token 复扫，验收标准是每一次 B1+ 出现都在本句独立解释并标级。

### P2-03｜中｜两项 CEFR 明确错标

- 第 9 句 `standard` 的“水平/质量标准”义标为 B1；Cambridge Learner's Dictionary 对该义标为 B2，应改为 B2。
- 第 4、22 句 `activity` 的“活动”义标为 B1；Cambridge Learner's Dictionary 对该常见义标为 A2。若保留在词汇栏，应写成 `基础词（A1/A2）`，不能标 `(B1)`。

建议同步抽查同一词跨句是否保持同义同级，避免基础词被抬高来满足 B1+ 数量。

## 已通过项目

- PDF 原页 37–38 的 A–F 段落、跨页 C 段和全部标点顺序已核对；未发现校准正文漏词、错序或擅改原书。
- 精读共 34 句，编号 1–34 连续；34 条英文拼接后与 JSON 六段正文逐字符一致。
- 句 15–16 对 Shore and Kanevsky 引语的拆句保持原书顺序和引号边界；原书异常但真实的逗号与引文标点没有被推测性改写。
- 翻译与句法总体准确；未发现会改变原意的翻译或主从关系错误。
- 总体英文指令和 Questions 14–17、18–22、23–26 的全部英文指令均出现，含 `NB You may use any letter more than once.` 和 `NO MORE THAN TWO WORDS`。
- 人物标签 A–E 完整且对应正确：A Freeman；B Shore and Kanevsky；C Elshout；D Simonton；E Boekaerts。精读同时给出中文音译。
- 14–26 题干与原页一致；全部官方答案、证据、定位逻辑和干扰项方向正确。
- Q23 已在精读中正确说明“双空、顺序可换、两项均需正确才得一分”；Q24 已完整列出 `internal regulation` 与 `self-regulation` 两个官方变体，均符合两词限制。
- 页面角色齐全：`bodyPages: [37,38]`、`questionPages: [39,40]`、`sourcePages: [37,38,39,40]`、`answerKeyPage: 146`；各题组 `sourcePages` 正确。
- A 层深挖恰好 3 个；Cambridge Dictionary 链接恰好 3 条；图片 0 张。

## 修正后复核清单

1. 统一 Q23、Q24 和其他题的答案字段类型与字段名，确保双空组合不会被字符串强制转换破坏。
2. 针对第 10、11、13、17、20、24、28、34 句补齐列出的重复 B1+，再复扫全部 34 句。
3. 修正 `standard` 与 `activity` 的 CEFR。
4. 重新确认 34 句逐字符一致、13 题答案不变、Q23 双空语义和 Q24 变体仍完整。
5. 重新确认 3 个 A 层、3 条 Cambridge 链接、0 张图片。

**当前状态：3 组问题未关闭，尚不能报告零遗留。**

## 修正版针对性复核（2026-07-21）

### 复核结论

原报告的 **3 组问题均已关闭，复核未发现新增遗留问题**。修正版可报告为零遗留。

### 逐项关闭情况

1. **P2-01｜Q23/Q24 答案 schema：已关闭**
   - 题目对象不再混入另一套 question-level `answer` / `acceptedAnswers`。
   - 顶层 `answers` 统一为 13 个按题号组织的答案对象，统一使用 `acceptableAnswers`；已删除重复的顶层 `answerKey`。
   - Q23 的 `acceptableAnswers` 为两个扁平字符串组合，不再是嵌套数组；同时以 `blankCount: 2` 和 `acceptedAnswerSets` 明确表示两个空、两种顺序及每空答案，能够保留“任意顺序、两项均需正确”的官方语义。
   - Q24 的 `acceptableAnswers` 恰为 `internal regulation`、`self-regulation` 两个官方变体；字段类型与其他题一致。
   - Q23、Q24 的 `answerKeyDisplay` 仅承担原答案页展示信息，不构成第二套答案源。

2. **P2-02｜重复 B1+ 覆盖：已关闭**
   - 第 10 句已补 `There appears to be`、`compared with`。
   - 第 11 句已补 `planning`、`choice`。
   - 第 13 句已补 `be better able to`。
   - 第 17 句已补 `method`。
   - 第 20 句已补 `Although`、`be followed by`。
   - 第 24 句已补 `especially`、`learning to learn`。
   - 第 28 句已补 `seem to`、`effort`。
   - 第 34 句已补 `environment`、`improve`。
   - 对 34 句重新逐句复扫，未再发现与原报告同类的明显重复 B1+ 漏项。

3. **P2-03｜CEFR：已关闭**
   - 第 9 句 `standard` 已改为 `(B2)`。
   - 第 4、22 句 `activity` 已统一改为 `基础词（A1/A2）`，格式符合规则。

### 回归核对

- 34 句编号连续；按 A–F 六段重组后，英文与 JSON `bodyParagraphs` **逐字符一致**。
- 3 个 question groups、13 道题，题号 14–26 连续；官方答案未发生变化。
- Q23 仍明确双空、顺序可换且两项均需正确；Q24 两个可接受变体完整。
- A 层深挖 3 个、Cambridge Dictionary 链接 3 条、图片 0 张；JSON 顶层 `images: []`。
- JSON 可正常解析，未发现残留的顶层重复 `answerKey`。

**最终状态：零遗留，针对性复核通过。**