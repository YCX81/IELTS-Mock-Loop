# Cambridge IELTS 11 Test 1 Passage 3 盲审报告

审计范围：物理页 23–27、官方答案物理页 123；`passage-3.json`、`source-pages.json`、新生成精读 `Cambridge-IELTS-11-Test-1-Passage-3-双语精读.md`。本次未读取旧精读，未修改被审稿。

人工逐页结论：正文为物理页 23–24，题目为物理页 25–27，答案为物理页 123。正文共有 A–H 八段、35 个完整句子；第 20 句跨页（物理页 23 的 `birches would shed their` 接物理页 24 的 `leaves in winter ...`）。新精读 35 句的数量、顺序及英文与 `passage-3.json` 完全一致。题目覆盖 27–40，官方答案 D/B/A/sunshade/iron/algae/clouds/cables/snow/rivers/B/D/C/A 全部正确。A 层 3 个、Cambridge Dictionary 链接 3 条、图片 0 张，数量均合规。

## Blocker

### B1+ 逐句覆盖未达到硬性要求

下列为逐句复核后确认的漏项；这些词在该句词汇行中没有独立讲解。重复词仍需在本句再次出现，不能依赖前句或总表：

- 句 4：`generally`（B2）、`term`（B1）、`environment`（B1）。
- 句 5：重复出现的 `fossil fuels`（B2）和 `global warming`（B1）未再次讲解。
- 句 7：`aircraft`（B2）。
- 句 8：`sunlight`（B1）、`planet`（B1）。
- 句 10：`weigh`（B1）、`form`（B1）。
- 句 12：重复出现的 `geo-engineering`（C1，气候科学专业词），以及 `project`（B1）、`growth`（B1）。
- 句 14：`reduce`（B1）、`warming`（B1，气候科学表达）。
- 句 21：`increase`（B1）、`climate`（B1，气候科学专业词）。
- 句 25：`geo-engineering` 在同一句出现两次，词汇行一次也未讲；`planet`（B1）也遗漏。
- 句 28：重复出现的 `geo-engineering`（C1，气候科学专业词），以及 `increase`（B1）、`planet`（B1）。
- 句 30：重复出现的 `geo-engineering`（C1，气候科学专业词），以及 `project`（B1）、`study`（B1）。
- 句 31：`risk`（B1）。
- 句 32：`avoid` 在同一句出现两次，目前只列一项；按“每一次重复出现也独立讲解”的硬规则，应分别说明 `To avoid such a scenario` 与 `avoid the need ... altogether`。
- 句 33：重复出现的 `geo-engineering`（C1，气候科学专业词）和 `support`（B2）。

建议：逐句补齐以上项目，并重新做一次逐句 token 对照；不要只向文末总表补词，因为硬规则要求每句独立覆盖。

## Major

### 1. 原书标点没有逐字符保真

物理页清楚使用 en dash（`–`），当前 `source-pages.json`、`passage-3.json` 和精读英文统一改成了 ASCII 连字符或带空格的 ` - `。这三个文件彼此一致，但并非与原书逐字符一致。至少包括：

- 总体指令 `Questions 27–40`；题组标题 `Questions 27–29`、`Questions 30–36`、`Questions 37–40`。
- 范围 `A–H`、`A–D` 及 `boxes 27–29 / 30–36 / 37–40`。
- 句 4：`geo-engineering – a term ...`。
- 句 5：`if Plan A – reducing our dependency on fossil fuels – fails ...`。
- 句 12：`carried out – which include ... algae – have focused ...`。
- 句 33：`politicians to agree – and then bring in – the necessary carbon cuts`。

原书还使用排版引号/撇号（如段 E、F、G、H 的单引号及 `“overshoot”`），当前全部转为直引号。若项目明确允许统一 ASCII 标点，需要在校准规范中写明；否则按本任务“逐字符一致”要求，应以原书为准，同时同步修改 `source-pages.json`、聚合校准数据、精读英文和 pages/raw 来源。

### 2. 三处 CEFR 标级明确错误

