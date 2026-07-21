# Cambridge IELTS 11 Test 3 Passage 3｜独立盲审报告

## 审阅范围与方法

- 独立目视核对原书正文物理页 71–72、题目物理页 73–74、官方答案物理页 127，均使用原始分辨率渲染图。
- 对照文件：`work/calibration/cambridge-11/test-3/passage-3.json` 与 `data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-11-Test-3-Passage-3-双语精读.md`。
- 本审阅者未参与 Passage 3 生成；本轮未修改 JSON 或精读正文。

## Major

### M1｜Q27–40 的 `location` 把全文句号写成了 section 内句号

当前定位如 `Section D, sentence 19`、`Section B, sentences 9–14`，但 D 段只有 3 句、B 段只有 6 句。这些数字实际是全文句号，字段文字却把它们表述成 section 内句号。应统一写成“section 内句号 + 全文句号”：

- Q27：`Section D, sentence 1 (overall sentence 19)`
- Q28：`Section B, sentences 1–6 (overall sentences 9–14)`
- Q29：`Section G, sentences 1–6 (overall sentences 31–36)`
- Q30：`Section C, sentence 4 (overall sentence 18)`
- Q31：`Section B, sentences 4–6 (overall sentences 12–14)`
- Q32：`Section E, sentence 3 (overall sentence 24)`
- Q33：`Section A, sentences 5–8 (overall sentences 5–8)`
- Q34：`Section F, sentences 1–2 (overall sentences 26–27)`
- Q35：`Section A, sentences 1–2 (overall sentences 1–2)`
- Q36：`Section A, sentence 4 (overall sentence 4)`
- Q37：见 M2；建议定位到 `Section A, sentence 8 (overall sentence 8)`，或同时补充 C 段的解释证据。
- Q38：`Section D, sentence 1 (overall sentence 19)`
- Q39：`Section E, sentence 4 (overall sentence 25)`
- Q40：`Section G, sentence 5 (overall sentence 35)`

### M2｜Q37 的证据与定位没有包含可抄写的官方答案 `intuitive`

当前 JSON 把 Q37 定位为 `Section C, sentence 16`，证据是 `intuition plays a significant role`。这里出现的是名词 `intuition`，而本题要求 `ONE WORD ONLY from the passage`，题干空格后又有 `thinking`，官方答案必须是原文实际出现的形容词 `intuitive`。

最直接证据在 A 段第 8 句（全文第 8 句）：

> its logical, yet intuitive, style of thinking

该处既原样包含 `intuitive`，也直接对应题干的 `intuitive thinking, as well as analytical skills`。C 段第 15–16 句可以作为概念补充，但不能只引用 `intuition` 后称其为可从原文填入的答案。精读题解也存在同一问题，应把答案词的精确出处写清。

### M3｜三处 A 层深挖均未达到强制深度

文件确有 3 个 `A层深挖`，也恰有 3 条 Cambridge Dictionary 链接，但三个单元都只有一小段释义：

- `at most`
- `bridge a gap`
- `turn someone off`

三者都没有强制要求的至少 2 个中英双语迁移例句，也没有 2–3 个近义表达及适用边界对比；因此没有完成“本句义、字面画面或构词、与普通说法差别、语气边界、篇章作用、至少两个迁移例句、近义差别”的完整深挖。链接数量正确不能替代深挖内容。

### M4｜B1+ 重复覆盖和 CEFR 存在明确漏项/错标

以下是人工逐句回扫并由 Cambridge Dictionary 等级可明确判定的问题：

- 第 8 句漏掉 `beauty`，应独立讲解为 B1；句中 `the beauty of mathematics` 不能只靠 `appreciate` 代替。
- 第 23 句与第 25 句的名词 `experiment / experiments` 都被标成“基础词（A1/A2）”，实际为 B1；两次出现均须分别改标。
- 第 26 句 `throughout` 当前标 B1，实际为 B2。
- 第 27 句漏掉 `simply`；本句义为“只是、仅仅”，Cambridge Dictionary 标 B2，应在本句独立收录。

这些不是汇总表是否列出的形式问题，而是逐句词汇栏未满足“本句全部 B1+，重复出现也再次独立讲解”的硬性要求。建议修订后再对 37 句作一次同样的逐句人工回扫。

### M5｜五个强制功能章节的标题结构未落实

当前五个二级标题是：

1. `## Preface to ‘How the other half thinks: Adventures in mathematical reasoning’`
2. `## 题目与选项精讲`
3. `## B1+ 词汇深讲总表`
4. `## IELTS 阅读提醒`
5. `## 答案汇总`

