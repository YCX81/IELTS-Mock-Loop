# Cambridge IELTS 10 Test 4 Passage 1 非生成者盲审

## 审计范围与方法

- 审计者未参与本篇生成，也未读取旧精读正文。
- 从 `data/Cambridge-IELTS-10.pdf` 独立按 72 dpi（原始 1400 × 1815 像素）渲染并人工查看物理页 80–83 与官方答案页 150。
- 逐项核对 `passage-1.json`、`cambridge-ielts-10.pages.json`、`cambridge-ielts-10.raw.md` 与新精读 Markdown。
- 机械辅助核验仅用于字符比对和计数；原书正文、跨页、双栏顺序、题目及答案均由审计者直接看图确认。

## 首次盲审结论

**结论：有实际问题，尚不能判定零遗留。**

已通过的项目：

- 正文 29 句，数量与顺序完整；第 17 句正确跨物理页 80→81。
- 新精读的 29 条 `英文` 按空格连接后，与 `bodyParagraphs` 逐字符一致。
- 双栏阅读顺序正确：页 80、81 均为左栏读完再接右栏。
- 题号 1–13 完整；两组题型指令、笔记标题/固定信息、TRUE/FALSE/NOT GIVEN 分类标签、题干翻译、官方答案、证据、定位和排除均已覆盖。
- 官方答案与页 150 一致：1 spread；2 10/ten times；3 below；4 fuel；5 seasons；6 homes/housing；7 TRUE；8 FALSE；9 TRUE；10 TRUE；11 NOT GIVEN；12 FALSE；13 FALSE。
- `pages.json` 与 `raw.md` 在页 80、81、82、83、150 逐字符一致；`passage-1.json.pages` 与前两者在页 80–83 也逐字符一致。
- 计数为恰好 3 个“A层深挖”、3 条 Cambridge Dictionary 链接、0 张图片。

## 必须修正的问题

### 1. 原书弯引号/撇号未逐字符校准

原始扫描使用弯撇号 `’`，当前校准文本却在下列正文位置使用 ASCII 直撇号 `'`；错误已同步扩散到 `pages.json`、`raw.md`、`passage-1.json` 和新精读英文：

1. 句 2：`There’s`，当前为 `There's`。
2. 句 16：`firefighters’ union`，当前为 `firefighters' union`。
3. 句 21：`Firefighters’ unions`，当前为 `Firefighters' unions`。
4. 句 21：`state’s commitment`，当前为 `state's commitment`。
5. 句 22：`firefighters’ union`，当前为 `firefighters' union`。
6. 句 24：`state’s Office`，当前为 `state's Office`。

这不是镜像不一致问题：三个来源镜像目前彼此相同，但共同没有与原书逐字符一致。应在全部来源层和精读英文中同步改正，并再次验证镜像相等。

### 2. 官方答案展示字符串未保留答案页原样

- 第 2 题页 150 印为 `10/ten times`，当前 `answerKeyDisplay` 为 `10 / ten times`。
- 第 6 题页 150 印为 `homes/housing`，当前 `answerKeyDisplay` 为 `homes / housing`。

可接受答案数组本身正确；这里只需把“官方答案展示”恢复为原书字符形式。

### 3. 重复出现的 B1+ 项仍有漏讲

以下是逐句复核中确认的遗漏；由于强制规则要求每次重复出现都再次独立讲解，不能以早先句子已经讲过为由省略：

- 句 4：`burn` (B1)。
- 句 5：再次出现的 `burn`/`burned` (B1)。
- 句 14：再次出现的 `the western US` (B1)。
- 句 18：再次出现的 `burn`/`burned` (B1)。
- 句 19：再次出现的 `in the past` (B1)。
- 句 21：再次出现的 `in the past` (B1)、`fire engine` (B1)；另漏 `note that` (B2) 与 `increase` (B1)。
- 句 24：`chief` (B2)。
- 句 26：`both ... and ...` (B1)。
- 句 27：`improve` (B1)；不能因句 28 讲了 `improvement` 而省略本句词形。
- 句 28：再次出现的 `both ... and ...` (B1)。

此外，`state` 表示“州”时属于 B1 义项，句 20、21、23、24、26 的各次出现没有逐次覆盖（句 18 的 `state history` 已覆盖）。修订者应据此做一次完整的逐句重复项回扫，而不是只补首个出现。

