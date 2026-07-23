# Cambridge IELTS 11 Test 2 Passage 1 独立盲审

## 审查范围与方法

- 人工查看 300 DPI 原始分辨率渲染：PDF 物理页 39–42，以及官方答案物理页 125。
- 对照文件：`passage-1.json`、`source-pages.json`、新生成精读 `Cambridge-IELTS-11-Test-2-Passage-1-双语精读.md`。
- 未读取旧精读正文。
- 检查正文双栏顺序、跨栏/跨页连接、38 个完整句子的数量与顺序、逐字符一致性、翻译与句法、逐句 B1+ 覆盖及 CEFR、Questions 1–13 的指令/选项/答案/证据/定位/干扰项，以及图片裁切。

## 结论

- Blocker：0
- Major：2
- Minor：1
- 当前结论：**未达到零遗留问题，修正后须由本审计者针对性复核。**

## Major

### M1｜原书中的 4 处弯引号被校准数据和新稿改成直引号，未达到逐字符一致

物理页 40 清楚排印为 `Edgerton’s`、`ship’s`、`hull’s`，物理页 41 第 6 题排印为 `person’s`。当前 `passage-1.json`、`source-pages.json` 及新稿相应位置均使用 ASCII 直引号：

- 正文第 21 句：`Edgerton's`，应为 `Edgerton’s`。
- 正文第 23 句：`ship's frame`，应为 `ship’s frame`。
- 正文第 36 句：`hull's delicate timber framework`，应为 `hull’s delicate timber framework`。
- 第 6 题题干：`One person's exploration ...`，应为 `One person’s exploration ...`。

影响范围包括 `paragraphs`、`questionGroups`、`pageTexts`、`source-pages.json` 及新稿中的英文原句/题干；正文 JSON 与新稿虽然彼此相同，但共同偏离原书，不能据此判定校准合格。

### M2｜日期匹配题没有完成 A–G 全部错误选项的逐题排除

新稿完整列出了 A–G 日期并给出了正确答案，但各题只解释了部分干扰日期，未覆盖其余错误选项；结构化题库中的 `distractorRationale` 也存在相同缺口。具体为：

- 第 5 题只排除了 D（1967）、E（1971）、F（1979），未说明 A、B、G 为什么不对应“启动搜索”。
- 第 6 题只对比 A（1836），未排除 C、D、E、F、G。
- 第 7 题提及 1978（并非 A–G 选项）与 F（1979），未排除 A、B、C、D、E。
- 第 8 题只对比 C（1965）、D（1967），未排除 B、E、F、G。

这不影响官方答案本身，但未满足“所有选项及干扰项排除”的精讲要求。建议每题按时间线明确标出其余六个日期分别对应的事件或为何与题干动作不符。

## Minor

### m1｜3 个明确的 B1+ 词形/重复出现未在所在句独立讲解

- 第 7 句的 `degrees`（B1，角度单位）未列入本句词汇。
- 第 16 句的 `diving` / `dive`（B1，潜水）未再次讲解；第 14 句出现过 `dive down`，不能替代第 16 句的重复项。
- 第 34 句的 `lifted` / `lift`（B1，吊起）未列入本句词汇；第 37 句才列出 `lift`，不能倒替第 34 句。

其余已抽查的专业词均同时给出领域与 CEFR；未发现明显会改变理解的 CEFR 等级错误。

## 已核实无误

- 物理页定位正确：正文 39–40，题目 41–42，官方答案 125。
- 双栏阅读顺序正确：每页均先左栏到底、再右栏；第 10 句在物理页 39 跨栏连接，第 19 句由物理页 39 的 `what McKee` 跨至物理页 40 的 `really hoped ...`，均未拆错。
- 正文共 38 句；新稿编号连续为 1–38，顺序完整。除 M1 的 3 处弯/直引号外，英文句子与校准 JSON 一致。
- `passage-1.json.pageTexts` 与 `source-pages.json` 的物理页 39、40、41、42 当前彼此逐字符一致；但二者共同包含 M1 所列原书字符偏差。
- 题号完整覆盖 1–13；所有总体/题组指令、TRUE/FALSE/NOT GIVEN 标签、A–G 七个日期、图题、固定标签与填空提示均已收录并翻译。
- 官方答案与物理页 125 一致：1 TRUE；2 NOT GIVEN；3 TRUE；4 FALSE；5 C；6 B；7 G；8 A；9 `(lifting) frame`；10 `hydraulic jacks`；11 `stabbing guides`；12 `(lifting) cradle`；13 `air bags`。第 9、12 题可接受变体与括号规则正确，所有填空均符合 `NO MORE THAN TWO WORDS`。
- 每题的核心证据与定位逻辑正确；未发现答案、题号或证据句定位错误。
- 翻译与句法说明整体准确，未发现会改变原意的错误。
- A 层深挖恰好 3 个；Cambridge Dictionary 链接恰好 3 条。
- 图片恰好 1 张，为第 9–13 题不可由纯文字无损表达的流程/空间关系紧裁图；未含正文页、题目页或答案页整页截图，箭头与标签均完整可读。

## 针对性复核清单

1. 四处原书弯引号须在校准 JSON、source pages、集成来源和新稿中同步修正，并重新验证镜像逐字符一致。
2. 日期匹配第 5–8 题逐题补齐 A–G 全部错误日期的排除依据。
3. 第 7、16、34 句分别补讲 `degrees`、`diving`、`lifted`，保留独立 CEFR 标注。
4. 修正后重新核对正文 38 句、Questions 1–13、A 层 3 个、Cambridge 链接 3 条、图片 1 张。

## 修订后针对性复核

复核日期：2026-07-21。

- M1 已关闭：重新人工查看物理页 40–41 后确认，`Edgerton’s`、`ship’s`、`hull’s`、`person’s` 四处弯引号均与原书一致；修改已同步进入 `passage-1.json` 的正文/题干/页文本、`source-pages.json` 和新稿。新稿 38 个英文句子与结构化正文逐句逐字符一致，页 39–42 的两个校准镜像也逐字符一致。
- M2 已关闭：第 5–8 题在结构化 `distractorRationale` 和新稿精讲中均逐题覆盖 A–G；每题除正确答案外的其余六个日期均有对应事件及排除依据，未发现错配。
- m1 已关闭：第 7 句已补 `degree`（原句 `degrees`），第 16 句已独立重讲 `dive`（原句 `diving`），第 34 句已独立重讲 `lift`（原句 `lifted`）；CEFR 和语境释义可接受。
- 回归检查：正文仍为 38 句，编号和顺序无变化；Questions 1–13、官方答案与可接受变体无变化；A 层 3 个、Cambridge Dictionary 链接 3 条、紧裁图 1 张。

### 最终复核结论

Blocker：0；Major：0；Minor：0。**上述盲审问题已全部关闭，零遗留问题。**
