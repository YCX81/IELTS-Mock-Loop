# Cambridge IELTS 13 Test 2 Passage 3 生成者自检

- 唯一文本来源：`source-pages.json` 物理页 47–51、答案页 120；未读取旧精读或 recovered-source。
- 正文物理页：47–48；题目物理页：49–51；官方答案页：120。
- 正文段落：8；完整句子：38；顺序连续，无合并或遗漏。
- 逐字符核对：对源页正文消除 PDF 视觉换行、页眉页脚并还原跨行 `mid-2008` 后，与 `bodyParagraphs` 拼接文本长度同为 6125 字符，区分大小写比较完全一致。
- MD 正文核对：38/38 个 JSON 句子均以完整、逐字符一致的英文引文出现；数字标题 1–38 连续。
- 每句项目：均含自然中文翻译、主干/修饰关系/表达作用，以及本句 B1+ 词语（重复出现处重新列出并逐项标级）。A1/A2 未冒充 CEFR 高阶项。
- A层深挖：3（`adopt a wait-and-see approach`、`cede to rivals the opportunity`、`reinvigorate the category`）。
- Cambridge Dictionary 链接：3；已实际联网检索，链接分别指向 `wait-and-see`、`cede`、`reinvigorate`。
- 图片：0；无正文页、题目页或答案页截图。
- 题库：3 个 question sections，14 道题，题号连续覆盖 27–40。
- 指令与题面：总体指令、三组题型指令、全部题干、Q27–31全部 A–D 选项、Q32–37全部公司标签、Q38–40全部句尾选项均已在 JSON 和 MD 中逐项覆盖。
- 官方答案：`D,C,A,D,D,D,C,B,A,C,A,B,C,D`，与答案页 120 完全一致。
- 解析：每题均含原文证据、段落/句子定位和干扰项排除；题面异常 `counteract-and-affirm` 忠实保留，并与正文策略名 `counteract and reaffirm` 区分说明。
- JSON 解析、计数和 MD 包含性检查：全部通过，零生成者自检遗留问题。

- 顶层兼容字段复检：`passageNumber` 与 `passage` 均为 3；`overallInstructionZh` 与 `instructionZh` 逐字符一致。
- 展平结构复检：顶层 `sentences` 共 38 条，编号 1–38，每条均含 `number`、`text`、`paragraph`、`sourcePage`，并与 `bodyParagraphs` 展开结果逐项一致；顶层 `questions` 共 14 条，题号 27–40，与 `questionSections` 展开后的题干、答案逐项一致。原有 8 个 `bodyParagraphs` 和 3 个 `questionSections` 均保留。

## 盲审问题修正后的针对性自检
- BR-P3-01：报告列出的14个句位已逐项复查；manager、trend、nearly、consumer、sports kit、category、point、video game、social 等重复 B1+ 项均已在对应句独立补讲。第32句原已含 `video game`，本轮保留并补入遗漏的 `point`，未重复制造词条。
- BR-P3-02：`risk doing` 已改为 B2，`tangible` 改为 C2，`seemingly` 改为 C1，第29/38句 `perceive` 均改为 C1；`skateboarding` 改为“基础词（A1/A2）”。旧错误标注检索结果均为0。
- BR-P3-03：第23句 `to incorporate ...` 已改释为“说明投入资源要实现的目的”，不再误称为修饰 resources。
- 回归检查：38/38个英文句子仍与JSON逐字符一致；Q27–40仍为14题，答案仍为 `D,C,A,D,D,D,C,B,A,C,A,B,C,D`；A层/链接/图片仍为3/3/0。
- `passage-3.json` 不含逐句词汇、翻译或句法讲解字段，因此上述修正仅涉及MD；JSON正文与题库保持不变并复检通过。
- 生成者针对性自检结论：BR-P3-01至BR-P3-03均已处理，等待原审计者复核。
