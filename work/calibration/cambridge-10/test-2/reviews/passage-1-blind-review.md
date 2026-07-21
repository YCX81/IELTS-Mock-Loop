# Cambridge IELTS 10 Test 2 Passage 1 交叉盲审

## 结论

**未通过，需修正后由本审计者针对性复核。** 本轮只读人工对照原书物理页 33–36、答案页 146，并检查 passage-1.json 与 Passage 1 新精读。官方答案 1–13 全部正确，正文 57 个编号单元也没有漏句或乱序；但仍发现结构化段落角色缺失、精读题解引用非原书文字、段落标签缺失、重复 B1+ 漏讲、CEFR 错标和一处翻译偏义等实际问题。

## 审核基准

- 题目物理页：33、36
- 正文物理页：34–35
- 官方答案物理页：146
- 正文段落：A–G，共 7 段
- 精读编号：57 个完整英文句子/句式单元，其中副标题 2 句、A–G 正文 54 句、Lister 脚注 1 句
- 题号范围：1–13
- 官方答案：1 iv；2 viii；3 vii；4 i；5 vi；6 ix；7 ii；8 NOT GIVEN；9 TRUE；10 FALSE；11 FALSE；12 NOT GIVEN；13 TRUE

## 可操作问题

### P1-01｜高｜结构化正文丢失 A–G 标签及页面/角色信息

passage-1.json 的 bodyParagraphs 是 7 个纯字符串，不含 label、text、sourcePages/sourcePage 或 role。当前集成器对字符串直接原样输出，因此生成的结构化题库正文不会带 A–G 段落标签；这会破坏 Questions 1–7 的 Paragraph A–G 定位。

修复动作：

1. 把 7 个元素改为统一对象结构，至少含 label: A–G、text、sourcePages（A–D 为 [34]，E–G 为 [35]）及正文 role；
2. 两个 questionGroups 补 sourcePages，分别为 [33]、[36]；
3. 保证 pages、bodyPages、questionPages、answerKeyPage 保持 33–36/146 的正确边界；
4. 重新运行集成器结构断言，确认题库正文仍显示 A–G 标签。

### P1-02｜高｜精读第 1–11 题中多处“原文证据”不是原书原句

JSON answers 中的证据总体可回溯原文；问题集中在精读文件的题目精讲，出现拼接、改词或来自另一版本的句子。

- 第 1 题把原文 happen 改引为 occur。直接证据应保持 “happen in Britain”。
- 第 2 题定位逻辑声称本段列出“农业”，B 段实际列的是技术和动力、城市人口、廉价劳动力、交通、富裕中产阶级、市场经济和政治制度，没有 agriculture。
- 第 3 题证据把 B、C 两段拼成一条引文，并虚构 “were the final two keys”。原文 C 段只有 “Tea and beer, two of the nation's favourite drinks, fuelled the revolution.”
- 第 4 题引用 “But no-one knows exactly why there was this sudden growth in population.”，原书没有这句话。可用原文 “People suggested four possible causes.” 及结句 “Efforts ... appeared to draw a blank.”
- 第 5 题引用 “The tax was withdrawn. The population began to rise ...”，原书没有 tax was withdrawn；又把 F 段 “Macfarlane looked to Japan” 混入 E 段。定位逻辑还称 E 段写到“再到茶”，但 E 段止于 “What caused this?”，茶在 F 段。
- 第 6 题写到 “typhoid death rate” 和 “the mystery was solved”，原书 F 段均无这些内容。原文写 water-borne diseases、dysentery、infant mortality 和 tea 的日期吻合。
- 第 8 题解释中称后文列出中国的“农业剩余、技术、人口激增”，本篇没有这份中国条件清单；原文只说 “China also had many of these factors.”
- 第 10 题引用 Porter 所谓 “a wonderful case history of epidemiology”、plausible、compelling，原书没有这些引语。正确证据是 “recently wrote a favourable appraisal of his research.”
- 第 11 题引用 “population exploded”，原书实际是 “there was a burst in population growth”。

这些问题不改变官方答案，但违反“证据必须来自校准原文”和“不得推测性补写”。修复时须逐题只从本次校准正文复制证据，并同步校正定位与干扰项说明。

