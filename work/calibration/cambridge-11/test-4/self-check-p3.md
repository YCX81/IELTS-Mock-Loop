# Cambridge IELTS 11 Test 4 Passage 3｜生成者自检

## 来源校准

- 已按原始分辨率逐页人工查看指定渲染图：题目物理页 94、正文物理页 95–96、题目物理页 97、官方答案物理页 129。
- 正文阅读顺序为物理页 95 的 A–D，再接物理页 96 的 E–F；没有跨页残句。
- 已人工核对标题 `‘This Marvellous Invention’`、A–F 段标、Port-Royal 长引文、紧排音素串 `p,f,b,v,t,d,k,g,sh,a,e`、土耳其词 `şehirlileştiremediklerimizdensiniz`、苏美尔词 `munintuma’a`、曲引号/曲撇号及 en dash。
- 本篇从上述原书图像与新建结构化 JSON 全新生成；未读取或沿用任何旧精读正文。

## 结构化 JSON

- 状态为 `manually_calibrated`；`sourcePages` 为 94–97，`passagePages` 为 95–96，`questionPages` 为 94、97，`answerKeyPage` 为 129。
- A–F 共 6 个 sections、32 个完整英文句子；括号内完整句 `(In case you were wondering ... own.)` 独立计为第 23 句。
- 3 个 question sections、14 道题，连续覆盖 27–40。
- Questions 27–32 包含全部三条指令、i–vii 七个 heading、段落 A–F、官方答案、证据、双重句号定位和干扰项依据。
- Questions 33–36 包含两条指令、摘要标题、完整摘要、A–G 七个选项、官方答案、证据、定位和错误选项排除。
- Questions 37–40 包含完整 YES / NO / NOT GIVEN 指令与三类标签、四道题干、官方答案、证据、定位及判断边界。
- `pageTexts` 完整收录物理页 94–97 的本 Passage 正文/题目内容及答案页 129 的 Questions 27–40 答案段，并保留五页底部可见印刷页码 `96`、`97`、`98`、`99`、`131`。
- 官方答案已目视核对为：27 vi，28 iv，29 ii，30 vii，31 i，32 v，33 E，34 G，35 B，36 F，37 NO，38 YES，39 NOT GIVEN，40 YES；原书未给额外变体。

## 全新精读

- Markdown 按 A–F 顺序列出 32 个连续编号；每个完整英文句子单独编号。
- JSON `paragraphs[].sentences[]` 与 Markdown 正文 32 个英文引用逐项比较，逐字符差异为 0。
- 每句均含自然中文翻译、主干/修饰/表达作用，以及本句 B1+ 单词和短语；相关词形如第 9 句 `invention/invent` 分别处理，同句重复项如第 14 句两次 `order`、第 28 句两次 `sound` 已按出现次序独立讲解。
- 专业词同时标注 CEFR 和领域；A1/A2 项没有使用 `(A1)` 或 `(A2)` 禁用格式。
- 恰好 3 个 A 层深挖：`take pride of place`、`take ... for granted`、`bring home`。每项均包括本句义、字面画面、普通说法差别、语气/篇章作用、2 个中英双语迁移例句和 3 个近义表达边界。
- Cambridge Dictionary 链接恰好 3 条；图片为 0，没有正文、题目或答案整页截图。
- 五个顶级功能章节精确为 `01 逐句精读`、`02 题目与选项精讲`、`03 B1+ 词汇深讲总表`、`04 IELTS 阅读提醒`、`05 答案汇总`。

## 题目精讲

- 位于全部正文精读之后，先给总体指令，再按 Questions 27–32、33–36、37–40 三组展开。
- 标题匹配部分逐条列出 i–vii 原文和翻译，每题包含段落、答案、原文证据、主旨定位及最相关干扰标题排除。
- 摘要部分给出完整摘要翻译及 A–G 全部选项和翻译，每空解释词义、搭配、原文改写和错误选项。
- 判断题部分完整翻译题干并区分“直接矛盾”“观点一致”和“比较维度未给出”；第 39 题明确不能把表达长度推断为清晰度。
- 答案汇总连续覆盖 27–40，无漏号或重复题号。

## 自动计数与边界回归

- JSON 可正常解析；sections 6，JSON sentences 32，Markdown sentences 32，英文逐字符差异 0。
- question sections 3，questions 14，题号 27–40 连续，答案映射与物理页 129 一致。
- H2 数量 5，A 层数量 3，Cambridge Dictionary 链接数量 3，Markdown 图片数量 0。
- `git diff --check` 通过。
- 本次仅新增 Test 4 Passage 3 的 `passage-3.json`、全新双语精读和本自检文件；未修改 shared、pages.json、raw.md、其他 Test 或其他 Passage。

## 首轮独立盲审修订回归

- `P3-SRC-01`：五个 `pageTexts` 已分别补入物理页 94、95、96、97、129 底部的印刷页码 `96`、`97`、`98`、`99`、`131`。
- `P3-VOC-01`：第 5 句已补 `come first` (B1)。
- `P3-VOC-02`：第 16 句已补本次出现的 `allow someone to do` (B1)，不再依赖第 6、28 句的标注。
- `P3-VOC-03`：第 11、18、31 句的三次 `so ... that ...` 均已分别补为 B1。
- `P3-VOC-04`：第 29 句已补完整正式假设结构 `If you were to ask ..., then ...` (B2)。
- `P3-CEFR-01`：第 4 句 `itself`、第 28 句 `information` 均已改为“基础词（A1/A2）”。
- `P3-TR-01`：第 22 句改译为“你属于那些我们无法使之成为城镇居民的人之一”，明确 `whom` 是 `turn` 的宾语。
- 英文保护回归：JSON 与 Markdown 仍各 32 句，逐字符差异 0；标题、Port-Royal 引文、紧排音素串、土耳其词、苏美尔词、曲引号/曲撇号和 en dash 均未变化。
- 题库保护回归：仍为 3 个 question sections、14 道题、Q27–40 连续，答案映射未变化。
- 版式保护回归：仍为五个固定 H2、3 个 A 层、3 条 Cambridge Dictionary 链接、0 张图片。
- 三个目标文件 `git diff --check` 通过；未修改 shared、pages.json、raw.md、其他 Test 或其他 Passage。

生成者修订自检结论：`P3-SRC-01`、`P3-VOC-01` 至 `P3-VOC-04`、`P3-CEFR-01`、`P3-TR-01` 已逐项处理，当前未发现遗留问题，交原独立审计者针对性复核。
