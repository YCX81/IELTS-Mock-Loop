# Cambridge IELTS 11 Test 4 Passage 3 独立盲审

## 审计结论

**结论：未通过；7 个实际问题待修，当前不能记为零遗留。**

审计对象：

- 原书物理页 94–97；官方答案物理页 129
- `work/calibration/cambridge-11/test-4/passage-3.json`
- `data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-11-Test-4-Passage-3-双语精读.md`

## 已核准项目

- A–F 共 32 个完整英文句子，数量、段落归属、先后顺序正确；精读的 32 个引用句与 JSON 逐字符一致。
- 标题 `‘This Marvellous Invention’`、Port-Royal 长引文、音素序列 `p,f,b,v,t,d,k,g,sh,a,e`、土耳其语 `şehirlileştiremediklerimizdensiniz`、苏美尔语 `munintuma’a` 均保留正确。
- 所检查正文中的弯引号、撇号、冒号及 en dash/em dash 未发现逐字错误。
- 题 27–40 全部存在；总体指令、三组题型指令、i–vii headings、A–G summary 选项、YES/NO/NOT GIVEN 标签完整。
- 官方答案与物理页 129 一致：27 vi，28 iv，29 ii，30 vii，31 i，32 v，33 E，34 G，35 B，36 F，37 NO，38 YES，39 NOT GIVEN，40 YES。
- 各题证据、定位与干扰项排除未发现事实性错误；第 39 题正确区分“表达长度”和“表达清晰度”。
- 文档恰有 5 个 H2、3 个 A 层、3 条 Cambridge Dictionary 链接、0 张图片。三个 A 层均有至少 2 个双语迁移例句和近义边界。
- 翻译和句法分析整体准确，除下列 `P3-TR-01` 外未发现影响理解的问题。

## 待修问题

### P3-SRC-01｜校准 JSON 的 `pageTexts` 漏掉印刷页码

物理页 94、95、96、97、129 底部分别印有页码 `96`、`97`、`98`、`99`、`131`，但对应五个 `pageTexts` 均在页码前结束。既然该字段承担逐页人工校准文本，不能把可见文字无说明地删去。请补齐五个页码，或在数据规范明确排除 folio；按本任务“逐字符一致”的口径应补齐。

### P3-VOC-01｜第 5 句漏讲 `come first`

原句 `because it came first` 中的 `come first` 是独立固定表达，意为“最先出现/居首”，但本句词汇栏只列了 `foremost` 和 `not just because`。A 层近义边界虽提到该短语，也不能替代它在本次出现处的独立 CEFR 标注。

### P3-VOC-02｜第 16 句漏掉重复出现的 `allow someone to do`

第 16 句主干正是 `allows ... everybody ... to tie ...`。同一表达已在第 6 句和第 28 句标为 `(B1)`，唯独第 16 句未列；这直接违反“每一次重复出现也必须再次独立讲解”。

### P3-VOC-03｜三次 `so ... that ...` 均未独立标级

第 11、18、31 句都出现 B1+ 结果/程度结构 `so ... that ...`。三处句法栏均解释了作用，但词汇/短语栏均没有独立 CEFR 标签。句法说明不能替代本句所有 B1+ 短语的逐项标级；三处都应分别补列。

### P3-VOC-04｜第 29 句假设结构未独立标级

`If you were to ask ..., then ...` 是正式的假设结构，句法栏识别正确，但词汇/表达栏未给该完整结构 CEFR 标签。应把它作为 B2 级表达独立列出，而不是只标 `have to` 等局部词项。

### P3-CEFR-01｜两个基础词被误标为 B1

- 第 4 句代词 `itself` 属基础词，却标成 `(B1)`；应按规则写作 `基础词（A1/A2）`，或不收入 B1+ 清单。
- 第 28 句普通义 `information` 属基础词，却标成 `(B1)`；应按规则写作 `基础词（A1/A2）`，或不收入 B1+ 清单。这里没有足以提高等级的特殊术语义。

### P3-TR-01｜第 22 句中文代词关系含混

`you are one of those whom we can’t turn into a town-dweller` 译为“你是我们无法变成城镇居民的那些人之一”，中文会被读成“我们无法把自己变成城镇居民”。应明确 `whom` 是 `turn` 的宾语，例如：“你属于那些我们无法使之成为城镇居民的人之一。”

## 复核门槛

修订后须由本审计者针对上述 7 个 ID 复核。只有 `P3-SRC-01`、`P3-VOC-01` 至 `P3-VOC-04`、`P3-CEFR-01`、`P3-TR-01` 全部关闭，且修订没有改变已核准的 32 句原文、27–40 题库、3 个 A 层、3 条链接和 0 图片，方可报告“零遗留问题”。

## 第一次针对性复核（修订后）

复核者：原独立审计者。复核范围仅为上述 7 个问题 ID 及规定的回归项；本轮未修改 Passage 3 JSON 或精读正文。

### 逐 ID 关闭结果

- **P3-SRC-01：已关闭。** `pageTexts` 的物理页 94、95、96、97、129 现分别以印刷页码 `96`、`97`、`98`、`99`、`131` 结尾，五处均已补齐。
- **P3-VOC-01：已关闭。** 第 5 句已独立补列 `come first` `(B1)`，释义为“最先出现、居首”。
- **P3-VOC-02：已关闭。** 第 16 句已再次独立补列 `allow someone to do` `(B1)`；第 6、16、28 句的三次出现均各自保留讲解。
- **P3-VOC-03：已关闭。** 第 11、18、31 句均已在各自词汇行独立补列 `so ... that ...` `(B1)`，三次没有合并省略。
- **P3-VOC-04：已关闭。** 第 29 句已独立补列完整正式假设结构 `If you were to ask ..., then ...` `(B2)`。
- **P3-CEFR-01：已关闭。** 第 4 句 `itself` 与第 28 句 `information` 均改为 `基础词（A1/A2）`，不再误标为 B1。
- **P3-TR-01：已关闭。** 第 22 句现译为“你属于那些我们无法使之成为城镇居民的人之一”，已明确 `whom` 是 `turn` 的宾语，不再产生中文代词歧义。

### 回归检查

- JSON 仍为 A–F 六段、32 句；精读正文仍有 32 个英文引用句，与 JSON 逐句、逐序、逐字符一致，差异数 0。
- 标题 `‘This Marvellous Invention’`、Port-Royal 引文、音素序列 `p,f,b,v,t,d,k,g,sh,a,e`、土耳其语 `şehirlileştiremediklerimizdensiniz`、苏美尔语 `munintuma’a` 均仍完整存在；未发现特殊字符回归。
- 题库仍为 3 个 question sections、14 题，题号 27–40 完整；答案仍为 27 vi，28 iv，29 ii，30 vii，31 i，32 v，33 E，34 G，35 B，36 F，37 NO，38 YES，39 NOT GIVEN，40 YES。
- H2 仍恰好 5 个；A 层深挖仍恰好 3 个；Cambridge Dictionary 链接仍恰好 3 条；图片仍为 0 张。
- `git diff --check` 对 Passage 3 JSON 与精读正文通过。

### 最终结论

**P3-SRC-01、P3-VOC-01、P3-VOC-02、P3-VOC-03、P3-VOC-04、P3-CEFR-01、P3-TR-01 全部关闭。最终遗留问题数：0。**