### P1-03｜中｜精读正文未显示 A–G 段落边界

精读的 57 个英文单元顺序正确，但正文区只连续显示句号编号，没有 A、B、C、D、E、F、G 标签。标题匹配题要求学习者识别段落，缺少标签会让正文与题解中的 Paragraph A–G 无法直接对应。

应在不改变英文句子和编号的前提下，明确标出：

- A：句 3–5
- B：句 6–12
- C：句 13–17
- D：句 18–34
- 脚注：句 35
- E：句 36–46
- F：句 47–54
- G：句 55–57

### P1-04｜中｜多处重复出现的 B1+ 未在本句再次讲解

以下为逐句复扫确认的遗漏；其中多项已在别句被稿件自身标为 B1+，因此不能以前文讲过代替本句独立讲解：

- 第 8 句：provide（同句出现两次）、willing
- 第 9 句：case（本义为“情形”）
- 第 11 句：coal
- 第 17 句：support
- 第 34 句：appear to
- 第 36 句：seem to
- 第 40 句：must have
- 第 50 句：provide
- 第 53 句：together with、provided/provide
- 第 56 句：note
- 第 57 句：think of ... as

修正后应对 57 句重新逐 token 扫描，尤其检查 provide、revolution、factor、population、support 等重复词在每次出现处都有本句级标注。

### P1-05｜中｜若干基础词被错误标成 B1

以下词的本义属于明显的 A1/A2 层级；如保留在词汇栏，应按用户规定写成“基础词（A1/A2）”或“基础表达（A1/A2）”，不能标成 (B1)：

- 第 5、27 句 century
- 第 38 句 disease
- 第 51 句 expensive
- 第 52 句 common
- 第 53 句 healthier（healthy 的比较级）

还应抽查相同词在全文各次出现的级别一致性。

### P1-06｜中｜副标题第 1 句 drinking habits 翻译偏成“饮酒习惯”

原文的 drinking habits 同时涵盖 tea 与 beer，译成“饮酒习惯”会把 tea 排除并造成酒精饮料偏义。应改为“饮用习惯”或“饮茶饮酒习惯”。其余 56 个单元的翻译与句法未发现会改变原意的明显错误。

### P1-07｜低｜pages 文本映射中的范围连接号与原书不一致

物理页 33、36 的题号和段落范围使用长连接号：1–13、1–7、A–G、i–ix、8–13。pages["33"] 与 pages["36"] 当前多处写成 ASCII 连字符 1-13、A-G、i-ix、8-13，而顶层 instructions/questionGroups 又使用长连接号，内部也不一致。

应按原页统一这些范围符号，并确保最终 pages.json 与 raw.md 由同一校准文本生成。

## 已通过项目

- 原书物理页 34–35 为单栏顺序；A–D 在第 34 页，E–G 在第 35 页，没有遗漏跨栏或跨页半句。
- 副标题、署名、A–G 正文和 Lister 脚注均进入精读；57 个编号连续。
- 将精读 57 条英文依序拼接后，与 JSON 的 subtitle + A–D + footnote + E–G 逐字符一致。
- 正文内容人工对照原页未发现漏词、错词、段落换序；OCR 缺失的 drive factories、move goods around、Between ... and 1740 等均已正确恢复。
- 页 33 的全部 headings i–ix、总体指令、Paragraph A–G 题项完整。
- 页 36 的 TRUE/FALSE/NOT GIVEN 指令和题干 8–13 完整。
- 答案页 146 已目视核对，1–13 的全部官方答案与 JSON/精读一致。
- JSON answers 的 13 项均有 evidence、evidenceLocation、distractors；答案值正确。
- 第 9、12、13 题的证据、定位与判断排除准确；其余题的答案方向也正确，问题是精读中部分引文不忠实。
- A 层深挖恰好 3 个；Cambridge Dictionary 链接恰好 3 条；图片 0 张。
- 全文句法分析总体准确；除 P1-06 外，未发现明显翻译偏义。

## 修正后复核清单

