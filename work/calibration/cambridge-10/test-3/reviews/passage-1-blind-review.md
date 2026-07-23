# Cambridge IELTS 10 Test 3 Passage 1 首轮交叉盲审

## 审查范围与方法

- 审查对象：`work/calibration/cambridge-10/test-3/passage-1.json` 与 `data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-10-Test-3-Passage-1-双语精读.md`。
- 原书人工核对：PDF 物理页 56–59（总体指令、8 个 headings、正文 A–E、题目 1–13）及物理页 148（官方答案）均按原始页面逐页查看。
- 辅助机械核对：把 MD 的 30 个编号英文句按 A–E 聚合后与 JSON 逐字符比较，并计数题号、A 层、Cambridge 链接和图片；脚本结果未替代原书人工核对。
- 首轮结论：**未达零遗留问题**。JSON 的来源转录和题库结构准确；MD 有 3 类实际问题，详见下文。只写报告，未修改 P1 JSON/MD。

## 必须修正的问题

### 1. MD 缺少原书的总体英文答题指令

- 位置：MD 第 343–345 行，“总体答题指令”。
- 当前内容只有中文编辑提示：`本篇共 13 题；只依据原文，不能用常识补足信息。`
- 原书物理页 56 的总体指令为：`You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 on the following pages.`
- 问题：分组题型指令均已保留，但篇章级总体原文指令缺失，不满足“总体答题指令”必须完整覆盖的要求。
- 建议：在该处补入上述英文原句及自然中文翻译；现有策略提示可另行保留，但不能替代原书指令。

### 2. 三句中文翻译遗漏原文的实质信息

1. **句 14，MD 第 161–167 行。** 现译只到“按几乎任何经济指标衡量”，遗漏引文明确列举的 `including value-added capital investment, employment and tax contributions`。建议按校准英文原样补出增值/资本投资、就业和税收贡献等列举，不要用“任何经济指标”概括掉列表。
2. **句 17，MD 第 191–197 行。** 现译“并带来超过 4,220 亿美元的资本投资及税收”省略 `direct, indirect and personal` 三类税及 `each year`，并把 `accounting for` 的并列贡献关系压缩得不清。原书措辞即使显得不寻常，也应忠实保留其项目和时间限定，不得推测性改写原书。
3. **句 28，MD 第 313–319 行。** 现译用“在所列各国”整体替代 Bahamas、Brazil、Canada、France、(the former) West Germany、Hong Kong、Italy、Jamaica、Japan、Singapore、the United Kingdom、the United States 的完整名单。中文译文应保留全部国名；不能因为英文在上一行可见就省略句内信息。

### 3. 多处 B1+ 单词或短语未在本句独立覆盖

强制规则要求每个 B1+ 项均在本句词汇行讲解，重复出现也必须再次讲解。以下缺项均可直接在对应英文句中定位；括号内为建议最低标级，生成者可在保持明显合理的前提下微调：

- 句 1（词汇行第 17 行）：`exist`（B1）；`since the beginning of time`（B2）。
- 句 2（第 35 行）：`for purposes of`（B2）。
- 句 5（第 65 行）：重复出现的 `throughout`（B2）；当前只讲了 `recorded history`，没有覆盖该介词。
- 句 8（第 97 行）：重复出现的 `development`（B1）。
- 句 10（第 117 行）：重复出现的 `government`（B1）；`produce`（B1）；`not only ... but also`（B2）。
- 句 13（第 157 行）：`although`（B1）。
- 句 14（第 167 行）：`including` / `include`（B1）。
- 句 17（第 197 行）：重复出现的 `produce`（B1）和 `per cent`（B1）。
- 句 18（第 207 行）：重复出现的 `both ... and`（B1）。
- 句 19（第 219 行）：`however`（B1）；重复出现的 `major`（B1）；`hide`（B1）。
- 句 20（第 229 行）：`include`（B1）。
- 句 22（第 249 行）：重复出现的 `both ... and`（B1）。
- 句 23（第 267 行）：重复出现的 `in order to`（B1）。
- 句 24（第 277 行）：重复出现的 `however`（B1）；`ideal`（B2）。
- 句 29（第 329 行）：重复出现的 `however`（B1）、`because of`（B1）和 `provide`（B1）；另漏 `affect`（B1）。

以上是按正文逐句扫描得到的明确缺项。修复时应保持“一项一标级一释义”，不要仅在句法段提到，或用相邻复合词替代独立出现的重复词。

## 已验证通过的项目及证据

### 来源、结构与正文英文

