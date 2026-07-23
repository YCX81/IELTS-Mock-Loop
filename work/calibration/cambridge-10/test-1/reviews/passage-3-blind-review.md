# Cambridge IELTS 10 Test 1 Passage 3 交叉盲审报告

## 审计范围

- 原书 PDF 物理页：17–21
- 官方答案页：144
- 校准稿：`work/calibration/cambridge-10/test-1/passage-3.json`
- 新精读：`data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-10-Test-1-Passage-3-双语精读.md`
- 审计方式：逐页核对原始分辨率渲染页；逐句核对顺序和字符；逐题核对指令、题干、选项、答案、证据、定位与干扰项；未读取旧 C10 精读。

## 结论

本轮发现 **7 组实际问题，尚有 7 组遗留问题**。因此当前稿不能记为“零遗留”。P3 JSON 与精读正文均未由本盲审修改。

## 实际问题

### P3-01｜原书句点被录成逗号，两个完整句子被合并（高）

原书物理页 17 在 `behave differently` 后是句点，随后开始直接引语：

`... as a species, behave differently. 'When things change, we are hard-wired to play it safe.'`

当前 JSON、`pages[17]`、`bodyParagraphs[3]` 和精读第 14 单元均写成：

`... as a species, behave differently, 'When things change, we are hard-wired to play it safe.'`

这既是逐字符错误，也把两个完整句子合成一个编号。若严格执行“每个完整英文句子单独编号”，当前 47 个正文编号应因拆分此处而成为 48 个。任务口径中的“47句”与原书标点存在冲突，应以原书和逐句规则为准，并在修订后重新报告句数。

### P3-02｜Kellogg's 引语的三个句点被替换成 Unicode 省略号（中）

原书物理页 18 为：

`'I like Kellogg's Corn Flakes because... .'`

当前 JSON、`pages[18]`、`bodyParagraphs[7]` 和精读第 36 单元写成：

`'I like Kellogg's Corn Flakes because… .'`

原书是三个 ASCII 句点 `...`，不是单字符 `…`。需逐字符恢复，不能做排印性“美化”。

### P3-03｜精读未完整保留全部答题指令（中）

精读在题目区只用中文概述了总体指令，没有逐字列出：

`You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.`

Questions 36–40 也只列了第一句英文指令，随后用中文概述 YES/NO/NOT GIVEN，遗漏以下原书英文行：

- `In boxes 36–40 on your answer sheet, write`
- `YES if the statement agrees with the claims of the writer`
- `NO if the statement contradicts the claims of the writer`
- `NOT GIVEN if it is impossible to say what the writer thinks about this`

Questions 27–30 和 31–35 的英文指令覆盖完整；本问题只涉及总体指令和 36–40 题组。

### P3-04｜多处重复出现的 B1+ 项未再次独立讲解（高）

以下为明确可复现的遗漏；这些词或短语在稿内其他句子已被稿件自身标为 B1/C1，但在再次出现的当前句中未讲解：

- 第 15 单元：`Managers` 未再次讲解（第 47 单元将 `manager` 标为 B1）。
- 第 16 单元：`Studies` 未再次讲解（第 6 单元将 `study` 标为 B1）。
- 第 27 单元：`scientists` 未讲解（第 28 单元将 `scientist` 标为 B1）。
- 第 41 单元：`leader` 未讲解（第 45 单元将 `leader` 标为 B1）。
- 第 43 单元：`led to` 未再次讲解（第 39 单元将 `lead to` 标为 B1）。
- 第 44 单元：`boss` 未再次讲解（第 22 单元将 `boss` 标为 B1）。

这违反“每一次重复出现的 B1+ 词或短语也必须再次独立讲解”。修订时还应据同一标准再做一次全篇逐词扫描，不能只补上述示例后即视为完成。

### P3-05｜多项明显 A1/A2 基础词被错误标成 B1（中）

稿件使用 `(B1)` 标注了一批明显属于 A1/A2 的基础词，违反“A1/A2 只能标为基础词（A1/A2）/基础表达（A1/A2）”。明确示例包括：

- 第 2 单元 `centre`
- 第 3 单元 `space`
- 第 5 单元 `join`
- 第 7 单元 `photograph`
- 第 11 单元 `own`
- 第 16 单元 `offer`
- 第 22 单元 `dangerous`
- 第 25 单元 `discover`
- 第 28 单元 `scientist`
- 第 37 单元 `believe`

修订者应统一复核全篇 CEFR，而非只机械修改这十项；专业词仍须保留“CEFR + 领域”双标。

### P3-06｜第 39 单元译文改变 `regrettable` 的修饰关系（中）

原文：

`the regrettable tendency of team members to opt out of team responsibilities ...`

当前译文：

`团队成员遗憾地倾向于逃避本应由自己承担的团队责任。`

