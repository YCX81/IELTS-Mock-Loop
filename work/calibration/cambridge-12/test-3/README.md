# Cambridge IELTS 12 Test 3 calibration package

本目录保存 Cambridge IELTS 12 Test 3 的全新校准中间文件。仓库 Test 3 对应原书印刷标识 **Test 7**；生成过程不得读取或沿用旧精读正文。

## 原书页面

- Reading 正文与题目：PDF 物理页 59–70
- Reading 官方答案：PDF 物理页 121
- 物理页 120 仅为 Listening 答案

## 文件说明

- `passage-1.json`、`passage-2.json`、`passage-3.json`：正文、题目、选项、答案、证据、定位和干扰项校准数据
- `calibration.json`：三篇 Passage 的汇总校准数据
- `manual-review.md`：原始分辨率逐页人工目检记录
- `blind-review-passage-1.md` 至 `blind-review-passage-3.md`：非生成者盲审、修正和针对性复核记录

## 集成与验证

在仓库根目录运行：

```powershell
node work/integrate-c12-t3.mjs
node work/validate-c12-t3.mjs
```

默认流程只生成并验证 Test 3 交付物。共享题库、镜像、coverage manifest 和跨书清单不得进入本独立提交。

主对话合并后才可运行 `node work/integrate-c12-t3.mjs --apply-shared`，以统一更新共享文件。
