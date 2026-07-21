# Cambridge IELTS 11 Test 1 Passage 1 盲审报告

审阅范围：PDF 物理页 16–18、官方答案物理页 123；新生成的 `passage-1.json` 与 `Cambridge-IELTS-11-Test-1-Passage-1-双语精读.md`。未查看或参考旧精读正文，也未修改被审稿件。

## 结论

- 正文：原书共 7 段、38 个完整句子。新 JSON 与精读稿的 38 句顺序一致，英文逐字符一致；物理页 16 末尾 `food-` 与页 17 开头 `bearing` 正确合并为 `food-bearing`。双栏阅读顺序正确。
- 题目与答案：Q1–13 题干均覆盖，答案及官方括号内可选词均与物理页 123 一致。未发现漏题或错答案。
- 格式计数：恰好 3 个“A层深挖”、3 条 Cambridge Dictionary 链接、0 张图片。
- 仍有 4 类 major、3 类 minor；没有 blocker。修正后需要针对性复核。

## Blocker

零。

## Major

### M1｜题目范围字符没有忠实保留原书的 en dash

原书物理页 16 的总体指令为 `Questions 1–13`，物理页 18 的第一组标题及答题纸范围分别为 `Questions 1–7`、`boxes 1–7`。当前 JSON 的 `instruction` 使用 `Questions 1-13`，Q1–7 的第三条 `instructions` 使用 `boxes 1-7`；精读稿总体指令和 Q1–7 引文也对应使用 ASCII `-`。这与“题目指令逐字符校准”不符。

建议：把来自原书的这些范围统一校准为 `1–13`、`1–7`；纯结构元数据字段 `range` 是否保留 ASCII 连字符可按项目 schema 决定，但所有原书引文必须用 en dash。

### M2｜Q1–13 的 `location` 混用了段落编号与全文句号，字段内部自相矛盾

例如 Q1 写 `P2 sentence 7`，但 P2 内只有 8 句且该证据实际是 P2 的第 1 句（全文第 7 句）；Q3 写 `P4 sentence 26`，实际是 P4 的第 6 句（全文第 26 句）；Q9 的 `P3 sentence 16`、Q11 的 `P3 sentences 19-20` 在段内均不存在。其余多数题也采用同一混合写法，只是个别数字偶然落在段内范围。

建议：为全部 Q1–13 统一一种无歧义格式，例如 `P2, sentence 1 (overall sentence 7)`。逐题正确对应如下：Q1=P2/1（总 7）；Q2=P2/6（总 12）；Q3=P4/6（总 26）；Q4=P4/7（总 27）；Q5=P5/1（总 28）；Q6=P6/1（总 33）；Q7=P7/3（总 38）；Q8=P1/2（总 2）；Q9=P1/5（总 5）及 P3/2（总 16）；Q10=P4/2（总 22）；Q11=P3/5–6（总 19–20）；Q12=P4/4（总 24）；Q13=P4/5（总 25）。

### M3｜逐句 B1+ 覆盖仍有明确漏项，违反“重复出现也须再次独立讲解”

至少补齐以下明确 B1+ 项；它们在相应句的 `本句 B1+` 行中缺失：

- 第 12 句：`amount`（B1）。
- 第 14 句：`successfully`（B1）、`production`（B1，原句出现两次，需明确覆盖两个出现位置）、`repair`（B1）。
- 第 16 句：`work the land`（B2，本句 `the land we worked` 中为“耕作土地”，值得按该语境解释）。
- 第 19 句：`however`（B1）。
- 第 20 句：`ton`（B2，计量单位；本句复数 `tons`）。
- 第 22 句：`produce`（B1，动词“生产”；不能仅以 `crop` 和 `growing conditions` 代替）。
- 第 26 句：`energy`（B1）出现两次；现有 `consume` 与 `return ... to the grid` 没有给 `energy` 本身独立 CEFR 标注。
- 第 30 句：`natural`（B1）；同词第 16、31 句已有标注，更显示此处重复项遗漏。
- 第 37 句：`though`（B1）、`energy`（B1；再次出现仍须解释）。
- 第 38 句：`simply`（B1）。

另外建议生成者用同一词表再机械辅助扫一次，但最终以逐句人工判断为准，尤其检查 `hope for`（第 18 句）等词块是否按项目词级口径计入。

