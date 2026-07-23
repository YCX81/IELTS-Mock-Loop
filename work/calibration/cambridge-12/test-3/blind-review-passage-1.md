# Cambridge IELTS 12 Test 3 Passage 1 独立盲审

## 审计范围与结论

- 审计对象：`work/calibration/cambridge-12/test-3/passage-1.json` 与 `Cambridge-IELTS-12-Test-3-Passage-1-双语精读.md`。
- 对照范围：物理页 59–62、Reading 官方答案物理页 121，以及根代理的原分辨率视觉记录。
- 本审计者未参与 Passage 1 生成；本轮只读核查，没有修改 JSON 或精读正文。
- 初审结论：正文、题库主结构和答案正确，但存在 1 项来源页眉错误、若干重复 B1+ 漏项、1 项 CEFR 错标及 3 处中文表达问题；修正前不能判定通过。

## 已核对且正确的项目

- A–G 七段共 33 个英文句子；Markdown 句 1–33 与 `section.sentences` 逐字符、按顺序一致，段落归属正确。
- 题号完整覆盖 1–13；Questions 1–7 的八个 headings、总体指令和答案均正确，答案依次为 `v / iii / viii / i / iv / vi / ii`。
- Questions 8–13 的完整指令和 `ONE WORD ONLY` 限制正确；答案依次为 `pirates / food / oil / settlers / species / eggs`，与物理页 121 一致。
- 原书笔记标题的异常拼写 `The decline of the Galápagos tertoise` 已在 JSON 和 Markdown 中原样保留，并明确说明这是原书拼写，不应擅自改成 `tortoise`。
- 13 道题均含翻译、答案、原文证据、定位和实际干扰项；heading 题每题完整列出八个选项。
- 数量契约保持：33 句、13 题、3 个 A 层、3 条 Cambridge Dictionary 链接、0 图片；无占位释义、无 `undefined`。

## 必须修正的问题

### 1. 来源页眉未按原书保留 `Test 7`

根代理的原分辨率视觉记录要求保留本 Test 的打印页眉 `Test 7`，且 JSON 顶层 `printedTest` 已是 `7`；但当前 `pageTexts` 的物理页 60、62 首行均写成 `Test 3`。校准来源中的 `calibration.json`、pages/raw 对应页也仍出现 `Test 3`，与原图及 `printedTest: 7` 不一致。

应把 Test 3 Passage 1 范围内物理页 60、62 的页眉校准为原书 `Test 7`，并同步本 Passage JSON 的 `pageTexts`。最终精读正文不应新增页眉模块。

### 2. 重复 B1+ 词未在每次出现处独立讲解

现有 240 条词汇说明都是真实释义，不存在占位；但仍漏掉以下明确项目：

- 句 3：`thick` (B1)，本句为“茂密的植被”。虽然句 30 有 `thick brush`，后文条目不能代替句 3 的首次讲解。
- 句 27：`yacht` (B2) 再次出现于 `the yacht's helicopter`，本句没有独立条目。
- 句 28：`weight` (B1) 再次出现于 `This weight`，本句没有独立条目；句 27 的 `total weight` 不能代替本句回指用法。
- 句 30：`location` (B1) 再次出现于 `remote locations`，本句只解释了 `remote`，没有解释 `location`。

### 3. 一项明显 CEFR 错标

- 句 1 的 `interior` 在“某地区的内陆/内部”这一名词义应为 **B2**，当前标为 B1。Cambridge Dictionary 的 `interior` 名词“inside part”标为 B2；本句的岛屿内陆义属于同一抽象名词层级。

### 4. 两句正文翻译用词不自然或偏义

- 句 12：`processed into high-grade oil` 译为“加工成高等级油脂”生硬；这里应译为“加工成优质油/高品质油”，保留 `high-grade` 的质量义。
- 句 23：`repatriation efforts` 译成“遣返陆龟的行动”带有人类出入境语感，未体现保育语境中的送归原生地；宜改为“陆龟送归/回归原栖息地行动”。

### 5. 第 8 题题干翻译修饰关系错误

原题 `small numbers taken onto ships used by 8 ______` 中 `used by 8` 修饰 `ships`，意为“少量陆龟被带上由海盗使用的船只”。当前译文“少量陆龟被带上船，由__________食用”把 `used by` 错接到陆龟，且把“使用船只”误成“食用陆龟”。

应在 JSON 和 Markdown 同步改为类似：“17世纪：少量陆龟被带上由 8 ______ 使用的船只”。答案仍为 `pirates`；现有定位和干扰项逻辑可保留，但中文须与题干句法一致。

## 待复核清单

生成者修正后，由同一审计者针对性复核：

1. 物理页 60、62 页眉及本 Passage `pageTexts` 是否统一为原书 `Test 7`，且未在精读中加入页面模块。
2. 句 3 `thick`、句 27 `yacht`、句 28 `weight`、句 30 `location` 是否逐次补齐真实语境释义。
3. 句 1 `interior` 是否改为 B2。
4. 句 12、23 翻译是否修正。
5. 第 8 题 JSON 与 Markdown 翻译是否同步修正，答案与证据保持不变。
6. 修正后 33 句、13 题、3 A 层、3 链接、0 图片及全部官方答案是否保持。

## 针对性复核

待修正。

## 生成者修正记录

已按初审报告完成定向修正，待原审计者复核：

- `passage-1.json` 物理页 60、62 的 `pageTexts` 页眉恢复为原书印刷 `Test 7`；未在精读中新增页面模块。
- 句 3 补 `thick`，句 27 补 `yacht`，句 28 补 `weight`，句 30 补 `location`；句 1 `interior` 改为 B2。
- 句 12 改为“加工成优质油”；句 23 改为“送归陆龟原栖息地的行动”。
- 第 8 题 JSON 与 Markdown 翻译同步改为“少量陆龟被带上由__________使用的船只”，明确 `used by` 修饰 `ships`。
- 自动回归保持 33 句、13 题、3 个 A 层、3 条 Cambridge Dictionary 链接、0 图片，英文句子和官方答案不变。
## 原审计者针对性复核（最终）

同一审计者完成两轮针对性复核，最终结论：**子稿零遗留问题**。

- 第一轮确认 interior、thick、yacht、weight、两句正文译法和第8题修饰关系均已修正，但发现 `location` 一度未落在句30；生成者随后把 `location (B1)` 精确补入句30 `remote locations` 的词汇区。
- `passage-1.json` 物理页60、62的 `pageTexts` 均已恢复原书页眉 `Test 7`，并与顶层 `printedTest: 7` 一致。按根代理的并行集成边界，pages/raw 与总 calibration 属集成产物，不在本 Passage 子稿中手改；主集成时仍须由校准脚本统一写入 `Test 7`。
- 最终回归：33个英文句子与 `section.sentences` 逐字符、按序一致；13题答案仍为 `v / iii / viii / i / iv / vi / ii / pirates / food / oil / settlers / species / eggs`；原书 `tertoise` 保留；3个A层、3条Cambridge链接、0图片、0 undefined；`git diff --check` 通过（仅共享来源文件行尾提示）。

原审计者未修改 Passage 1 JSON 或精读正文。
