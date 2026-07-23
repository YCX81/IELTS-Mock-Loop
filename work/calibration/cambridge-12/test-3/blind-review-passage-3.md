# Cambridge IELTS 12 Test 3 Passage 3 独立盲审

## 审计范围与初审结论

- 审计对象：`work/calibration/cambridge-12/test-3/passage-3.json` 与 `Cambridge-IELTS-12-Test-3-Passage-3-双语精读.md`。
- 对照范围：正文物理页 66–67、题目物理页 68–70、官方答案物理页 121，以及 Test 3 原分辨率校准页记录。
- 本审计者未参与 Passage 3 生成；本轮只读核查，没有修改 Passage 3 JSON 或精读正文。
- 初审结论：正文英文、句序、题号和官方答案正确，但题目选项展示、证据原文性、干扰项完整性、重复词/CEFR及两处翻译仍有实际问题，修正前不能判定通过。

## 已核对且正确的项目

- 正文六个自然段，共 38 个完整英文句子；Markdown 句 1–38 与 `section.sentences` 逐字符一致、顺序一致，无合并或遗漏。
- 题号连续覆盖 27–40，共 14 题；三组指令及摘要 `NO MORE THAN TWO WORDS` 限制正确。
- 官方答案与物理页 121 一致：`dopamine / pleasure / caudate / anticipatory phase / food / B / C / A / B / D / F / B / E / C`。
- 正文页 66–67、题目页 68–70、答案页 121 的定位正确。原书页眉印刷为 `Test 7`；JSON 的 `printedTest: 7` 及相关 `pageTexts` 保留正确，不应改成 `Test 3`。
- 三个 A 层分别为 `stir / turn out / arise out of`，共有 3 条 Cambridge Dictionary 链接，0 图片，无 `undefined` 或占位释义。

## 必须修正的问题

### 1. Questions 32–36 在精读中完全漏掉 A–D 选项及中文翻译

第 32–36 题每题都只留下“全部选项：”空行，随后直接给答案。原书物理页 69 的四个选项虽存在于 JSON，但没有写入 Markdown，也没有任何中文翻译。这违反“每道题干、所有选项及翻译、答案、证据、定位、干扰项”要求。

修正要求：第 32–36 题分别完整列出本题 A、B、C、D 原文和逐项中文翻译；JSON 中也应把纯字符串选项补成带 `label / text / translation` 的结构，或以项目既有规范保存等价完整字段。

### 2. Questions 37–40 没有完整呈现 A–F 英文句尾

本组题型开头只列了 A–F 的中文意思，没有列原书英文；每题又只写 `A｜B｜C｜D｜E｜F（含义见本组题型标签）`。因此最终精读中找不到 A–F 的完整英文句尾，也不能逐项中英对照。JSON 的 `questionSections.endings` 和各题 `options` 同样没有 translation 字段。

修正要求：至少在组题标签处完整列出 A–F 的英文原文与逐项中文翻译；每题解析须能明确对应全部选项。结构化 JSON 同步补齐每个 ending/option 的翻译字段。

### 3. 多道题的“原文证据”实际是改写，不是原文引用

以下证据改变了原文主语、结构或措辞，却标作“原文证据”：</n
- 第 31 题：`The caudate is involved ...` 是从句改写；原文为 `a region of the brain involved in ... anticipating food and other ‘reward’ stimuli`。
- 第 32 题：`The paragraph lists ...` 是审题者总结，完全不是原句。
- 第 33 题：`Combining PET and fMRI enabled ...` 改写了原文 `Because the scientists were combining methodologies ...`。
- 第 34 题：缩写并改写句 15，应引用完整关键原句或不改词的连续片段。
- 第 35、36 题：均为理论概述，不是原文句子。
- 第 37 题：删改了句 15 的强调结构和限定成分。
- 第 39 题：把句 30–33 综合改写成一句。
- 第 40 题：压缩改写句 35。

修正要求：JSON 与 Markdown 同步换成逐字符来自正文的原句或不改变词序的明确片段；若另需概括，应放在定位逻辑中，不能冒充“原文证据”。第 38 题现有证据为原句，可保留。

### 4. 第 32–40 题没有逐一排除全部错误选项

当前解析多为一句概括，只谈一个错误项或把多个选项笼统合并，未覆盖全部干扰项：

- 第 32–36 题均需分别说明三个错误选项为何不符；例如第 32 题当前把 C、D 合并为“not the focus”，且正文根本未展示选项。
- 第 37 题只排 B；第 38 题只排 F；第 39 题只排 C；第 40 题只排 D，其他错误句尾均未处理。

修正要求：每题按 A/B/C/D 或 A–F 逐项说明正确依据与所有错误项的错位点；可简洁，但不得遗漏任何一个选项。

### 5. 重复 B1+ 漏项与明确 CEFR 错标

