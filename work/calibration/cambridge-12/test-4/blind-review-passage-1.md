# Cambridge IELTS 12 Test 4 Passage 1 非生成者盲审

## 审查范围

- 校准 JSON：`work/calibration/cambridge-12/test-4/passage-1.json`
- 新精读稿：`data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-12-Test-4-Passage-1-双语精读.md`
- 原书物理页：正文 80–81，题目 82，答案 123
- 未读取旧 Passage 1 精读正文；未修改被审 JSON 或 Markdown。

## 已确认通过的项目

- 正文为 7 个自然段、35 个完整句子；编号 1–35 连续，段落顺序正确。
- Markdown 的 35 个英文句子与 JSON `section.sentences` 逐句逐字符一致。
- 第 1–13 题完整；答案为 `obsidian, spears, beads, impurities, Romans, lead, clouding, taxes, TRUE, FALSE, NOT GIVEN, TRUE, FALSE`，与物理答案页 123 一致。
- Questions 1–8 的笔记、`ONE WORD ONLY` 限制、题干翻译、答案、证据和定位完整。
- Questions 9–13 的 TRUE / FALSE / NOT GIVEN 标签、翻译、答案、证据和判断逻辑完整。
- A 层深挖恰好 3 处，Cambridge Dictionary 链接恰好 3 条，图片 0 张；三个深挖均覆盖本句义、表达画面、语气边界、文章作用、迁移例句和近义差别。
- 未发现通用句法占位、`TODO`、`undefined` 或漏号。

## 首轮发现的实际问题

### 1. 句 19 的跨页元数据错误

物理页 80 末尾只有 `Glass`，物理页 81 才继续 `manufacturing techniques also improved ...`，所以句 19 是一个跨 80–81 页的完整句子。当前 JSON 却只有：

```json
{"number":19,"paragraph":"P4","page":81,"text":"Glass manufacturing techniques also improved ..."}
```

段落 P4 的 `sourcePages: [80,81]` 不能替代句级跨页记录。

修正要求：保持句 19 为一个编号和一条完整英文句子，同时增加 `sourcePages: [80,81]` 及明确的跨页字段；标量 `page` 若为 schema 必需，可保留起始页 80 并补 `pageEnd: 81`。

### 2. CEFR 与专业词标注格式存在明确问题

- 句 5 和句 8 的 `century` 均标为 `(B1)`；该高频基础时间词应按本任务格式标为 `基础词（A1/A2）`，或不列入 B1+ 词表。重复出现的两处都要分别修正。
- 专业词目前普遍使用英文逗号，例如 `(B2, 材料专业词)`、`(C1, 玻璃制造专业词)`。任务指定的组合格式是 `(等级，领域专业词)`，应统一为中文逗号，如 `(B2，材料专业词)`；正文中所有专业项都需机械核对，不能只改一处。

### 3. 句 20 漏讲本次重复出现的 B1+ 表达

原句有 `glass making developed from traditional mouth-blowing to a semi-automatic process`。`develop` / `develop from ... to ...` 在前文已经出现，任务要求每次重复也独立讲解；句 20 的词表讲了 `glass making`、`traditional`、`mouth-blowing` 和 `semi-automatic process`，但没有讲本句实际承担“由 A 发展为 B”意义的 `develop from ... to ...`。

修正要求：在句 20 独立补充该表达及合适 CEFR，不得依赖句 7、15 或 21 的讲解。

### 4. 句 17 的中文译文加入了原文未明说的动作

原文是 `Joseph Paxton's Crystal Palace at London's Great Exhibition of 1851 ...`，现译为“约瑟夫·帕克斯顿为1851年伦敦万国工业博览会设计的水晶宫……”。`designed / 设计` 不在本句中；即使历史事实可能成立，本任务禁止推测性补写来源之外的信息。

修正要求：改成忠实于所有格和地点关系的译法，例如“1851年伦敦万国工业博览会上的约瑟夫·帕克斯顿水晶宫……”，不要自行加入“设计”。

### 5. 句 25 的中文译文不够自然

`Today, glass making is big business.` 现译为“如今，玻璃制造是一门大生意。”这是英语搭配的直搬，不是自然中文；`big business` 在此强调产业规模和商业重要性。

修正要求：改为“如今，玻璃制造已成为规模庞大的产业”或同等自然、准确的中文，并保持句法分析中的当代产业转折作用。

## 首轮结论

首轮盲审不通过，共发现 5 类问题。P1 生成者修正后，必须由本审计者仅针对上述五项复核；在复核确认前不能签署零遗留。

## 生成者修正记录（2026-07-21）

- 已保持句 19 为单一完整句，同时将起始 `page` 改为 80，并补充 `pageEnd: 81`、`sourcePages: [80,81]`、`crossPage: true`。
- 已把句 5、句 8 的 `century` 分别改为 `基础词（A1/A2）`；全文 62 个专业词/专业表达标注均统一为中文逗号，英文逗号残留为 0。
- 已在句 20 独立补讲 `develop from ... to ...` (B2)。
- 已删除句 17 译文中原文未明说的“设计”，改为“1851年伦敦万国工业博览会上的约瑟夫·帕克斯顿水晶宫……”。
- 已将句 25 译文改为自然中文“如今，玻璃制造已成为规模庞大的产业”。
- 回归验证：JSON 可解析；35 句英文仍与 JSON 逐字符一致；13 题未变化；A 层 3 个、Cambridge 链接 3 条、图片 0 张；`git diff --check` 通过。

请原审计者仅针对上述五类问题复核并签署最终结论。
## 原审计者针对性复核

针对首轮五类问题逐项复核如下：

1. 句 19 仍为一个完整英文句子，现以 `page: 80` 记录起始页，并同时包含 `sourcePages: [80,81]`、`crossPage: true`、`pageEnd: 81`；跨物理页 80–81 的事实已完整记录。
2. 句 5、句 8 的两处 `century` 均已改为 `基础词（A1/A2）`。全文专业词／专业表达共 62 处，均使用任务指定的中文逗号格式；ASCII 逗号专业标注残留为 0。
3. 句 20 已独立补充 `develop from ... to ... (B2)`，解释“由传统口吹发展为半自动工艺”，满足重复 B1+ 项逐次讲解要求。
4. 句 17 译文已删除原文未明说的“设计”，改为“1851年伦敦万国工业博览会上的约瑟夫·帕克斯顿水晶宫……”，未再加入来源外动作。
5. 句 25 已改为自然中文“如今，玻璃制造已成为规模庞大的产业”，准确传达 `big business` 的产业规模义。

回归检查：正文仍为 7 段、35 句，Markdown 英文与 JSON 逐句逐字符一致；题号仍完整覆盖 1–13，官方答案序列未变；A 层深挖 3 处、Cambridge Dictionary 链接 3 条、图片 0 张；未发现 `TODO`、`undefined` 或通用占位。

针对性复核结论：首轮五类问题均已修正，**零遗留问题**。
