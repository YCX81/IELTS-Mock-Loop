# Cambridge IELTS 10 Test 3 Passage 2 交叉盲审

## 审查范围与方法

- 审查对象：`work/calibration/cambridge-10/test-3/passage-2.json` 与 `data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-10-Test-3-Passage-2-双语精读.md`。
- 原书人工核对：PDF 物理页 60–63（正文、脚注、题目）及物理页 148（官方答案），均按原始页面版面逐页查看；未以 OCR 或脚本结果代替人工核对。
- 机械核对仅作辅助：将 MD 中 37 个编号英文单元按 A–I 段重新拼接，与 JSON 逐字符比较；另计数题号、A 层、Cambridge 链接和图片。
- 本轮结论：**未达零遗留问题**。正文英文与题库结构准确，但精读中有 5 类实际问题，详见下文。只出报告，未修改 JSON 或 MD。

## 必须修正的问题

### 1. 第 25 单元翻译改变了 `evolved to capture` 的语义

- 位置：MD 第 271–275 行，段落 G 第 1 句（编号 25）。
- 原文：`Chlorophyll, although exquisitely evolved to capture the energy of sunlight, can sometimes be overwhelmed by it ...`
- 现译：`叶绿素虽然精妙地进化为捕获阳光能量的物质……`
- 问题：`evolved to capture` 表示“经过精妙演化而具备捕获能力”，不是“进化成为某一种物质”。现译增添了原文没有的“成为……物质”关系。
- 建议：改为类似“叶绿素虽然经过精妙演化，能够捕获阳光的能量，有时仍会被阳光压垮……”；句法说明可保留“although 为让步成分”，并明确 `to capture` 是演化所得功能/目的。

### 2. 第 28 单元把光化学术语 `excited` 误译为“活跃”

- 位置：MD 第 301–307 行，段落 G 第 4 句（编号 28）。
- 现译：`活跃叶绿素分子所产生的氧`。
- 问题：此处 `excited chlorophyll molecules` 是光化学语境中的“受激（发）的叶绿素分子”。同一单元的句法说明已经正确指出“受激发”，但正文翻译仍写成泛义“活跃”，术语前后不一致。
- 建议：将译文改为“受激（发）的叶绿素分子所产生的氧”；词汇项 `excited molecule（C1，化学专业词）受激分子` 可保留。

### 3. 第 21 单元漏讲重复出现的 B1 词 `theory`

- 位置：MD 第 225–231 行，段落 F 第 1 句（编号 21）。
- 问题：原句包含 `the theory known as ...`，但词汇行只列 `plausible`、`suggestion`、`as to`、`go to the trouble of doing`、`anthocyanin`、`be busy doing`、`pack up`、`be known as`、`light screen hypothesis`，未独立覆盖 `theory`。该词此前已在编号 15、19 中按 `(B1)` 讲解；强制规则要求每次重复出现的 B1+ 项再次独立讲解。
- 建议：在本句词汇中补 `theory（B1）理论`，不要用相邻的 `hypothesis` 或术语短语替代这一独立出现的词。

### 4. `in the fall` 的 CEFR 标注明显偏高且三处重复

- 位置：MD 第 15、27、287 行（编号 1、2、26）。
- 现标：`in the fall（B1）`。
- 问题：表示“在秋季”的常用季节表达属于基础层级，标成 B1 与本文对同类基础时间/季节表达的处理不一致。
- 建议：三处统一改为 `in the fall 基础表达（A1/A2）在秋季`。编号 5 的 `As fall approaches` 中 `fall` 可按基础词处理，不构成 B1+ 漏项。

### 5. Q16、Q18、Q23–25 的“证据”不是可核对的英文原文证据

- 位置：MD 第 450、468、528、537、546 行。
- 问题：这些行主要用中文概述原文；Q24 也只是中英混写的碎片。定位与结论本身正确，但强制规则要求每题给出“原文证据”，应保留可直接对照正文的英文措辞。JSON 中已有合适英文证据，不应在 MD 中降格为中文概述。
- 建议补入以下英文证据（中文分析继续放在“定位”中）：
  - Q16：`the leaves that are the reddest are those on the side of the tree which gets most sun`，并可续引 `the best conditions for intense red colours are dry, sunny days and cool nights`；说明 H 2–5 句共同构成验证光屏假说的观察证据。
  - Q18：`trees may produce vivid red colours to convince herbivorous insects that they are healthy and robust and would be easily able to mount chemical defences against infestation.`
  - Q23：至少保留 `there are problems with each of these theories`，并结合 D 段前一句明确指向 `increase a leaf's tolerance to freezing`；中文定位再解释为何官方为 FALSE。
  - Q24：`It sounds paradoxical` 以及 `Why does chlorophyll need protection when it is the natural world's supreme light absorber?`
  - Q25：`Do these trees have other means at their disposal to prevent overexposure to light in autumn?`；中文定位说明原文仅提出疑问，未比较损伤概率。

