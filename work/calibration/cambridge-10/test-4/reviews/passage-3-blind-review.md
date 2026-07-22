# Cambridge IELTS 10 Test 4 Passage 3 首轮交叉盲审

## 审计范围与来源

- 审计对象：`work/calibration/cambridge-10/test-4/passage-3.json`
- 审计对象：`data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-10-Test-4-Passage-3-双语精读.md`
- 唯一原书依据：`data/Cambridge-IELTS-10.pdf` 物理页 89–92、官方答案物理页 150。
- 已独立逐条查看原始像素渲染。物理页 89–90 按左栏后右栏人工复核；第 3 段在页 89 跨栏，第 5 段跨 89–90 页，第 8 段在页 90 跨栏，当前正文顺序正确。

## 首轮结论

首轮发现 **4 类、33 个可执行问题**：28 个本句 B1+ 覆盖缺口、3 个明显 CEFR 偏低、1 个句法层级问题、1 个题目证据问题。除下列问题外，未发现正文转录、题干选项或官方答案的来源性错误。

### 1. 二十八处本句 B1+ 词项覆盖缺口

强制规则要求每一次出现的 B1+ 词或短语都在本句再次独立讲解。以下项目出现在英文中，但对应句的“词汇与短语”没有收录；即使此前句子已讲过，也不能据此豁免：

1. 句 4：`more and more (B1)`。
2. 句 7：`born not made (B2)`、重复出现的 `throwback (C1，进化生物学专业词)`、`state (B1)`。
3. 句 8：`come to the opposite conclusion (B2)`；当前只有 `opposite conclusion`，未覆盖完整谓语表达。
4. 句 9：重复出现的 `evolution (B2，生物学专业词)`、`be unable to (B1)`、`in the ranks of (C1)`。
5. 句 10：重复出现的 `biologist (B2，生物学专业词)`、`there is no reason why (B2)`、重复出现的 `run backwards (B2)`。
6. 句 11：重复出现的 `evolution (B2，生物学专业词)`。
7. 句 12：重复出现的 `Dollo’s law (C1，进化生物学专业词)`。
8. 句 14：`a full set of (B1)`。
9. 句 24：`gene (B2，遗传学专业词)`。
10. 句 25：`up to (B1)`。
11. 句 28：`except for (B1)`、`famously (B2)`。
12. 句 29：`alone (B1)`。
13. 句 30：`however (B1)`、重复出现的 `lose the ability to (B1)`。
14. 句 34：学术语境的 `paper (B1)`。
15. 句 35：重复出现的 `lizard (B2，动物学专业词)`。
16. 句 38：重复出现的 `occur (B1)`。
17. 句 40：`simply (B1)`。
18. 句 41：重复出现的 `possibility (B1)`、重复出现的 `somehow (B1)`。
19. 句 43：`within (B1)`。

### 2. 三处明显 CEFR 偏低

1. 句 7 的 `connotation` 当前标为 C1；应上调为 `connotation (C2)`。
2. 句 22 的 `likelihood` 当前标为 B2；应上调为 `likelihood (C1)`。
3. 句 44 的 `womb` 当前标为 `B2，解剖学专业词`；应上调为 `C2，解剖学专业词`。

### 3. 句 19 的不定式层级说明不准确

- 当前说明：`to use 与 to put 表目的`。
- 实际结构：`decided` 的补足语是 `to use genetics`，而 `to put a number on ...` 是使用遗传学的目的；两个不定式并非同层并列。
- 建议明确写成“主干为 Raff and colleagues decided to use genetics；to put a number on ... 作目的状语，说明借助遗传学所要完成的量化任务”。

### 4. 第 33 题“原文证据”不是原文引句

- 当前证据：`Lombroso accepted physical throwbacks; Dollo proposed that evolution was irreversible.`
- 问题：前半句是审题者概括，原文没有 `Lombroso accepted physical throwbacks` 这一句；字段和精读栏目都标为“原文证据”，应使用校准正文中的逐字符原句或明确的原句片段。
- 建议直接引用句 7 中关于 Lombroso 的原句片段与句 9 的 `he proposed that evolution was irreversible`，同时保持定位为 Paragraphs 2–3 / overall sentences 7–9。