- 句 1：`carbon dioxide` 标为 B1；Cambridge Dictionary 标为 B2，应改为 `(B2，环境科学专业词)`。
- 句 10：形容词 `minute`（“极小的”）标为 C1；Cambridge Dictionary 明确标为 C2，应改为 `(C2)`。
- 句 20：`radiation` 标为 B2；Cambridge Dictionary 明确标为 C1，应改为 `(C1，物理学专业词)`。

### 3. A2 词不能伪标为 B1

- 句 7 的 `cloud`（天气义）标为 B1；Cambridge Dictionary 为 A2。应写成 `cloud 基础词（A1/A2）`，不能保留 `(B1)`。
- 句 12 的 `iron` 为基础金属词，当前标 `(B1)`；应按 A1/A2 基础词格式处理，而非 B1 标签。

## Minor

### 1. 第 40 题中文略不自然且对象边界含混

`Research into non-fossil-based fuels cannot be replaced by geo-engineering.` 当前译为“对非化石燃料能源的研究不能由地球工程取代”。“燃料能源”重复且不自然，建议改为“非化石燃料研究不能由地球工程取代”或“对非化石能源的研究不能由地球工程取代”，并在定位逻辑中继续说明题干以 `non-fossil-based fuels` 改写原文 `renewable energy`。

### 2. 第 25–26 句中文引号连续性可改善

英文引语在句 25 末没有闭合，闭合引号位于句 26 末；当前中文在句 25 自行闭合，然后句 26 又重新开引号。逐句展示虽可读，但削弱了对原文连续引语结构的呈现。建议句 25 中文末保留未闭合引号，句 26 接续后再闭合，或在句法说明中明确“引语跨两句延续”。

## 无问题项

- 35 句数量、段落 A–H、顺序、跨页衔接均正确；新精读英文与当前 `passage-3.json` 逐字符一致。
- Q27–40 的总体指令、三组题型指令、题干、表格两列、全部表格行、科学家名单 A–D 均已覆盖。
- 官方答案和题号范围全部正确；填空均保留 `ONE WORD` 限制，无遗漏官方变体。
- 每题证据、定位逻辑和干扰项排除均能支持答案；未发现答案逻辑错误。
- 翻译整体准确，长句主干、修饰和表达作用说明总体可靠；除上述两项 minor 外未发现实质语义误译。
- A 层恰好 3 个，Cambridge Dictionary 链接恰好 3 条，图片 0 张；无整页截图或 PDF 页码图片模块。

## 复核状态

首轮结论：**非零遗留问题**。需修正以上 1 组 blocker、3 组 major、2 组 minor 后，由本盲审者针对性复核。

## 最终针对性复核（2026-07-21）

已按首轮报告逐项复核当前修订稿，结果如下：

- Blocker（逐句 B1+ 与重复项）：句 4、5、7、8、10、12、14、21、25、28、30、31、32、33 所列漏项均已在各自句内补齐；句 20 的两次 `radiation`、句 25 的两次 `geo-engineering`、句 32 的两次 `avoid` 也已分别标明。
- Major 1（原书标点）：总体指令、题组范围、A–H/A–D、正文四处插入破折号均恢复为 en dash；正文排版引号、双引号和撇号已恢复，并在 `source-pages.json`、`passage-3.json`、精读英文中同步。
- Major 2（CEFR）：`carbon dioxide` 已改 B2；形容词 `minute` 已改 C2；`radiation` 已改 C1 且保留物理学领域标注。
- Major 3（A1/A2 格式）：`cloud`、`iron` 均已改为 `基础词（A1/A2）`，未再使用 B1 标签。
- Minor 1（第 40 题中文）：已改为“对非化石能源的研究不能由地球工程取代”，对象清楚、中文自然。
- Minor 2（句 25–26 引号连续性）：句 25 中文不再提前闭合，引语由句 26 接续并闭合；两句结构说明也明确了跨句引语关系。

复核同时确认：精读仍为 35 句，顺序不变，英文与当前 `passage-3.json` 逐字符一致；A 层仍为 3 个，Cambridge Dictionary 链接仍为 3 条，图片仍为 0 张；Q27–40 的题干、表格、人物选项、官方答案、证据、定位和干扰项没有因修订发生回归。

最终结论：**零遗留问题**。