- 句 9 的 `study` (B1) 没有讲解；它在句 24 再次出现时虽有条目，但后文不能替代句 9 本次出现。
- 句 6 的 `muscle` 身体部位义应为 B2，当前标成 B1。
- 句 12、13 的独立词 `brain` 身体器官义为 A2，当前标成 `(B1，神经科学专业词)`；应标 `基础词（A1/A2）`，专业语境可在释义中说明，但不能提升 CEFR。
- 句 38 的 `listen` 为 A1，当前标 B1；应改为 `基础词（A1/A2）`。

以上等级均可由 Cambridge Dictionary 对应义项直接核实。修正后还应顺带复扫全文，避免同类 A1/A2 被升标。

### 6. 两处中文翻译需要校正

- 句 20：`when the melodic pattern is still unresolved` 译成“旋律模式仍未解决”搭配生硬；应为“旋律模式尚未得到解决/尚未收束”等，体现和声或旋律期待未解决。
- 句 28：`the 5th movement of Beethoven’s String Quartet in C-sharp minor, Op. 131` 当前译成“升 C 小调弦乐四重奏第 131 号作品的第五乐章”，把作品号嵌入标题不自然。宜改为“贝多芬《升 C 小调弦乐四重奏》（作品 131 号）的第五乐章”。

## 待针对性复核

生成者修正后，由同一审计者复核以下项目直到零遗留：

1. 38 句英文与顺序、27–40 题及官方答案保持不变。
2. 第 32–36 题每题 A–D 原文和翻译齐全；第 37–40 题 A–F 英文和翻译齐全。
3. 第 31–37、39–40 题证据均为真实原文，不再使用改写冒充引文。
4. 第 32–40 题逐项覆盖全部错误选项。
5. 句 9 `study` 补齐；句 6 `muscle`、句 12/13 `brain`、句 38 `listen` 等级修正。
6. 句 20、28 翻译修正。
7. 数量契约仍为 38 句、14 题、3 A 层、3 Cambridge 链接、0 图片。

## 针对性复核结果

最终复核通过，零遗留问题。

- 38 个英文句子仍与 `section.sentences` 逐字符一致、顺序完整；六个自然段未变。
- 第 27–40 题共 14 题，答案仍为 `dopamine / pleasure / caudate / anticipatory phase / food / B / C / A / B / D / F / B / E / C`，与物理页 121 一致。
- 第 32–36 题各有 4 个 `label / text / translation` 选项；第 37–40 题各有 6 个同结构句尾，组级与逐题 Markdown 均完整呈现英文和中文。
- 第 31–40 题证据均在校准正文段落中逐字符连续命中；第 32–40 题已逐项覆盖全部正确项和错误项，不再遗漏干扰项。
- 句 9 `study`、句 6 `muscle`、句 12/13 `brain`、句 38 `listen` 均已按报告修正；第一轮复核追加发现的句 26 `finally`、句 31 `instead` 也已改为 `基础词（A1/A2）`，旧 B1 标记不存在。
- 句 20 `unresolved` 与句 28 作品名/作品号翻译已修正，语义和中文搭配准确。
- 数量回归：38 句、14 题、3 个 A 层、3 条 Cambridge Dictionary 链接、0 图片、0 `undefined`；`git diff --check` 通过。

结论：Passage 3 新稿及结构化子稿通过独立盲审，可进入 Test 3 集成与提交阶段。
## 生成者修正记录（2026-07-21）

- Questions 32–36 已在 JSON 与 Markdown 中逐题补齐 A–D 英文选项和中文翻译。
- Questions 37–40 已在组题标签及每一道题中补齐 A–F 英文句尾和中文翻译；JSON 的 endings/options 均为 label/text/translation 结构。
- 第 31–37、39–40 题的 evidence 已全部替换为正文逐字符原句或连续原句片段；第 38 题原有逐字证据保留。
- 第 32–40 题均按 A–D 或 A–F 逐项说明正确依据与所有错误项的排除理由。
- 句 9 已补 study；muscle 改为 B2；句 12、13 的 brain 与句 38 的 listen 改为“基础词（A1/A2）”。
- 句 20 改为“旋律模式也尚未收束”；句 28 作品名与作品号改为“贝多芬《升 C 小调弦乐四重奏》（作品 131 号）的第五乐章”。
- 自检：38 句英文与 section.sentences 逐字符一致；14 题及答案序列不变；第 31–40 题 evidence 均可在正文连续字符串中精确命中；3 个 A 层、3 条 Cambridge 链接、0 图片；git diff --check 通过。

已提交原审计者针对性复核。
- 原审计者第一轮针对性复核另发现句 26 `finally`、句 31 `instead` 在本义均为 A2；已改为“基础词（A1/A2）”，其余内容保持不变。


## 最终审计签署

原审计者已在生成者最后两项 CEFR 修正后再次回归检查；最终结论为零遗留问题，Passage 3 盲审通过。
