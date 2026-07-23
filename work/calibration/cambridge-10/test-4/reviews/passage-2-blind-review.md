# Cambridge IELTS 10 Test 4 Passage 2 首轮交叉盲审

## 审查范围与方法

- 审查对象：`work/calibration/cambridge-10/test-4/passage-2.json` 与 `data/generated/intensive-reading/cambridge-10-12/Cambridge-IELTS-10-Test-4-Passage-2-双语精读.md`。
- 原书人工核对：PDF 物理页 84–88（正文、题目）及物理页 150（官方答案）均按原始分辨率逐页查看；物理页 84–85 的正文、86–88 的三组题和答案页中的 14–26 均直接与书页核对，未以 OCR 或脚本结果代替人工检查。
- 辅助机械核对：将 MD 的 51 个编号英文单元按来源顺序回贴到副标题及 A–H 段，检查每个单元字符及单元之间的非空白缺口；另检查 pages.json/raw.md、题号、A 层、Cambridge 链接和图片计数。
- 首轮结论：**未达零遗留问题**。来源校准、51 个英文单元、题目与答案准确，但 MD 有 3 类实际问题。只写本报告，未修改 passage-2.json 或精读 MD。

## 必须修正的问题

### 1. 人物选项 A–G 没有给出中文翻译

- 位置：MD “Questions 19–22：人物匹配”下的“人物选项”。
- 当前七项均把英文姓名原样重复在破折号两侧，例如 `A Christopher Peterson — Christopher Peterson`，没有输出校准 JSON 已提供的中文译名。
- 这不满足“所有选项及翻译”要求；专有名词也应使用 JSON 中的译名，而不是重复英文。
- 应改为：A 克里斯托弗·彼得森；B 戴维·法伊根鲍姆；C 苏珊娜·塞格斯特罗姆；D 坦尼娅·斯特里特；E 托德·卡什丹；F 肯尼思·佩德洛斯；G 辛西娅·普里。英文姓名仍须保留。

### 2. 8 处基础词/表达的 CEFR 被明显标成 B1 或更高

以下均为当前句义下的 Cambridge Dictionary 基础层级，应按强制格式改为“基础词（A1/A2）”或“基础表达（A1/A2）”；重复出现处必须分别修正：

- 句 16、33：`have to` 表“必须/不得不”是 A2，现标 `(B1)`。
- 句 21、48：`believe` 表“认为/相信”是 A2，现标 `(B1)`。
- 句 23：`actually` 表“其实/事实上”是 A2，现标 `(B1)`。
- 句 32：`advice` 是 A2，现标 `(B1)`。
- 句 37：`finally` 在“经历一段时间后终于”这一句义是 A2，现标 `(B1)`。
- 句 39：`including` 是 A2，现标 `(B1)`。
- 句 42：`conversation` 是 A1，现标 `(B1)`。
- 句 31：`the secret` 在“取得某种结果的诀窍/关键”这一句义是 B2，现将 `secret` 标成 `(B1)`，应按本句义上调为 `(B2)`。

### 3. 句 31 漏掉 B1+ 因果结构 `which is why`

- 原句：`... they require discipline, hard work and ability, which is why they are so rewarding.`
- 句法段虽提到 `which is why`，但“本句词汇”没有给它独立 CEFR 标注和释义；强制规则要求本句所有 B1+ 词或短语在本句独立讲解，不能只在句法段顺带点到。
- 建议补为 `which is why（B2）这就是为什么……`（如生成者采用 B1，须保持明显合理且独立标注）。

## 已验证通过的项目及证据

### 原书、JSON、pages.json/raw.md 与正文英文

- 物理页定位正确：正文 84–85，题目 86–88，官方答案 150。
- JSON 元数据正确：`status=manually_calibrated`、`sourcePages=[84,85,86,87,88]`、`bodyPages=[84,85]`、`questionPages=[86,87,88]`、`answerKeyPage=150`、`images=[]`。
- 标题 `Second nature`、两句副标题、A–H 八段、三组题目指令、摘要全文、人物 A–G、段落标签 A–H 均与原书视觉核对一致。
- pages.json 与 raw.md 共 165 页逐页文本相等；物理页 84–88 均与 passage-2.json 的 `pages` 字段逐字符一致，且标记为人工视觉校准。
- MD 有 51 个编号英文单元，编号 1–51 连续：副标题 2 个单元，A–H 正文 49 句。每个单元均为校准 JSON 中的连续原文子串；单元之间只有来源中的空白/换段，没有漏字符、增字符、倒序、合并或遗漏。
- 逐句中文翻译和主干/修饰/表达作用未发现改变原意的错误；专业词均带有领域和 CEFR，除上列 CEFR 问题外未发现其他明确错标。

