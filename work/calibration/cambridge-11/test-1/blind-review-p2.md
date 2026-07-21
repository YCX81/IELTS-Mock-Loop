# Cambridge IELTS 11 Test 1 Passage 2 独立盲审报告

审阅范围：物理页 19–22、官方答案物理页 123、`passage-2.json` 与全新 Passage 2 双语精读。未参考旧精读，未修改任何被审稿件。

## 核对结论

- 正文：7 段、33 句；句数、段序、句序正确。物理页 19 的 `Celtic double- / headed axe`、物理页 19→20 的 `Archimedes' principle of displacement, / floating objects ...`、物理页 20 的 `outer arms of the / Wheel` 均已正确合并。
- JSON 与精读：33 个英文句子目前彼此逐字符一致。
- 题目：Q14–26 齐全；官方答案与物理页 123 完全一致（14 FALSE，15 NOT GIVEN，16 TRUE，17 NOT GIVEN，18 FALSE，19 TRUE，20 gates，21 clamp，22 axle，23 cogs，24 aqueduct，25 wall，26 locks）。证据、定位和主要干扰逻辑总体正确。
- 图：保留 1 张紧裁福尔柯克轮流程图是必要的；机械空间关系、箭头、固定标签和 Q20–26 标签均完整清晰，未夹带整页截图或装饰内容。
- 形式计数：恰好 3 个 A 层深挖、3 条 Cambridge Dictionary 链接、1 张图片；五个必需章节齐全。

## Blocker

无。

## Major

### M1｜正文没有逐字符保留原书的排印标点

原书图像中以下位置为 en dash `–`，JSON 和精读却写成 hyphen-minus `-`：

- 句 4：`11 locks – enclosed ... lowered – that stepped down ...`
- 句 21：`the Wheel – roughly the same ...`
- 句 29：`the outer cogs – so ensuring ...`

此外，原书使用弯引号/弯撇号，当前稿统一成直引号：

- 句 1：`world’s`
- 句 10：`Engineering’s`
- 句 16：`‘gondolas’`
- 句 18：`Archimedes’`
- 流程图固定标签：`Wheel’s two gondolas`

建议：以物理页为准统一修正 `passage-2.json`、精读逐句英文、校准页文本及后续题库中的对应引文，避免只改一个镜像造成新的不一致。

### M2｜原书题号范围和 Q20–26 图标签被规范化改写，不是逐字符题干

- 总指令及题型标题原书均为 `Questions 14–26`、`Questions 14–19`、`Questions 20–26`，当前 JSON/精读相关位置使用 `14-26`、`14-19`、`20-26`。
- 物理页 22 的七条图标签末尾均没有句点；JSON 的 `prompt`、`diagramLabel` 与精读题干给 Q20–26 全部增加了 `.`。
- 原图是点引导线，当前结构化题干将空格统一写成下划线。若题库 schema 允许，应保留原书标签文本并把答案槽单独结构化；至少不能把经过格式化的文本宣称为逐字符题干。
- Q14–19 原书指令是分行结构：主问题、`In boxes ... write`、三条 TRUE/FALSE/NOT GIVEN 定义。当前 JSON 将其压成一句并自行加入逗号。建议保留逐行原文（或结构化成 instructionLines），精读展示也按原书完整呈现。

### M3｜逐句词汇未覆盖全部重复出现的 B1+ 项

以下是明确遗漏，需在对应句下逐项补讲并独立标 CEFR；已经在其他句讲过也不能省略：

