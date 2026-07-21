# Cambridge IELTS 12 Test 1 Passage 1 盲审报告

## 审计结论

结论：发现 4 个可执行问题，其中 1 个会影响集成契约，1 个涉及翻译准确度，2 个涉及题解措辞/定位逻辑精度。正文 36 句的数量、顺序及 Markdown 与校准 JSON 的逐字符一致性通过；题号 1–13、官方答案、可接受答案、题干、分类标签和核心证据均完整。

## PDF 核对状态与证据边界

- 已从本地 `data/Cambridge-IELTS-12.pdf` 渲染物理页 16、17、18、19、117，输出尺寸分别约为 2080×2775、2080×2767、2080×2767、2096×2767、2080×2756。
- 本代理尝试使用 `view_image` 和 Node `emitImage` 打开渲染图时，Windows 图像沙箱分别因 split writable roots / `apply deny-read ACLs` 拒绝启动。因此本报告**不声称完成了本代理独立视觉目检**。
- 已核对 `manual-review.md` 中根代理的原始扫描分辨率逐页目检记录：正文为物理页 16–17，题目为 18–19，答案页为 117；双栏顺序、英式拼写、弯引号、en dash，以及末段复数谓语 `support` / `prevent` 均已在该记录中确认。
- 根代理需在本报告后追加独立 PDF 视觉复核，才能满足“双人证据链”的视觉部分。

## 检查统计

- 校准段落：7 段（A–G）。
- JSON 句子：36；Markdown `## 句 N`：36；编号 1–36 连续。
- Markdown 英文句与 JSON：36/36 逐字符一致，错位 0，遗漏 0，重复 0。
- 每段由所属句子按顺序拼接后与 `paragraph.text` 一致：7/7。
- 题目：13 道；题号 1–13 连续。
- 题型：1–5 TRUE/FALSE/NOT GIVEN；6–13 ONE WORD ONLY 笔记填空。
- 官方答案序列：1 NOT GIVEN；2 FALSE；3 FALSE；4 TRUE；5 TRUE；6 taste；7 cheaper；8 convenient；9 image；10 sustainable；11 recycled；12 biodiversity；13 desertification。
- A 层深挖：3；Cambridge Dictionary 链接：3；图片：0。
- 重复 B1+ 抽查覆盖：`cork`、`bark`、`cork oak`、`buoyant`、`harvest`、`strip`、`trunk`、`branch`、`bottle stopper`、`concern about`、`product`、`cork forest`、`region` 等重复出现处均再次讲解。未发现明确漏讲的 B1+ 重复项。
- CEFR 与专业领域标注逐项复核：未发现可以确定的明显等级错误；专业词均同时给出领域与 CEFR。

## 可执行问题

### 1. [高] `section.sentences` 不符合当前集成契约

位置：`work/calibration/cambridge-12/test-1/passage-1.json`，`section.sentences[0..35]`。

现状：句子对象使用 `{ "id": N, "paragraph": "A", "page": 16, "text": "..." }`。当前 Test 1 集成契约要求至少提供 `{ number, paragraph, text }`，而 Passage 2 已按 `number` 统一。若集成脚本按 `sentence.number` 读取，Passage 1 的 36 个编号都会成为 `undefined`。

建议：把全部句子的 `id` 改为 `number`；`page` 可作为额外字段保留。修改后重新运行 1–36 连续性与 Markdown 逐字符比对。

### 2. [中] 第 23 句把 `the first branches` 译成“第一批枝条”，空间定位不够准确

位置：精读稿第 23 句中文译文。

原文：`... from just above ground level to the first branches.`

现译：`从略高于地面处一直延伸到第一批枝条。`

问题：此处 `first branches` 是沿树干向上遇到的最低处分枝，不是按批次出现的“第一批”树枝。“第一批枝条”容易让读者误解为时间或数量分组。

建议：改为 `从略高于地面处一直延伸到最下面的第一处分枝`，或更自然地写成 `从略高于地面处一直延伸到最低处的树枝`。句法分析中的空间范围说明同步采用同一表述。

### 3. [低] 第 1 题定位逻辑误加“最厚”，削弱 NOT GIVEN 的解释

位置：精读稿第 1 题“定位逻辑”。

现文：`原文只给出“最厚可达20厘米”，没有与所有现存树种比较。`

问题：原文是 `Its bark grows up to 20 cm in thickness`，只表示“厚度可达 20 厘米”，没有 `thickest` 的最高级。“最厚可达”在中文中会重新引入题干的最高级色彩，和紧接着的 NOT GIVEN 理由相冲突。

建议：改为 `原文只给出“厚度可达20厘米”，没有与所有现存树种比较。`

### 4. [低] 第 8 题对 `convenient` 的字数限制解释不准确

位置：精读稿第 8 题“干扰项排除”。

现文：`不能写两词 more convenient，因为限制为一个词；笔记结构本身表达比较。`

