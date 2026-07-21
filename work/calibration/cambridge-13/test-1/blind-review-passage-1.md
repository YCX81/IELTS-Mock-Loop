# Cambridge IELTS 13 Test 1 Passage 1 非生成者盲审

审计范围：校准来源物理页 17–20、官方答案页 118；生成稿 `Cambridge-IELTS-13-Test-1-Passage-1-双语精读.md`；结构化文件 `passage-1.json`。

本轮仅报告问题，未修改生成稿或结构化 JSON。

## 已通过项目

- 页 17–18 正文规范化拼接后共 5,232 字符，与 `bodyParagraphs` 逐字符一致。
- `bodyParagraphs` 可按顺序无损重建为 39 个句子；Markdown 的 39 个英文句子与 JSON 的 `sentences[].text` 编号、顺序、标点和字符全部一致。
- 标题与原书一致；原书无副标题，JSON 的 `subtitle: null` 正确。
- Questions 1–7 的整张表、栏目标签、题干和 `ONE WORD ONLY` 限制均已覆盖。
- Questions 8–13 的六条声明、TRUE / FALSE / NOT GIVEN 三类标签及翻译均已覆盖。
- 官方答案与答案页 118 完全一致：1 update；2 environment；3 captain；4 films；5 season；6 accommodation；7 blog；8 FALSE；9 NOT GIVEN；10 FALSE；11 TRUE；12 NOT GIVEN；13 TRUE。
- 13 题的证据、定位、字数限制或判断逻辑及干扰项排除没有发现事实错误。
- A 层深挖 3 个、Cambridge Dictionary 链接 3 条、图片 0 张，数量符合要求。

## 必须修正的问题

### P1-01｜总体答题指令未完整保留英文原文

位置：Markdown `Questions 1–13 题目与选项精讲` 开头；JSON 顶层/题组结构。

现稿只有中文概述“建议用约20分钟完成第1–13题”，没有逐字保留原书总体指令：

`You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.`

用户要求覆盖“总体答题指令”。应在题目精讲开头加入完整英文原句及准确中文翻译；结构化数据也应保存该总体指令，不能只保留两个题组各自的 instruction。

### P1-02｜第 10 句译文漏掉原文的 `address`

原句：`This meant that even the smallest bed and breakfast address or specialist activity provider could gain a web presence with access to an audience of long-haul visitors.`

现译：“即便是规模最小的住宿加早餐旅店或专项活动服务商……”

问题：原书明确写的是 `bed and breakfast address`，现译把 `address` 无声删除并把整个短语改成“旅店”。来源规则要求即使原文表达看起来不寻常，也不得推测性抹去。译文至少要体现“住宿加早餐地址／登记项”这一层信息；句法讲解也应说明 `bed and breakfast address` 与 `specialist activity provider` 是 `or` 连接的两个并列中心。

### P1-03｜第 25 句译文搭配不自然且主语关系含混

原句：`More importantly perhaps, the growth of tourism to New Zealand was impressive.`

现译：“也许更重要的是，前往新西兰的旅游业增长十分可观。”

“前往新西兰的旅游业”不是自然中文，也容易被理解为某个行业在移动。这里的 `tourism to New Zealand` 是“赴新西兰旅游／入境旅游”，应明确译成“赴新西兰旅游的增长势头十分可观”或“新西兰入境旅游的增长十分可观”。

### P1-04｜第 32 句译文不符合自然中文搭配

原句：`It has also been found that visitors enjoy cultural activities most when they are interactive ...`

现译：“当文化活动具有互动性时，游客最为享受……”

中文不能自然地说“游客最为享受”。应改为“游客最喜欢互动式文化活动”或“文化活动具有互动性时，游客最能乐在其中”，同时保留 `most` 的最高程度。

### P1-05｜第 39 句 `underlying lessons` 译义不准

原句：`However, the underlying lessons apply anywhere ...`

现译：“然而，其深层经验适用于任何地方……”

这里的 `lessons` 是由案例提炼出的“启示／经验教训”，`underlying` 是“背后的、根本的”，不是“深层经验”。建议改为“然而，这一案例背后的根本启示适用于任何地方”。现有句法说明本身正确，但译文需与其“把个案提升为普遍原则”的解释一致。

### P1-06｜第 38 句讲了原文中不存在的词块 `on average`

原句括号内是：`(average 20 days)`。

现稿词项：`on average` (B1)。

问题：`on average` 并未出现在原句，不能用迁移表达替代逐字符词项覆盖。应讲原文实际形式 `average 20 days`，并说明这是括号中的压缩表达，可展开理解为 `an average of 20 days`；如需补充 `on average`，只能作为额外近义表达，不能冒充原文词项。

### P1-07｜`campaign` 的 CEFR 明显低标，且后两次出现漏讲

第 5 句把 `launch a campaign` 标为 B2；Cambridge Dictionary 对本文“为特定目标规划的一系列商业活动”这一名词义标为 C1。应改为 `(C1，市场营销专业表达)`。

