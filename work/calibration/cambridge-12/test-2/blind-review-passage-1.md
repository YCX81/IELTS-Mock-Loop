# Cambridge IELTS 12 Test 2 Passage 1 盲审记录

## 审计范围

- 审计者：未参与本篇生成的 agent /root/t1_generate_p1/blind_review_t2p1
- 原书目视页：正文与题目物理页 36–41；官方答案物理页 119
- 文件：work/calibration/cambridge-12/test-2/passage-1.json；data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-12-Test-2-Passage-1-双语精读.md
- 审计方式：以原分辨率渲染页为依据，核对正文、题目、答案、精读和计数；审计者未修改文件。

## 初审确认正确

- A–I 九段共 34 个完整句子，顺序和英文逐字符一致。
- Q1–13 题干、选项与官方答案一致：1 A，2 B，3 H，4 D，5 B，6 C，7 G，8 B，9 A；10–11 D/E 任意顺序；12–13 C/D 任意顺序。
- 初审时计数为 3 个 A 层、3 条 Cambridge Dictionary 链接、0 张图片。

## 初审发现

1. 重复或首现 B1+ 漏讲：句 2/3 highly；句 8 face risks；句 12 However；句 13 executive director、essay；句 15 argue that；句 17 note that、increase；句 20 mention；句 21 explain that、reduce、increase；句 24 suggest that；句 25 author；句 31 explain that；句 32 suggest。
2. 明显 CEFR 错标：句 2 aspect 应为 B2；句 33 guarantee 应为 B2。
3. 三个 A 层缺少完整的使用边界、篇章作用、至少两个双语迁移例句和近义表达辨析。
4. Q1–9 多数只复述正确证据，缺少实际错误段落/人物排除。
5. JSON 中 Q10–13 单题 instruction 误写为 corresponding two boxes，不是题页逐字指令。

## 生成者修正

- 为上述 17 个漏项逐句补充独立词汇讲解，并把 aspect、guarantee 改标为 B2。
- 三个 A 层均补齐核心义/构词、使用边界、篇章作用、两个双语迁移例句和近义表达辨析；链接仍恰好各一条。
- Q1–9 在 JSON 与精读中同步加入实际错误段落或人物排除。
- Q10–11 单题指令恢复为 boxes 10 and 11；Q12–13 恢复为 boxes 12 and 13。
- 双选题主答案规范为 10 D、11 E、12 C、13 D，同时保留两种可接受顺序。

## 针对性复核

同一原审计者完成两轮针对性复核。第一轮发现词汇条目插入未实际落盘，生成者改用句标题偏移逐项插入并自检。最终复核结论：**零遗留问题**。

- 17 个指定 B1+ 项均已在正确句块中作为独立 CEFR 词汇条目出现；句 21 的 increase 两次用法合并在同一独立条目中明确说明。
- aspect (B2)、guarantee (B2) 保持正确。
- 3 个 A 层、3 条 Cambridge 链接、0 张图片，六件套内容保持完整。
- Q1–9 干扰项排除在 JSON 与 Markdown 中同步。
- Q10–13 指令逐字正确；主答案 10 D、11 E、12 C、13 D，任意顺序变体完整保留。
- 原审计者未编辑文件。
