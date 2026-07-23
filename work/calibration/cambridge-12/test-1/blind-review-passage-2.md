# Cambridge IELTS 12 Test 1 Passage 2 盲审报告

## 审计范围与方法

- 审计对象：新生成的 `passage-2.json` 与 `Cambridge-IELTS-12-Test-1-Passage-2-双语精读.md`；未读取任何旧精读正文。
- 原书核对：将本地 PDF 物理页 20、21、22、117 按 300 DPI 渲染为 PNG，并逐页人工查看正文双栏顺序、跨页句、题干、字数限制、TRUE/FALSE/NOT GIVEN 标签和官方答案。
- 正文检查：逐一核对 34 个完整句子的数量、顺序、段落位置和逐字符文本，并人工检查中译、句法拆分、表达作用、B1+ 重复项与 CEFR 标注。
- 题目检查：逐题核对 14–26 的题干、填空限制、分类标签、官方答案及变体、证据、定位和干扰项分析。

## 检查统计

- JSON 正文句数：34。
- Markdown 句级单元：34。
- JSON 与 Markdown 英文逐字符差异：0。
- 原书与校准句子的漏句、错序、跨页拼接错误：0。
- A 层深挖：3。
- Cambridge Dictionary 链接：3。
- 图片：0。
- 题目：13 题，完整覆盖 14–26。
- 官方答案序列：`antiques; triumph; information; contact/meetings; hunt/desire; aimless/empty; educational; Trainspotting; NOT GIVEN; FALSE; NOT GIVEN; TRUE; TRUE`，与物理页 117 一致。
- 题干及 TRUE/FALSE/NOT GIVEN 选项与物理页 22 的实质差异：0。
- 翻译与句法发现的明确语义错误：0。

## 遗留问题

### BR-P2-01（高）：20 个句级单元未按契约重复讲解核心 B1 词族

用户要求每一次重复出现的 B1+ 词或短语都再次独立讲解。稿件把 `collector` 明确标为 B1，但没有在后续每次出现的 `collect / collecting / collector / collection` 处重复讲解。

受影响句号：**1、2、6、8、10、12、16、17、18、19、20、24、26、27、28、29、30、32、33、34**。

代表性证据：

- 句 6 中 `collect` 一次、`collecting` 两次，词汇区只讲 `instrumental`、`reason for`、`that is` 等，没有讲这三次核心词。
- 句 10 中 `collectors` 出现两次、`collect` 一次，词汇区没有任何一项解释该词族。
- 句 18 中 `collectors` 与 `collections` 各出现一次，均未解释。
- 句 27 中 `collectors` 与 `collecting` 再次出现，均未解释。
- 句 29 同时出现 `collect` 与 `collector’s`，均未解释。
- 句 32、33、34 的收束段再次出现 `collecting`，仍未独立解释。

可执行修正：在上述每个句级单元的词汇区补充对应表面形式，并按每一次出现分别标注 `(B1)`；同一句中多次出现也不得只用一个合并条目替代。修正后按英文原句逐词重新走一遍 B1+ 覆盖清单。

### BR-P2-02（中）：除核心词族外，仍有可由稿内自身 CEFR 标注证明的重复项漏讲

以下项目在别句已被稿件标为 B1，却在再次出现时没有独立解释：

- 句 15：`looking for` 未讲；句 7 已把 `look for` 标为 `(B1)`。
- 句 16：`postage stamps` 与 `reason` 未讲；句 2 已把 `postage stamp` 标为 `(B1)`，句 6 已把 `reason for` 标为 `(B1)`。
- 句 18：`information` 未讲；句 10、22 均把 `exchange information` 标为 `(B1)`。
- 句 29：`reason` 未讲；前文已标为 `(B1)`。
- 句 12：`particular` 在同一句中出现两次（`a particular example` / `a particular singer`），词汇区只有一个合并条目，不符合“每一次重复出现均独立讲解”的字面要求。
- 句 32：`pleasure` 在 `give pleasure` 和 `pleasure is putting it ...` 中出现两次，词汇区没有针对第二次名词用法的独立条目。

可执行修正：按上述句号补足独立条目，并在最终复核时不仅检查跨句重复，也检查同一句内的重复表面形式。

## 题目与语言质量结论

- 第 14–21 题的 `ONE WORD ONLY` 限制、所有可接受变体和语法槽位均正确。
- 第 22–26 题的 TRUE/FALSE/NOT GIVEN 分类、证据方向与干扰项排除均正确；未发现把“未提及”误判为“错误”的情况。
- 34 句的中文翻译与句法拆解总体准确，未发现需要单独立项的语义或结构错误。
- 当前稿件不能判定为零遗留问题；必须先修正 BR-P2-01 和 BR-P2-02，再由本审计者针对词汇覆盖进行复核。

## 生成者修正记录（BR-P2-01 / BR-P2-02）

- 已在受影响的 20 个句级单元中，按原句每一次表面出现分别补充 `collect / collecting / collects / collected / collector(s) / collection(s) / collector’s` 的独立 `(B1)` 条目；同一句多次出现者分别标明第一次、第二次或具体语法作用。
- 已补齐 BR-P2-02 指定项：句15 `look for`；句16 `postage stamp`、`reason`；句18 `information`；句29 `reason`；句12两次 `particular`；句32第二次 `pleasure`。
- 未改动 34 句英文、中文翻译、句法主干、题目 14–26、答案或证据。
- 生成者自检：34 句英文与校准 JSON 逐字符差异 0；句号 1–34 连续；题号 14–26 连续；A 层深挖 3；Cambridge Dictionary 链接 3；图片 0；`git diff --check` 通过。
- 待原审计者针对 BR-P2-01 / 02 复核并给出零遗留结论。
## 针对性复核（原审计者，BR-P2-01 / BR-P2-02）

- BR-P2-01：逐句重新统计句 1、2、6、8、10、12、16、17、18、19、20、24、26、27、28、29、30、32、33、34 中 `collect / collecting / collects / collected / collector(s) / collection(s) / collector’s` 的每次表面出现，并与各句新增 `(B1)` 词条逐项核对。20 个句级单元的出现次数与独立讲解数全部覆盖，无漏项。
- BR-P2-02：句 15 `look for`、句 16 `postage stamp` 与 `reason`、句 18 `information`、句 29 `reason` 均已补齐；句 12 两次 `particular` 已分别标明第一次和第二次，句 32 第二次 `pleasure` 已单列讲解。
- 回归检查：Markdown 34 句与校准 JSON 34 句逐字符差异 0，句序连续；本次复核未改动 Passage 2 稿件。
- 最终结论：BR-P2-01、BR-P2-02 **零遗留问题**，Passage 2 针对性复核通过。