第一个二级标题只是原文标题，正文没有独立的“逐句精读”章节；其余四节也缺少统一编号。应调整为项目规定的五个功能章节，同时把英文原题保留在正文导语或第一节之前：

- `## 01 逐句精读`
- `## 02 题目与选项精讲`
- `## 03 B1+ 词汇深讲总表`
- `## 04 IELTS 阅读提醒`
- `## 05 答案汇总`

## Minor

### m1｜第 15 句 `notorious gap` 的译文“声名狼藉的鸿沟”不自然且偏义

`notorious` 确有负面意味，但这里修饰的是长期被谈论的人文/科学分隔问题，不是说“鸿沟本人名声败坏”。“那道众所周知、饱受诟病的鸿沟”或“那道臭名昭著的隔阂”更符合中文搭配，也更能保留作者对所谓“两种文化”分裂的批评语气。

## 已核实无问题项

- 原书正文为 A–G 七节，共 37 个完整句子；JSON 为 37 句，精读有 37 个连续编号，句序一致。
- 37 个编号英文句与 JSON 逐字符一致，并与原书人工核对一致。
- D 段第 3 句正确跨越物理页 71–72：页 71 末尾 `can be` 与页 72 开头 `sketched intuitively` 未被拆句或漏词。
- 标题中的曲单引号、正文引语的曲引号与曲撇号、破折号、方括号、`step-by-step`、`haven’t`、`naïve` 的分音符，以及原书异常但应保留的 `logical, yet intuitive, style` 标点均正确。
- `sourcePages` 71–74、`passagePages` 71–72、`questionPages` 73–74、`answerKeyPage` 127 正确。
- Q27–34 的题组范围、四条指令、`NB You may use any letter more than once.`、8 条 matching information 陈述、A–G 标签说明、答案 `D B G C B E A F` 与逐题排除逻辑完整且正确。
- Q35–40 的三条指令、`ONE WORD ONLY` 限制、6 个完整题干、答案 `beginner, arithmetic, intuitive, scientists, experiments, theorems` 与干扰项排除正确；除 M2 的精确证据定位外，其余证据均与原文相符。
- 官方答案物理页 127 与 JSON、精读答案汇总一致；原书未列额外答案变体。
- A 层数量为 3、Cambridge Dictionary 链接数量为 3、图片数量为 0。

## 复核状态

当前：**非零遗留问题**（M1–M5、m1）。修正后需由本审阅者针对上述 ID 复核；在此之前不能判定为零遗留。

## 第一次针对性复核（2026-07-21）

- M1 已关闭：Q27–40 共 14 个 `location` 均已同时写明准确的 section 内句号和全文句号；逐项核对无错位。
- M2 已关闭：Q37 现引用 A 段第 8 句 `its logical, yet intuitive, style of thinking`，证据原样包含可抄写答案 `intuitive`；定位为 `Section A, sentence 8 (overall sentence 8)`，题解也明确区分形容词 `intuitive` 与名词 `intuition`。
- M3 已关闭：仍恰有 3 个 A 层深挖和 3 条 Cambridge Dictionary 链接。`at most`、`bridge a gap`、`turn someone off` 每项均已补足至少 2 个中英双语迁移例句、3 个近义表达的适用边界，并覆盖本句义、字面/结构画面、普通说法差别、语气边界和篇章作用。
- M4 已关闭：第 8 句 `beauty` 已按 B1 独立收录；第 23、25 句重复出现的名词 `experiment` 均按 B1 独立标注；第 26 句 `throughout` 已改为 B2；第 27 句 `simply` 已按 B2 独立收录。未发现这些词项的残留或回归。
- M5 已关闭：五个二级功能标题现精确为 `## 01 逐句精读`、`## 02 题目与选项精讲`、`## 03 B1+ 词汇深讲总表`、`## 04 IELTS 阅读提醒`、`## 05 答案汇总`。
- m1 已关闭：第 15 句 `notorious gap` 现译为“那道众所周知、饱受诟病的鸿沟”，中文搭配自然，并保留原文的负面评价。

### 回归检查

- JSON 仍为 A–G 七节、37 句；精读仍有 37 个连续编号，JSON 与 Markdown 英文逐字符差异为 0。
- 原有跨页句、曲引号、破折号、方括号、`naïve` 等字符均未发生回归。
- 两个 question sections、Q27–40 连续题号、全部题组指令、题干、section matching 标签/说明、填空字数限制、证据、干扰项和官方答案均保持完整；答案映射差异为 0。
- A 层数量 3、Cambridge Dictionary 链接数量 3、图片数量 0。

最终：**零遗留问题**。M1–M5、m1 全部关闭，本次针对性复核未发现新问题。
