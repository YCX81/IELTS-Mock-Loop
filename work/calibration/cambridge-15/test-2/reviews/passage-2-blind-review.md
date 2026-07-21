# Cambridge IELTS 15 Test 2 Passage 2 首轮交叉盲审

- 审计者未参与 Passage 2 生成。
- 审计对象：`Cambridge-IELTS-15-Test-2-Passage-2-双语精读.md`
- 审计基线 SHA-256：`D4BA8301582F66EB45E164EE5B9C97AF0EB586F9FA8786A9A0C89027D91BA47A`
- 校准来源：Test 2 `passages.json`、`questions.json`、`test-bank-entry.json`
- 首轮结论：**发现 6 项可执行问题；本轮只审不改正文。**

## 已通过的硬性检查

- 正文恰好 35 个 `### 句 N`，编号 1–35 连续。
- 35 个标题后的英文句子与 P2-S1 至 P2-S35 数量、顺序和字符完全一致，差异为 0。
- 题号标题恰好覆盖 14–26，顺序连续。
- 总体指令和 Questions 14–17、18–22、23–26 三组完整指令均存在且与校准来源一致。
- A–F 段落标签及中文功能概括齐全；人物选项 A Ben Novak、B Michael Archer、C Beth Shapiro 及翻译/说明齐全。
- Q14–26 官方答案与校准题库一致；Q21 接受 `fat` / `insulating fat`，Q22 接受 `emissions` / `carbon emissions`。
- 摘要标题、三段摘要原文、两词上限和括号可省略规则齐全。
- `A层深挖` 3 个、Cambridge Dictionary 链接 3 条、图片 0 张。

## 待修正问题

### P2-BR-01｜多句仍漏讲 B1+ 重复项

用户要求每次出现的 B1+ 词或短语都再次独立讲解。当前至少漏掉以下明确项：

- 句 2：`single` (B1)。
- 句 5：`technology` (B1) 再次出现；`in this case` (B1) 未列。
- 句 8：`explain` (B1) 未列。
- 句 9：`dangerously` (B2) 未列，只讲了 `debilitating`。
- 句 13：`cause` (B1) 未列。
- 句 19：`explain` (B1) 再次出现但未列。
- 句 28：`extra` (B1) 未列。
- 句 32：`technology` (B1) 再次出现但未列。
- 句 33：`go extinct` (B2，生态学专业表达) 再次出现但未列。

修正方式：在对应句的“词汇与表达”中逐项补入，重复出现也要保留本句义和等级；专业表达同时保留领域与 CEFR。

### P2-BR-02｜句 9 的关键短语翻译不自然且语义偏差

当前把 `dangerously debilitating facial tumour syndrome` 译为“会造成危险性衰弱的面部肿瘤综合征”。“危险性衰弱”不是自然中文，也没有准确表现 `dangerously` 修饰 `debilitating` 的程度关系。

建议改为类似：“一种会造成严重衰弱、危害极大的面部肿瘤综合征不断蔓延”。词汇项还应按 P2-BR-01 单列 `dangerously` (B2)。

### P2-BR-03｜句 12 人为重复了一次不存在的词项

句 12 原文中 `thylacines` 只出现一次，但词汇行首尾各列了一次 `thylacine` (C2)。这不符合“按每次实际出现独立讲解”的审计口径，也会造成虚假重复计数。

修正方式：删除该词汇行末尾第二个重复的 `thylacine` 项，保留第一次即可。

### P2-BR-04｜句 18 的主谓讲解可能把非标准一致关系教成通则

原文必须保留 `This complicated process and questionable outcome begs ...`，新稿也确实逐字符保留；但讲解直接说“单数 `begs` 把并列概念视为一个整体情境”，容易让学习者误以为 `and` 连接两个中心名词时通常可以自由使用单数谓语。

修正方式：明确标注这是原书原句，不能擅改；标准一致关系下 `process and outcome` 通常预期复数谓语，本文可谨慎理解为作者把“复杂过程及其成疑结果”整体打包成一个局面。不要把这一解释表述为普遍语法规则。

### P2-BR-05｜Q19 中文翻译生硬

`physical adaptations to minimise 19 __________` 当前译为“用身体上的适应性改变把第 19 空降到最低”。“把空降到最低”把题目占位符误当作实际对象，不是自然中文。

修正方式：改为“为尽量减少第 19 空所指损失而进行的身体适应性改变”，或直接结合答案写成“旨在尽量减少热量流失的身体适应性改变”，同时继续保留英文原题干。

### P2-BR-06｜Q25 的引证没有完整呈现“植被受益”证据链

当前只引用句 23 的 `re-establish that forest disturbance, thereby creating a habitat ...`，随后直接解释“打破森林停滞，促进再生”。单看这段引文，并不能直接看到题干中的 `beneficial impact on the vegetation`。

修正方式：补引句 21–23 的连续证据，至少包括：

- `the lack of disturbance ... means there has been minimal need for regrowth`
- `This has left forests stagnant ...`
- `re-establish that forest disturbance ...`

再说明 `vegetation` 对应 forest / trees / regrowth，`beneficial impact` 对应恢复扰动并使森林重新生长。A/B/C 人物干扰项可保持现有排除逻辑。

## 复核要求

修正后需由本审计者针对以上 P2-BR-01 至 P2-BR-06 逐项复核，并重新跑 35 句逐字符、13 个题号、3 深挖、3 链接、0 图片的硬检查。全部关闭前不能报告零遗留问题。

## 针对性复核结论

- 复核对象 SHA-256：`73A7989890D85084097BA399628C09718E9CC8508FA188ED1E9DC9C0490B415D`
- 复核结论：**P2-BR-01 至 P2-BR-06 全部关闭，零遗留问题。**

逐项结果：

- **P2-BR-01 已关闭：** 首轮列出的 9 组漏项均已按实际出现位置独立补讲并标注 CEFR/领域。
- **P2-BR-02 已关闭：** 句 9 已自然改译为“会造成严重衰弱、危害极大的面部肿瘤综合征”。
- **P2-BR-03 已关闭：** 句 12 已删除人为重复的第二个 `thylacine` 词项。
- **P2-BR-04 已关闭：** 句 18 已区分原书逐字符保留与标准主谓一致规则，并警示不可推广为通则。
- **P2-BR-05 已关闭：** Q19 已改为自然、准确的占位符译法。
- **P2-BR-06 已关闭：** Q25 已补充句 21–23 的连续证据，并明确植被、森林扰动与再生之间的对应。

回归检查结果：

- 35 个正文句标题连续，P2-S1 至 P2-S35 的顺序和字符差异为 0。
- Q14–26 共 13 个题号标题连续；总体指令、三组题型指令、摘要与全部题干仍与校准来源一致。
- 官方答案和 Q21/Q22 可接受变体未被破坏。
- `A层深挖` 仍为 3 个，Cambridge Dictionary 链接仍为 3 条，图片仍为 0 张。
- 修复未引入新的翻译、句法、CEFR、证据定位或干扰项问题。

**最终状态：零遗留问题，可通过 Passage 2 交叉盲审。**