### 4. 两处句法/翻译解释不准确

- 句 6 把非限制性定语从句 `which usually has dry summers` 译成“**虽然**夏季通常干燥，**但**……”，无依据地增加让步关系。应改为并列补充式自然译文，例如“该地区夏季通常干燥，而近年来降水量显著低于正常水平”。
- 句 17 把 `it` 称为“形式主语式的 it”不正确。这里的 `it` 有实际所指，概括前面的多重火情/整体灭火任务；应删除“形式主语”判断。

### 5. A 层深挖与词典链接对应失配，且深挖不足

- “A层深挖 2”讲的是 `might have been contained` 的未实现可能和第 9 题逻辑，但紧随其后的链接指向 `erratic`，与本段没有语义对应。应让链接指向本层实际深挖的表达，或把该 A 层真正改为围绕 `erratic/erratically` 展开。
- 三个 A 层目前都只有一小段题目逻辑说明，缺少 A 层应有的本句义、语气/使用边界、文章作用及至少两个双语迁移例句；第 1、2 层尤其没有围绕一个可迁移表达完成深挖。数量虽然恰好为 3，但质量尚未达到“A层深挖”。修订后仍须保持总数恰好 3、Cambridge 链接恰好 3。

## 题库复核备注

- 题目和答案本身未发现漏题或错答。
- 第 6 题的 `homes` 与 `housing` 两个可接受变体均有原文依据。
- 第 11 题判 `NOT GIVEN` 的边界解释正确：经费、设备和基础设施增加不能推出增聘消防员。
- 第 7、8、9、10、12、13 题的 TRUE/FALSE 证据方向与页 150 官方答案一致。

## 复核状态

- 首次盲审：**未通过（存在上述 5 类实际问题）**。
- 针对性复核：待生成者修正后，由本审计者复核；当前不得写“零遗留”。

## 修订后针对性复核

原审计者按首次报告的 5 类问题逐项复核。第一次针对性检查发现句 5 的 `state figures` 中 `state (B1)` 仍未在本句独立讲解，故未提前判定通过；生成者只补入该项后，原审计者再次完成全项复核。

### 首轮问题复核结果

1. **六处弯撇号：通过。** `There’s`、两处 `firefighters’ union`、`Firefighters’ unions`、`state’s commitment`、`state’s Office` 已在 `pages.json`、`raw.md`、`passage-1.json` 与新精读英文四层同步；相关层中不再残留 ASCII 直撇号写法。
2. **官方答案展示：通过。** 第 2 题为 `10/ten times`，第 6 题为 `homes/housing`；可接受答案数组仍分别包含两个合法变体。
3. **B1+ 重复项：通过。** 首报所列 `burn/burned`、`the western US`、`in the past`、`fire engine`、`note that`、`increase`、`chief`、`both ... and ...`、`improve` 均已在各自句内独立讲解。`state` 全文回扫后，句 5、18、20–26 的相关词形/词组均已覆盖；句 23、24 的两次出现也有明确说明。
4. **句法与翻译：通过。** 句 6 已删除无依据的“虽然……但……”让步关系；句 17 已明确 `it` 有实际所指，不再误称形式主语。
5. **A 层深挖：通过。** 三层分别围绕 `contain a fire`、`might have been contained`、`notwithstanding` 展开；对应词典链接为 `contain`、`might`、`notwithstanding`，均与讲解对象一致。每层均说明本句义、语气或使用边界及文章作用，并包含至少两个双语迁移例句。

### 全文回归

- 新精读共 29 个英文句子，顺序和跨页衔接正确；29 句连接后与校准 `bodyParagraphs` 逐字符一致。
- `pages.json` 与 `raw.md` 全书逐页逐字符一致；`passage-1.json.pages` 在物理页 80–83 与两者逐字符一致。
- 题库仍为 2 个题组、13 道题，题号范围为 1–6、7–13；指令、题干、分类标签、官方答案、证据、定位和干扰项未发生回归错误。
- 官方答案仍与物理页 150 一致。
- A 层深挖恰好 3 个，Cambridge Dictionary 链接恰好 3 条，Markdown 与 JSON 图片数均为 0。

### 最终结论

**针对性复核通过：首次盲审发现的问题已全部修正，回归检查无新增错误，零遗留问题。**