## 已验证通过的项目

- 导语句加正文共 **48** 个编号单位，编号连续；前 48 个 `原文` 单元与校准 JSON 按顺序拼接后逐字符一致，无合并、遗漏、倒序或跨栏错接。题目模块另有 1 条总体指令使用 `原文` 标签，不计入正文句数。
- 标题、副标题、10 个正文段落及标点与物理页 89–90 一致；`sourcePages=[89,90,91,92]`、`bodyPages=[89,90]`、`questionPages=[91,92]`、`answerKeyPage=150` 正确。
- `pages.json` 与 `raw.md` 全书逐页逐字符一致；Passage 3 JSON 内嵌的 89–92 页文本也分别与 `pages.json` 对应页逐字符一致。
- A 层深挖准确为 **3**，分别为 `evolutionary throwback`、`irreversible`、`beg to differ`；Cambridge Dictionary 链接准确为 **3**；Markdown 图片为 **0**，JSON `images=[]`。
- Questions 27–31 的两条题型指令、五道题干及全部 A–D 选项与物理页 91 一致；每题答案、定位和三项错误选项排除均齐全。
- Questions 32–36 的两条题型指令、五个句首及 A–G 七个结尾与物理页 92 一致；每题均覆盖其余六个干扰项。
- Questions 37–40 的总指令、YES / NO / NOT GIVEN 三条定义及四道陈述与物理页 92 一致；每题均覆盖另外两种判断的排除依据。
- 官方答案与物理页 150 完全一致：`27 C, 28 D, 29 C, 30 B, 31 A, 32 F, 33 G, 34 A, 35 B, 36 D, 37 NOT GIVEN, 38 YES, 39 NO, 40 YES`。
- 题号 27–40 连续完整，共 3 个题组、14 道题；全部题干、选项和结尾均有中文翻译。

## 针对性复核入口

修复后由本审计者重点复核上述 28 个词项、3 个 CEFR、句 19 句法说明和第 33 题证据；同时回归检查 48 句逐字符一致、题目数据、3 A 层、3 链接、0 图片及页面镜像一致性。

---

## 修订后针对性复核

本次由首轮同一审计者逐项复核，首轮 **4 类、33 个问题已全部修复，零遗留问题**：

- 28 个 B1+ 词项均已补入各自句子的“词汇与短语”，包含全部报告点名的重复项；逐句核对未见漏补、错句或用前句讲解替代本句讲解。
- `connotation` 已由 C1 上调至 C2，`likelihood` 已由 B2 上调至 C1，`womb` 已由 B2 上调至 `C2，解剖学专业词`。
- 句 19 已明确区分层级：`to use genetics` 是 `decided` 的补足语，`to put a number on ...` 是目的状语，不再把两个不定式写成同层关系。
- 第 33 题的 JSON 与精读题解已同步替换为句 7 和句 9 的逐字符原文证据，不再使用 `Lombroso accepted physical throwbacks` 这一概括性改写；答案 G、定位和干扰项未受影响。

回归核验结果：

- 48 个正文英文单位编号连续，与校准 JSON 按顺序拼接后逐字符一致，无增删、换序或跨栏回归。
- 题组仍为 `27–31 / 32–36 / 37–40`，共 3 组、14 题；五道单选题各有 A–D 四项，句尾配对保留 A–G 七项，三组指令数量分别为 2、2、5。
- 官方答案仍为 `27 C, 28 D, 29 C, 30 B, 31 A, 32 F, 33 G, 34 A, 35 B, 36 D, 37 NOT GIVEN, 38 YES, 39 NO, 40 YES`；精读中 14 道题号连续完整。
- A 层深挖 **3**、Cambridge Dictionary 链接 **3**、Markdown 图片 **0**、JSON `images=[]`；`pages.json` 与 `raw.md` 仍全书逐页逐字符一致。

最终状态：**通过，零遗留问题。**
