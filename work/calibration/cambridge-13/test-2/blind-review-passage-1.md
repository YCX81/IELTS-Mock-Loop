# Cambridge IELTS 13 Test 2 Passage 1 非生成者盲审

## 审查基准与结论

- 审查身份：未参与 Passage 1 生成。
- 唯一基准：`source-pages.json` 物理页 39–42、答案页 120，以及同页 PDF 的 300 DPI 渲染图。
- 视觉核对：正文页 39–40、题目页 41–42、答案页 120 均已逐页查看；未用脚本通过代替视觉检查。
- 英文正文：5 段、37 个完整句子；顺序正确。消除 PDF 视觉换行和页眉页脚后，源页正文与 `bodyParagraphs` 均为 4933 字符且区分大小写完全一致；MD 中 37/37 句均逐字符命中结构化 JSON。
- 题库：Q1–13 连续完整；总体指令、Questions 1–9 的 `ONE WORD ONLY` 指令与全部时期标签/笔记题面、Questions 10–13 的 TRUE/FALSE/NOT GIVEN 指令与三类标签均覆盖。官方答案 `oils, friendship, funerals, wealth, indigestion, India, camels, Alexandria, Venice, TRUE, FALSE, NOT GIVEN, FALSE` 与答案页 120 一致。
- 版式计数：A层深挖 3；Cambridge Dictionary 链接 3（均为对应词条）；图片 0。
- 结论：发现 4 组问题，当前均待生成者修正；除下列问题外，未发现英文漏句/乱序、题面漏项、答案错误或图片违规。

## 具体问题

### BR-T2-P1-01｜重复出现的 B1+ 项未在对应句再次独立讲解

严重度：高。

用户要求每次重复出现的 B1+ 词或短语都再次独立讲解；下列词在稿内已被生成者自身标为 B1，却在后续出现句中遗漏：

- 第15句 `to reach Europe`：`reach` 已在第12句标为 `(B1)`，但第15句词汇项未再次列出。
- 第25句 `When the Dutch arrived ...`：`arrive` 已在第17句、第18句标为 `(B1)`，但第25句未再次列出。
- 第34句 `the English arrived on Ceylon`：同一 `(B1)` 的 `arrive on` 再次出现，但第34句未列出。
- 第23句主语 `the Portuguese` 与第28句 `Portuguese monopoly` 中的 `Portuguese`：稿件在第22、25、27、29、30句把 `Portuguese` / `the Portuguese` 标为 `(B1，历史专名)`，但第23、28句没有按其自身分级规则重复覆盖。

建议：在对应句词汇区逐句补入，不要用“前文已讲”替代；若生成者决定专名不适用 CEFR，应统一调整全文规则，而不是只补两处。

### BR-T2-P1-02｜把基础代词 `it` 与 B2 词合并后整体错误标为 B2

严重度：中。

- 第2句和第11句均列出 ``cinnamon / it` (B2，烹饪专业词)``。
- `cinnamon` 可以单独按目标等级讲解，但 `it` 是基础代词，不能随组合项一起被标成 B2；这也违反“A1/A2只能标为基础词/基础表达”的标注边界。

建议：词条只保留 ``cinnamon` (B2，烹饪专业词)``，在释义文字中自然说明 `it` 回指 cinnamon；不要把 `it` 放入带 B2 标签的词头。

### BR-T2-P1-03｜第27句中文译文的交换关系表达含混

严重度：中。

- 英文：`In return for payments of elephants and cinnamon, they protected the native king from the Portuguese.`
- 当前译文：`作为大象和肉桂报酬的交换，他们保护当地国王免受葡萄牙人的侵害。`

`in return for payments of ...` 表示荷兰人以保护国王作为回报，获得以大象和肉桂支付的报酬。当前“作为大象和肉桂报酬的交换”搭配不完整，容易被读成“大象与肉桂报酬彼此交换”。

建议改为：`作为获得大象和肉桂报酬的回报，他们保护当地国王免受葡萄牙人侵害。` 或 `当地以大象和肉桂作为报酬，换取荷兰人保护国王免受葡萄牙人侵害。`

### BR-T2-P1-04｜第5题把 `treatment` 误译成具体“药物”

严重度：中。

- 题面：`known as a treatment for 5 __________ and other health problems`
- 当前译文（题型总览、JSON note item 和第5题详解均相同）：`被视为治疗5 __________及其他健康问题的药物`

`treatment` 在这里是“治疗手段/疗法”，原文并未把肉桂定义为药物；“药物”会无依据地收窄词义。正文第7句的历史传闻语气处理正确，但题面译文应同步准确。

建议统一改为：`被视为治疗5 __________及其他健康问题的一种疗法（或治疗手段）`。

## 通过项明细

- 37 个英文句子无合并、概括、遗漏或调序；跨页句 `When the Portuguese arrived, they needed to increase production significantly ...` 拼接正确。
- 逐句均有中文翻译、主干/修饰/表达作用与词汇区；除 BR-T2-P1-01/02 外，未发现另一处明确的 B1+ 重复漏项或明显 CEFR 错级。
- 三处 A层分别为 `token`、`at someone’s disposal`、`set one’s sights on`，数量正确、均含语境义/差异/作用/迁移例句；三个 Cambridge 链接对应有效词条。
- Q1–9 均写明 `ONE WORD ONLY`、唯一可接受答案、证据、定位与易错词排除；Q10–13 均含三个判断标签、证据、定位和 TRUE/FALSE/NOT GIVEN 排除逻辑。
- Q10 的 TRUE、Q11 的 FALSE、Q12 的 NOT GIVEN、Q13 的 FALSE 均与原文时间线/比较范围及官方答案一致。

## 复核状态

当前状态：**4 组问题待修正，尚未达到零遗留问题。** 修正后应由本审计者针对 BR-T2-P1-01 至 BR-T2-P1-04 逐项复核。

## 修正后针对性复核（原审计者）

复核结论：**BR-T2-P1-01 至 BR-T2-P1-04 全部闭环，最终零遗留问题。**

- BR-T2-P1-01：通过。第15句已补 `reach`；第25、34句已补 `arrive / arrive on`；第23、28句已按稿内既定规则补 `the Portuguese / Portuguese`。MD 与 JSON 对应 vocabulary 均同步。
- BR-T2-P1-02：通过。第2、11句词头均已从 `cinnamon / it` 改为独立的 `cinnamon`（B2，烹饪专业词），只在释义中说明基础代词 `it` 的回指；MD 与 JSON 中不再存在 `cinnamon / it`。
- BR-T2-P1-03：通过。第27句已改为“作为获得大象和肉桂报酬的回报，他们保护当地国王免受葡萄牙人侵害。”，交换方向清楚；MD 与 JSON 同步。
- BR-T2-P1-04：通过。题型总览、第5题详解、JSON note item 与 question prompt 均已把 `treatment` 译为“一种疗法”，不再误译为具体药物。
- 回归检查：源页正文与 JSON 仍逐字符一致；37/37个英文句子在MD中完整命中；Q1–13及答案 `oils, friendship, funerals, wealth, indigestion, India, camels, Alexandria, Venice, TRUE, FALSE, NOT GIVEN, FALSE` 未改变；A层/链接/图片仍为3/3/0。未发现修正引入的新问题。

最终遗留问题数：**0**。