### 题目、答案、证据与干扰项

- JSON 有 3 个题组、13 道题，完整覆盖 14–26；MD 的题号也连续覆盖 14–26。
- Questions 14–18 的全部指令、`NO MORE THAN TWO WORDS`、摘要全文、字数限制和可接受答案均完整。
- Questions 19–22 的英文指令、A–G 七个人物英文姓名和四道题干完整；除人物中文译名问题外，题目翻译、答案、证据、定位及干扰项正确。
- Questions 23–26 的英文指令、A–H 八个段落标签及中文概述完整；四道题的答案、证据、定位和干扰项正确。
- 物理页 150 的官方答案逐项核对为：14 `transformation/change`；15 `young age`；16 `optimism`；17 `skills/techniques`；18 `negative emotions/feelings`；19 E；20 C；21 G；22 A；23 E；24 C；25 G；26 H。JSON 与 MD 全部一致。
- JSON 的 evidenceLocation 与正文编号关系正确；所有 13 题在 MD 中均有可直接核对的英文证据，没有只列答案或只用中文概述代替证据。

### 格式与图片

- A 层深挖恰好 3 个。
- Cambridge Dictionary 链接恰好 3 条，且总外链也是 3 条。
- Markdown 图片 0 张，JSON `images=[]`；没有正文页、题目页或答案页整页截图。

## 复核状态

- 当前状态：**待生成者修正后复核**。
- 针对性复核入口：人物 A–G 中文译名；上述 CEFR 句号位；句 31 的 `which is why`。
- 回归要求：51 个英文单元与 JSON 仍须逐字符一致；题号 14–26、全部答案与证据、3 A 层/3 链接/0 图不得发生回归。
- 最终零遗留结论：尚未出具。

## 修订后针对性复核

- 人物选项 A–G 已全部保留英文姓名并补入校准 JSON 对应的中文译名：克里斯托弗·彼得森、戴维·法伊根鲍姆、苏珊娜·塞格斯特罗姆、坦尼娅·斯特里特、托德·卡什丹、肯尼思·佩德洛斯、辛西娅·普里；七项逐项匹配，无重复英文冒充翻译的残留。
- 首轮列出的基础层级问题均已按本句义修正：句 16/33 的 `have to`、句 21/48 的 `believe`、句 23 的 `actually`、句 32 的 `advice`、句 37 的 `finally`、句 39 的 `including`、句 42 的 `conversation` 均改用“基础词/基础表达（A1/A2）”格式。
- 句 31 的 `the secret` 已按“诀窍、关键”义标为 `(B2)`；`which is why（B2）这就是为什么……` 已在本句词汇中独立标注和解释，不再只出现在句法说明里。
- 正文回归：51 个编号英文单元仍为 1–51 连续；副标题 2 个单元与 A–H 正文 49 句逐项回贴校准 JSON 后，没有字符差异、非空白缺口、漏句、合并或倒序。
- 来源回归：物理页 84–88 的 passage-2.json、pages.json、raw.md 三层文本仍逐字符一致；pages.json/raw.md 全部 165 页也保持逐页一致。
- 题库回归：JSON 仍有 3 个题组、13 道题；MD 与 JSON 均连续覆盖 14–26。官方答案仍为 14 `transformation/change`、15 `young age`、16 `optimism`、17 `skills/techniques`、18 `negative emotions/negative feelings`、19 E、20 C、21 G、22 A、23 E、24 C、25 G、26 H；每题的英文证据、定位和干扰项字段均在，无答案或讲解回归。
- 格式回归：A 层深挖 3 个、Cambridge Dictionary 链接 3 条、Markdown 图片 0 张，JSON `images=[]`。

**最终结论：通过，零遗留问题。**