`regrettable` 修饰 `tendency`，表示“这种倾向令人遗憾”，不是说团队成员本人“遗憾地”逃避责任。应改为类似“团队成员逃避本应承担的团队责任这一令人遗憾的倾向”。当前句法说明已正确识别同位解释，但中文译文没有保持该修饰关系。

### P3-07｜第 28 单元中文译文残留多余英文引号（低）

当前译文结尾为：

`她“聪明得几乎从不寻求建议”。’`

中文双引号闭合后又残留一个英文右单引号 `’`。这是排版错误，应移除；跨第 26–28 单元的外层引语关系可以在句法说明中解释，不应把英文引号残留在中文译文。

## 已核对且通过的项目

- 当前新稿确有 47 个编号单元，顺序与当前 JSON 一致；但 P3-01 修正后必须重新分句计数。
- 题号 27–40 完整。
- Questions 27–30 的 A–D 题干、选项和官方答案均正确。
- Questions 31–35 的 A–G 全部结尾、匹配答案均正确。
- Questions 36–40 的题干及 YES/NO/NOT GIVEN 官方答案均正确。
- 官方答案页 144 对应答案为：27 C，28 A，29 D，30 B，31 G，32 E，33 A，34 F，35 B，36 NO，37 YES，38 NOT GIVEN，39 NOT GIVEN，40 NO。
- JSON 中 27–40 的证据、段落定位和干扰项逻辑均成立；未发现答案错位或引用到错误段落。
- 精读题目区覆盖了全部 A–D/A–G 选项及中文翻译；每题均有证据和排除逻辑。
- A 层深挖数量：3。
- Cambridge Dictionary 链接数量：3；全文 HTTP 链接总数也是 3。
- 图片数量：0。
- 三个 A 层深挖均包含本句义、搭配/构词、语气边界、文章作用、迁移例句和近义辨析。

## 复核要求

生成者修正上述 7 组问题后，应再次交回本审计者针对性复核。重点复核：

1. `differently.` 后引语是否拆成独立完整句，且句数已重新统计；
2. `because... .'` 是否逐字符恢复；
3. 总体指令及 36–40 全部英文指令是否补齐；
4. 重复 B1+ 是否已做全篇扫描而非只补列出的六项；
5. A1/A2 标签、两处中文问题是否清零。

---

## 第二轮针对性复核

复核对象为生成者提交的 Passage 3 修正版。本节结论取代上方首次盲审的历史状态；本审计者仍未修改 P3 JSON 或精读正文。

### P3-01 复核：通过

- JSON 的 `pages[17]` 与 `bodyParagraphs[3]` 已恢复为 `behave differently. 'When ...`。
- 精读已将其拆成第 14、15 两个独立完整句子。
- 正文现为 **48 个**连续编号单元，编号 1–48 无缺号；48 个英文单元按顺序逐字符匹配校准正文。

### P3-02 复核：通过

- JSON 的 `pages[18]`、`bodyParagraphs[7]` 与精读对应英文均已恢复为原书 ASCII 三句点：`because... .'`。
- 未再使用单字符 Unicode 省略号替换原书标点。

### P3-03 复核：通过

- 精读题目区已逐字加入总体指令 `You should spend about 20 minutes ...`。
- Questions 36–40 已补齐 `In boxes ... write` 以及 YES、NO、NOT GIVEN 三行完整英文定义。

### P3-04 复核：通过

首次报告列出的六处重复项均已在各自句子中再次独立讲解：

- 第 16 句 `manager`
- 第 17 句 `study`
- 第 28 句 `scientist`
- 第 42 句 `leader`
- 第 44 句 `lead to`
- 第 45 句 `boss`

编号因 P3-01 拆句而较首次报告整体后移一位；内容位置正确。

### P3-05 复核：通过

首次报告列出的十项基础词均已改用规定格式“基础词（A1/A2）”：`centre`、`space`、`join`、`photograph`、`own`、`offer`、`dangerous`、`discover`、`scientist`、`believe`。

### P3-06 复核：通过

原第 39 单元现为第 40 句，译文已改为“团队成员逃避本应由自己承担的团队责任这一令人遗憾的倾向”，正确保持 `regrettable` 修饰 `tendency` 的关系。

### P3-07 复核：通过

原第 28 单元现为第 29 句，中文译文结尾的多余英文右单引号已移除，中文引号闭合正常。

## 第二轮结构回归

- JSON 可解析。
- 正文句数：48；编号连续；英文与校准正文逐字符、按顺序一致。
- Questions 27–40：14 道题、14 份答案，范围完整。
- A 层深挖：3。
- HTTP/Cambridge Dictionary 链接：3。
- 图片：0。

## 最终复核结论

首次报告的 **7 组问题已全部修复，遗留问题数为 0**。Passage 3 修正版通过针对性盲审。
