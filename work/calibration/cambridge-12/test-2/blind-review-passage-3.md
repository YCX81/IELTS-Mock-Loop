# Cambridge IELTS 12 Test 2 Passage 3 盲审报告

## 审计范围与视觉证据边界

- 审计对象为新生成的 `passage-3.json` 与 `Cambridge-IELTS-12-Test-2-Passage-3-双语精读.md`；未读取任何旧 Test 2 精读正文。
- 本代理从本地 PDF 提取了物理页 46、47、48、49、119 的原生扫描图，尺寸约为 1450×1927；但 `view_image` 仍被 Windows split writable roots 沙箱拒绝，因此本代理**不声称完成了独立图像目检**。
- 视觉部分采用根代理在 `manual-review.md` 中记录的原分辨率逐页目检证据：Passage 3 正文为物理页 46–47，题目为 48–49，Reading 答案为 119；`marka` / `marker`、`Stroop Task`、`language co-activation`、`NO MORE THAN TWO WORDS`、YES / NO / NOT GIVEN 及答案序列均已由根代理确认。

## 检查统计

- 正文段落：7 段（A–G）。
- JSON 句子：36；Markdown `## 句 N`：36；编号 1–36 连续。
- Markdown 英文句与 JSON：36/36 逐字符一致；错序 0，遗漏 0，重复 0。
- 7 个段落由所属句子顺序拼接后与 `paragraph.text` 一致。
- 题目：14 道，完整覆盖 27–40。
- 题型与标签：27–31 表格填空，`NO MORE THAN TWO WORDS`；32–36 YES / NO / NOT GIVEN；37–40 段落信息匹配 A–G。
- 官方答案序列：27 `eye movements`；28 `language co-activation`；29 `Stroop Task`；30 `conflict management`；31 `cognitive control`；32 YES；33 NOT GIVEN；34 NO；35 NO；36 NOT GIVEN；37 D；38 G；39 B；40 C。
- A 层深挖：3；Cambridge Dictionary 链接：3；图片：0。
- 重复 B1+ 检查：句 10 的 `marker` / `stamp`，句 17 的 `match` / `i.e.` / `be printed in`，句 20 的 `bilinguals` / `categorize`，句 24 的双语/单语语言表达，句 28 的三组患者/疾病表达，句 35 的两次 `rule` 均分别讲解。跨句重复的双语、单语、研究、语言共同激活、认知/感官处理、背景噪声、患者、疾病等也均在再次出现处重讲。未发现明确的 B1+ 重复项遗漏。
- CEFR 与专业领域标注：未发现可以确定的明显等级错误；语言学、心理语言学、认知心理学、神经科学、听觉科学、医学等专业词均同时标注领域与 ASCII CEFR。

## 实际问题

### BR-T2-P3-01（中）：第 10 句把 `look more at` 过度具体化为“次数更多”

位置：精读稿第 10 句中文译文。

原文：`... would look more at a stamp than someone who doesn’t know Russian ...`

现译：`他看向邮票的次数会比不懂俄语的人更多`

问题：眼动语境中的 `look more at` 只说明对邮票投入了更多视觉注意，可以体现为注视更久、更多次或更高注视比例；原文没有把指标限定为“次数”。现译加入了未明示的测量维度。

建议：改为 `他会比不懂俄语的人更多地看向邮票`，或 `他对邮票的注视会多于不懂俄语的人`。句法说明中的 `look more at` 保持“更多视觉注意”的中性解释。

### BR-T2-P3-02（低）：第 37 题没有准确解释 `non-verbal auditory input` 的定位信号

位置：精读稿第 37 题“定位逻辑”与“原文证据”。

现文把 `a certain type of non-verbal auditory input` 解释成 `背景噪声条件下的声音`，主要依赖 `background noise`。

问题：D 段的关键不仅是有背景噪声，而是双语者对声音的 `fundamental frequency` 编码更好，并明确把它解释为与 `pitch perception` 密切相关的声音特征。`fundamental frequency / pitch perception` 才更直接对应题干的“某类非语言听觉输入/特征”；背景噪声是实验条件，不是完整的定位解释。

建议：证据补入 `reflecting better encoding of the sound's fundamental frequency, a feature of sound closely related to pitch perception`；定位逻辑改为：D 段比较两组神经反应，并以基频编码和音高感知说明非词汇性的听觉特征。背景噪声只作为触发组间差异的实验条件。

## 题库逐题复核摘要

- 27–31：表格结构、`Test / Findings` 表头、所有行标签、两词限制、答案词形和大小写均正确。
- 32：过去“不利”与近年“明确益处”形成态度变化，YES 正确。
- 33：没有双语者猜词准确率更高的比较，NOT GIVEN 正确。
- 34：原文说图片命名可能更慢，NO 正确。
- 35：无噪声时两组反应相似，反驳 `in all situations`，NO 正确。
- 36：只比较症状时间和损伤，不比较患病人数，NOT GIVEN 正确。
- 37：D 答案正确，但解释需按 BR-T2-P3-02 补足非语言听觉特征的对应。
- 38：七个月大婴儿规则切换实验在 G，答案正确。
- 39：B 描述连续声音到词汇识别的过程，答案正确。
- 40：C 明示更慢图片命名和话到嘴边状态，答案正确。

## 当前结论与复核要求

当前不能判定为零遗留问题。生成者应只修正 BR-T2-P3-01 与 BR-T2-P3-02，不改 36 句英文、题目答案或其他强制指标。修正后由本审计者针对两处文本复核，并重新确认 36 句逐字符、3 个 A 层、3 条 Cambridge 链接、0 图片和题号 27–40，直至报告记录零遗留。

## 生成者修正记录（BR-T2-P3-01 / BR-T2-P3-02）

- BR-T2-P3-01：句 10 译文已由“看向邮票的次数更多”改为“比不懂俄语的人更多地看向邮票”，不再擅自限定眼动指标是注视次数；词条 `look more at` 仍保持中性的“更多地看向”。
- BR-T2-P3-02：第 37 题原文证据已补入 `fundamental frequency` 的更好编码及其与 `pitch perception` 的关系；定位逻辑已明确这两项对应非词汇性的听觉特征，背景噪声仅为触发组间差异的实验条件。
- 未改动 36 条英文原句、JSON、题目答案或题号。生成者回归自检：36/36 英文与 JSON 逐字符差异 0；题 27–40 共 14 题；A 层深挖 3；Cambridge Dictionary 链接 3；图片 0；`git diff --check` 通过。
- 待原审计者针对 BR-T2-P3-01、BR-T2-P3-02 复核并给出最终零遗留结论。

## 原审计者针对性复核

复核结论：**BR-T2-P3-01 与 BR-T2-P3-02 均已正确修正，当前零遗留问题。**

- 句 10 已改为“比不懂俄语的人更多地看向邮票”，不再把 `look more at` 擅自限定为注视次数；词汇条目也保持中性解释。
- 第 37 题证据已明确补入 `fundamental frequency` 的编码与 `pitch perception`，定位逻辑正确说明两者对应非词汇听觉特征，并把背景噪声限定为实验条件。
- 回归检查：36 条 Markdown 英文与 JSON 逐字符差异 0；句号 1–36 连续；题号 27–40 连续；A 层深挖 3；Cambridge Dictionary 链接 3；图片 0；`git diff --check` 通过。