同一词在第 6 句 `The campaign focused ...` 和第 7 句 `A key feature of the campaign ...` 再次出现，却均未独立讲解，违反重复 B1+ 项每次重新讲解的要求。三句应分别保留本句语境义，不能只靠第 5 句一次解释覆盖后文。

### P1-08｜重复或独立出现的 B1+ 项仍有系统性漏讲

逐句核对后，至少以下项目在对应句中没有独立词项；括号内为应使用的等级或最低等级。生成者修正时应逐句补入，并再次扫描同类遗漏：

- 第 2 句：`tourism` (B1，旅游业专业词)。
- 第 3 句：`tourism` (B1，旅游业专业词)，为重复出现，仍须解释。
- 第 6 句：`campaign` (C1，市场营销专业词)，见 P1-07。
- 第 7 句：`campaign` (C1，市场营销专业词)，见 P1-07。
- 第 8 句：`tourism` (B1，旅游业专业词)；现有 `operator` 词项不能替代复合名词中再次出现的 `tourism`。
- 第 12 句：`improve` (B1)；`organisation` (B1)。本句同时出现动词 `organised` 和复数名词 `organisations`，现稿只讲了 `organise a scheme`，没有覆盖后一个独立词项。
- 第 16 句：`feature` (B2)；这是继第 7、14 句后的再次出现。
- 第 17 句：`feature` (B2)；再次出现仍须解释。
- 第 19 句：`feature` (B2)；再次出现仍须解释。
- 第 28 句：`allow ... to ...` (B1)；这一结构已在第 19 句出现，但本句再次出现而未讲。
- 第 30 句：`accommodation` (B1，旅游业专业词)；已在第 21 句讲过，但本句重复出现必须再讲。
- 第 39 句：`however` (B1)；`lesson` 在“由经验提炼出的启示”这一义项为 B2；`strong brand` 也应作为本句再次出现的市场营销表达独立说明。

## 复核要求

生成者完成修改后，针对以下项目逐项复核：

1. P1-01 的英文总体指令是否逐字符正确，并已中英双语覆盖；
2. 第 10、25、32、39 句译文及第 10 句句法是否修正；
3. 第 38 句是否不再把 `on average` 当作原文词项；
4. 第 5–7 句 `campaign` 是否统一按本文义项标为 C1 且每次独立解释；
5. P1-08 所列每个重复/独立 B1+ 项是否在对应句中出现；
6. 修订后仍保持 39 句逐字符一致、3 个 A 层、3 条 Cambridge 链接、0 图片，Questions 1–13 与答案序列不变。



## 第二轮针对性复核

复核日期：2026-07-21。

### 已关闭

- P1-02：第 10 句已保留 `address`，译文与并列句法已修正。
- P1-03：第 25 句已改为自然准确的“赴新西兰旅游的增长势头”。
- P1-04：第 32 句已改为“游客最喜欢互动式文化活动”。
- P1-05：第 39 句已改为“案例背后的根本启示”。
- P1-06：第 38 句已讲原文实际形式 `average 20 days`，未再把 `on average` 冒充原文词项。
- P1-07：第 5–7 句 `campaign` 已统一为 C1，并逐句独立解释。
- P1-08：报告所列 15 个对应句/词项已全部补入。
- 回归检查：页 17–18 正文仍与 JSON 逐字符一致；39 句 Markdown/JSON 英文仍逐句一致；Questions 1–13 答案序列未变；A 层/链接/图片仍为 3/3/0。

### 尚未关闭：P1-01 中文总体指令有叠词

Markdown 与 JSON `generalInstructionZh` 当前均写为：

“你应该用大约20分钟完成第1–13题；这些题目以以下阅读文章1为依据。”

“以以下”是不自然的叠词，未达到“准确自然中文翻译”的要求。英文总体指令已经逐字符正确，只需把两处中文统一改为例如：

“你应该用大约20分钟完成第1–13题；这些题目以下方的阅读文章1为依据。”

或更自然的：

“你应该用大约20分钟完成第1–13题；这些题目均以阅读文章1为依据。”

当前结论：第二轮仍有 1 个遗留问题，暂不能签署零遗留。修正 MD 与 JSON 两处中文后需做最后一次针对性复核。


## 第三轮最终复核

P1-01 的唯一遗留已修正：

- Markdown 总体指令译文现为“这些题目均以阅读文章1为依据”；
- JSON `generalInstructionZh` 与 Markdown 完全一致；
- 旧字符串“以以下”在 Markdown 与 JSON 中均为 0 处。

最终回归结果：

- P1-01 至 P1-08 全部关闭；
- 页 17–18 校准正文与 JSON `bodyParagraphs` 逐字符一致；
- Markdown 与 JSON 共 39 句，英文编号、顺序和字符完全一致；
- Questions 1–13 的题干、表格、标签、答案、证据和干扰项没有回归；
- 官方答案序列保持为 `update / environment / captain / films / season / accommodation / blog / FALSE / NOT GIVEN / FALSE / TRUE / NOT GIVEN / TRUE`；
- A 层深挖 3 个、Cambridge Dictionary 链接 3 条、图片 0 张。

最终结论：Passage 1 非生成者盲审零遗留。