## 已通过项目及证据

### 原书、JSON 与正文英文

- 物理页定位正确：正文页 60–61，题目页 62–63，官方答案页 148。
- JSON 元数据正确：`sourcePages=[60,61,62,63]`、`bodyPages=[60,61]`、`questionPages=[62,63]`、`answerKeyPage=148`、状态为 `manually_calibrated`。
- 标题 `Autumn leaves`、副标题、A–I 九个段落标签与原书一致；脚注逐字符为 `* photosynthesis: the production of new material from sunlight, water and carbon dioxide`。
- MD 有 37 个编号英文单元：副标题 1 个 + 正文 36 句。副标题与 JSON 逐字符一致；按原书段落拼接后，A–I 九段均与 JSON 逐字符一致，句数依次为 `2/7/4/2/4/4/4/6/3`，顺序无误、无合并或遗漏。
- 原书双栏顺序及跨页衔接正确：D 段在物理页 60 结束，E 段从物理页 61 开始。

### 题目与答案

- JSON 有 4 个题组、13 道题，完整覆盖 14–26；MD 题号也是连续的 14–26。
- 题组指令、A–I 标签、`NB You may use any letter more than once.`、`ONE WORD ONLY`、TRUE/FALSE/NOT GIVEN 三项定义和 Q26 单选指令均与原书一致。
- Q26 的 A–D 四个选项完整、顺序和英文逐字正确，四项均有中文翻译；答案 B、证据和 A/C/D 排除逻辑正确。
- 物理页 148 官方答案核对为：14 C；15 B；16 H；17 B；18 E；19 `sun(light)`；20 upper；21 dry；22 north；23 FALSE；24 TRUE；25 NOT GIVEN；26 B。JSON 与 MD 答案全部一致。
- Q16=H、Q18=E 的定位和干扰项区分正确：F 是假说、G 是机制、H 是观察证据；D 是直接功能猜想，E 才是面向昆虫的警告信号。
- Q19 正确保存官方展示 `sun(light)`，并把 `sun`、`sunlight` 都列为可接受的一词答案；字数限制处理正确。

### 格式与附加要求

- A 层深挖恰好 3 个。
- Cambridge Dictionary 链接恰好 3 条。
- Markdown 图片 0 张，JSON `images` 也为空；没有正文页、题目页或答案页整页截图。
- 除上列问题外，逐句中文翻译、主干/修饰/表达作用以及重复专业词的领域与 CEFR 标注未发现其他明确错误。

## 复核状态

- 当前状态：**待生成者修正后复核**。
- 针对性复核清单：上述 5 项全部修正；正文英文、题号、答案、A 层/链接/图片计数不得发生回归。
- 最终零遗留结论：尚未出具。

## 针对性复核（修复后）

- 复核对象：首轮报告列出的 5 类问题，以及正文、题号和格式计数回归。
- 句 25 已改为“经过精妙演化，能够捕获阳光的能量”，句法明确 `to capture` 是演化所得功能；修饰关系正确。
- 句 28 已改为“受激叶绿素分子”，与光化学语境及词汇解释一致。
- 句 21 已补入重复出现的 `theory（B1）理论`。
- 句 1、2、26 三处 `in the fall` 已统一为 `基础表达（A1/A2）`。
- Q16、Q18、Q23、Q24、Q25 的 MD 证据均已改为可直接核对的完整英文原句；Q16、Q18、Q23、Q24 的 JSON 题组与答案镜像 evidence 也已同步为完整原句，Q25 JSON 原证据保持正确。答案、定位与干扰项逻辑无变化且仍正确。
- 回归检查：37 个编号英文单元（副标题 1 + 正文 36）按 A–I 聚合后与 JSON 逐字符零差异；A–I 句数仍为 `2/7/4/2/4/4/4/6/3`。
- 题号 14–26 连续完整，共 13 题；Q26 四个选项、Q19 `sun`/`sunlight` 变体及全部官方答案无回归。
- A 层深挖 3 个、Cambridge Dictionary 链接 3 条、Markdown 图片 0 张，JSON `images=[]`。

**最终结论：通过，零遗留问题。**
