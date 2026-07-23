# Cambridge IELTS 10 Test 3 Passage 3 首轮交叉盲审

## 审计范围与来源

- 审计对象：`work/calibration/cambridge-10/test-3/passage-3.json`
- 审计对象：`data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-10-Test-3-Passage-3-双语精读.md`
- 唯一原书依据：`data/Cambridge-IELTS-10.pdf` 物理页 64–68、官方答案物理页 148。
- 已逐页查看原始 PDF 渲染；物理页 64–65 的双栏阅读顺序人工复核完毕。第 3 段从第 64 页左栏续至右栏，第 8 段从第 65 页左栏续至右栏，当前 JSON 与精读顺序正确。

## 首轮结论

首轮发现 **2 类、6 个可执行问题**；除下列问题外，未发现正文或题库的来源性错误。

### 1. 句 17 翻译的修饰关系错误

- 当前英文：`how did the Lapita accomplish the ancient equivalent of a moon landing, many times over?`
- 当前译文：`拉皮塔人究竟如何多次完成堪比古代“登月”的壮举？`
- 问题：`ancient` 修饰 `equivalent` 所处的时代，意思是“在古代相当于登月的事”，不是“古代的登月”。当前“古代‘登月’”会让 `ancient` 错误地修饰 `moon landing`。
- 建议：改为类似“拉皮塔人究竟如何一次又一次完成了在古代堪比登月的壮举？”；同步校正句法说明中 `ancient equivalent` 的解释，避免继续使用“古代对应物”这种容易误挂修饰语的表述。

### 2. 五处本句 B1+ 词项覆盖缺口

强制规则要求每一次出现的 B1+ 词或短语都在本句再次独立讲解。以下词项出现在英文中，但对应句的“词汇与短语”未收录：

1. 句 4：`some 3,000 years old` 中近似数量用法 `some + 数字`，应按 B1+ 表达讲解为“约、大约”。
2. 句 9：`jungle`，应独立标级并解释；当前只收录了复合词 `jungle-clad`，没有覆盖作为构词成分出现的 `jungle` 的本义。若团队约定复合词整体已覆盖全部成分，可在复核时明确豁免；按“本句所有 B1+ 单词和短语”的字面规则，当前属于缺项。
3. 句 13：重复出现的 `site` 未再次讲解；同句的身份表达 `head of the international team` 也未收录。
4. 句 20：重复出现的 `canoes` 未再次讲解。句 18 已讲过 `canoe`，但规则要求重复出现仍逐句重讲。
5. 句 33：`professor of prehistory` 未作为完整身份表达讲解；当前只有 `prehistory`，未覆盖本句再次出现的 `professor`/`professor of ...`。

## 已验证通过的项目

- 正文/导语共 **43** 个编号单位，编号连续；与校准 JSON 的 43 个单位逐字符一致，未发现合并、遗漏、倒序或跨栏错接。
- 标题、导语、11 个正文段落及原书标点顺序与物理页 64–65 一致。
- 三处 A 层深挖准确为 **3**；Cambridge Dictionary 链接准确为 **3**；Markdown 图片准确为 **0**。
- A 层分别落在 `voyager`、`launch out on`、`presuppose`，未发现多余链接或隐性图片。
- 题号 **27–40** 连续完整；27–31 的摘要标题、三段摘要、A–J 十个标签和文本均与物理页 66 一致。
- 32–35 的每题题干及 A–D 全部选项均与物理页 67 一致；三项错误选项均有排除说明。
- 36–40 的 YES / NO / NOT GIVEN 总指令、定义和五道陈述均与物理页 68 一致。
- 官方答案与物理页 148 完全一致：`27 B, 28 F, 29 I, 30 G, 31 D, 32 C, 33 A, 34 D, 35 C, 36 NO, 37 YES, 38 NOT GIVEN, 39 YES, 40 NOT GIVEN`。
- 每题均具备答案、原文证据、定位逻辑及干扰项说明；本轮未发现答案、证据指向、定位或干扰项逻辑错误。
- `sourcePages=[64,65,66,67,68]`、`bodyPages=[64,65]`、`questionPages=[66,67,68]`、`answerKeyPage=148` 均正确；`images=[]` 符合原书地图仅为装饰、不影响答题的处理原则。

## 针对性复核入口

修复后仅需重点复核：句 17 的翻译与句法说明，以及句 4、9、13、20、33 的词汇列表；其余来源、结构和题目项首轮已通过。

---

## 针对性复核（修复后）

复核范围仅限首轮列出的 6 个问题及必要回归项，结论为 **零遗留问题**：

- 句 17 已改为“如何一次又一次完成了在古代堪比登月的壮举”，正确恢复 `ancient` 对古代等同壮举的限定；句法说明与 `the ancient equivalent of` 词项同步准确。
- 句 4 已补 `some + 数字 (B1)`；句 9 已补 `jungle (B1)`；句 13 已补 `head of the international team (B2)` 和重复 `site (B1，考古学专业词)`；句 20 已补重复 `canoe (B1，航海专业词)`；句 33 已补 `professor of prehistory (B2，历史学专业表达)`。
- 回归核验：43 个英文单位与校准 JSON 逐字符一致，无新增、删减或顺序变化；题号 27–40 连续，JSON 共 14 题；A 层 3、Cambridge Dictionary 链接 3、图片 0，JSON `images=[]`。
- 首轮已通过的来源页、双栏顺序、题干、A–J/A–D 选项、答案、证据、定位和干扰项均未发生回归。

最终状态：**通过，零遗留问题。**