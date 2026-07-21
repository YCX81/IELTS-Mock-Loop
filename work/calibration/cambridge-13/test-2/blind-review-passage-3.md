# Cambridge IELTS 13 Test 2 Passage 3 独立盲审报告

## 审计范围与依据

- 生成稿：data/generated/intensive-reading/cambridge-13-15/Cambridge-IELTS-13-Test-2-Passage-3-双语精读.md
- 结构化稿：work/calibration/cambridge-13/test-2/passage-3.json
- 唯一文字基准：work/calibration/cambridge-13/test-2/source-pages.json 的物理页47–51、120
- 视觉基准：data/Cambridge-IELTS-13.pdf 物理页47–51、120，按300 DPI渲染后逐页查看。
- 正文页：47–48；题目页：49–51；官方答案页：120。
- 审计者未参与本篇生成，且未直接修改生成稿或 passage-3.json。

## 初审发现

初审发现3组实际问题：

1. BR-P3-01：14个句位存在重复 B1+ 词汇漏讲。
2. BR-P3-02：risk doing、tangible、seemingly、perceive、skateboarding 存在明确 CEFR 误标。
3. BR-P3-03：第23句把 to incorporate ... 错说成修饰 resources，而非说明投入资源的目的。

生成者完成修正后，本审计者已逐项针对性复核。

## 针对性复核

### BR-P3-01｜已修正

原报告列出的句位均已补齐：

- 第2句：manager、trend
- 第3句：trend、manager
- 第4句：trend
- 第7句：manager、trend
- 第10句：nearly
- 第17句：consumer
- 第22句：trend
- 第23句：trend
- 第26句：sports kit
- 第27句：category、consumer、trend
- 第32句：point；原有 video game 保持
- 第33句：video game
- 第35句：trend
- 第38句：trend、social

每项均在所在句重新独立解释并标注等级，未再以其他句已经讲过为由省略。

### BR-P3-02｜已修正

- 第11句 risk doing：已改为 B2。
- 第17句 tangible：已改为 C2。
- 第23句 seemingly：已改为 C1。
- 第29句、第38句 perceive：均已改为 C1。
- 第31句 skateboarding：已改为“基础词（A1/A2）”，符合 A1/A2 专用格式。

未发现修正引入新的明显 CEFR 错误。

### BR-P3-03｜已修正

第23句现说明 to incorporate ... 是“投入资源要实现的目的”，不再误判为修饰名词 resources。句法关系准确。

## 全量回归结果

### 正文

- 段落数：8。
- 完整英文句数：38。
- 编号：1–38连续。
- passage-3.json 的正文与物理页47–48归一化文本逐字符一致。
- Markdown 的38个编号句与 passage-3.json 逐字符一致。
- 无漏句、合句、倒序或英文漂移。
- 38句均具备自然中文翻译、主干/修饰/表达作用和词汇讲解。
- 翻译与句法复查未发现遗留实质错误。

### 题目与答案

三组题目完整：

1. Questions 27–31：单项选择，A–D全部选项及翻译齐全。
2. Questions 32–37：公司匹配；A Coach、B Tesco、C Nike、D iToys 全部公司标签及中文齐全，重复使用字母的 NB 指令完整。
3. Questions 38–40：句子结尾匹配，A–D全部结尾及翻译齐全；题面 counteract-and-affirm strategy 忠实保留。

Questions 27–40 共14题。总体指令、分组指令、题干、选项/公司标签、官方答案、原文证据、定位逻辑和干扰项排除均完整。

答案与物理页120一致：

- 27 D；28 C；29 A；30 D；31 D
- 32 D；33 C；34 B；35 A；36 C；37 A
- 38 B；39 C；40 D

### A层、链接与图片

- A层深挖：3。
- Cambridge Dictionary 链接：3。
- 图片：0。
- 三处A层的原有内容和计数未被本轮修正破坏。

## 最终结论

**最终复核通过，零遗留问题。**

BR-P3-01、BR-P3-02、BR-P3-03 均已关闭；正文英文、题库内容、官方答案和硬性计数回归全部通过。