### M4｜多处明显专业词只有 CEFR，没有同时标明领域

用户明确要求专业词同时写“领域 + CEFR”。当前稿虽对 `ecozone`、`monsoon`、`herbicide` 等做了领域标注，但同一标准没有贯彻。至少以下明显专业项及其重复出现需补领域：

- 第 2 句 `demographic`：人口统计/人口学。
- 第 11 句 `environmentally controlled conditions`：农业/设施农业。
- 第 14 句 `urban renewal`：城市规划；`ecosystem`：生态学；`horizontal farming`：农业。
- 第 21、28、33、36 句等重复出现的 `vertical farming`：农业。
- 第 27 句 `fossil fuel`：能源/环境；`tractor`、`plough`：农业机械。
- 第 30、35 句 `greenhouse`：农业/设施农业。
- 第 32 句 `renewable energy`：能源/环境。
- 第 33 句 `stacked tray`：设施农业/农业工程。

建议不要只在总表补；逐句出现处都要按要求写成如 `vertical farming（B2，农业专业词：垂直农业）`。

## Minor

### m1｜第 25 句中文译文存在施受关系歧义

当前为“降低许多在农业接触界面感染的传染病发生率”，语法上容易读成“传染病被感染”。原文 `diseases that are acquired` 指人们在农业接触环节感染疾病。建议改为“该系统会大幅降低人们在农业接触环节感染多种传染病的发生率”或“会大幅降低多种经农业接触而感染的传染病的发生率”。

### m2｜第 18 句 `food-bearing plants` 译为“结果实的植物”范围偏窄

`food-bearing` 在此统指供人类获取食物的作物，不只结出植物学意义上的“果实”。建议译为“供食用的作物/能产出食物的植物”，保留与人类住所的对比。

### m3｜Q11 题干中文不够自然

当前“粮食作物的一部分损害由气候变化造成”语义可懂，但搭配生硬。建议改为“粮食作物遭受的一些损害是由气候变化造成的”。

## 已核实无问题项

- 原书正文标题、7 段顺序、38 句数量及英文字符。
- `10⁹ hectares`、`10,000 years`、`food-bearing` 三个易错点。
- Q1–13 题干文字与题序；Q1–7 字数限制；TRUE/FALSE/NOT GIVEN 三类标签及判定说明。
- 官方答案：`tomatoes`; `urban centres/centers`; `energy`; `fossil fuel`; `artificial`; `(stacked) trays`; `(urban) rooftops`; `NOT GIVEN, TRUE, FALSE, TRUE, FALSE, TRUE`。
- 每题证据与判断方向、填空干扰项和 T/F/NG 排除逻辑均正确；问题仅在 M2 所述定位字段格式。
- 3 个 A 层深挖均具备本句义、表达边界、篇章作用、两个迁移例句及近义差别；链接均为 Cambridge Dictionary。
- 最终稿未插入任何原书整页截图或其他图片。

## 复核状态

最终针对性复核：**零遗留问题**。

- M1 已关闭：JSON 与精读稿中的原书范围均改为 en dash（`1–13`、`1–7`、`8–13`）。
- M2 已关闭：Q1–13 全部定位统一为“段内句号 + 全文句号”，逐项与原报告给出的正确映射一致。
- M3 已关闭：原报告列出的 `amount`、`successfully`、两处 `production`、`repair`、`work the land`、`however`、`ton`、`produce`、两处 `energy`、`natural`、`though`、`simply` 均已在对应句独立补标；建议项 `hope for` 也已补入第 18 句。
- M4 已关闭：原报告列出的专业词在逐句出现处均补齐 CEFR 与领域，包括人口统计、设施农业、城市规划、生态学、农业、能源/环境及农业机械等标注。
- m1 已关闭：第 25 句译文已明确为人们在农业接触环节感染疾病，施受关系无歧义。
- m2 已关闭：第 18 句已将 `food-bearing plants` 译为“供食用的作物”，不再缩窄为结果实植物。
- m3 已关闭：Q11 中文已改为“粮食作物遭受的一些损害是由气候变化造成的”，表达自然准确。

本轮只复核上述原始问题，未修改正文或 JSON。
