# Cambridge IELTS 13 Test 1 Passage 3 非生成者盲审（首轮）

审计对象：

- `data/generated/intensive-reading/cambridge-13-15/Cambridge-IELTS-13-Test-1-Passage-3-双语精读.md`
- `work/calibration/cambridge-13/test-1/passage-3.json`

唯一校准来源：`source-pages.json` 物理页 25–29 与官方答案页 118。

## 首轮发现

### BR-P3-01｜句2把非人类系统译成“一位”作曲家

原句：`Classical music by an artificial composer ...`

现译：`一位人工作曲家创作的古典音乐……`

问题：`artificial composer` 在上下文中是人工作曲系统，不是人；量词“一位”把它误写成人。建议改为“由一个人工作曲程序创作的古典音乐……”或同等自然且不人格误导的译法。

### BR-P3-02｜句7译文不自然，且 humanity 的语境义没有落准

原句：`This is a question at the very core of humanity ...`

现译：`这个问题正处在人性最核心的位置。`

问题：中文搭配“问题处在……位置”生硬；此处 `humanity` 承接 `what it means to be human`，重点是人类本质/人之所以为人的核心，而不是一般意义的“人性”。建议译为“这是一个关乎人类本质核心的问题”或同等准确自然的表达。

### BR-P3-03｜句19把 one work 的单数关系译错

原句：`One of its original works is a series of fuzzy landscapes ...`

现译：`它的一组原创作品是一系列朦胧的风景画……`

问题：`one of its original works` 是“一件/一项原创作品”，该作品本身由“一系列风景画”组成；现译把前者也写成“一组”，丢失单数层级。建议译为“它的一件原创作品是一组朦胧的风景画……”或同等表达。

### BR-P3-04｜句39译文搭配生硬

原句：`... yet recoil when they discovered how it was composed?`

现译：`……却在发现它是如何创作出来之后退避反感？`

问题：“退避反感”不是自然中文搭配，未能顺畅呈现 `recoil` 的本能退缩/强烈排斥。建议改为“……却在得知它的创作方式后本能地排斥它？”或同等自然译法。

### BR-P3-05｜漏讲多处重复出现的 B1+ 原词

以下原词在其他句中虽已讲过，但本句没有再次独立讲解，违反“每次重复出现也须再次解释”：

- `human (B1)`：句2、6、9、27、28、42、43。
- `believe (B1)`：句28（句43虽已讲，句28仍须重复讲）。
- `create (B1)`：句36、48（其他句已讲，但这两句仍须分别补讲）。
- `seem (B1)`：句50。

### BR-P3-06｜六处明显 CEFR 误标

经 Cambridge Learner’s Dictionary/English Dictionary 的明确等级条目核对：

- 句1 `computer program (B1)`：其中计算机义 `program` 为 A2，应按“基础表达（A1/A2）”处理。
- 句2 `classical music (B1)`：该表达为 A2，应标“基础表达（A1/A2）”。
- 句8 `a lot of (B1)`：该表达为 A1，应标“基础表达（A1/A2）”。
- 句11 `begin (B1)`：本句“开始”的动词义为 A1/A2，应标“基础词（A1/A2）”。
- 句23 `machine (B1)`：本句“机器”义为 A2，应标“基础词（A1/A2）”。
- 句31 `program (B1)`：计算机程序义为 A2，应标“基础词（A1/A2）”。

注意：`machine artist`、`machine creativity` 等复合领域表达可按整体难度另行标注；本条只针对上列稿件中明确写出的独立等级项。

### BR-P3-07｜JSON 第28题 location 与全篇句号体系不一致

`passage-3.json` 第28题证据是全篇第9句：`They are worried that ...`

现字段：`"location": "Paragraph 2, sentence 5"`

问题：本JSON其余题目使用全篇连续句号（如第29题写 `sentences 14–16`、第31题写 `sentences 25–26`），因此这里的 `sentence 5` 错指全篇第5句。应改为 `Paragraph 2, sentence 9`，或统一全文件采用清楚标明“段内第5句”的另一套格式；不可混用。

## 其余核验结果

- 正文来源与 `passage-3.json` 的10段正文逐字符一致。
- JSON及Markdown均为52句，顺序连续，Markdown英文与JSON 52句逐句完全一致。
- Questions 27–40 的题干、全部选项、分组指令、官方答案、证据、定位逻辑和干扰项排除未发现实质错误；答案序列与页118一致：B/C/C/D/A/D/A/E/C/G/B/YES/NOT GIVEN/NO。
- A层深挖3处、Cambridge Dictionary链接3条、图片0张，数量均符合要求。

## 当前结论

首轮共发现7组问题（其中翻译4组、重复B1+漏讲1组、CEFR误标1组、JSON定位1组）。本报告只记录问题，未直接修改生成稿。待生成者修正后，应由本审计者针对 BR-P3-01 至 BR-P3-07 逐项复核并确认零遗留。

## 针对性复核（修正后）

复核日期：2026-07-21。

- **BR-P3-01 已关闭**：句2改为“由一个人工作曲程序创作……”，不再用人的量词“一位”修饰系统。
- **BR-P3-02 已关闭**：句7改为“这是一个关乎人类本质核心的问题”，语义与中文搭配均准确。
- **BR-P3-03 已关闭**：句19改为“一件原创作品是一组……”，恢复 `one work / a series` 的层级。
- **BR-P3-04 已关闭**：句39改为“在得知它的创作方式后本能地排斥它”，`recoil` 译法自然准确。
- **BR-P3-05 已关闭**：逐项确认 `human` 已补于句2/6/9/27/28/42/43，`believe` 已补于句28，`create` 已补于句36/48，`seem` 已补于句50；均独立标为 B1。
- **BR-P3-06 已关闭**：句1 `computer program`、句2 `classical music`、句8 `a lot of` 改为“基础表达（A1/A2）”；句11 `begin`、句23 `machine`、句31 `program` 改为“基础词（A1/A2）”。
- **BR-P3-07 已关闭**：JSON第28题 `location` 已改为 `Paragraph 2, sentence 9`。

回归复核：Markdown仍为52个连续编号句，52句英文与JSON逐句完全一致；A层深挖3处、Cambridge Dictionary链接3条、图片0张；Questions 27–40与答案序列未发生回归。

**最终结论：BR-P3-01 至 BR-P3-07 全部关闭，零遗留问题。**
