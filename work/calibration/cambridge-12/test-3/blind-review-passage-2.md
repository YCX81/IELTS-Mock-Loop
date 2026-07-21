# Cambridge IELTS 12 Test 3 Passage 2 独立盲审

## 审计范围与结论

- 审计对象：`work/calibration/cambridge-12/test-3/passage-2.json` 与 `Cambridge-IELTS-12-Test-3-Passage-2-双语精读.md`。
- 人工对照：正文物理页 63–64、题目物理页 65、Reading 官方答案物理页 121；四页均按原始分辨率渲染后逐页查看。
- 本审计者未参与 Passage 2 生成；本轮只读核查，没有修改 JSON 或精读正文。
- 初审结论：英文正文、题库结构、题目和官方答案正确，但存在大批 B1+ 漏讲、8 类明显 CEFR 错标、2 处句法说明错误、1 处翻译漏译，以及一组题型指令未完整翻译；修正前不能判定通过。

## 已核对且正确的项目

- A–H 八段共 29 个英文句子；Markdown 句 1–29 与 `section.sentences` 逐字符、按顺序一致，段落归属正确，并与物理页 63–64 的原书正文一致。
- 题号完整覆盖 14–26，共 13 题；Questions 14–19 的答案依次为 `D / C / F / G / D / B`，Questions 20–26 的答案依次为 `vaccinations / antibiotics / mosquito(e)s / factories / forests / Polio / mountain`，与物理页 121 一致。
- 第 22 题同时保留官方写法 `mosquito(e)s` 以及 `mosquitoes`、`mosquitos` 两种可接受拼写；原文自身的拼写 `mosquitos` 未被推测性改写。
- 两组英文题型指令、总体英文指令、全部题干、答案、证据、定位和实际干扰项均存在；Questions 20–26 每题均说明 `ONE WORD ONLY`。
- 现有 171 条词汇项均有真实的中文语境释义，没有 `undefined` 或空占位释义。
- 数量契约保持：29 句、13 题、3 个 A 层、3 条 Cambridge Dictionary 链接、0 图片。

## 必须修正的问题

### 1. B1+ 词汇没有覆盖每一次出现

现稿远未满足“本句所有 B1+，且重复出现也逐次独立讲解”。以下是逐句复核中确认的明确漏项；同一句中标明 `×2` 的词，必须按两次出现分别讲解，不能用一个合并条目替代：

- 句 1：`disease`、`human`、`certain`、`health issue`。
- 句 6：`region`。
- 句 9：`cause`、`lung problem`。
- 句 11：`in recent years`、`fresh air`。
- 句 13：`area of study`、`disease ×2`、`continue`。
- 句 14：`health geography`、`knowledge`、`method`、`on the one hand`、`on the other`、`study`、`disease`。
- 句 15：`science`、`health problem`。
- 句 16：`study`、`geography`、`certain`，以及第二次出现的 `illness`；当前一个 `illness` 条目不能覆盖 `illness` 与 `illnesses` 两处。
- 句 17：`get sick`、`disease`、`certain`。
- 句 18：`geography ×2`、`disease ×2`、`ill health`、`certain`。
- 句 19：`health geographer`、`study`、`disease`，以及第二次出现的 `population`。
- 句 20：`health geographer`、`field`、`disease`、`population`。
- 句 21：`researcher`、`study`、`human`、`illness ×2`、`asthma`、`high level of`、`disease`。
- 句 22：`health geographer`、`spread ×2`、`illness ×2`、`disease`、`reason`、`population`。
- 句 23：`health geography`，以及 `geography` 的第二次出现。
- 句 26：完整术语 `geography of healthcare provision`、`for instance`，以及第二处语境中的 `healthcare`（`levels of healthcare`）。
- 句 27：完整搭配 `local government body`；现条目仅解释 `government body`，漏掉 `local` 所构成的具体机构类别。
- 句 28：`field ×2`、`health geography`、`geography`。
- 句 29：`geography`、`affect`。

上述清单是明确可定位的漏项，不应以维持“171 条”这一旧计数为目标；补齐后词汇条目数理应增加。

### 2. 多项明显 CEFR 错标

按 Cambridge Dictionary 对当前语义的等级核对，以下标注需要同步修正；A1/A2 项必须使用规定格式 `基础词（A1/A2）` 或 `基础表达（A1/A2）`：

- 句 1、16 的 `affect`：当前 B1，应为 B2。
- 句 14、18 的 `analyse`：当前 B1，应为 B2。
- 句 19 的 `factor`：当前 B1，应为 B2。
- 句 22 的 `identify`：当前 B1，应为 B2。
- 句 25 的 `available`：当前 B1；本义为 A2，应标 `基础词（A1/A2）`。
- 句 26 的 `mountain`：当前 B1；本义为 A2，应标 `基础词（A1/A2）`。
- 句 26 的 `hospital`：当前 B1；本义为 A1，应标 `基础词（A1/A2）`。
- 句 17 的 `understand`：当前 B1；`understand why/how` 本义为 A2，应标 `基础词（A1/A2）`。
- 句 27 的 `researcher`：当前 B1，应为 B2。