1. 将 bodyParagraphs 改为带 A–G 标签、页码和 role 的对象，并补题组 sourcePages。
2. 用本次校准正文逐字替换第 1、3、4、5、6、8、10、11 题的非原文证据，同时删除第 2、5、6、8 题的虚构定位细节。
3. 在精读正文显式恢复 A–G 段落标签。
4. 补齐 P1-04 列出的每次 B1+，再做 57 句全量复扫。
5. 修正 P1-05 的 CEFR 与 P1-06 的 drinking habits 译法。
6. 统一 pages 文本中的范围连接号。
7. 重新验证 57 句、13 题、3 个 A 层、3 条链接、0 图均不变。

**当前状态：7 组问题未关闭，尚不能报告零遗留。**


---

## 第二轮针对性复核

### 结论

**仍未通过；首轮 7 组问题中 6 组已关闭，P1-04/P1-05 尚有 2 个小型残留。** 本轮只读检查修正后的 passage-1.json 与 P1 精读，没有修改被审文件。

### 已关闭项目

- P1-01 已关闭：bodyParagraphs 已改为 A–G 对象，均含 text、sourcePages 和 role；A–D 对应 [34]，E–G 对应 [35]；题组 sourcePages 为 [33]、[36]。
- P1-02 已关闭：第 1–6、8、10、11 题的证据均已替换为本次校准正文原句；首轮列出的拼接句、异版本引文和非原书事实已全部移除。13 道题的答案、定位方向与干扰项现均正确。
- P1-03 已关闭：精读正文已经明确标出段落 A–G 和脚注边界。
- P1-06 已关闭：drinking habits 已改译为“饮用习惯”，不再误限为酒精饮品。
- P1-07 已关闭：页 33、36 的 1–13、1–7、A–G、i–ix、8–13 已统一为原书范围连接号。
- 计数复核通过：57 个英文单元连续，拼接后与 subtitle + A–D + footnote + E–G 逐字符一致；13 个答案与答案页 146 一致；3 个 A 层、3 条 Cambridge 链接、0 图。

### 尚存问题

#### R2-P1-01｜中｜第 8 句虚增第二次 provide

原句中 provide 只出现一次：

“For industry to take off, there needs to be ... large urban populations to provide cheap labour, easy transport to move goods around ...”

当前词汇栏却写成：

- provide（第一次出现，B1），提供廉价劳动力
- provide（第二次出现，B1），提供便利交通

第二项并不存在于英文原句；easy transport 后使用的是 to move，而不是 provide。请只保留一次 provide，并把需要讲解的 move goods around 另行按实际词形处理，不能为了满足重复项规则虚增原词。

#### R2-P1-02｜低｜第 5 句 century 仍存在同义同句双重级别

第 5 句词汇栏同时写：

- the end of the 18th century（B1）
- century，基础词（A1/A2）

同一个基础词及其普通时间短语在同句被标成两个层级，P1-05 尚未完全关闭。请把 the end of the 18th century 整体按“基础表达（A1/A2）”处理，或只保留一个不冲突的基础项。

### 第三轮复核入口

1. 第 8 句删除虚构的“第二次 provide”，确认英文原句和词汇栏出现次数一致。
2. 第 5 句消除 century 的 B1/A1–A2 冲突。
3. 重跑 57 句逐字符、13 答案、3A/3链接/0图检查。

**第二轮状态：2 个残留未关闭，暂不能报告零遗留。**



---

## 第三轮最终针对性复核

### 结论

**通过，零遗留。** 本轮只复核第二轮的两项残留，并重跑必要回归；未修改 passage-1.json 或 P1 精读。

### 复核结果

- R2-P1-01 已关闭：第 8 句词汇栏现在只保留一次 provide（B1），与英文原句唯一一次出现一致；已删除虚构的“第二次 provide”，be willing to 保留正确。
- R2-P1-02 已关闭：第 5 句 the end of the 18th century 已统一标为“基础表达（A1/A2）”，不再另列 century，也不存在 B1/A1–A2 冲突。
- 57 个英文单元仍连续，拼接后与校准 JSON 的 subtitle + A–D + footnote + E–G 逐字符一致。
- 1–13 官方答案序列保持正确。
- A 层深挖 3 个、Cambridge Dictionary 链接 3 条、图片 0 张。

**第三轮状态：首轮与第二轮全部问题均已关闭，最终复核零遗留。**
