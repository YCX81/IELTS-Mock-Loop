# Cambridge IELTS 12 Test 2 Passage 2 盲审记录

## 审计范围与结论状态

- 审计者：未参与 Passage 2 生成的 agent /root/t1_generate_p1。
- 目视核对原书物理页 42–45，官方答案物理页 119。
- 审核文件：
  - work/calibration/cambridge-12/test-2/passage-2.json
  - data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-12-Test-2-Passage-2-双语精读.md
- 审计者未修改生成稿。
- 当前结论：存在阻断问题，尚未通过；等待生成者修正后由同一审计者针对性复核。

## 已确认正确

- PDF 页面范围正确：题目页 42、45；正文页 43–44；答案页 119。
- 标题、副标题、A–G 七段正文及题目页文字与原书一致。
- 正文共 30 个完整英文句子；JSON 顺序正确，Markdown 30 句均逐字符包含，无漏句或合并。
- 八个 headings 的原文和翻译均已覆盖。
- 官方答案正确：
  - 14 iv，15 vi，16 viii，17 v，18 i，19 vii，20 iii
  - 21 TRUE，22 FALSE，23 FALSE，24 NOT GIVEN
  - 25 rubber，26 farmer
- 形式计数正确：3 个 A 层、3 条 Cambridge Dictionary 链接、0 张图片。

## 初审发现的实际问题

### 1. 全部词汇释义仍是占位文字，181 项均未真正讲解

Markdown 中 181 个 B1+ 词汇 bullet 的冒号后全部是同一句：

“结合本句语境理解；重复出现时仍按本句作用重新讲解。”

这句话没有给出本句义、中文释义、搭配作用或语气，因而即使词条被列出，也不构成“独立讲解”。必须逐项改成与本句对应的真实释义；重复项必须说明本次出现的具体语义或作用，不能再次复制统一模板。

这是全篇阻断问题，涉及句 1–30 的全部现有词汇条目。

### 2. 仍有明确漏掉的 B1+ 首现或重复项

除上述占位问题外，至少下列出现没有独立 CEFR bullet：

- 句 1：be ready for / what was to be（后者是叙述者回看未来结果的结构）。
- 句 3：lie（表示“坐落于”）；pass through（本句首次出现，句 5 才列出，不能用后文条目代替）。
- 句 4：recently；重复出现的 valley、canyon；bring ... up 在本句表示“向上运输”。
- 句 5：重复出现的 mountain；therefore。
- 句 6：a few days into（表示进入某进程已有数日）。
- 句 9：seem to have been；prospect of（当前只列 prospect，未保留搭配）。
- 句 10：make the ascent；without having the least expectation。
- 句 12：describe；make considerable springs（spring 在此为“跃跳”）；not that。
- 句 13：followed by；grand。
- 句 14：seem like。
- 句 15：not ... until。
- 句 19：重复出现的 However。
- 句 20：come to write。
- 句 21：the very first；could have been 的过去可能性。
- 句 24：重复出现的 site；while 的让步义。
- 句 25：重复出现的 lie。
- 句 28：重复出现的 idea；over the past few years。
- 句 30：and so；some 50 years 中 some 的“大约”义。

句 21 还列出了 civilisation (B2)，但该词并未出现在句 21 英文中；这是错挂到本句的词条，应删除或改为真正出现的项目。

### 3. 明显 CEFR 错标

以下可由 Cambridge Dictionary 的对应词义直接确认：

- 句 11 vivid 标为 C1，但“清晰、生动的描述”这一义为 B2。
- 句 24 magnificent 标为 C1，但“极好、壮丽、值得赞叹”这一义为 B1。

其余等级在逐项重写真实释义时仍需重新检查，不能沿用占位稿而不复核。

### 4. 翻译与句法有明确错误或失真

- 句 1：was ready for what was to be the greatest achievement 是叙述者的事后视角。现译“已经准备好迎接一生最伟大的成就”容易误成宾厄姆当时已知道其历史意义。宜体现“准备展开后来成为他一生最大成就的探索”。
- 句 5：rejoin the river lower down 的宾语 river 在译文“在下游重新汇合”中丢失；应明确“在下游重新回到/接上河道”。
- 句 12：ever-present possibility of deadly snakes 是“始终存在遇到致命毒蛇的可能性”，不是现译“致命毒蛇无处不在的可能性”。后者把 possibility 错转成蛇本身无处不在。
- 句 14：句法说明称“倒装引语后接 he wrote”，原句只是直接引语后置报道语，并不存在倒装。
- 句 16：“一种远为渐进的成就认知”中文生硬且未准确表达 gradual appreciation of his achievement；应为“对自己成就逐渐加深的认识/体会”。
- 句 23：原文 for nearly 40 years 是过去持续时段；现译“近40年来”带到说话当下，宜改为“此后近40年里/他用了近40年”。

