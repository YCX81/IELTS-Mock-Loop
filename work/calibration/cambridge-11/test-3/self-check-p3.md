# Cambridge IELTS 11 Test 3 Passage 3 生成者自检

## 来源核对

- 已逐页人工查看原始分辨率渲染：PDF 物理页 71–74；官方答案物理页 127。
- 正文页：71–72；题目页：73–74；官方答案页：127。
- 物理页 71 的 D 段末句跨至物理页 72，已合并为一个完整句子。
- 已人工恢复/确认 OCR 易错处：Section C 标签、`specialized`、`colorful`、`analyzed`、`naïve`、curly quotation marks、en dashes、方括号 `[in mathematics]`，以及 `logical, yet intuitive, style` 的标点与空格。
- 未读取或沿用旧精读正文。

## 结构化 JSON

- 状态：`manually_calibrated`。
- 7 个 sections（A–G），37 个完整英文句子。
- 2 个 question sections，14 道题，完整覆盖 27–40。
- Questions 27–34：全部 8 条 matching-information 陈述、A–G 标签、重复使用字母说明齐全。
- Questions 35–40：全部 6 条句子填空、`ONE WORD ONLY` 限制齐全。
- 每题均含官方答案、可接受答案、证据、定位和干扰项依据。
- 官方答案已对照物理页 127：27 D，28 B，29 G，30 C，31 B，32 E，33 A，34 F，35 beginner，36 arithmetic，37 intuitive，38 scientists，39 experiments，40 theorems。
- `sourcePages` 为 71–74；`passagePages` 为 71–72；`questionPages` 为 73–74；`answerKeyPage` 为 127。
- `pageTexts` 已包含校准后的 71–74 与答案页 127 文本。

## 全新精读

- 正文句数：37；编号 1–37；A–G 顺序完整。
- Markdown 的 37 个英文句子与 `passage-3.json` 逐字符比较：0 差异。
- 每句均含中文翻译、主干/修饰/表达作用和逐句词汇讲解。
- 已按逐次出现原则重新复查 B1+ 词项；同句重复的 `opera singer`、`publish` 已分别标明第 1/2 次，并补正 `beauty` (B1)、两次 `experiment` (B1)、`throughout` (B2) 与 `simply` (B2)。
- A1/A2 项仅使用“基础词（A1/A2）”或“基础表达（A1/A2）”，未使用 `(A1)` / `(A2)` 等禁用标签。
- 恰好 3 个“A层深挖”、3 条 Cambridge Dictionary 链接、0 张图片。

## 题目精讲

- 位于正文精读之后。
- 含总体指令、两组题型完整指令和中文翻译。
- Questions 27–34 含 A–G 七个 section 标签的内容翻译/概括，每题均有题干翻译、答案、原文证据、定位逻辑和干扰段排除。
- Questions 35–40 每题均有题干翻译、官方答案、证据、定位、词性/语法逻辑、干扰项排除和一个词限制；官方未给额外变体。
- 答案汇总完整覆盖 27–40。

## 自动计数回归

- JSON 可成功解析。
- sections：7。
- JSON sentences：37。
- Markdown body quote sentences：37。
- 英文逐字符差异：0。
- question sections：2。
- questions：14。
- A层深挖：3。
- Cambridge Dictionary links：3。
- images：0。

## 边界检查

- 本次仅新增 `passage-3.json`、Passage 3 全新精读和本自检文件。
- 未修改共享题库、pages.json、raw.md、其他 Test 或其他 Passage。

## 独立盲审后修订与回归

- M1：Questions 27–40 的 `location` 已统一为“Section A–G 内句号 + 全文句号”，14 个定位均逐项复核。
- M2：Q37 的主证据已改为 A 段第 8 句（全文第 8 句）的 `its logical, yet intuitive, style of thinking`，证据可直接抄出官方答案 `intuitive`；C 段名词 `intuition` 仅保留为概念补充说明。
- M3：三个 A 层深挖均已补足本句义、字面/结构画面、普通说法差别、语气边界、篇章作用、2 个中英双语迁移例句及 3 个近义表达边界；总数仍恰好为 3 个 A 层和 3 条 Cambridge Dictionary 链接。
- M4：第 8 句补 `beauty` (B1)；第 23、25 句的 `experiment` 均改为 B1；第 26 句 `throughout` 改为 B2；第 27 句补 `simply` (B2)。全篇逐句回扫后未发现上述问题的同类遗留。
- M5：五个顶级功能章节精确改为 `01 逐句精读`、`02 题目与选项精讲`、`03 B1+ 词汇深讲总表`、`04 IELTS 阅读提醒`、`05 答案汇总`；英文原题作为第一节前的正文导语保留。
- m1：第 15 句 `notorious gap` 改译为“众所周知、饱受诟病的鸿沟”，保留负面评价且符合中文搭配。
- 英文保护回归：JSON 37 句、Markdown 37 句，逐字符差异为 0；题库仍为 2 个 question sections、14 道题；版式仍为 3 个 A 层、3 条 Cambridge 链接、0 张图片。
- 已重新运行 `node work/integrate-c11-t3.mjs`，集成成功；`node scripts/validate-c11-t3.mjs --shared` 通过；目标文件 `git diff --check` 通过。

生成者修订自检结论：M1–M5、m1 已逐项处理，当前未发现遗留问题，交原独立审阅者做针对性复核。
