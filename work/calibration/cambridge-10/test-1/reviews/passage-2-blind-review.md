# Cambridge IELTS 10 Test 1 Passage 2 交叉盲审

## 初审结论

**初审未通过。** 本轮人工对照原书物理页 13–16 及官方答案页 144，并检查 `passage-2.json` 与全新精读稿。初审发现 6 组可操作问题，其中原书字符校准与英文题目指令缺失属于阻断项。

## 审核基准

- 正文与题目物理页：13–16（正文主体在 14–15，题目在 13、16）
- 官方答案物理页：144
- 正文段落：A–I，共 9 段
- 精读分句：34 句，编号 1–34 连续
- 题号范围：14–26，共 13 题
- 官方答案：14 viii；15 iii；16 xi；17 i；18 v；19 x；20 ii；21 iv；22 TRUE；23 FALSE；24 NOT GIVEN；25 NOT GIVEN；26 FALSE

## 初审可操作问题

### P2-01｜高｜原书中的 en dash 被改成 ASCII hyphen

逐页原图显示下列位置使用 en dash `–`，初审稿却写成 `-`：

1. 标题：原书 `1990–2010`，初审稿为 `1990-2010`。
2. Paragraph C / 第 12 句：原书 `although – and this could benefit the enlarged EU – it ...`，初审稿使用 ASCII hyphen。
3. Paragraph D / 第 13 句：原书 `a new imperative – sustainable development – offers ...`，初审稿使用 ASCII hyphen。

同类错误也传入第 17 题 evidence。要求从 calibration 源统一修正 page text、body text、title、精读和题目证据。

### P2-02｜高｜结构化校准缺少页面角色和完整总体指令

初审 JSON 有 `sourcePages: [13,14,15,16]` 和 `answerKeyPage: 144`，但缺少正文页/题目页角色字段，也没有独立保存总体英文指令：

`You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 on the following pages.`

要求补充：

- `bodyPages: [14,15]`
- `questionPages: [13,16]`
- 顶层总体 instruction
- 题组 `sourcePages`：14–21 为 `[13]`，22–26 为 `[16]`
- 逐行无损保存两组原书指令

### P2-03｜高｜精读题目精讲遗漏原书英文指令及 Example 原文

初审稿仅有中文概括，未呈现：

- 总体英文指令整句
- Questions 14–21 的三条英文指令
- `Example / Paragraph F / Answer / vii`
- Questions 22–26 的两条英文引导句
- TRUE / FALSE / NOT GIVEN 三条英文定义

此外，初审稿中的题号、段落和罗马数字范围使用 ASCII hyphen。要求逐行恢复原书英文并提供中文翻译。

### P2-04｜中｜“本句全部 B1+”存在重复项漏讲

- 第 8 句：`even though`（B1）
- 第 12 句：`decrease by`（B1）
- 第 26 句：`expected`（B1）
- 第 29 句：`include`（B1）

这些项目必须在各自句内独立解释，不能以前句已讲代替本句讲解。

### P2-05｜中｜CEFR 标注存在低标或规则不清

- `approach` 的“方法/方案”名词义多次标 B1，要求统一复核为 B2。
- `decade` 标 B1，要求复核为 B2。
- `European Union (EU)`、`CO₂` 等专名/符号直接赋予普通词汇式 B1，依据不清；若保留等级，须说明等级针对识别与使用难度，并保留领域标注。

### P2-06｜中｜两处中文翻译需修正

- 第 24 句把 `focusing on road transport solely through pricing` 译为“通过定价手段来约束公路运输”，额外加入“约束”含义。
- 第 28 句“但同时配套措施，以提高……”缺少完整谓语搭配。

## 初审已通过项目

- JSON 九段正文与精读 34 个英文句子的句数、顺序、分句边界和拼接文本一致。
- 题号 14–26 全部出现；matching headings 的 i–xi 标题与中文翻译齐全。
- 13 道题答案与答案页 144 一致；每题均有 evidence、定位和干扰项/判定排除说明。
- A 层深挖 3 个；Cambridge Dictionary 链接 3 条；图片 0 张。

---

## 修正版针对性复核

复核结论：**通过，P2-01 至 P2-06 均已修正，零遗留问题。** 本次只审查修正版，未修改 calibration JSON 或精读正文。

### P2-01｜通过

- 标题已统一为原书 `1990–2010`。
- Paragraph C / 第 12 句已恢复 `although – and this could benefit the enlarged EU – it ...`。
- Paragraph D / 第 13 句已恢复 `a new imperative – sustainable development – offers ...`。
- 第 17 题 evidence 已同步使用 en dash；未检出相关旧写法。

### P2-02｜通过

- JSON 已增加 `bodyPages: [14,15]`、`questionPages: [13,16]`。
- 顶层已逐字符保存总体英文 instruction。
- 两个题组均增加准确的 `sourcePages`：14–21 为 `[13]`，22–26 为 `[16]`。
- 两组原书指令均以逐行 `instructions` 数组无损保存；原有兼容字段不影响来源追溯。

### P2-03｜通过

- 精读题目区已补齐总体英文指令及中文翻译。
- Questions 14–21 的三条英文指令、中文翻译及 `Example / Paragraph F / Answer / vii` 已完整呈现。
- Questions 22–26 的两条引导语、三条标签定义及中文解释已完整呈现。
- 题号、段落和罗马数字范围均已改为 en dash。

### P2-04｜通过

- 第 8 句已补 `even though`（B1）。
- 第 12 句已补 `decrease by`（B1）。
- 第 26 句已补 `expected`（B1）。
- 第 29 句已补 `include`（B1）。
- 四项均在各自句内独立解释。

### P2-05｜通过

- `approach` 的“方法/方案”义已在相关各句统一为 B2。
- `decade` 已改为 B2。
- `European Union (EU)` 与 `CO₂` 已统一为 B2，并明确说明等级针对专名/符号的识别与使用难度，同时保留领域标注。
- 本次定点复核未发现同一项跨句等级漂移。

### P2-06｜通过

- 第 24 句已改为“仅通过定价来处理公路运输问题”，不再把 `focus on` 增译为“约束”。
- 第 28 句已改为“但同时辅以提高其他运输方式效率的措施……”，中文谓语和搭配完整。

### 回归检查

- 精读仍为 34 句，编号 1–34 连续；按顺序拼接后与 JSON 九段正文逐字符一致。
- 题库仍为 2 个 question groups、13 道题，题号 14–26 连续。
- 13 道答案与答案页 144 完全一致，无答案回归。
- 逐题证据、定位及干扰项说明仍完整，未发现修正引入的新错误。
- A 层深挖 3 个；Cambridge Dictionary 链接 3 条；图片 0 张。

**最终状态：零遗留问题，可通过 Passage 2 盲审。**
