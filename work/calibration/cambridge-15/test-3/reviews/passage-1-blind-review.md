# Cambridge IELTS 15 Test 3 Passage 1 盲审报告（首轮）

## 审计范围

独立对照 `passages.json`、`questions.json`、`test-bank-entry.json` 与新生成的 Passage 1 精读，未参考生成者自检结论，首轮未修改精读正文。

## 发现的可操作问题

### 1. 六处词汇条目混入了字面量 `` `n- ``，破坏独立条目结构

影响位置：

- 句 13：`increasingly` 条目末尾粘连 `` `n- **be interested in** ``；`turn away from` 条目末尾粘连 `` `n- **European** ``。
- 句 17：`stone sculpture` 条目末尾粘连 `` `n- **power** ``。
- 句 27：`painting` 条目末尾粘连 `` `n- **become interested in** ``。
- 句 35：`dramatic change` 条目末尾粘连 `` `n- **style** ``；`away from ... towards ...` 条目末尾粘连 `` `n- **natural** ``。

这些内容虽然仍可辨认，但字面量 `` `n `` 是生成噪声，且被粘连的 B1+ 重复表达没有作为独立项呈现。建议将每处 `` `n- `` 替换为真实换行加 Markdown 列表符 `-`，不改动原有词义和 CEFR 标注。

## 其他审计结果

- 正文：43 个 `### 句 N` 编号连续，数量与顺序正确；43 个英文句子与校准句逐字符一致，零差异。
- 翻译与句法：43 句中译自然且不改变原意；主干、修饰指向、逻辑关系和表达作用均已交代，未发现另外的实质性误读。
- 词汇与 CEFR：除上述 6 处格式残留外，重复出现的 B1+ 词语有再次讲解；未发现明显的 CEFR 高低级倒置。雕塑、艺术史、建筑、历史文化等专业词均同时标明了领域和 CEFR；A1/A2 项使用了“基础词（A1/A2）”或“基础表达（A1/A2）”。
- Mayan 脚注：英文逐字保留，中译、`civilisation`、`inhabit`、`current-day` 均已讲解，且未错计为正文句子。
- Questions 1–7：总指令、题组指令、TRUE/FALSE/NOT GIVEN 三个定义、每道题干与中译、官方答案、证据、定位逻辑及 TRUE/FALSE/NOT GIVEN 干扰判断均完整且正确。
- Questions 8–13：完整保留 `ONE WORD ONLY` 限制、笔记标题和 1930s/1940s/1950s 时间标签；6 道题干、中译、官方答案、`acceptedAnswers`、证据、词性/语法定位和每个校准干扰项均已覆盖。
- 数量约束：`A层深挖` 恰好 3 处；`dictionary.cambridge.org` 链接恰好 3 条；Markdown 图片 0 张。

## 首轮结论

遗留问题数：**1 类，共 6 个精确位置**。需生成者修复后，由本审计者针对性复核。

## 针对性复核：零遗留问题

原审计者已对首轮报告的 6 个精确位置逐一复核：

- 全文字面量 `` `n- `` 计数为 **0**。
- 句 13 的 `be interested in`、`European`，句 17 的 `power`，句 27 的 `become interested in`，句 35 的 `style`、`natural` 均已恢复为各自独立的 Markdown `-` 词汇条目；前置的 `increasingly`、`turn away from`、`stone sculpture`、`painting`、`dramatic change`、`away from ... towards ...` 也保持独立，无再粘连。
- 回归核验：43 个 `### 句 N` 连续，英文与校准句 43/43 逐字符一致；Questions 1–13 的 13 个精确题号标题、题干和官方答案均仍完整。
- 数量约束无回归：`A层深挖` **3** 处，`dictionary.cambridge.org` 链接 **3** 条，Markdown 图片 **0** 张。

最终复核结论：**首轮报告所列问题已全部修复，零遗留问题。**
