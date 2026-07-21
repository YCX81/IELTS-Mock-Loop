# Cambridge IELTS 12 Test 4 Passage 2 独立盲审

## 审查范围

- `work/calibration/cambridge-12/test-4/passage-2.json`
- `data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-12-Test-4-Passage-2-双语精读.md`
- 未读取任何旧精读正文；未修改被审正文。

## 首轮盲审发现

首轮结论：未通过，发现 4 类需修正问题。

1. 句 12–41 曾使用同一泛化句法模板，未逐句指出真实主干、修饰对象和表达作用。
2. `animal`、`poem`、`describe` 等明显 A1/A2 词曾误标为 B1，未遵守基础词／基础表达的指定格式。
3. 句 4 曾加入原句未出现的派生形式 `tassel-eared`，句 8 还由词根匹配产生了孤立 `hunter` 误报。
4. 跨页句 22 虽为一个完整句子，但首轮记录不足以明确页 83–84 的跨页事实，需要显式的跨页元数据。

## 修正记录

- 句 12–41 已逐句重写专属句法分析。
- 明显 A1/A2 项已改用“基础词（A1/A2）”或“基础表达（A1/A2）”；同时清除派生词与词根误报。
- 句 22 保留完整句，并记录 `sourcePages: [83,84]`、`crossPage: true`、`pageEnd: 84`。
- 修正未改变 41 句英文、题 14–26、官方答案、3 个 A 层、3 条链接和 0 图片。

## 审查结果

- 正文共 9 段、41 个完整英文句子，编号 1–41 连续，无合并、漏号或乱序。
- Markdown 的 41 个英文句子与校准 JSON 的 `section.sentences` 逐句逐字符一致，包括大小写、连字符、引号及标点。
- 41 句均有中文翻译和针对本句的主干、修饰关系或表达作用说明；未发现通用句法占位、`TODO`、`undefined`、待补文本或模板残留。
- 第 2 句 `But what was it?` 没有机械添加词汇项，符合该句无须单列 B1+ 项的实际情况；其余句子的重复 B1+ 词语按出现句重新讲解，未发现明显漏项或明显 CEFR 误标。
- A 层深挖恰好 3 处：`totemic`、`resonate through`、`marry well with`。
- Cambridge Dictionary 链接恰好 3 条；图片为 0。
- 题号完整覆盖 14–26，共 13 题；答案序列为：`D, A, C, A, C, E, D, F, A, NO, NOT GIVEN, YES, YES`，与指定官方答案完全一致。
- Questions 14–18：每题均含完整题干及翻译、A–D 四个选项及翻译、官方答案、原文证据、定位说明，并逐项排除三个干扰项。
- Questions 19–22：组指令与 A–F 六个标签及翻译完整；每题均重复呈现全部标签，含官方答案、证据、定位和其余五项排除依据。
- Questions 23–26：YES / NO / NOT GIVEN 三个判断标签及翻译完整；每题均含官方答案、证据、定位，并说明另外两个判断为何不成立。
- JSON 中 13 题均带 `sourcePages`、`answerKeyPage: 123`、`acceptableAnswers`、证据、定位与干扰项分析；Markdown 与 JSON 的题干、选项、答案和解析一致。

## 最终结论

零遗留问题。该篇通过独立盲审，无需返修。

## 原审计者针对性复核

针对首轮提出的四类问题复核如下：

1. 句 12–41 均已改为与具体句子对应的专属句法说明，逐条交代实际主干、修饰结构、逻辑关系或表达作用；未再发现原通用模板残留。
2. 首轮点名的 `animal`、`poem`、`describe` 等基础词已改为“基础词（A1/A2）”格式；抽查其重复出现位置，格式保持一致。
3. 句 4 未出现原先误加的 `tassel-eared`；句 8 未再把孤立的 `hunter` 作为误报词项，保留的 `mounted hunter` 与原句实际词组一致。
4. 句 22 仍作为一个完整英文句子，现明确包含 `sourcePages: [83,84]`、`crossPage: true` 和 `pageEnd: 84`，跨页事实记录完整。

针对性复核结论：首轮四类问题均已修正，**零遗留问题**。修订未改变 41 句英文正文、题 14–26、3 个 A 层、3 条 Cambridge Dictionary 链接和 0 图片的既有结构。
