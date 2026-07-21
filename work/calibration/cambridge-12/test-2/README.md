# Cambridge IELTS 12 Test 2 calibration package

本目录保存 Cambridge IELTS 12 Test 2 的**全新校准中间文件**。仓库中的 Test 2 对应原书印刷标识 **Test 6**；生成过程不得读取或沿用旧精读正文。

## 原书页面

- Reading 正文与题目：PDF 物理页 36–49
- Reading 官方答案：PDF 物理页 119
- 物理页 118 仅为 Listening 答案，不属于本 Test 的 Reading 答案页

## 文件说明

- `passage-1.json`：Passage 1 的正文、题目、选项、答案、证据和定位校准数据
- `passage-2.json`：Passage 2 的正文、题目、headings、答案、证据和定位校准数据
- `passage-3.json`：Passage 3 的正文、题目、选项、答案、证据和定位校准数据
- `calibration.json`：Test 2 三篇 Passage 的汇总校准数据
- `manual-review.md`：根代理按原始分辨率逐页目检的页面范围、关键校准点和答案记录
- `blind-review-passage-1.md`：Passage 1 非生成者盲审与复核记录
- `blind-review-passage-2.md`：Passage 2 非生成者盲审与复核记录
- `blind-review-passage-3.md`：Passage 3 非生成者盲审与复核记录

## 集成与验证

在仓库根目录运行：

```powershell
node work/integrate-c12-t2.mjs
node work/validate-c12-t2.mjs
```

上述默认流程用于从本目录的校准中间文件生成或验证 Test 2 交付物。共享题库和跨书清单不应包含在本书独立提交中。

`--apply-shared` 只允许主对话在合并本提交后使用，以统一更新共享题库、镜像和清单；本独立 worktree 中不要运行该参数。