这里共有 9 个具体条目、8 类词形；修正时仍需保留每次出现分别讲解的原则。

### 3. 句 6 的句法说明虚构了第二个 `in which`

原句只有一处 `in which`：`a warm and damp environment in which ...`。当前句法说明写“两个 in which 分别说明环境与蚊子生长条件”，与原句结构不符。应改为：`which are usually tropical regions` 修饰 `areas`，唯一的 `in which` 修饰 `environment`，其中 `that can give people this disease` 再修饰 `mosquitos`。

### 4. 句 21 的翻译漏掉完整括号例子

英文的 `(such as asthma in places with high levels of pollution)` 在中文里完全消失。应补出类似“例如污染水平很高的地方会出现哮喘”，不能仅译成笼统的“可能导致疾病”。

### 5. 句 21 的句法说明混入英文单词造成病句

当前写作“`study 与 work 并列，from 原因研究推进到分类方法`”，其中 `from` 是误植，整句不通。应改为自然中文，如“从成因研究推进到分类方法”。

### 6. Questions 14–19 的题型指令未完整翻译

现稿保留了英文完整指令，但中文只解释了 `NB You may use any letter more than once`，没有翻译前面的核心要求：文章有 A–H 八段、判断下列信息出现在哪一段、把正确字母写入答题纸 14–19。强制规则要求每组题型指令完整覆盖，需补上整段中文翻译；现有 A–H 选项说明可保留。

## 待复核清单

生成者修正后，由同一审计者针对性复核：

1. 上述各句漏掉的 B1+ 是否全部补齐，特别是同句 `×2` 项是否按每次出现独立讲解。
2. 9 个具体 CEFR 条目是否按正确等级修正，A1/A2 是否使用规定格式。
3. 句 6 的句法是否只保留一个 `in which`，并正确说明三个修饰层级。
4. 句 21 括号例子是否完整译出，句法说明中的 `from` 是否修成中文。
5. Questions 14–19 的整段题型指令是否有完整中文翻译。
6. 修正后英文 29 句逐字符不变，13 题、官方答案、`mosquito(e)s` 变体、3 A 层、3 链接、0 图片均保持。

## 针对性复核

初次复核发现 17 个新增词汇项被误放在下一段标题之后、下一句之前，导致其脱离所属句；已退回生成者修正。生成者随后把句 11、17、20、22 的新增项全部移回对应句块。再次复核结果如下：

- 初审列出的 B1+ 漏项全部补齐；同句重复的 disease、illness、population、geography、spread、field 均按每次出现独立讲解。正文词汇条目由 171 增至 242。
- 9 个具体 CEFR 条目均按要求修正；available、mountain、hospital、understand 使用“基础词（A1/A2）”格式。
- 句 6 三层修饰说明正确；句 21 括号例子已完整译出，句法误植已清除。
- Questions 14–19 的完整中文题型指令已同步到 JSON 与 Markdown。
- 段落边界复核通过：A–H 标题后均直接进入对应首句，不再夹入上一句词汇。
- 最终保持 29 句逐字符一致、13 题、答案序列及 mosquito(e)s / mosquitoes / mosquitos 变体、3 个 A 层、3 条 Cambridge Dictionary 链接、0 图片；git diff --check 通过。

**最终结论：零遗留问题，Passage 2 盲审通过。**

## 生成者修正记录（2026-07-21）

已按初审逐项修正并提交原审计者复核：

- 按报告逐句补齐全部明确漏项，同句标为 ×2 的 disease、illness、population、geography、spread、field 均按每次出现分别新增条目；词汇条目由 171 增至 242。
- affect（句1、16及句29新增重复项）、analyse（句14、18）、factor、identify、researcher 已改为目标 B2；available、mountain、hospital、understand 已按规定改为 `基础词（A1/A2）`。
- 句6句法已改为 `which are usually tropical regions`、唯一 `in which` 与内部 `that ...` 三层修饰，不再虚构第二个 `in which`。
- 句21译文已补出“污染水平很高的地方会出现哮喘”，句法说明中的误植 `from` 已删除。
- Questions 14–19 的完整中文题型指令已写入 Markdown，并同步到 JSON `questionSections[0].instructionTranslation` 及第14–19题。
- 自检保持：29句英文与 `section.sentences` 逐字符一致；13题与答案序列不变；Q22仍含 `mosquito(e)s / mosquitoes / mosquitos`；3个A层、3条Cambridge链接、0图片、0 undefined；`git diff --check` 通过。

原审计者收到稳定稿后填写下方针对性复核结论。
