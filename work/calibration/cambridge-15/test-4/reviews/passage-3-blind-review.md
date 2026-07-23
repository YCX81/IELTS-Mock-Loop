# Cambridge IELTS 15 Test 4 Passage 3 首轮交叉盲审

审计者未参与 Passage 3 生成。本轮只审计并记录问题，未修改精读正文。

## 审计基准

- 校准正文：`work/calibration/cambridge-15/test-4/passages.json`
- 校准题库：`work/calibration/cambridge-15/test-4/questions.json`
- 集成题库：`work/calibration/cambridge-15/test-4/test-bank-entry.json`
- 新稿：`data/generated/intensive-reading/cambridge-13-15/Cambridge-IELTS-15-Test-4-Passage-3-双语精读.md`

## 已通过项目

- 26 个 `### 句 N` 数量、顺序及英文逐字符一致，未发现合并、遗漏或改写。
- 26 句中文翻译整体自然准确；主干、修饰关系与篇章作用未发现实质性错误。
- Q27–40 共 14 个严格的 `### 第 N 题`，题号连续。
- 总体指令及四组题型指令完整。
- Q27–31 的摘要全文、A–I 九个实际选项及翻译完整；已明确说明原书指令写 A–J、实际选项框只有 A–I，且未擅自补写 J。
- Q32–34 与 Q40 的所有 A–D 选项及翻译完整。
- Q35–39 的 YES / NO / NOT GIVEN 三项定义完整。
- 所有官方答案和 `acceptedAnswers` 均与校准题库一致；全部干扰项均有排除说明。
- 恰好 3 个 A 层深挖、3 条 Cambridge Dictionary 链接、0 张图片。

## 实际问题

### P3-BR-01（高）：重复出现的 B1+ 词未在每句再次独立讲解

强制规则要求每一次重复出现的 B1+ 词或短语都在所在句独立讲解。新稿自身已多次把 `business` 标为 `(B1，商业专业词)`，但下列句中的同一词未列入本句词汇：

- 句 2：`a business`
- 句 4：`big businesses`
- 句 7：`businesses`
- 句 9：`his business`
- 句 10：`businesses` / `a business`
- 句 11：`businesses`
- 句 12：`businesses`
- 句 13：`businesses`（两次，至少须在本句按每次出现独立列项；不能由 `track record`、`contract` 等其他词条替代）

此外，句 13 的 `products` 也未列项，而稿件在句 20 已将 `product` 明确标为 `(B1)`。应补齐上述每次出现，不得只补一条总括说明。

### P3-BR-02（中）：`identify` 的 CEFR 明显偏低

句 18 将 `identify` 标为 `(B1)`。在“识别供应链中的敏感环节”这一抽象分析义下，应标为 `(B2)`。需同步保留本句义“识别、确定”。

### P3-BR-03（高）：多数题目未明确给出校准题库的段落定位

稿件有“定位逻辑”或“定位与替换”，但 Q28–31、Q34–40 没有明确写出证据所在段落；Q32–33 只沿用题干中的“第三/第四段”，没有用校准正文的 A–G 段标签。强制项是“原文证据 + 定位”，不能让读者自行推断位置。

应按校准题库补充：

- Q27：Paragraph B（现有，保留）
- Q28–31：Paragraph A
- Q32：Paragraph C
- Q33：Paragraph D
- Q34：Paragraph E
- Q35–36：Paragraph F
- Q37–39：Paragraph G
- Q40：Paragraphs C and G

不得在最终精读中加入 PDF 物理页信息；只补正文段落标签即可。

## 首轮结论

非零问题：3 类。正文英文、翻译句法、题面选项、答案与固定数量要求已通过；须修复 P3-BR-01 至 P3-BR-03 后进行原审计者针对性复核。

## 针对性复核

原审计者已针对 P3-BR-01 至 P3-BR-03 逐项复核修订稿。复核过程中发现首轮清单误把句 11 列为含 `business`，生成者据此一度加入了正文不存在的词条；该多余词条已删除，并再次独立验证。

复核依据与结果：

- 26/26 个英文句仍与校准正文逐字符一致，句序无变化。
- 句 2、4、7、9、10、12、13 的 `business` 重复项及句 13 的 `product` 已在各自句块补齐；句 10 与句 13 的多次出现分别独立列项；句 11 已确认无脱离原文的 `business` 词条。
- 句 18 的 `identify` 已更正为 `(B2)`。
- Q27–40 均明确给出 Paragraph A–G 定位：Q27 B；Q28–31 A；Q32 C；Q33 D；Q34 E；Q35–36 F；Q37–39 G；Q40 C and G。未加入 PDF 物理页信息。
- Q27–40 的题干、选项、答案、acceptedAnswers、证据及全部干扰项无回归。
- 数量约束无回归：A 层深挖 3、Cambridge Dictionary 链接 3、图片 0。

针对性复核最终结论：**零遗留问题。**
