# Cambridge IELTS 13 Test 3 Passage 2 独立盲审报告

## 审核范围与依据

- 审核对象：`Cambridge-IELTS-13-Test-3-Passage-2-双语精读.md`、`passage-2.json`。
- 唯一内容依据：`source-pages.json` 中物理页 63–66 与官方答案页 122；未读取或参考任何旧精读正文。
- 来源页范围：正文物理页 63–64，题目物理页 65–66，官方答案物理页 122。

## 已通过项目

- 正文为 A–F 六段，共 37 个完整句子；段落、句子数量与顺序正确。
- 37 句英文与校准来源逐字符一致；`bodyParagraphs`、flat `sentences` 与精读英文一致。
- 总体指令与 Questions 14–17、18–23、24–26 三组题型指令完整。
- Questions 14–26 共 13 题，研究者 A–C、摘要题面、段落标签与官方答案均齐全。答案依次为：14 B、15 C、16 A、17 B、18 recording devices、19 fathers / dads、20 bridge hypothesis、21 repertoire、22 (audio-recording) vests、23 vocabulary、24 F、25 A、26 E。
- 原书异常已忠实保留：正文实际为 A–F 六段，作答指令原文确实写 `A–E`，官方答案第24题仍为 `F`；JSON 和精读均未擅自修正原书。
- 三个 A 层均具备本句义、字面画面或构词/来源、与普通说法的差别、语气/使用边界、文章作用、至少两条双语迁移例句及三个近义表达边界。
- 硬性计数正确：A 层 3 个、Cambridge Dictionary 链接 3 条、图片 0 张。
- JSON 元数据正确：`passageNumber: 2`、`status: manually_calibrated`、`sourcePages: [63,64,65,66]`、`answerKeyPage: 122`。

## 初审问题清单

### BR-T3-P2-01｜重复 B1+ 词项仍有漏讲

以下词项出现在相应句中，但没有进入该句的“词汇与表达”：

- Sentence 4：`raised in bilingual homes` 中的 `raise`（“抚养、养育”，B2）未讲。
- Sentence 22：`seem to`（B1）与 `among`（B1）未讲。
- Sentence 35：`simply`（B1，“只是、仅仅”）未讲。

修正要求：在每个对应句独立补入，不得以其他句已出现或属于常用词为由省略。

### BR-T3-P2-02｜若干明确 CEFR 误标

以下条目当前标成 B1，但属于 A1/A2；若保留，只能使用“基础词（A1/A2）/基础表达（A1/A2）”格式：

- Sentence 4：`information`。
- Sentence 14：`idea`、`practice`。
- Sentence 15：`scientist`、`collect`、`conversation`、`language`。
- Sentence 18：`listen to`、`more than`。
- Sentence 22：`tool`。
- Sentence 23：`repeating`（来自基础动词 `repeat`）。
- Sentence 26：`longer`（`long` 的比较级）。
- Sentence 34：`practice`。

另有一项反向误标：Sentence 14 的 `repertoire` 及 `a wider repertoire of` 当前标为 C1；该低频正式词应标为 C2，且 A 层标题词的等级应与句内词表一致。

### BR-T3-P2-03｜Sentence 13 对 `less familial language` 的译法产生数量歧义

当前译文为“父亲使用较少家庭化的语言”。这里 `less familial` 修饰语言的家庭化/熟悉程度，不是说父亲使用语言的数量较少。当前中文容易被理解成“少说一些家庭化语言”。

建议改为：“父亲使用不那么家庭化的语言，为孩子通向他们将在公共场合听到的言语搭建一座桥梁。”主干分析与 `familial language` 释义也应同步明确这一程度关系。

### BR-T3-P2-04｜Sentence 27 的 `which` 指向被扩大