### 5. Q21–24 题组原文指令不完整

- JSON questionSections 中 Questions 21–24 的 instruction 只有首句 Do the following statements ...，漏掉：
  - In boxes 21–24 on your answer sheet, write
  - TRUE if the statement agrees with the information
  - FALSE if the statement contradicts the information
  - NOT GIVEN if there is no information on this
- Markdown 只引用首句英文，后面用中文概括规则；没有完整呈现上述原文总体题型指令。

单题 instruction 字段虽然含完整内容，但题组字段与最终精读仍应完整、同步。

### 6. Q14–20 的“原文证据”和干扰项在 JSON 与 Markdown 中不同步

- JSON 中第 14–20 题 evidence 均是英文概括，例如 “A states Bingham’s goal ...”，不是原文证据句。
- JSON 中第 14–20 题 distractorAnalysis 七题全部复制同一条泛化模板，未实际排除任何 heading。
- Markdown 中第 14–20 题虽有较具体的定位和部分干扰项排除，但仍主要是中文概述，没有给出逐字原文证据。
- 因此 JSON 与 Markdown 不同步，也不满足“官方答案 + 原文证据 + 定位 + 实际干扰项排除”的契约。

修正时应为每题写入对应原文句或关键原文片段，并把 Markdown 已有的实际排除逻辑同步回 JSON；至少明确为什么正确 heading 概括整段、为什么最相近的错误 heading 不成立。未使用 heading ii 也应在整体或相关题中明确说明。

## 待复核清单

生成者修正后，同一审计者将针对以下项目复核：

1. 181 个现有词汇条目是否全部改为真实、逐句、独立释义。
2. 上列漏项是否在各自句块中补齐，句 21 错挂 civilisation 是否移除。
3. vivid B2、magnificent B1 及其余明显等级是否正确。
4. 六处翻译/句法问题是否修正。
5. Q21–24 完整原文指令是否同步到 JSON 与 Markdown。
6. Q14–20 原文证据、定位、实际干扰项是否同步且具体。
7. 修正后 30 句、13 题、3 A 层、3 链接、0 图片等既有正确项是否保持不变。

## 生成者修正记录（2026-07-21）

已按初审清单完成修正并提交原审计者针对性复核：

- 句 1–30 原有 181 条占位释义已分三块全部改为真实中文义项和本句语境说明；占位文本计数为 0。
- 已补齐审计清单列出的首现与重复 B1+ 项；当前词汇条目共 212 条。句 21 错挂的 civilisation 已删除。
- vivid 已改为 B2，magnificent 已改为 B1；句 28 escape 已按语境修为“躲避/避开严冬”。
- 句 1、5、12、14、16、23 的翻译或句法说明已逐项修正，英文原句未改动。
- Q21–24 的完整英文题组指令已同步到 JSON 与 Markdown。
- Q14–20 的 JSON evidence 已改为对应完整原句，location 与 distractorAnalysis 均逐题具体化；Markdown 已同步完整英文证据、定位逻辑与实际干扰项排除。
- 生成者自检：30 个句块，英文与结构化题库逐句、按序一致；13 道题完整覆盖 14–26；3 个 question sections、13 questions；3 个 A 层、3 条 Cambridge Dictionary 链接、0 图片；7 条 Q14–20 干扰项分析互不重复；0 个词汇占位；`git diff --check` 通过。

原审计者已收到稳定稿复核请求。

## 针对性复核

同一审计者完成针对性复核，最终结论：**零遗留问题**。

复核过程与结果：

1. 第一轮针对性复核确认初审主体问题均已修正，但发现两个残留：句 28 的 escape 被误释为“避暑”；Q14–20 的 Markdown 尚未加入与 JSON 同步的逐字原文证据。生成者随后把 escape 改为“躲避；避开；本句指避开库斯科寒冷的冬季”，并为七道 heading 题同步原文证据、定位和实际干扰项。
2. 第二轮针对性复核发现题目重写引入回归：Q14–20 的 Markdown 官方答案显示为 undefined。生成者将其依次修复为 iv、vi、viii、v、i、vii、iii。
3. 最终复核确认：undefined 计数为 0；30 个英文句子仍全部逐字符匹配；181 个原占位词条已全部改为真实释义，新增漏项均位于正确句块，句 21 错挂 civilisation 已移除；vivid (B2)、magnificent (B1) 正确；六处翻译/句法问题均已修正。
4. Q21–24 完整原文指令已同步；Q14–20 七题均有原文证据、定位逻辑和具体干扰项，官方答案正确。
5. 既有正确项保持：30 句、13 题、3 个 A 层、3 条 Cambridge 链接、0 张图片；git diff --check 通过（仅有共享来源文件的行尾提示，无内容错误）。

原审计者未修改 Passage 2 的 JSON 或精读正文。