- 句 3：`project` (B1)、`canal`（至少 B2，水运专业词）。
- 句 4：`join` (B1)、`canal`（重复出现，水运专业词）、`section` (B1)。
- 句 6：`not only ... but also ...`（B1/B2 结构；当前仅在句法中提到，未作为词汇项独立标级）。
- 句 7：`project` (B1)、`rolling/roll` (B1)、`tank` (B1)、`giant` (B2)。
- 句 8：`huge` (B1)。
- 句 9：`shape` (B1)、`source` (B1)。
- 句 11：`steel` (B1；前文出现过，但本句必须再次讲解)。
- 句 12：`finally` (B1；本句流程标记词)、`position` (B1；可并入但须明确标级的 `lift into position`)。
- 句 23：`steel` (B1)、`raise` (B1)。
- 句 26：`central` (B1/B2) 在 `central machine room` 与 `central axle` 两次出现；当前只通过前一个短语隐含覆盖，后一次未独立说明。
- 句 28：`position` (B1)。
- 句 29：`width` (B1)。
- 句 32：`canal`（重复出现，水运专业词）。

建议修订时再逐句做一次“英文 token/短语 → 本句词汇条目”的人工反查，重点关注普通 B1 词；当前专业词覆盖较好，但常见 B1 词更容易漏。

## Minor

### m1｜句 13 的 `withstand` 明显标高

当前标为 `(C2)`；建议改为 `(C1)`。它是高级正式词，但通常不应上标到 C2。总表中的 `withstand stress | C2 + C1` 也应同步改成 `C1 + C1` 或合并为符合既定格式的单项等级。

### m2｜句 21 中文没有准确呈现数量类比

原句 `roughly the same as boiling eight small domestic kettles of water` 指“约等于烧开八小壶水所需的能量”。当前译文“相当于用八个小型家用水壶烧水”容易被读成同时使用八只水壶这一设备动作，弱化了水量/能耗类比。建议改为“约相当于烧开八小壶水所需的能量”。

### m3｜句 6 的 `a fitting commemoration` 翻译略有增义

当前译为“纪念千禧年的恰当建筑”，原文中心词是 `commemoration`，没有明说 `building`。建议改为“对千禧年的恰当纪念（物）”，以免把 `landmark` 的建筑属性错误塞入该并列补语。

## 修后复核重点

1. 同步核对 JSON、精读英文、校准页文本中的 en dash 和弯引号，确保三处来源一致。
2. 逐一比对物理页 21–22 的题型指令和七条图标签，不保留人为添加的句点。
3. 核查上述 14 个句号范围内的遗漏词项，确认每项都有独立 CEFR；尤其检查重复的 `canal`、`project`、`steel`、`finally`。
4. 再跑 33 句顺序/逐字符对照、Q14–26 完整性、3 A 层/3 链接/1 图计数。

当前结论：**非零遗留问题；需修订后由本审计者针对性复核。**

## 最终针对性复核结果

复核对象为修订后的 `passage-2.json` 与 Passage 2 双语精读；仍未修改被审稿件。

- **M1 已解决**：句 4、21、29 已恢复原书 en dash `–`；句 1、10、16、18 及流程图固定标签已恢复原书弯引号/弯撇号。JSON 与精读的 33 个正文句仍逐字符一致。
- **M2 已解决**：总指令和题型范围均改为原书 en dash；Q14–19 与 Q20–26 指令恢复为逐行结构；Q20–26 标签已取消人为句点，答案槽通过 `labelParts`/`answerSlot` 单独结构化，精读中的展示与紧裁图一致。
- **M3 已解决**：句 3、4、6、7、8、9、11、12、23、26、28、29、32 所列遗漏项均已补入对应句，重复项也按句重新讲解；句 26 两次 `central` 已分别列项。
- **m1 已解决**：句 13 与总表中的 `withstand` 已统一为 C1。
- **m2 已解决**：句 21 已改为“约相当于烧开八小壶水所需的能量”，准确保留能耗数量类比。
- **m3 已解决**：句 6 已改为“对千禧年的恰当纪念（物）”，不再增译 `building`。
- 复核计数保持合规：7 段、33 句、Q14–26 共 13 题、3 个 A 层深挖、3 条 Cambridge Dictionary 链接、1 张必要紧裁图；答案仍与物理答案页 123 完全一致。

**最终结论：零遗留问题。Passage 2 盲审通过。**
