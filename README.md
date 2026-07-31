# IELTS Mock Loop

这是一个本地静态网页项目，用来做雅思机考模拟、每日练习、错题日志和 Anki 候选卡导出。

## 打开方式

直接双击 `index.html` 可以运行。口语录音功能需要浏览器安全上下文，建议在项目目录运行：

```powershell
python -m http.server 5178
```

然后打开 `http://127.0.0.1:5178/`。

## 双语精读学习闭环

“精读”页只使用 `canonical-catalog.json` 中的 216 篇唯一正式材料（Cambridge 04–21，每本 4 套、每套 3 篇）。目录里另外保留的恢复稿和旧版本用于审计，不会重复建立学习进度。

每篇材料按同一条学习链推进：

1. 预读预测：只看标题和导语，先写自己的判断。
2. 限时通读：英文模式抓段落主旨，完成后记录用时和 WPM。
3. 重点精读：英文、逐层揭示、完整参考三种模式；先写段落主旨，再按需显示译文和结构讲解。
4. 输出迁移：写 80–120 词摘要和一分钟复述提纲，收藏可复用表达。
5. 间隔复习：今天、第 1/3/7 天主动中译英，并按“忘记 / 困难 / 掌握”调整下次日期。

学习阶段、段落主旨、逐句揭示、输出、表达库和复习计划都会保存在当前浏览器。精读概览会显示已开始、完成闭环、今日待复习和复习留存；表达库可导出 CSV。

## 碎片时间与断点续做

- 作答、标记、题号位置、写作文本和剩余时间会在每次修改后自动保存。
- 临时离开时点击机考顶部的“保存并退出”，计时会暂停，首页会保留“未完成草稿”。
- 下次仍用同一个浏览器和同一个地址打开，点击“继续未完成练习”即可从原位置恢复。
- 关闭页面、切换标签页时还会执行一次兜底保存；存在未完成草稿时，不会因误点其他模块而覆盖它。
- 数据保存在当前浏览器的本地存储中。更换浏览器、使用无痕模式、清除站点数据或改用不同端口时不会自动同步，请定期从复盘页导出完整 JSON 备份。

## 资料策略

项目内置的是资料索引、原创练习和“整套资料导入器”。我不会把受版权保护的整套剑桥真题或官方样题正文直接打包进项目；你自己已有的资料可以按模板导入到本地浏览器题库。推荐流程是：

1. 从资料页打开官方/公开练习来源。
2. 把你已有的题目整理成资料页右侧的 JSON 模板。
3. 点击“导入题库”，在机考页选择导入的题。
4. 完成计时作答，把错误、证据、同义替换和下一步记录进复盘。
5. 从复盘页导出 `ielts-error-log.csv` 和 `ielts-anki-candidates.csv`。

## 整套资料导入

在“资料”页使用“整套资料导入”。JSON 顶层结构：

```json
{
  "tests": [
    {
      "mode": "reading",
      "id": "my-reading-test-001",
      "title": "My Reading Test 001",
      "durationSec": 3600,
      "passageTitle": "Passage title",
      "passage": ["paragraph 1", "paragraph 2"],
      "questions": [
        {
          "id": "Q1",
          "number": 1,
          "type": "tfng",
          "prompt": "Statement",
          "options": ["TRUE", "FALSE", "NOT GIVEN"],
          "answer": "TRUE",
          "evidence": "minimal source phrase"
        }
      ]
    }
  ]
}
```

支持的 `mode`：`reading`、`listening`、`writing`、`speaking`。同一个 JSON 可以一次放多套题，重复 `id` 会更新旧题。

## 已整理资料入口

- IELTS.org Academic sample test questions: https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test
- British Council free IELTS practice tests: https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests
- British Council IELTS on computer preparation: https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests/ielts-on-computer
- IDP IELTS practice tests: https://ielts.idp.com/prepare/all-test-types/all-skills/practice-test
- Cambridge English IELTS preparation: https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/

## 当前功能

- 今日仪表盘：练习次数、近 7 天次数、阅读均分、Anki 候选卡数量。
- 断点续做：实时自动保存、保存时间提示、暂停计时、未完成草稿恢复和防误覆盖。
- 阅读机考：双栏阅读、计时器、题号面板、标记题目、提交自动判分。
- 听力工作台：粘贴音频 URL、记录 10 个答案、保存听力错因。
- 写作机考：Task 1 图表、Task 2 题目、打字区、字数统计、自评分数和弱项。
- 口语复盘：Part 2 cue card、Part 3 追问、浏览器录音入口、弱项记录。
- 双语精读：216 篇唯一正式材料、五阶段主动学习、分层双语揭示、题目证据关联、个人表达库和间隔复习。
- 复盘导出：错题 CSV、Anki CSV、完整 JSON 备份。
- 整套资料导入：批量导入自有 reading/listening/writing/speaking 题库，并在机考页选择练习。
