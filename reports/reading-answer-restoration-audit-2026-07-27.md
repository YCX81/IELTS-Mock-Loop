# 34 套历史恢复 Reading 答案审计（2026-07-27）

## 范围与方法

- 范围：最初 44 套历史恢复题中，排除当前优先重新校准的 10 套后剩余的 34 套，共 1,360 题。
- 数据源：`data/cambridge-test-bank.json` 当前工作区快照。
- 只读检查：题数与题号、答案非空、题干是否为 `Answer N` 占位、evidence 覆盖、状态字段，以及 `answerKeyText` 中题号—答案对应关系。
- `answerKeyText` 支持度为结构化文本比对结果：脚本兼容逐行、分号列表、跨行表格以及 `IN EITHER/ANY ORDER` 组合答案。它能证明当前答案与本地官方答案页文本一致，但不能替代逐页视觉复核。

## 总结

- 套数：34；题数：1360。
- 40 题且题号 1–40 连续：34/34 套。
- 答案非空：1360/1360 题。
- 非 `Answer N` 占位题干：1360/1360 题。
- evidence 非空：1360/1360 题。
- 可从 `answerKeyText` 建立题号映射并支持当前答案：1360/1360 题。
- 标准化 `verification` 状态完整：34/34 套。

## 逐套结果

| 测试 | 题数/题号 | 空答案 | 占位题干 | evidence | 状态 | answerKeyText 支持 |
|---|---:|---:|---:|---:|---|---:|
| cambridge-04-reading-test-1 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / human_verified | 40/40 |
| cambridge-04-reading-test-2 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / human_verified | 40/40 |
| cambridge-04-reading-test-3 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-04-reading-test-4 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-05-reading-test-1 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-05-reading-test-2 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-05-reading-test-3 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-05-reading-test-4 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-06-reading-test-1 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-06-reading-test-2 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-06-reading-test-3 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-06-reading-test-4 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-08-reading-test-1 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-08-reading-test-2 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-08-reading-test-3 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-08-reading-test-4 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-12-reading-test-1 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / verified | 40/40 |
| cambridge-12-reading-test-2 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / verified | 40/40 |
| cambridge-12-reading-test-3 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / verified | 40/40 |
| cambridge-12-reading-test-4 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / verified | 40/40 |
| cambridge-16-reading-test-1 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-16-reading-test-2 | 40/连续 | 0 | 0 | 40/40 | calibrated / manually_calibrated | 40/40 |
| cambridge-18-reading-test-3 | 40/连续 | 0 | 0 | 40/40 | visually_calibrated / verified | 40/40 |
| cambridge-18-reading-test-4 | 40/连续 | 0 | 0 | 40/40 | visually_calibrated / verified | 40/40 |
| cambridge-19-reading-test-1 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / verified | 40/40 |
| cambridge-19-reading-test-2 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / verified | 40/40 |
| cambridge-19-reading-test-3 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / manually_verified | 40/40 |
| cambridge-19-reading-test-4 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / manually_verified | 40/40 |
| cambridge-20-reading-test-1 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / manually_verified | 40/40 |
| cambridge-20-reading-test-2 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / manually_verified | 40/40 |
| cambridge-20-reading-test-3 | 40/连续 | 0 | 0 | 40/40 | calibrated / manual_visual_verified | 40/40 |
| cambridge-20-reading-test-4 | 40/连续 | 0 | 0 | 40/40 | calibrated / manual_visual_verified | 40/40 |
| cambridge-21-reading-test-1 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / human_verified | 40/40 |
| cambridge-21-reading-test-2 | 40/连续 | 0 | 0 | 40/40 | manually_calibrated / human_verified | 40/40 |

## 异常与风险

- 未发现空答案、`Answer N` 占位题干或当前答案与 `answerKeyText` 的机器可见冲突。
- 缺 evidence：0 题；位置：无。
- answerKeyText 未解析：0 题；位置：无。
- answerKeyText 已解析但不支持当前答案：0 题。

### 状态字段分布

- `calibrated / manual_visual_verified`：2 套。
- `calibrated / manually_calibrated`：16 套。
- `manually_calibrated / human_verified`：4 套。
- `manually_calibrated / manually_verified`：4 套。
- `manually_calibrated / verified`：6 套。
- `visually_calibrated / verified`：2 套。

## 结论

- 这 34 套的题目结构与答案键恢复完整，且当前答案均能由本地 `answerKeyText` 支持。
- 每题均有 evidence，可进入抽样视觉复核。
- 旧 `draftStatus` / `parseConfidence` 值继续保留作历史来源；统一状态由 `verification.answerKey` 与 `verification.evidence` 分别表达答案键和逐题证据的核对结果。