问题：题干实际是 `are 8 ______ to use`，空格外没有 `more` 或其他比较标志，不能说“笔记结构本身表达比较”。正确答案为 `convenient` 是因为官方笔记把原文 `more convenient for the user` 压缩为“旋盖的优点”，并受 ONE WORD ONLY 限制，不是题干语法已经保留了比较级。

建议：改为 `原文是 more convenient，但题目要求 ONE WORD ONLY，笔记在“铝制旋盖的优点”分类下只保留核心形容词 convenient；不能填写两个词 more convenient。`

## 题库逐题复核摘要

- 1：NOT GIVEN。20 cm 只是绝对厚度，无跨树种最高级比较。
- 2：FALSE。题干说已复制相同细胞结构，原文说技术从未成功复制。
- 3：FALSE。25 年是种植到首次采剥；采剥间隔约十年。
- 4：TRUE。潮湿时剥皮会伤树，支持应在干燥空气条件下操作。
- 5：TRUE。没有机械剥皮手段，工作由熟练工人完成。
- 6–8：`taste / cheaper / convenient`，分别对应不损害味道、生产更便宜、使用更方便。
- 9–13：`image / sustainable / recycled / biodiversity / desertification`，分别对应传统形象、可持续材料、易回收、维护生物多样性、防止荒漠化。

题干和选项标签均已在精读稿中给出中译；1–5 三个判断选项及其含义完整；6–13 的总标题、两组分类标签、ONE WORD ONLY 和答题框范围完整。除上列第 1、8 题解释措辞外，未发现答案、证据、定位或干扰项结论错误。

## 复核要求

修正上述 4 项后，应针对性复核：

1. JSON 句子键名与集成脚本契约；
2. 第 23 句译文与句法说明；
3. 第 1、8 题两处解释措辞；
4. 根代理补充物理页 16–19、117 的独立视觉复核记录，并确认本报告未覆盖的版面细节为零遗留。

## 生成者修正记录

已按首轮盲审四项逐一修正，等待原审计者 P2 针对性复核：

1. `section.sentences` 的 36 个对象已由 `id` 统一改为 `number`，保留 `paragraph`、`page` 与 `text`；编号 1–36 连续。
2. 句 23 译文已将 `the first branches` 改为“最低处的树枝”，句法说明同步明确为“从近地面到最低处分枝”的空间跨度。
3. 第 1 题定位逻辑已删除误加的“最厚”，改为原文准确含义“厚度可达20厘米”。
4. 第 8 题已说明：原文虽为 `more convenient`，但 ONE WORD ONLY 与“铝制旋盖的优点”分类要求笔记只保留核心形容词 `convenient`，并非题干结构自带比较标志。

生成者自检：36 句英文与 JSON 逐字符一致；A 层 3、Cambridge Dictionary 链接 3、图片 0；题号 1–13 连续；四项问题对应文本均已消除。

## 根代理独立 PDF 视觉复核

- 复核者未参与 Passage 1 正文或题解生成；已打开本地 PDF 的原生扫描图，逐页目检物理页 16、17、18、19、117。
- 页 16–17 的双栏阅读顺序为左栏完整读完再接右栏；跨栏处分别从 Mediterranean countries 接 Portugal、从 bottle 接 is caused，校准文本衔接正确。
- 页 18 的 1–5 题、TRUE/FALSE/NOT GIVEN 标签及说明完整；页 19 的 6–13 题、两组分类标题及 ONE WORD ONLY 限制完整。
- 页 117 的官方答案与报告所列 1–13 序列一致；`NOT GIVEN` 保留空格，6–13 无额外可接受变体。
- 视觉复核确认 `20 cm`、`40 million`、`2,4,6-trichloroanisole (TCA)`、`three or four parts to a trillion`、`support`、`prevent` 等易错点与校准 JSON 一致。
- 未发现正文、题目、选项、指令或答案页的新增视觉差异；本段补足图像通道失败留下的证据边界。

## 针对性复核

复核结论：**首轮 4 项问题均已修正，结合根代理追加的物理页视觉复核，当前零遗留问题。**

1. 集成契约：`section.sentences` 的 36 个对象均含 `number`，不再含 `id`；编号 1–36 连续，`paragraph / page / text` 保留。
2. 第 23 句：译文已改为“最低处的树枝”，句法说明同步写明“从近地面到最低处分枝”的空间跨度，语义准确。
3. 第 1 题：定位逻辑已准确写为“厚度可达20厘米”，不再误加最高级“最厚”。
4. 第 8 题：已删除“笔记结构本身表达比较”的错误解释，改为基于原文 `more convenient`、分类标签及 ONE WORD ONLY 说明只填 `convenient`。
5. 根代理视觉证据：已逐页复核物理页 16–19、117，确认双栏顺序、跨栏衔接、题目指令/标签、ONE WORD ONLY、官方答案以及易错数字和 `support / prevent` 均与校准 JSON 一致，新增视觉差异 0。

针对性自检：36 个 Markdown 英文句与 JSON 逐字符差异 0；句号 1–36 连续；题号 1–13 连续；A 层 3；Cambridge Dictionary 链接 3；图片 0；`git diff --check` 通过。