原句为 `like smiling or lip moving, which approximates sound making`。单数谓语 `approximates` 就近指向 `lip moving`，不是同时概括 smiling 与 lip moving。当前译文写“这些动作近似于发声”，结构分析也写 `which` 回指“lip moving 等反应”，把微笑一并纳入了“近似发声”。

建议译为：“婴儿声音还在聆听的婴儿中引发更多反应，例如微笑或嘴唇活动；后者近似发声动作。”结构分析同步写明 `which` 就近回指 `lip moving`。

### BR-T3-P2-05｜Sentence 36 把脑部激活误写成“处理激活”

当前译文为“较大婴儿的大脑在处理非母语声音的运动激活时……更为费力”，容易理解成大脑把“激活”当作处理对象。原文 `worked harder at the motor activations of non-native sounds` 比较的是非母语声音与母语声音所对应的运动区激活强度/活动程度。

建议改为：“较大婴儿的大脑对非母语声音产生的运动区激活，比对母语声音产生的激活更强/更为活跃。”结构分析也应避免写成“处理运动激活”。

### BR-T3-P2-06｜Questions 18–23 的共享摘要中，第21题中文空格位置不完整

JSON `questionSections[1].summaryZh` 与精读“摘要翻译”当前写：

`会扩展婴儿能够练习的言语类型21__________。`

这里缺少连接“类型”与答案 `repertoire` 的“的”，中文题面不完整；而单题 `promptZh` 已正确写成“言语类型的________”。

修正要求：共享摘要的 JSON 与 MD 同步改为类似“会扩展婴儿能够练习的言语类型的21__________”，保持第21题空格和译义一致。

## 初审结论

本轮不是零问题：共发现 6 组可操作问题。正文英文、段落结构、全部题目与官方答案、A–E/F 原书异常、三个 A 层及 3/3/0 硬性计数均正确；遗留集中在词汇覆盖、CEFR、三处正文译文/句法指向和一处摘要中文题面。

## 最终针对性复核

生成者修正后，本审计者仅做针对性复核，未修改 Passage 2 稿件。复核结果如下：

- [x] **BR-T3-P2-01**：Sentence 4 的 `raise`、Sentence 22 的 `seem to` 与 `among`、Sentence 35 的 `simply` 均已在所在句独立补讲，等级与语境义正确。
- [x] **BR-T3-P2-02**：报告列出的 A1/A2 项均已改用“基础词/基础表达（A1/A2）”格式；Sentence 14 的 `repertoire` 与 `a wider repertoire of` 均已改为 C2，A 层标题同步标明 C2。
- [x] **BR-T3-P2-03**：Sentence 13 已改为“使用不那么家庭化的语言”，句法明确 `less` 修饰 `familial` 而非语言数量。
- [x] **BR-T3-P2-04**：Sentence 27 译文使用“后者”限定 `lip moving`，句法明确单数 `approximates` 就近回指 `lip moving`，未再把 smiling 纳入。
- [x] **BR-T3-P2-05**：Sentence 36 已改为比较非母语声音与母语声音产生的运动区激活强度，并明确不是把“激活”写成大脑处理对象。
- [x] **BR-T3-P2-06**：JSON `summaryZh` 与 MD 共享摘要均已补为“言语类型的21__________”，与单题译文及答案 `repertoire` 一致。

回归检查：

- 正文仍为 A–F 六段、37 句；JSON 与 MD 英文均与物理页 63–64 的校准来源逐字符一致。
- Questions 14–26 仍为 13 题，题号连续；官方答案仍依次为 B、C、A、B、recording devices、fathers/dads、bridge hypothesis、repertoire、(audio-recording) vests、vocabulary、F、A、E。
- 原书异常保持不变：正文标签为 A–F，原指令作答范围仍为 A–E，Question 24 官方答案仍为 F，且说明完整。
- A 层仍为 3 个，Cambridge Dictionary 链接仍为 3 条，图片仍为 0 张。

**最终结论：BR-T3-P2-01～06 全部关闭；遗留问题数量：0。**
