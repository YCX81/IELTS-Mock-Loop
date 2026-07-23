# Cambridge IELTS 11 Test 3 Passage 1｜生成者自检

## 来源校准

- 已按原始分辨率逐页目视检查正文物理页 63–64、题目物理页 65–66、官方答案物理页 127。
- 已确认正文采用物理页 63 的左栏、右栏，再接物理页 64 的左栏、右栏顺序。
- 已确认第 18 句跨页连续：物理页 63 末尾 `bringing gold, silver and` 与物理页 64 开头 `wool to the East.` 合为一个完整句子。
- 已人工核对标题、副标题、5 个正文段落、题组范围、全部指令、笔记分类标题、题号及 TRUE/FALSE/NOT GIVEN 说明。
- 已对照物理页 127 核实官方答案：`tea, reel, women, royalty, currency, paper, wool, monks, nylon, FALSE, TRUE, FALSE, NOT GIVEN`。

## 结构与逐字符检查

- JSON 状态：`manually_calibrated`。
- `sourcePages`：63–66；`passagePages`：63–64；`questionPages`：65–66；`answerKeyPage`：127。
- 正文：5 段、40 个完整句子。
- 精读：40 个编号英文句；脚本逐项比较 JSON `paragraphs[].sentences[]` 与精读英文引用，40/40 逐字符一致，顺序一致，无合并或遗漏。
- 题库：2 个 question sections、13 道题，题号连续覆盖 1–13；`officialAnswers` 为 13 项，逐题与结构化答案一致。
- Q1–9 已收录完整笔记填空指令、两个分类标题、所有笔记行、一个词字数限制、可接受答案、证据、定位和干扰依据。
- Q10–13 已收录完整判断题指令、4 个题干、官方答案、证据、定位及 TRUE/FALSE/NOT GIVEN 排除逻辑。

## 精读质量检查

- 每句均包含自然中文翻译、主干/修饰/表达作用和词汇讲解。
- 已人工回扫全部 40 句的 B1+ 单词与短语；同句或后文重复出现的核心项继续在对应句独立标注，专业项同时标领域与 CEFR。
- A 层深挖：恰好 3 个，分别为 `legend has it that`、`lucrative`、`recapture its position`；每项包含本句义、表达边界、篇章作用、两个迁移例句及近义差别。
- Cambridge Dictionary 链接：恰好 3 条。
- 图片：0；无正文页、题目页或答案页截图模块。
- 题目精讲位于正文精读之后，覆盖总体指令、各题组指令、题干翻译、字数限制、答案、原文证据、定位逻辑和干扰项排除。

## 机械校验结果

- JSON 可正常解析。
- 段落数 5；JSON 句数 40；精读英文句数 40；逐句差异 0。
- question section 数 2；题目数 13；答案数 13；题号断档 0；答案映射差异 0。
- A 层数量 3；Cambridge Dictionary 链接数量 3；Markdown 图片数量 0。
- `git diff --check`：通过。

## 首轮盲审修正复查

- P1-01 已处理：句 31 的两次 `silk`、句 35 的两次 `such as`、句 37 的两次 `production`、句 38 的两次 `raw silk` 均按出现次序独立讲解；句 40 分别讲解动词 `produce` 与名词 `production`；句 13 补入 `be used as`。随后再次回扫 40 句的同句重复项。
- P1-02 已处理：句 3/9 `several`、句 4/5 `collect`、句 5 时间连词 `while`、句 9 `certainly`、句 12 `finally`、句 18 `create`、句 21 `across`、句 26/27/29/30/33/35 `century`、句 40 `almost` 已改用“基础词/基础表达（A1/A2）”；句 26/30/39 `however` 已改为 B2。
- 修订未触碰 40 个英文原句；修订后 JSON/Markdown 英文逐字符差异仍为 0。
- 已运行 `node work/integrate-c11-t3.mjs` 与 `node scripts/validate-c11-t3.mjs --shared`，两者均通过；随后再次运行目标文件 `git diff --check`，结果通过。

结论：首轮盲审 P1-01、P1-02 已逐项修正并完成生成者复查，可交原审计者针对性复核。