- 物理页定位正确：总体指令/headings 页 56；正文页 57–58；题目 5–13 页 59；官方答案页 148。
- JSON 元数据正确：`sourcePages=[56,57,58,59]`、`bodyPages=[57,58]`、`questionPages=[56,59]`、`answerKeyPage=148`、`status=manually_calibrated`、`images=[]`。
- 标题 `The Context, Meaning and Scope of Tourism` 与原书一致；原书没有副标题，JSON `subtitle` 为空正确。
- MD 共 30 个编号英文句，编号 1–30 连续。按 A–E 聚合后，五段均与 JSON 逐字符一致，句数依次为 `5/5/8/6/6`；无漏句、合并、倒序或跨页错接。
- A–E 五个段落标签、英式拼写、引号、金额、百分比、国家名单及标点顺序与物理页 57–58 一致。

### 题目、headings、答案与讲解

- JSON 有 3 个题组、13 道题；MD 题号 1–13 连续完整。
- Questions 1–4 的 A–E 说明、示例 `Paragraph A → viii` 以及 i–viii 共 8 个 headings 的英文、标签、顺序和中文翻译均完整。原书指令印作 `i–vii`，尽管列表另含示例使用的 viii；JSON/MD 忠实保留原书，不能擅自改成 i–viii。
- Questions 5–10 的 TRUE/FALSE/NOT GIVEN 总指令与三项定义完整；六道题干逐字正确。
- Questions 11–13 的 `NO MORE THAN THREE WORDS` 限制、题干及可接受答案完整；Q11 正确保留 `source of income` / `industry` 两种官方答案。
- 物理页 148 官方答案逐项核对为：`1 ii, 2 i, 3 v, 4 vii, 5 TRUE, 6 NOT GIVEN, 7 NOT GIVEN, 8 TRUE, 9 NOT GIVEN, 10 FALSE, 11 source of income / industry, 12 employer, 13 domestic tourism`。JSON 与 MD 全部一致。
- 每题均有英文题干、中文翻译、官方答案、英文证据、定位逻辑和干扰项说明。Q6/Q7/Q9 的 NOT GIVEN 边界、Q10 的 easy/difficult 矛盾及 Q11–13 的定位均正确，未发现答案或推理错误。

### 格式与其他语言质量

- A 层深挖恰好 3 个：`set out`、`in turn`、`amorphous`。
- Cambridge Dictionary 链接恰好 3 条。
- Markdown 图片 0 张，JSON 图片 0 张；无整页截图或无关装饰图片。
- 除“必须修正的问题”外，其他句子的翻译、主干与修饰关系，以及已列词项的 CEFR/专业领域标注未发现明确错误。

## 复核状态

- 当前状态：**待生成者修正后复核**。
- 针对性复核入口：总体英文指令；句 14/17/28 译文；上述 15 个句号位的 B1+ 补项。
- 回归要求：30 句英文与 JSON 仍须逐字符一致；题号 1–13、8 个 headings、官方答案、3 A 层/3 链接/0 图不得发生回归。
- 最终零遗留结论：尚未出具。

## 针对性复核（修复后）

- 复核对象：首轮报告的 3 类问题，以及正文、题库与格式回归。
- 篇章级总体指令已补入原书英文 `You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 on the following pages.`，并配有完整中文翻译；原有策略提示不再替代原题指令。
- 句 14 的译文已补出引文列举的增值资本投资、就业和税收贡献；句 17 已忠实保留 `direct, indirect and personal taxes`、`each year` 及 `accounting for` 的关系；句 28 已补全 Bahamas 至 United States 的全部国家/地区名称。三处均未改动英文原文。
- 首轮列出的 15 个句号位已全部补齐：句 1 `exist`/`since the beginning of time`；句 2 `for purposes of`；句 5 `throughout`；句 8 `development`；句 10 `government`/`produce`/`not only ... but also`；句 13 `although`；句 14 `including`；句 17 `produce`/`per cent`；句 18 `both ... and`；句 19 `however`/`major`/`hide`；句 20 `include`；句 22 `both ... and`；句 23 `in order to`；句 24 `however`/`ideal`；句 29 `however`/`because of`/`affect`/`provide`。各项均在本句词汇行独立标级并释义。
- 回归：30 个编号英文句按 A–E 聚合后与 JSON 逐字符零差异，句数仍为 `5/5/8/6/6`。
- 题号 1–13 连续，JSON 仍为 3 个题组/13 题；i–viii 共 8 个 headings 完整。MD 官方答案与 JSON/物理页 148 一致；Q11 的 `industry` 仍在可接受答案中。
- A 层深挖 3 个、Cambridge Dictionary 链接 3 条、总链接 3 条、Markdown 图片 0 张，JSON `images=[]`。
- 未发现首审缺陷残留或修复引入的来源、答案、翻译、句法、CEFR、结构与格式回归。

**最终结论：通过，零遗留问题。**
