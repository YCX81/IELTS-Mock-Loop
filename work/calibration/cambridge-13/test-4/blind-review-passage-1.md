# Cambridge IELTS 13 Test 4 Passage 1 盲审报告

## 审计范围与方法

- 审计者未参与 Passage 1 生成，未读取任何旧精读正文，也未直接修改新稿。
- 唯一原书来源：`source-pages.json` 的物理页 81–83 与答案页 124。
- 被审文件：`passage-1.json` 与新生成的 `Cambridge-IELTS-13-Test-4-Passage-1-双语精读.md`。
- 人工核对项目：正文数量、顺序、逐字符一致性、翻译与句法、每次出现的 B1+ 词项、CEFR/专业词格式、Q1–13 全部指令/标签/答案/证据/干扰逻辑，以及 A层/链接/图片数量。

## 初审结论

初审未通过；发现 5 组需要修正的问题。正文和题库事实本身准确，但词汇覆盖、两处句法说明以及 A层六件套结构尚未满足强制标准。

## 已通过项目

- 正文为 9 段、41 句，编号 1–41 连续。
- `bodyParagraphs`、JSON flat `sentences`、Markdown 41 条英文的数量、顺序与文本完全一致。
- 将原书页内换行规范化为空格后，正文 5,065 个字符与页 81–82 来源逐字符一致。
- Q1–13 连续完整；答案为 `FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, NOT GIVEN, TRUE, wool, navigator, gale, training, fire`，与答案页 124 完全一致。
- TRUE/FALSE/NOT GIVEN 三类标签、Q9–13 的 `ONE WORD ONLY` 限制、可接受答案、证据、定位和干扰项均完整且逻辑正确。
- 数量为 3 个 A层标题、3 条 Cambridge Dictionary 链接、0 张图片；无禁用整页截图或物理页模块。
- CEFR 标签书写格式及专业领域并列格式总体合规；未发现裸 `(A1)` / `(A2)`。

## 初审问题

### 1. 词汇表含与本句无关的串匹配误收词

以下项目必须从对应句的 JSON vocabulary 与 Markdown 词表中删除；它们并未在该句出现，显然是把单词内部字母串误当成独立词：

- 句2：`port`（误从 `transport` 截取）。
- 句27：`port`（误从 `transporting` 截取）。
- 句33：`port`（误从 `Portuguese` 截取）。
- 句36：`Red Sea`（本句完全未出现；应属句22）。
- 句37：`port`（误从 `Portugal` / `Portuguese` 截取）。

### 2. 多次出现的 B1+ 词和短语没有逐句重复讲解

至少补齐下列已人工确认的缺项；同一词在不同句再次出现时也要再次列出：

- `journey` (B1)：句12、14、23、28。
- `speed` (B1)：句12、20。
- `return` (B1)：句14、37、38。
- `lead` 作“领先优势” (B1)：句17。
- `pose a threat` (B2)、`increase` (B1)：句20；`increase` 在句32再次出现，也须再次解释。
- `take on` (B2)：句24。
- `be suspended from service` (C1)：句26。
- `turnaround` (C1)、`wool` (B1)：句27。
- `journey` (B1)、`just under` (B2)：句28。
- `excellent` (B1)、`get the best out of` (B2)：句29。
- `depend on` (B1)：句30。
- `vessel` (B2，航海专业词)：句31；不能因前文解释过而省略。
- `approach` (B1)：句32。
- `following` (B1)、`original` (B1)：句38。
- `continue` (B1)、`role` (B1)：句39。
- `transfer` (B2)：句40。
- `suffer from` (B2)：句41。

同时检查 JSON 与 Markdown 两份词汇内容同步，避免只修一处。

### 3. 句37的句法说明把主动谓语误判为被动

现稿称“两个被动谓语 `returned` 与 `was sold`”。`returned` 在 `She returned to Portugal` 中是不及物动词的一般过去时主动用法；只有 `was sold` 是被动。应改为“两个并列谓语：主动 `returned` 与被动 `was sold`”。翻译本身准确。

### 4. 句40的句法说明误称有两个不定式短语

`to dry dock` 中的 `to` 是介词，`dry dock` 是转移目的地；全句只有 `to go on public display` 是不定式目的状语。现稿“两个不定式短语分别说明去向和公开展示目的”必须更正。翻译本身准确。

### 5. 三个 A层深挖均未呈现完整、可核验的六件套

三处 A层虽各有释义、语境、例句、辨析/易错点和词典链接，但均只有约四个未编号内容块，没有完整六件套，也无法核验六项是否齐全。需将每个 A层明确重构为六个独立组件（按项目统一模板逐项标出），同时保持每篇恰好三个 A层、每层一条 Cambridge 链接，总链接数仍为 3。

涉及：

- `dominated world trade`
- `live up to expectations`
- `paid off`

## 题目专项复核

Q1–8 的陈述、中文、三类标签、官方答案、证据及排除逻辑均无遗留问题。Q9–13 的题干、中文、官方答案、可接受答案、原文证据、字数限制和排除逻辑均无遗留问题。特别核实：Q2 的 FALSE 正确区分“名字来自诗中的衣物名称”与“以人物命名”；Q7 的 NOT GIVEN 没有把帆船需要大洋风错误外推给蒸汽船。

## 最终针对性复核

- 复核状态：通过
- P1-BR-01（误收词项）：通过。句2、27、33、37 的伪 `port` 和句36的伪 `Red Sea` 已同时从 JSON vocabulary 与 Markdown 对应词表删除；真实出现于句16、24的 `port` 及句22的 `Red Sea` 正确保留。
- P1-BR-02（重复 B1+ 漏讲）：通过。初审清单所列 `journey`、`speed`、`return`、`lead`、`pose a threat`、`increase`、`take on`、`be suspended from service`、`turnaround`、`wool`、`just under`、`excellent`、`get the best out of`、`depend on`、`vessel`、`approach`、`following`、`original`、`continue`、`role`、`transfer`、`suffer from` 均已在对应句独立补齐，JSON 与 Markdown 同步；CEFR 与专业领域格式未见明显遗留错误。
- P1-BR-03（句37主动/被动误判）：通过。现说明明确区分主动不及物 `returned` 与被动 `was sold`。
- P1-BR-04（句40不定式误判）：通过。现说明明确指出 `to dry dock` 为介词短语、只有 `to go on public display` 为不定式目的状语。
- P1-BR-05（A层六件套）：通过。三个 A层均明确具备①语境义、②构词/意象、③与普通表达的差异、④语气边界、⑤文中作用、⑥迁移例句与近义辨析；每层含至少两个英中迁移例句。
- 正文回归：9段、41句；来源正文、JSON段落、JSON flat sentences 与 Markdown 英文数量、顺序、文本保持逐字符一致。
- 题目回归：Q1–13 连续，答案仍为 `FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, NOT GIVEN, TRUE, wool, navigator, gale, training, fire`；指令、标签、字数限制、证据和干扰逻辑无回归错误。
- 配额回归：A层 / Cambridge Dictionary 链接 / 图片 = `3 / 3 / 0`；无禁用页面模块。
- 最终遗留问题数：0