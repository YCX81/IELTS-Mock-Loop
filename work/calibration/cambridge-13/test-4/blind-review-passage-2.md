# Cambridge IELTS 13 Test 4 Passage 2 非生成者盲审

## 初审范围与结论

- 审阅来源仅限 `source-pages.json` 的物理页 84–87、官方答案页 124，以及本轮新生成的 `passage-2.json` 和精读 Markdown；未读取旧精读正文，未直接修改生成稿。
- 正文机械核对：A–G 七段齐全；flat sentences 为连续 1–44；44 个英文句子均能按顺序、逐字符命中去除 PDF 版面换行后的校准正文；无重复句、漏句或乱序。
- 题库机械核对：三组题型完整，题号连续覆盖 14–26；官方答案依次为 `minerals, carbon, water, agriculture, C, E, A, D, E, C, F, G, F`，与答案页 124 一致；摘要全文、A–F 句尾选项、A–G 段落标签及总体/题组指令均已出现。
- 配额核对：A层深挖 3 个，且每个均含六个编号组成部分；Cambridge Dictionary 链接 3 条；图片 0 张。
- 初审结论：发现 6 组可操作问题，需生成者修正后由本审阅者针对性复核。

## 可操作初审问题

### P2-BR-01｜词汇表出现并不存在于原句中的误命中项

- 句1在 `endangered` 之外额外列出 `danger (B1)`，但原句没有独立词 `danger`。
- 句22、句25把原文 `recently` 列成 `recent (B1)`；应讲解原句实际出现的 `recently`，不能用子串替代。
- 句36从 `Sustainable` 中误命中 `Sustain (B2)`；原句没有独立词 `sustain`。
- 句41在 `endangered` 之外再次列出不存在的 `danger (B1)`。

修正要求：JSON 与 Markdown 同步删除误命中项，并按原句实际词形补入应讲项；不要用字符串子串命中制造并不存在的词项。

### P2-BR-02｜多处 B1+ 词或短语漏讲，含重复出现后未再次讲解

至少补齐以下明确遗漏，并同步检查同类漏项：

- 句4：`point out (B1/B2)`、`warn about (B1)`。
- 句7：`nearly (B1)`。
- 句23：`start out (B2)`。
- 句24：`come to realise (B2)`、`develop (B1)`。
- 句25：`cocktail (C1，本句为重复出现，仍须再次独立讲解)`。
- 句27：`weak (B1)`。
- 句28：`solve (B1)`。
- 句29：`face (B1，表示“面临问题”)`。
- 句42：`difficulty (B1)`。

修正要求：逐句重新扫一遍所有 B1+ 项；每次重复出现都保留独立讲解，不能因前句讲过而省略。

### P2-BR-03｜句27中译的施事关系不自然且易误解

原句：`The few plants that grew in the control plots, fed with traditional fertilisers, were small and weak.`

现译“对照试验地里仅有的几株植物施用了传统肥料，它们又小又弱”把植物写成主动“施用肥料”的主体。`fed with traditional fertilisers` 表示这些植物/对照地块接受传统肥料处理。建议改为类似：“对照地块中用传统肥料培育出来的少数植物又小又弱。”句法说明也应明确 `fed with...` 是被动的过去分词补充说明，而非植物主动施肥。

### P2-BR-04｜第19题证据链没有证明题干中的 Haber–Bosch 来源

当前证据只引用句21的化肥污染结果，能支持选项 E，却没有把题干 `Synthetic fertilisers produced with the Haber-Bosch process` 与这些 `Chemical fertilisers` 连起来。应把 D 段句18–22作为连续证据：句18引入 Haber–Bosch 制造硝酸铵，句19明确其 `synthetic fertiliser` 身份，句21–22再给出大气、河流与土壤损害。定位和解释需同步覆盖这条链。

### P2-BR-05｜第21题现有证据没有显式支持 governments

当前只引句39 `easily understood target...shape expectations and encourage action`，但选项 D 的主语信息是 `help governments to be more aware`。应把 G 段句36–39连用：句36先提出要把问题切实传达给 governments and the wider public，句38–39再给出零净土地退化这一易懂目标及其促进行动的作用。现答案 D 正确，但证据和定位需闭合。

### P2-BR-06｜第24–26题尚未做到 A–G 逐项干扰排除

- 第24题只写“其他段……”，没有逐一说明 A、B、C、D、E、G 各自为何不符。
- 第25题虽提到 E、F 和 A–D，但仍以成组概括代替 A–G 逐项排除。
- 第26题只单独说明 G，其余 A–E 被合并成“其余段”。

修正要求：第22–26题每题都明确列出 A–G（正确段除外的六个干扰段）及各自不匹配的主题/信息点；JSON 的 `distractorsZh` 与 Markdown 同步更新。

## 已确认无问题的项目

- 标题、副标题、脚注及总体答题指令与校准源一致。
- A–G 段落边界、44句原句文本、顺序和段落归属一致。
- 句1–44均有中文翻译与句法/表达作用说明；除 P2-BR-03 外未发现实质性翻译或句法错误。
- Q14–17 摘要正文与 ONE WORD ONLY 限制完整；四个答案及可接受答案正确。
- Q18–21 的 A–F 全部句尾选项与翻译完整；四个答案正确。
- Q22–26 的题干、A–G 标签、可重复使用字母提示及五个答案正确。
- 三个 A层深挖均为六件套，且三条 Cambridge 链接分别位于三个深挖中；没有额外链接或图片。

## 最终复核区

状态：通过。已由原初审者对修后 JSON 与 Markdown 做针对性复核；本轮未修改生成稿。

- P2-BR-01：通过。句1、句41的误收 `danger` 和句36的误收 `Sustain` 已删除；句22、句25均改为原句实际出现的 `recently (B1)`，JSON 与 Markdown 一致。
- P2-BR-02：通过。句4 `points out`、`warning about`，句7 `nearly`，句23 `started out`，句24 `came to realise`、`developed`，句25重复出现的 `cocktail`，以及句27/28/29/42的 `weak`、`solve`、`face`、`difficulty` 均已逐句补入；复查未见该组指定项遗漏。
- P2-BR-03：通过。句27已译为“对照试验地中用传统肥料培育出来的少数植物又小又弱”，句法说明明确 `fed with traditional fertilisers` 是表示被动处理的过去分词短语，不再把植物写成主动施肥者。
- P2-BR-04：通过。第19题证据与定位扩展至 D 段句18–22，完整串联 Haber–Bosch 工艺、synthetic fertiliser 身份以及大气、河流和土壤损害。
- P2-BR-05：通过。第21题证据与定位扩展至 G 段句36–39，显式包含 `governments and the wider public`、零净土地退化目标及其塑造预期、促进行动的作用。
- P2-BR-06：通过。第24–26题均已逐一列明正确段之外的 A–G 各干扰段及不匹配原因，JSON 与 Markdown 同步。
- 回归核对：A–G 七段与连续 1–44 句保持不变；44句仍按顺序逐字符命中校准正文。三组题型与 Q14–26 连续完整，答案仍为 `minerals, carbon, water, agriculture, C, E, A, D, E, C, F, G, F`。A层深挖 / Cambridge Dictionary 链接 / 图片仍为 `3 / 3 / 0`。
- 最终遗留问题数：0。