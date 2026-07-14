(function () {
  "use strict";

  const STORAGE_KEY = "ieltsMockLoopState.v1";
  const app = document.getElementById("app");
  const navButtons = Array.from(document.querySelectorAll(".nav-button"));
  const seed = window.IELTS_SEED_TESTS;
  const sourceLibrary = window.IELTS_SOURCE_LIBRARY;
  const cambridgeIndex = window.CAMBRIDGE_RESOURCE_INDEX || { books: [], summary: {} };
  const cambridgeTestBank = window.CAMBRIDGE_TEST_BANK || { tests: [], summary: {} };
  const generatedTests = Array.isArray(cambridgeTestBank.tests) ? cambridgeTestBank.tests : [];

  const defaultState = {
    view: "dashboard",
    activeMode: "reading",
    session: null,
    history: [],
    lastCompletedSessionId: "",
    errors: [],
    anki: [],
    customMaterials: [],
    userTests: [],
    selectedTestIds: {
      reading: "reading-workforce-mini",
      listening: "listening-import-workspace",
      writing: "writing-task-loop",
      speaking: "speaking-daily-cue"
    },
    importMessage: "",
    settings: {
      targetBand: "7.0",
      examDate: ""
    }
  };

  let state = loadState();
  let timer = null;
  let mediaRecorder = null;
  let recordedChunks = [];

  const sampleImportJson = JSON.stringify(
    {
      tests: [
        {
          mode: "reading",
          id: "my-reading-test-001",
          title: "My Reading Test 001",
          source: "Cambridge / 官方样题 / 自有资料名称",
          durationSec: 3600,
          passageTitle: "Passage title",
          passage: ["Paste paragraph 1 here.", "Paste paragraph 2 here."],
          questions: [
            {
              id: "Q1",
              number: 1,
              type: "tfng",
              prompt: "Statement for TRUE/FALSE/NOT GIVEN",
              options: ["TRUE", "FALSE", "NOT GIVEN"],
              answer: "TRUE",
              evidence: "minimal source phrase",
              explanation: "why the answer is correct",
              card: {
                front: "question wording = source wording",
                back: "explain the paraphrase",
                tags: "ielts reading"
              }
            }
          ]
        },
        {
          mode: "listening",
          id: "my-listening-test-001",
          title: "My Listening Test 001",
          source: "自有音频或官方练习链接",
          durationSec: 1800,
          audioUrl: "http://127.0.0.1:5178/media/listening-001.mp3",
          questions: [
            { "id": "L1", "number": 1, "prompt": "Answer 1", "answer": "" }
          ],
          officialLinks: []
        },
        {
          mode: "writing",
          id: "my-writing-test-001",
          title: "My Writing Test 001",
          source: "自有写作题",
          durationSec: 3600,
          task1: {
            title: "Task 1",
            instruction: "Paste Task 1 prompt here.",
            data: []
          },
          task2: {
            title: "Task 2",
            instruction: "Paste Task 2 prompt here."
          }
        },
        {
          mode: "speaking",
          id: "my-speaking-test-001",
          title: "My Speaking Test 001",
          source: "自有口语题",
          durationSec: 900,
          cue: {
            topic: "Describe ...",
            bullets: ["what it was", "why it mattered", "what happened", "how you felt"],
            followUps: ["Part 3 question 1", "Part 3 question 2"]
          }
        }
      ]
    },
    null,
    2
  );

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return normalizeState(saved ? { ...structuredClone(defaultState), ...JSON.parse(saved) } : structuredClone(defaultState));
    } catch (error) {
      console.warn("Failed to load state", error);
      return structuredClone(defaultState);
    }
  }

  function normalizeState(nextState) {
    nextState.userTests = Array.isArray(nextState.userTests) ? nextState.userTests : [];
    nextState.selectedTestIds = { ...defaultState.selectedTestIds, ...(nextState.selectedTestIds || {}) };
    nextState.customMaterials = Array.isArray(nextState.customMaterials) ? nextState.customMaterials : [];
    nextState.history = Array.isArray(nextState.history) ? nextState.history : [];
    nextState.lastCompletedSessionId = nextState.lastCompletedSessionId || "";
    nextState.errors = Array.isArray(nextState.errors) ? nextState.errors : [];
    nextState.anki = Array.isArray(nextState.anki) ? nextState.anki : [];
    nextState.importMessage = nextState.importMessage || "";
    return nextState;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleString("zh-CN", { hour12: false });
  }

  function formatTime(total) {
    const sec = Math.max(0, Number(total || 0));
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function normalize(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
  }

  function wordCount(text) {
    const words = String(text || "").trim().match(/\b[\w'-]+\b/g);
    return words ? words.length : 0;
  }

  function allTestsByMode(mode = state.activeMode) {
    return [
      seed[mode],
      ...generatedTests.filter((test) => test.mode === mode),
      ...state.userTests.filter((test) => test.mode === mode)
    ];
  }

  function getTestById(mode, testId) {
    return allTestsByMode(mode).find((test) => test.id === testId) || seed[mode];
  }

  function getModeTest(mode = state.activeMode) {
    return getTestById(mode, state.selectedTestIds[mode]);
  }

  function getSessionTest(session = state.session) {
    return session ? getTestById(session.mode, session.testId) : getModeTest();
  }

  function setSelectedTest(mode, testId) {
    const exists = allTestsByMode(mode).some((test) => test.id === testId);
    if (!exists) return;
    state.selectedTestIds[mode] = testId;
    saveState();
    render();
  }

  function setView(view) {
    state.view = view;
    saveState();
    render();
  }

  function setMode(mode) {
    state.activeMode = mode;
    state.view = "practice";
    saveState();
    render();
  }

  function startSession(mode) {
    const test = getModeTest(mode);
    state.activeMode = mode;
    state.view = "practice";
    state.session = {
      id: uid(mode),
      mode,
      testId: test.id,
      startedAt: new Date().toISOString(),
      durationSec: test.durationSec,
      remainingSec: test.durationSec,
      currentIndex: 0,
      answers: {},
      flagged: {},
      notes: "",
      review: "",
      writingText: "",
      transcript: "",
      audioUrl: test.audioUrl || "",
      textSize: "medium",
      settingsOpen: false,
      helpOpen: false,
      chromeHidden: false,
      selfScores: {}
    };
    saveState();
    startTimer();
    render();
  }

  function startTimer() {
    stopTimer();
    if (!state.session) return;
    timer = setInterval(() => {
      if (!state.session) {
        stopTimer();
        return;
      }
      state.session.remainingSec = Math.max(0, state.session.remainingSec - 1);
      const timerEl = document.querySelector("[data-timer]");
      if (timerEl) {
        timerEl.textContent = formatTime(state.session.remainingSec);
        timerEl.classList.toggle("is-low", state.session.remainingSec <= 300);
      }
      if (state.session.remainingSec % 5 === 0) saveState();
      if (state.session.remainingSec === 0) {
        saveState();
        stopTimer();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function sessionCompletionSummary(session = state.session) {
    if (!session) return { total: 0, answered: 0, unanswered: 0, flagged: 0 };
    const test = getSessionTest(session);
    const questions = navigationQuestions(test, session);
    const answered = questions.filter((question) => String(session.answers?.[question.id] || "").trim()).length;
    const flagged = questions.filter((question) => Boolean(session.flagged?.[question.id])).length;
    return {
      total: questions.length,
      answered,
      unanswered: Math.max(0, questions.length - answered),
      flagged
    };
  }

  function finishSession() {
    if (!state.session) return;
    const session = state.session;
    const test = getSessionTest(session);
    const finishedAt = new Date().toISOString();
    let result;

    if (session.mode === "reading") {
      result = scoreReading(session, test);
    } else if (session.mode === "listening") {
      result = scoreManual(session, test.title);
    } else if (session.mode === "writing") {
      result = scoreWriting(session, test);
    } else {
      result = scoreSpeaking(session, test);
    }

    const historyItem = {
      id: session.id,
      mode: session.mode,
      title: test.title,
      startedAt: session.startedAt,
      finishedAt,
      durationUsedSec: session.durationSec - session.remainingSec,
      summary: sessionCompletionSummary(session),
      reviewNextAction: defaultReviewNextAction(session.mode),
      ...result
    };

    state.history.unshift(historyItem);
    state.errors.unshift(...result.errors);
    state.anki.unshift(...result.anki);
    state.session = null;
    state.view = "review";
    state.lastCompletedSessionId = historyItem.id;
    saveState();
    stopTimer();
    render();
  }

  function scoreReading(session, test) {
    const errors = [];
    const anki = [];
    let correct = 0;

    for (const question of test.questions) {
      const userAnswer = session.answers[question.id] || "";
      const isCorrect = normalize(userAnswer) === normalize(question.answer);
      if (isCorrect) {
        correct += 1;
      } else {
        const rootCause = inferReadingRootCause(question, userAnswer);
        errors.push({
          id: uid("err"),
          createdAt: new Date().toISOString(),
          mode: "reading",
          source: test.title,
          question: `Q${question.number}`,
          userAnswer,
          correctAnswer: question.answer,
          errorType: rootCause,
          evidence: question.evidence,
          nextAction: "把题干表达和原文证据各抄一遍，标出同义替换。"
        });
        if (question.card) {
          anki.push({
            id: uid("anki"),
            createdAt: new Date().toISOString(),
            front: question.card.front,
            back: `${question.card.back}\n错题：Q${question.number}；正确答案：${question.answer}；证据：${question.evidence}`,
            tags: question.card.tags,
            source: test.title
          });
        }
      }
    }

    return {
      score: `${correct}/${test.questions.length}`,
      accuracy: Math.round((correct / test.questions.length) * 100),
      mainDiagnosis: buildReadingDiagnosis(errors),
      errors,
      anki,
      answers: { ...session.answers }
    };
  }

  function defaultReviewNextAction(mode) {
    const actions = {
      reading: "把错题证据句和题干表达各抄一遍，标出同义替换。",
      listening: "重听错题所在音频段，写下漏听词、连读或拼写问题。",
      writing: "只针对最弱维度改一段，不整篇重写。",
      speaking: "用 30 秒复述同一题，再换新题。"
    };
    return actions[mode] || "下次练习前先复现这一条错误。";
  }

  function inferReadingRootCause(question, userAnswer) {
    if (!userAnswer) return "未作答/时间管理";
    if (question.type === "tfng") return "T/F/NG 证据边界";
    if (question.type === "completion") return "定位词与词形";
    return "同义替换/细节定位";
  }

  function buildReadingDiagnosis(errors) {
    if (!errors.length) return "本轮阅读全对；下轮提高难度或缩短时间。";
    const counts = errors.reduce((acc, item) => {
      acc[item.errorType] = (acc[item.errorType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([type, count]) => `${type} ${count} 处`)
      .join("；");
  }

  function scoreManual(session, modeLabel) {
    const unresolved = String(session.review || "").trim();
    const errors = unresolved
      ? [
          {
            id: uid("err"),
            createdAt: new Date().toISOString(),
            mode: session.mode,
            source: modeLabel,
            question: "Manual review",
            userAnswer: "",
            correctAnswer: "",
            errorType: "人工复盘",
            evidence: unresolved,
            nextAction: "下次练习前先复现这一条错误。"
          }
        ]
      : [];

    const anki = unresolved
      ? [
          {
            id: uid("anki"),
            createdAt: new Date().toISOString(),
            front: `${modeLabel} 错因复现`,
            back: unresolved,
            tags: `ielts ${session.mode} review`,
            source: modeLabel
          }
        ]
      : [];

    return {
      score: session.selfScores.score || "manual",
      accuracy: Number(session.selfScores.accuracy || 0),
      mainDiagnosis: unresolved || "已完成练习，但未填写复盘诊断。",
      errors,
      anki,
      answers: { ...session.answers },
      notes: session.notes
    };
  }

  function scoreWriting(session, test) {
    const text = session.writingText || "";
    const wc = wordCount(text);
    const weak = session.selfScores.weakness || "未标注";
    const errors = [];
    const anki = [];

    if (session.review) {
      errors.push({
        id: uid("err"),
        createdAt: new Date().toISOString(),
        mode: "writing",
        source: test.title,
        question: "Task review",
        userAnswer: `${wc} words`,
        correctAnswer: "",
        errorType: weak,
        evidence: session.review,
        nextAction: "下次只改这一类问题，不整篇重写。"
      });
      anki.push({
        id: uid("anki"),
        createdAt: new Date().toISOString(),
        front: `Writing 弱项：${weak}`,
        back: session.review,
        tags: "ielts writing review",
        source: test.title
      });
    }

    return {
      score: session.selfScores.band ? `Band ${session.selfScores.band} estimate` : `${wc} words`,
      accuracy: 0,
      mainDiagnosis: session.review || "已保存写作文本；建议补充 TR/CC/LR/GRA 中最弱一项。",
      errors,
      anki,
      writingText: text,
      wordCount: wc
    };
  }

  function scoreSpeaking(session, test) {
    const weak = session.selfScores.weakness || "未标注";
    const errors = session.review
      ? [
          {
            id: uid("err"),
            createdAt: new Date().toISOString(),
            mode: "speaking",
            source: test.title,
            question: "Part 2/3",
            userAnswer: session.notes,
            correctAnswer: "",
            errorType: weak,
            evidence: session.review,
            nextAction: "下次先用 30 秒复述同一 cue card，再换新题。"
          }
        ]
      : [];
    const anki = session.review
      ? [
          {
            id: uid("anki"),
            createdAt: new Date().toISOString(),
          front: `Speaking 修正点：${weak}`,
          back: session.review,
          tags: "ielts speaking review",
            source: test.title
          }
        ]
      : [];
    return {
      score: session.selfScores.band ? `Band ${session.selfScores.band} estimate` : "manual",
      accuracy: 0,
      mainDiagnosis: session.review || "已保存口语笔记；建议补充 fluency/lexical/grammar/pronunciation 中最弱一项。",
      errors,
      anki,
      notes: session.notes
    };
  }

  function render() {
    document.body.classList.toggle("is-exam-running", Boolean(state.session));
    navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === state.view));
    if (state.session) startTimer();

    if (state.view === "dashboard") {
      app.innerHTML = renderDashboard();
    } else if (state.view === "practice") {
      app.innerHTML = renderPractice();
    } else if (state.view === "review") {
      app.innerHTML = renderReview();
    } else {
      app.innerHTML = renderMaterials();
    }
  }

  function renderDashboard() {
    const sessions = state.history.length;
    const lastSeven = state.history.filter((item) => Date.now() - new Date(item.finishedAt).getTime() < 7 * 86400000);
    const readingItems = state.history.filter((item) => item.mode === "reading" && typeof item.accuracy === "number");
    const readingAvg = readingItems.length
      ? Math.round(readingItems.reduce((sum, item) => sum + item.accuracy, 0) / readingItems.length)
      : 0;
    const unresolved = state.errors.length;
    const cards = state.anki.length;

    return `
      <section class="dashboard-grid">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2>今日闭环</h2>
              <p class="panel-subtitle">选择一个模块，完成测试、诊断、错题和 Anki 候选卡。</p>
            </div>
            <button class="ghost-button" data-action="open-view" data-view-target="review">查看复盘</button>
          </div>

          <div class="metrics-grid" aria-label="学习指标">
            <div class="metric"><span>总练习</span><strong>${sessions}</strong></div>
            <div class="metric"><span>近 7 天</span><strong>${lastSeven.length}</strong></div>
            <div class="metric"><span>阅读均分</span><strong>${readingAvg}%</strong></div>
            <div class="metric"><span>Anki 候选</span><strong>${cards}</strong></div>
          </div>

          <div class="focus-grid">
            ${renderFocusCard("reading", "阅读", "20 分钟迷你机考，自动判分并生成错因与同义替换卡。")}
            ${renderFocusCard("listening", "听力", "配合官方听力页面或本地音频，记录听辨、拼写和跟丢位置。")}
            ${renderFocusCard("writing", "写作", "60 分钟 Task 1/2 打字界面，统计字数并保存自评诊断。")}
            ${renderFocusCard("speaking", "口语", "Part 2 计时、Part 3 追问和录音入口，输出复述问题。")}
          </div>
        </div>

        <aside class="panel">
          <div class="panel-header">
            <div>
              <h2>下一步</h2>
              <p class="panel-subtitle">系统只保留可复盘的动作。</p>
            </div>
          </div>
          <div class="empty-state">
            ${state.errors[0] ? escapeHtml(state.errors[0].nextAction) : "先做一轮阅读迷你测试；完成后检查错误类型是否集中在同义替换或 T/F/NG 证据边界。"}
          </div>
          <div class="source-list">
            ${sourceLibrary.slice(0, 3).map(renderSourceCard).join("")}
          </div>
        </aside>
      </section>
    `;
  }

  function renderFocusCard(mode, title, text) {
    const isRunning = state.session?.mode === mode;
    return `
      <button class="focus-card" data-action="${isRunning ? "open-view" : "start-session"}" data-mode="${mode}" data-view-target="practice">
        <strong>${title}</strong>
        <p>${text}</p>
        <span class="primary-button">${isRunning ? "继续" : "开始"}</span>
      </button>
    `;
  }

  function renderPractice() {
    const modes = [
      ["reading", "阅读机考"],
      ["listening", "听力工作台"],
      ["writing", "写作机考"],
      ["speaking", "口语复盘"]
    ];
    const mode = state.activeMode;
    const activeSession = state.session?.mode === mode ? state.session : null;

    if (state.session) {
      return renderActiveSession(state.session);
    }

    return `
      <section class="practice-layout">
        <aside class="panel side-panel">
          <h2>模块</h2>
          <div class="segmented" role="tablist" aria-label="练习模块">
            ${modes
              .map(
                ([key, label]) => `
                  <button class="${key === mode ? "is-active" : ""}" data-action="set-mode" data-mode="${key}">
                    ${label}
                  </button>`
              )
              .join("")}
          </div>
          ${renderTestSelector(mode)}
          <div class="source-list">
            <button class="primary-button" data-action="start-session" data-mode="${mode}">
              ${activeSession ? "重开本模块" : "开始本模块"}
            </button>
            <button class="ghost-button" data-action="open-view" data-view-target="materials">资料库</button>
          </div>
        </aside>
        ${activeSession ? renderActiveSession(activeSession) : renderStartPanel(mode)}
      </section>
    `;
  }

  function renderTestSelector(mode) {
    const tests = allTestsByMode(mode);
    const selected = getModeTest(mode).id;
    const generatedCount = generatedTests.filter((test) => test.mode === mode).length;
    const manualCount = state.userTests.filter((test) => test.mode === mode).length;
    return `
      <label class="form-stack test-selector">
        <span>题库</span>
        <select class="select-input" data-action="select-test" data-mode="${mode}">
          ${tests.map((test) => `<option value="${escapeHtml(test.id)}" ${test.id === selected ? "selected" : ""}>${escapeHtml(test.title)}</option>`).join("")}
        </select>
      </label>
      <div class="panel-subtitle">本地 Cambridge ${generatedCount} 套；手动导入 ${manualCount} 套。</div>
    `;
  }

  function renderStartPanel(mode) {
    const test = getModeTest(mode);
    return `
      <section class="exam-shell">
        <div class="exam-top">
          <div>
            <strong>${escapeHtml(test.title)}</strong>
            <div class="panel-subtitle">${escapeHtml(test.source || "本地练习")}</div>
          </div>
          <button class="primary-button" data-action="start-session" data-mode="${mode}">开始计时</button>
        </div>
        <div class="panel" style="margin:18px">
          <h2>本模块会保存什么</h2>
          <div class="session-summary">
            <div class="summary-card"><span>答案</span><strong>本地</strong></div>
            <div class="summary-card"><span>错因</span><strong>CSV</strong></div>
            <div class="summary-card"><span>Anki</span><strong>候选卡</strong></div>
          </div>
          <p class="panel-subtitle">所有记录存在浏览器 localStorage；复盘页可导出 CSV/JSON。</p>
        </div>
      </section>
    `;
  }

  function renderActiveSession(session) {
    if (session.mode === "reading") return renderReadingSession(session);
    if (session.mode === "listening") return renderListeningSession(session);
    if (session.mode === "writing") return renderWritingSession(session);
    return renderSpeakingSession(session);
  }

  function renderFinishConfirm(session) {
    if (!session?.finishConfirm) return "";
    const summary = sessionCompletionSummary(session);
    return `
      <div class="exam-modal-backdrop" role="presentation">
        <section class="exam-modal" role="dialog" aria-modal="true" aria-labelledby="finish-dialog-title">
          <h2 id="finish-dialog-title">Finish section?</h2>
          <p class="panel-subtitle">Submit this section and move to review. You can still cancel and return to the test.</p>
          <div class="finish-summary-grid">
            <div><span>Answered</span><strong>${summary.answered}</strong></div>
            <div><span>Unanswered</span><strong>${summary.unanswered}</strong></div>
            <div><span>Review marked</span><strong>${summary.flagged}</strong></div>
            <div><span>Total</span><strong>${summary.total}</strong></div>
          </div>
          <div class="modal-actions">
            <button type="button" class="ghost-button" data-action="cancel-finish-session">Return to test</button>
            <button type="button" class="finish-button" data-action="confirm-finish-session">Finish section</button>
          </div>
        </section>
      </div>
    `;
  }

  function examTextSize(session) {
    return ["small", "medium", "large"].includes(session?.textSize) ? session.textSize : "medium";
  }

  function renderExamSettings(session) {
    if (!session?.settingsOpen) return "";
    const activeSize = examTextSize(session);
    const options = [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" }
    ];
    return `
      <div class="exam-modal-backdrop" role="presentation">
        <section class="exam-modal exam-settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title">
          <h2 id="settings-dialog-title">Setting</h2>
          <div class="settings-group">
            <span>Text size</span>
            <div class="settings-choice-row" role="group" aria-label="Text size">
              ${options.map((item) => `
                <button
                  type="button"
                  class="tool-button ${activeSize === item.value ? "is-selected" : ""}"
                  data-action="set-exam-text-size"
                  data-size="${item.value}">
                  ${item.label}
                </button>
              `).join("")}
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="finish-button" data-action="close-exam-settings">OK</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderExamHelp(session) {
    if (!session?.helpOpen) return "";
    const test = getSessionTest(session);
    const summary = sessionCompletionSummary(session);
    const currentQuestion = currentNavigationQuestion(test, session);
    return `
      <div class="exam-modal-backdrop" role="presentation">
        <section class="exam-modal exam-help-modal" role="dialog" aria-modal="true" aria-labelledby="help-dialog-title">
          <h2 id="help-dialog-title">Help</h2>
          <div class="finish-summary-grid">
            <div><span>Module</span><strong>${escapeHtml(session.mode)}</strong></div>
            <div><span>Question</span><strong>${escapeHtml(currentQuestion?.number || "-")}</strong></div>
            <div><span>Answered</span><strong>${summary.answered}/${summary.total}</strong></div>
            <div><span>Review</span><strong>${summary.flagged}</strong></div>
          </div>
          <div class="settings-group">
            <span>Display</span>
            <div class="status-line">
              <span>Text size</span>
              <strong>${escapeHtml(examTextSize(session))}</strong>
            </div>
            <div class="status-line">
              <span>Timer</span>
              <strong>${escapeHtml(formatTime(session.remainingSec))}</strong>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="finish-button" data-action="close-exam-help">OK</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderExamOverlays(session) {
    return `${renderFinishConfirm(session)}${renderExamSettings(session)}${renderExamHelp(session)}`;
  }

  function renderExamTop(session, title, options = {}) {
    const modeLabel = {
      reading: "Reading",
      listening: "Listening",
      writing: "Writing",
      speaking: "Speaking"
    }[session.mode] || "Practice";
    if (session.chromeHidden) {
      return `
        <div class="exam-top cbt-top cbt-top-${escapeHtml(session.mode)} is-compact">
          <span class="exam-brand">IELTS</span>
          <div class="exam-status">
            <span class="clock-icon" aria-hidden="true">◷</span>
            <div class="timer ${session.remainingSec <= 300 ? "is-low" : ""}" data-timer>${formatTime(session.remainingSec)}</div>
            <span>left</span>
          </div>
          <button type="button" class="tool-button" data-action="toggle-exam-chrome">Show</button>
        </div>
      `;
    }
    return `
      <div class="exam-top cbt-top cbt-top-${escapeHtml(session.mode)}">
        <div class="exam-identity">
          <span class="exam-brand">IELTS</span>
          <div>
            <strong>${escapeHtml(title)}</strong>
            <div class="panel-subtitle">${escapeHtml(modeLabel)} Mock Test</div>
          </div>
        </div>
        <div class="exam-status">
          <span class="clock-icon" aria-hidden="true">◷</span>
          <div class="timer ${session.remainingSec <= 300 ? "is-low" : ""}" data-timer>${formatTime(session.remainingSec)}</div>
          <span>left</span>
          ${options.audioUrl ? `<audio class="exam-audio" controls src="${escapeHtml(options.audioUrl)}"></audio>` : ""}
        </div>
        <div class="exam-top-actions">
          <button type="button" class="finish-button" data-action="finish-session">Finish section</button>
          <button type="button" class="tool-button" data-action="open-exam-settings">Setting</button>
          <button type="button" class="tool-button" data-action="open-exam-help">Help</button>
          <button type="button" class="tool-button" data-action="toggle-exam-chrome">Hide</button>
        </div>
      </div>
    `;
  }

  function renderExamTools(session) {
    const label = session.flagged && Object.values(session.flagged).some(Boolean) ? "Review marked" : "Review";
    return `
      <div class="exam-tools">
        <div class="tool-group" aria-label="Test tools">
          <button type="button" class="tool-button">Highlight</button>
          <button type="button" class="tool-button">Notes</button>
          <button type="button" class="tool-button">${label}</button>
        </div>
        <div class="tool-group" aria-label="Display controls">
          <button type="button" class="tool-button">Settings</button>
          <button type="button" class="tool-button">Help</button>
        </div>
      </div>
    `;
  }

  function questionGroupsForMode(mode) {
    if (mode === "reading") {
      return [
        { label: "Part 1", start: 1, end: 13 },
        { label: "Part 2", start: 14, end: 26 },
        { label: "Part 3", start: 27, end: 40 }
      ];
    }
    if (mode === "listening") {
      return [
        { label: "Part 1", start: 1, end: 10 },
        { label: "Part 2", start: 11, end: 20 },
        { label: "Part 3", start: 21, end: 30 },
        { label: "Part 4", start: 31, end: 40 }
      ];
    }
    return [];
  }

  function activeQuestionGroup(session) {
    const questionNumber = Number(session.currentIndex || 0) + 1;
    return questionGroupsForMode(session.mode).find((group) => questionNumber >= group.start && questionNumber <= group.end)
      || { label: "Part 1", start: 1, end: 40 };
  }

  function questionGroupIndex(session, group = activeQuestionGroup(session)) {
    return Math.max(0, questionGroupsForMode(session.mode).findIndex((item) => item.start === group.start && item.end === group.end));
  }

  function sectionQuestionRange(section) {
    const title = String(section?.title || "");
    const match = title.match(/Questions?\s+(\d+)(?:\s*[-–]\s*(\d+)|\s+and\s+(\d+))?/i);
    if (!match) return null;
    const start = Number(match[1]);
    const end = Number(match[2] || match[3] || match[1]);
    return { start: Math.min(start, end), end: Math.max(start, end) };
  }

  function sectionOverlapsGroup(section, group) {
    const range = sectionQuestionRange(section);
    if (!range) return false;
    return range.start <= group.end && range.end >= group.start;
  }

  function questionsInGroup(test, session, group = activeQuestionGroup(session)) {
    if (questionGroupsForMode(session.mode).length) {
      return Array.from({ length: group.end - group.start + 1 }, (_, index) => questionForNumber(test, group.start + index));
    }
    return (test.questions || []).filter((question) => question.number >= group.start && question.number <= group.end);
  }

  function questionForNumber(test, number) {
    const existing = (test.questions || []).find((question) => Number(question.number) === number);
    if (existing) return existing;
    return {
      id: `${test.id || "test"}-q${number}`,
      number,
      type: "completion",
      prompt: `Question ${number}`,
      options: []
    };
  }

  function navigationQuestions(test, session) {
    const groups = questionGroupsForMode(session.mode);
    if (!groups.length) return Array.isArray(test.questions) ? test.questions : [];
    return groups.flatMap((group) => Array.from({ length: group.end - group.start + 1 }, (_, index) => questionForNumber(test, group.start + index)));
  }

  function navigationQuestionCount(test, session) {
    const groups = questionGroupsForMode(session.mode);
    return groups.length ? groups[groups.length - 1].end : (test.questions || []).length;
  }

  function currentNavigationQuestion(test, session) {
    const questions = navigationQuestions(test, session);
    return questions[Math.max(0, Math.min(session.currentIndex || 0, questions.length - 1))] || null;
  }

  function renderPartHeader(session, title, instruction = "") {
    const group = activeQuestionGroup(session);
    return `
      <div class="part-header">
        <div>
          <h2>${escapeHtml(group.label)}</h2>
          <p>${escapeHtml(instruction || `Questions ${group.start}-${group.end}`)}</p>
        </div>
        ${title ? `<strong>${escapeHtml(title)}</strong>` : ""}
      </div>
    `;
  }

  function renderQuestionNavigator(test, session) {
    const questions = navigationQuestions(test, session);
    if (!questions.length) return "";
    const answered = Object.values(session.answers || {}).filter((value) => String(value || "").trim()).length;
    const groups = questionGroupsForMode(session.mode);
    const currentQuestion = currentNavigationQuestion(test, session);
    const currentFlagged = currentQuestion ? Boolean(session.flagged?.[currentQuestion.id]) : false;
    return `
      <div class="exam-bottom">
        <label class="review-check">
          <input
            type="checkbox"
            data-action="toggle-current-flag"
            data-qid="${escapeHtml(currentQuestion?.id || "")}"
            ${currentFlagged ? "checked" : ""} />
          <span>Review</span>
        </label>
        <div class="question-strip" aria-label="Question navigation">
          ${(groups.length ? groups : [{ label: "", start: 1, end: questions.length }]).map((group) => `
            <div class="nav-part">
              <span>${escapeHtml(group.label)}</span>
              ${questions
                .filter((q) => q.number >= group.start && q.number <= group.end)
                .map((q) => {
                  const index = Math.max(0, q.number - 1);
                  return `
                    <button
                      class="${index === session.currentIndex ? "is-current" : ""} ${session.answers[q.id] ? "is-answered" : ""} ${session.flagged[q.id] ? "is-flagged" : ""}"
                      data-action="jump-question"
                      data-index="${index}"
                      data-qid="${escapeHtml(q.id)}"
                      aria-label="Question ${q.number}">
                      ${q.number}
                    </button>`;
                })
                .join("")}
            </div>`).join("")}
        </div>
        <div class="exam-progress">
          <span data-answer-progress>${answered}/${questions.length} answered</span>
          <button class="round-nav" data-action="prev-question" aria-label="Previous question">‹</button>
          <button class="round-nav" data-action="next-question" aria-label="Next question">›</button>
        </div>
      </div>
    `;
  }

  function renderReadingSession(session) {
    const test = getSessionTest(session);
    const group = activeQuestionGroup(session);
    const groupIndex = questionGroupIndex(session, group);
    const sections = Array.isArray(test.readingSections) ? test.readingSections : [];
    let questionSections = sections.filter((section) => section.kind === "questions" && sectionOverlapsGroup(section, group));
    if (!questionSections.length) {
      questionSections = sections.filter((section) => section.kind === "questions").slice(groupIndex, groupIndex + 1);
    }
    const passage = readingPassageForGroup(sections, groupIndex, questionSections);
    return `
      <section class="exam-shell cbt-shell text-size-${escapeHtml(examTextSize(session))}">
        ${renderExamTop(session, test.title)}
        ${renderPartHeader(session, "", `You should spend about 20 minutes on Questions ${group.start}-${group.end}, which are based on Reading Passage ${groupIndex + 1} below.`)}
        <div class="exam-body cbt-reading-body">
          <article class="passage-pane cbt-passage-pane">
            ${renderStructuredSections(passage ? [passage] : [], test.passage)}
          </article>
          <div class="split-handle" aria-hidden="true">↔</div>
          <aside class="question-pane cbt-question-pane">
            ${renderStructuredSections(questionSections, [])}
            ${renderInlineAnswerArea(test, session, group)}
          </aside>
        </div>
        ${renderQuestionNavigator(test, session)}
        ${renderExamOverlays(session)}
      </section>
    `;
  }

  function readingPassageForGroup(sections, groupIndex, questionSections) {
    const contentSections = sections.filter((section) => section.kind !== "questions");
    const expectedTitle = `Reading Passage ${groupIndex + 1}`.toLowerCase();
    const namedPassage = contentSections.find(
      (section) => String(section.title || "").trim().toLowerCase() === expectedTitle,
    );
    if (namedPassage) return namedPassage;

    const firstQuestionIndex = Math.min(
      ...questionSections.map((section) => sections.indexOf(section)).filter((index) => index >= 0),
    );
    if (Number.isFinite(firstQuestionIndex)) {
      for (let index = firstQuestionIndex - 1; index >= 0; index -= 1) {
        const candidate = sections[index];
        if (candidate.kind !== "questions" && String(candidate.title || "").trim().toLowerCase() !== "overview") {
          return candidate;
        }
      }
    }

    const withoutOverview = contentSections.filter(
      (section) => String(section.title || "").trim().toLowerCase() !== "overview",
    );
    return withoutOverview[groupIndex] || withoutOverview[0] || contentSections[groupIndex] || contentSections[0];
  }

  function renderQuestion(question, answer) {
    if (question.type === "completion") {
      return `
        <div class="question-card">
          <p>${escapeHtml(question.prompt)}</p>
          <input class="answer-input" data-action="answer-input" data-qid="${escapeHtml(question.id)}" value="${escapeHtml(answer || "")}" placeholder="Type your answer" />
        </div>
      `;
    }

    return `
      <div class="question-card">
        <fieldset>
          <legend>${escapeHtml(question.prompt)}</legend>
          ${question.options
            .map(
              (option) => `
                <label class="option">
                  <input type="radio" name="${escapeHtml(question.id)}" value="${escapeHtml(option)}" data-action="answer-radio" data-qid="${escapeHtml(question.id)}" ${option === answer ? "checked" : ""} />
                  <span>${escapeHtml(option)}</span>
                </label>`
            )
            .join("")}
        </fieldset>
      </div>
    `;
  }

  function renderAnswerKeyPanel(test) {
    if (!test.answerKeyText) return "";
    const pages = Array.isArray(test.answerKeyPages) && test.answerKeyPages.length
      ? ` · 页码：${test.answerKeyPages.join(", ")}`
      : "";
    return `
      <details class="result-box" style="margin-top:12px">
        <summary>答案页 OCR${escapeHtml(pages)}</summary>
        <pre style="white-space:pre-wrap; overflow:auto; max-height:260px">${escapeHtml(test.answerKeyText)}</pre>
      </details>
    `;
  }

  function markdownTableRows(value) {
    const lines = String(value || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length < 2 || !lines.every((line) => line.startsWith("|") && line.endsWith("|"))) return null;
    const rows = lines
      .filter((line) => !/^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|$/.test(line))
      .map((line) => line.slice(1, -1).split("|").map((cell) => cell.trim()));
    return rows.length >= 2 ? rows : null;
  }

  function renderMarkdownTable(paragraph) {
    const rows = markdownTableRows(paragraph);
    if (!rows) return "";
    const [header, ...body] = rows;
    return `
      <div class="ocr-table-wrap">
        <table class="ocr-table">
          <thead><tr>${header.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>
          <tbody>
            ${body.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderStructuredParagraph(paragraph) {
    const text = String(paragraph || "").trim();
    if (!text) return "";
    const image = text.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      return `
        <figure class="ocr-image">
          <img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1] || "Question image")}" loading="lazy" />
        </figure>
      `;
    }
    if (markdownTableRows(text)) return renderMarkdownTable(text);
    const option = text.match(/^([A-P])\s+(.+)$/);
    if (option) {
      return `<p class="ocr-option"><strong>${escapeHtml(option[1])}</strong><span>${escapeHtml(option[2])}</span></p>`;
    }
    const passageLabel = text.match(/^([A-G])$/);
    if (passageLabel) return `<p class="ocr-passage-label">${escapeHtml(passageLabel[1])}</p>`;
    return `<p>${escapeHtml(text)}</p>`;
  }

  function renderStructuredSections(sections, fallbackParagraphs = []) {
    if (!Array.isArray(sections) || !sections.length) {
      return fallbackParagraphs.map((p) => renderStructuredParagraph(p)).join("");
    }
    return `
      <div class="structured-text">
        ${sections
          .map((section) => {
            const pages = Array.isArray(section.pages) && section.pages.length ? ` <span>p.${section.pages.join(", ")}</span>` : "";
            const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
            return `
              <section class="text-section ${section.kind === "questions" ? "is-questions" : ""}">
                <h3>${escapeHtml(section.title || "Section")}${pages}</h3>
                ${paragraphs.map((paragraph) => renderStructuredParagraph(paragraph)).join("")}
              </section>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderInlineAnswerArea(test, session, group = activeQuestionGroup(session)) {
    const questions = questionsInGroup(test, session, group);
    if (!questions.length) return "";
    return `
      <div class="inline-answer-area">
        <h3>Questions ${group.start}-${group.end}</h3>
        <div class="inline-answer-grid">
          ${questions.map((question) => `
            <label>
              <span>${question.number}</span>
              <input class="answer-input" data-action="answer-input" data-qid="${escapeHtml(question.id)}" value="${escapeHtml(session.answers[question.id] || "")}" />
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }

  function listeningAudioForGroup(test, session, group) {
    const tracks = Array.isArray(test.audioTracks) ? test.audioTracks : [];
    const partTrack = tracks[questionGroupIndex(session, group)];
    return partTrack?.url || session.audioUrl || test.audioUrl || tracks[0]?.url || "";
  }

  function renderListeningSession(session) {
    const test = getSessionTest(session);
    const group = activeQuestionGroup(session);
    const audioUrl = listeningAudioForGroup(test, session, group);
    const listeningSections = (test.listeningSections || []).filter((section) => {
      const title = String(section.title || "");
      if (/^(Part|Section)\s+\d+/i.test(title)) {
        const partNo = Number(title.match(/\d+/)?.[0] || 0);
        return partNo === questionGroupsForMode("listening").indexOf(group) + 1;
      }
      return sectionOverlapsGroup(section, group);
    });
    return `
      <section class="exam-shell cbt-shell cbt-listening-shell text-size-${escapeHtml(examTextSize(session))}">
        ${renderExamTop(session, test.title, { audioUrl })}
        ${renderPartHeader(session, "", `Questions ${group.start}-${group.end}`)}
        <div class="cbt-listening-body">
          <div class="listening-exam-pane">
            <div class="structured-scroll cbt-listening-text">
              ${renderStructuredSections(listeningSections, test.questionText ? test.questionText.split("\n").filter(Boolean) : [])}
              ${renderInlineAnswerArea(test, session, group)}
            </div>
          </div>
        </div>
        ${renderQuestionNavigator(test, session)}
        ${renderExamOverlays(session)}
      </section>
    `;
  }

  function renderWritingSession(session) {
    const test = getSessionTest(session);
    return `
      <section class="exam-shell cbt-shell text-size-${escapeHtml(examTextSize(session))}">
        ${renderExamTop(session, test.title)}
        ${renderExamTools(session)}
        <div class="exam-body cbt-writing-body">
          <article class="writing-pane passage-pane cbt-passage-pane">
            <h2>Writing tasks</h2>
            ${renderStructuredSections(test.writingSections, [test.task1.instruction, test.task2.instruction].filter(Boolean))}
            ${Array.isArray(test.task1.data) && test.task1.data.length ? renderTaskChart(test.task1.data) : ""}
          </article>
          <aside class="writing-pane cbt-writing-answer">
            <div class="toolbar">
              <h2>Answer</h2>
              <span class="word-count" data-word-count>${wordCount(session.writingText)} words</span>
            </div>
            <textarea class="textarea writing-editor" data-action="writing-text" placeholder="Type your answer here">${escapeHtml(session.writingText || "")}</textarea>
            <div class="rubric-grid" style="margin-top:12px">
              ${["Task Response", "Coherence", "Lexical Resource", "Grammar"].map((item) => `<div class="rubric-item">${item}</div>`).join("")}
            </div>
            <label class="form-stack" style="margin-top:12px">
              <span>最弱维度</span>
              <select class="select-input" data-action="score-field" data-field="weakness">
                ${["Task Response", "Coherence", "Lexical Resource", "Grammar", "Timing"].map((item) => `<option ${session.selfScores.weakness === item ? "selected" : ""}>${item}</option>`).join("")}
              </select>
            </label>
            <label class="form-stack">
              <span>预估分数</span>
              <input class="text-input" data-action="score-field" data-field="band" value="${escapeHtml(session.selfScores.band || "")}" placeholder="如 6.5" />
            </label>
            <label class="form-stack">
              <span>诊断和下一步</span>
              <textarea class="textarea" data-action="session-field" data-field="review">${escapeHtml(session.review || "")}</textarea>
            </label>
            <button class="primary-button" data-action="finish-session">Submit test</button>
          </aside>
        </div>
        ${renderExamOverlays(session)}
      </section>
    `;
  }

  function renderTaskChart(data) {
    const max = Math.max(...data.flatMap((row) => [row.tech, row.finance, row.education]));
    return `
      <div class="chart" aria-label="Task 1 chart">
        ${data
          .map(
            (row) => `
              <div class="chart-row">
                <strong>${row.year}</strong>
                <div class="bars">
                  <div class="bar tech" style="height:${Math.round((row.tech / max) * 100)}%">${row.tech}%</div>
                  <div class="bar finance" style="height:${Math.round((row.finance / max) * 100)}%">${row.finance}%</div>
                  <div class="bar education" style="height:${Math.round((row.education / max) * 100)}%">${row.education}%</div>
                </div>
              </div>`
          )
          .join("")}
        <div class="legend">
          <span><i class="bar tech"></i>Technology</span>
          <span><i class="bar finance"></i>Finance</span>
          <span><i class="bar education"></i>Education</span>
        </div>
      </div>
    `;
  }

  function renderSpeakingSession(session) {
    const test = getSessionTest(session);
    return `
      <section class="exam-shell">
        ${renderExamTop(session, test.title)}
        <div class="split-2">
          <article class="speaking-pane">
            <div class="cue-card">
              <h3>${escapeHtml(test.cue.topic)}</h3>
              <ul>${test.cue.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </div>
            <h3>Part 3 follow-up</h3>
            <ol>${test.cue.followUps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
            <div class="toolbar">
              <button class="ghost-button" data-action="record-start">开始录音</button>
              <button class="ghost-button" data-action="record-stop">停止录音</button>
            </div>
            <div id="recording-output" class="panel-subtitle">录音在 localhost 或安全上下文中可用。</div>
          </article>
          <aside class="speaking-pane">
            <h2>口语笔记</h2>
            <textarea class="textarea" data-action="session-field" data-field="notes" placeholder="记录复述卡点、表达缺口、Part 3 论证问题">${escapeHtml(session.notes || "")}</textarea>
            <label class="form-stack">
              <span>最弱维度</span>
              <select class="select-input" data-action="score-field" data-field="weakness">
                ${["Fluency", "Lexical Resource", "Grammar", "Pronunciation", "Idea development"].map((item) => `<option ${session.selfScores.weakness === item ? "selected" : ""}>${item}</option>`).join("")}
              </select>
            </label>
            <label class="form-stack">
              <span>预估分数</span>
              <input class="text-input" data-action="score-field" data-field="band" value="${escapeHtml(session.selfScores.band || "")}" placeholder="如 6.0" />
            </label>
            <label class="form-stack">
              <span>诊断和下一步</span>
              <textarea class="textarea" data-action="session-field" data-field="review">${escapeHtml(session.review || "")}</textarea>
            </label>
            <button class="primary-button" data-action="finish-session">提交口语复盘</button>
          </aside>
        </div>
        ${renderExamOverlays(session)}
      </section>
    `;
  }

  function renderReview() {
    return `
      <section class="review-grid">
        <div class="panel">
          <div class="review-header">
            <div>
              <h2>练习记录</h2>
              <p class="panel-subtitle">每次练习都要留下可复盘结果。</p>
            </div>
            <div class="toolbar">
              <button class="ghost-button" data-action="export-json">导出 JSON</button>
              <button class="ghost-button" data-action="export-errors">导出错题 CSV</button>
              <button class="ghost-button" data-action="export-anki">导出 Anki CSV</button>
            </div>
          </div>
          <div class="review-list">
            ${state.history.length ? state.history.map(renderHistoryItem).join("") : `<div class="empty-state">还没有练习记录。先从阅读迷你测试开始。</div>`}
          </div>
        </div>
        <aside class="panel">
          <h2>错题日志</h2>
          ${renderErrorTable()}
        </aside>
      </section>
    `;
  }

  function renderHistoryItem(item) {
    const summary = item.summary || {};
    const isLatest = item.id === state.lastCompletedSessionId;
    const nextAction = item.reviewNextAction || defaultReviewNextAction(item.mode);
    const ankiReady = Boolean(item.ankiGeneratedAt);
    const reviewDetails = isLatest
      ? `
        <div class="review-edit-form">
          <label>
            <span>本轮诊断</span>
            <textarea rows="3" data-action="history-field" data-history-id="${escapeHtml(item.id)}" data-field="mainDiagnosis">${escapeHtml(item.mainDiagnosis || "")}</textarea>
          </label>
          <label>
            <span>下一步动作</span>
            <textarea rows="2" data-action="history-field" data-history-id="${escapeHtml(item.id)}" data-field="reviewNextAction">${escapeHtml(nextAction)}</textarea>
          </label>
          <div class="review-actions">
            <button type="button" class="ghost-button" data-action="add-history-anki" data-history-id="${escapeHtml(item.id)}" ${ankiReady ? "disabled" : ""}>
              ${ankiReady ? "已加入 Anki 候选" : "加入 Anki 候选"}
            </button>
            <span class="panel-subtitle">提交后先写清楚错因和下一步，再进入下一套题。</span>
          </div>
        </div>
      `
      : `
        <p><strong>诊断：</strong>${escapeHtml(item.mainDiagnosis)}</p>
        <p><strong>下一步：</strong>${escapeHtml(nextAction)}</p>
      `;
    return `
      <article class="review-row ${isLatest ? "is-latest" : ""}">
        <div class="toolbar">
          <h3>${escapeHtml(item.title)}</h3>
          <span class="tag">${isLatest ? "刚提交" : escapeHtml(item.mode)}</span>
        </div>
        <p><strong>结果：</strong>${escapeHtml(item.score)} ${item.accuracy ? `· ${item.accuracy}%` : ""}</p>
        ${summary.total ? `<p><strong>答题：</strong>${summary.answered}/${summary.total} 已答 · ${summary.unanswered} 未答 · ${summary.flagged} 标记</p>` : ""}
        ${reviewDetails}
        <p class="panel-subtitle">${formatDate(item.finishedAt)} · 用时 ${formatTime(item.durationUsedSec)}</p>
      </article>
    `;
  }

  function updateHistoryField(target) {
    const item = state.history.find((entry) => entry.id === target.dataset.historyId);
    if (!item) return false;
    const field = target.dataset.field;
    if (!["mainDiagnosis", "reviewNextAction"].includes(field)) return false;
    item[field] = target.value;
    saveState();
    return true;
  }

  function addHistoryAnki(historyId) {
    const item = state.history.find((entry) => entry.id === historyId);
    if (!item || item.ankiGeneratedAt) return;
    const diagnosis = item.mainDiagnosis || "本轮还没有填写诊断。";
    const nextAction = item.reviewNextAction || defaultReviewNextAction(item.mode);
    state.anki.unshift({
      id: uid("anki"),
      createdAt: new Date().toISOString(),
      front: `${item.title} 复盘下一步`,
      back: `${diagnosis}\n${nextAction}`,
      tags: `ielts ${item.mode} review`,
      source: item.title
    });
    item.ankiGeneratedAt = new Date().toISOString();
    saveState();
    render();
  }

  function renderErrorTable() {
    if (!state.errors.length) return `<div class="empty-state">暂无错题。提交练习后会自动生成。</div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>时间</th><th>模块</th><th>题目</th><th>错因</th><th>证据</th><th>下一步</th></tr>
          </thead>
          <tbody>
            ${state.errors
              .slice(0, 30)
              .map(
                (item) => `
                  <tr>
                    <td>${formatDate(item.createdAt)}</td>
                    <td>${escapeHtml(item.mode)}</td>
                    <td>${escapeHtml(item.question)}</td>
                    <td>${escapeHtml(item.errorType)}</td>
                    <td>${escapeHtml(item.evidence)}</td>
                    <td>${escapeHtml(item.nextAction)}</td>
                  </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderMaterials() {
    const allMaterials = [...sourceLibrary, ...state.customMaterials];
    const importedByMode = ["reading", "listening", "writing", "speaking"].map((mode) => ({
      mode,
      count: state.userTests.filter((test) => test.mode === mode).length
    }));
    const generatedSummary = cambridgeTestBank.summary || {};
    return `
      <section class="materials-grid">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2>资料库</h2>
              <p class="panel-subtitle">官方入口做索引；你已有的整套资料用 JSON 导入成可练习题库。</p>
            </div>
          </div>
          <div class="metrics-grid">
            ${importedByMode.map((item) => `<div class="metric"><span>${item.mode}</span><strong>${item.count}</strong></div>`).join("")}
            <div class="metric"><span>生成题库</span><strong>${generatedSummary.tests || 0}</strong></div>
          </div>
          <h3 style="margin-top:18px">已导入题库</h3>
          <div class="source-list">
            ${state.userTests.length ? state.userTests.map(renderImportedTestCard).join("") : `<div class="empty-state">还没有导入整套题。把你已有资料整理成右侧 JSON 格式后导入。</div>`}
          </div>
          ${renderCambridgeLocalPanel()}
          <h3 style="margin-top:18px">官方/公开资料入口</h3>
          <div class="source-list">
            ${allMaterials.map(renderSourceCard).join("")}
          </div>
        </div>
        <aside class="panel">
          ${renderImportPanel()}
          <h2>添加资料</h2>
          <div class="form-stack">
            <label>标题 <input class="text-input" id="material-title" /></label>
            <label>来源 <input class="text-input" id="material-provider" /></label>
            <label>链接 <input class="text-input" id="material-url" /></label>
            <label>用途 <textarea class="textarea" id="material-use"></textarea></label>
            <button class="primary-button" data-action="add-material">保存资料</button>
          </div>
        </aside>
      </section>
    `;
  }

  function renderCambridgeLocalPanel() {
    const books = cambridgeIndex.books || [];
    const summary = cambridgeIndex.summary || {};
    return `
      <h3 style="margin-top:18px">本地 Cambridge 资源</h3>
      <div class="metrics-grid">
        <div class="metric"><span>PDF</span><strong>${summary.pdfs || 0}</strong></div>
        <div class="metric"><span>听力 ZIP</span><strong>${summary.listeningZips || 0}</strong></div>
        <div class="metric"><span>已抽文本</span><strong>${summary.textExtracted || 0}</strong></div>
        <div class="metric"><span>已 OCR</span><strong>${summary.ocrExtracted || 0}</strong></div>
        <div class="metric"><span>需 OCR</span><strong>${summary.needsOcr || 0}</strong></div>
        <div class="metric"><span>音频轨</span><strong>${summary.extractedAudioTracks || summary.audioTracks || 0}</strong></div>
      </div>
      <div class="source-list">
        ${books.length ? books.map(renderCambridgeBookCard).join("") : `<div class="empty-state">尚未生成本地 Cambridge 索引。运行 scripts/convert_cambridge_resources.py 后会显示 PDF、听力和文本抽取状态。</div>`}
      </div>
    `;
  }

  function renderCambridgeBookCard(book) {
    const extraction = book.extraction || {};
    const listening = book.listening || {};
    const statusLabel = {
      text_extracted: "已抽文本",
      ocr_extracted: "已 OCR",
      ocr_no_text: "OCR 无文本",
      needs_ocr: "需 OCR",
      error: "错误",
      unknown: "未知"
    }[extraction.status] || "未处理";
    return `
      <article class="source-card">
        <div class="toolbar">
          <h3>${escapeHtml(book.title)}</h3>
          <span class="tag">${escapeHtml(statusLabel)}</span>
        </div>
        <p>页数：${escapeHtml(extraction.pages || "-")}；前几页平均字符：${escapeHtml(extraction.avgCharsFirstPages || 0)}；听力音频条目：${escapeHtml(listening.audioEntries || 0)}</p>
        <div class="tag-row">
          ${book.pdf ? `<a class="small-button" href="${escapeHtml(book.pdf)}" target="_blank" rel="noreferrer">PDF</a>` : ""}
          ${book.listeningZip ? `<a class="small-button" href="${escapeHtml(book.listeningZip)}" target="_blank" rel="noreferrer">听力 ZIP</a>` : ""}
          ${extraction.textMarkdown ? `<a class="small-button" href="${escapeHtml(extraction.textMarkdown)}" target="_blank" rel="noreferrer">抽取文本</a>` : ""}
          ${extraction.pagesJson ? `<a class="small-button" href="${escapeHtml(extraction.pagesJson)}" target="_blank" rel="noreferrer">页面 JSON</a>` : ""}
          <a class="small-button" href="data/generated/reports/cambridge-test-bank.json" target="_blank" rel="noreferrer">机考 JSON</a>
        </div>
      </article>
    `;
  }

  function renderImportPanel() {
    return `
      <section class="import-panel">
        <div class="toolbar">
          <h2>整套资料导入</h2>
          <button class="small-button" data-action="download-template">模板</button>
        </div>
        <p class="panel-subtitle">支持一次导入多套题。阅读题会自动判分；听力、写作、口语会进入计时和复盘工作台。</p>
        ${state.importMessage ? `<div class="result-box">${escapeHtml(state.importMessage)}</div>` : ""}
        <textarea class="textarea import-textarea" id="test-bank-json" spellcheck="false">${escapeHtml(sampleImportJson)}</textarea>
        <div class="toolbar" style="margin:10px 0 18px">
          <button class="primary-button" data-action="import-bank">导入题库</button>
          <button class="ghost-button" data-action="clear-import-message">清空提示</button>
        </div>
      </section>
    `;
  }

  function renderImportedTestCard(test) {
    const questionCount = test.questions?.length || 0;
    return `
      <article class="source-card">
        <div class="toolbar">
          <h3>${escapeHtml(test.title)}</h3>
          <button class="small-button" data-action="use-imported-test" data-mode="${test.mode}" data-test-id="${escapeHtml(test.id)}">练这套</button>
        </div>
        <p>${escapeHtml(test.source || "自有资料")}</p>
        <div class="tag-row">
          <span class="tag">${escapeHtml(test.mode)}</span>
          <span class="tag">${questionCount ? `${questionCount} questions` : "prompt"}</span>
          <span class="tag">${formatTime(test.durationSec || seed[test.mode].durationSec)}</span>
        </div>
      </article>
    `;
  }

  function importTestBank(rawJson) {
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (error) {
      state.importMessage = `导入失败：JSON 格式错误。${error.message}`;
      saveState();
      render();
      return;
    }

    const incoming = Array.isArray(parsed) ? parsed : parsed.tests;
    if (!Array.isArray(incoming) || incoming.length === 0) {
      state.importMessage = "导入失败：JSON 需要包含 tests 数组。";
      saveState();
      render();
      return;
    }

    const normalized = [];
    const errors = [];
    incoming.forEach((test, index) => {
      try {
        normalized.push(normalizeImportedTest(test, index));
      } catch (error) {
        errors.push(`第 ${index + 1} 套：${error.message}`);
      }
    });

    if (!normalized.length) {
      state.importMessage = `导入失败：${errors.join("；")}`;
      saveState();
      render();
      return;
    }

    const nextById = new Map(state.userTests.map((test) => [test.id, test]));
    normalized.forEach((test) => nextById.set(test.id, test));
    state.userTests = Array.from(nextById.values());
    normalized.forEach((test) => {
      if (!state.selectedTestIds[test.mode] || state.selectedTestIds[test.mode] === seed[test.mode].id) {
        state.selectedTestIds[test.mode] = test.id;
      }
    });
    state.importMessage = `已导入/更新 ${normalized.length} 套题${errors.length ? `；跳过 ${errors.length} 套：${errors.join("；")}` : ""}`;
    saveState();
    render();
  }

  function normalizeImportedTest(test, index) {
    if (!test || typeof test !== "object") throw new Error("不是对象");
    const mode = String(test.mode || "").trim();
    if (!["reading", "listening", "writing", "speaking"].includes(mode)) {
      throw new Error("mode 必须是 reading/listening/writing/speaking");
    }
    const id = String(test.id || `${mode}-import-${index + 1}`).trim();
    const title = String(test.title || "").trim();
    if (!title) throw new Error("缺少 title");
    const base = {
      ...test,
      mode,
      id,
      title,
      source: String(test.source || "自有导入资料"),
      durationSec: Number(test.durationSec || seed[mode].durationSec)
    };

    if (mode === "reading") {
      if (!Array.isArray(base.passage) || !base.passage.length) throw new Error("reading 缺少 passage 数组");
      if (!Array.isArray(base.questions) || !base.questions.length) throw new Error("reading 缺少 questions 数组");
      base.passageTitle = base.passageTitle || title;
      base.questions = base.questions.map((question, questionIndex) => normalizeQuestion(question, questionIndex));
    }

    if (mode === "listening") {
      base.questions = Array.isArray(base.questions) && base.questions.length
        ? base.questions.map((question, questionIndex) => normalizeQuestion({ type: "completion", ...question }, questionIndex))
        : Array.from({ length: 10 }, (_, questionIndex) => ({
            id: `L${questionIndex + 1}`,
            number: questionIndex + 1,
            type: "completion",
            prompt: `Answer ${questionIndex + 1}`,
            answer: ""
          }));
      base.officialLinks = Array.isArray(base.officialLinks) ? base.officialLinks : [];
    }

    if (mode === "writing") {
      base.task1 = base.task1 || { title: "Task 1", instruction: "Paste Task 1 prompt here.", data: [] };
      base.task2 = base.task2 || { title: "Task 2", instruction: "Paste Task 2 prompt here." };
    }

    if (mode === "speaking") {
      if (!base.cue) throw new Error("speaking 缺少 cue");
      base.cue = {
        topic: String(base.cue.topic || title),
        bullets: Array.isArray(base.cue.bullets) ? base.cue.bullets : [],
        followUps: Array.isArray(base.cue.followUps) ? base.cue.followUps : []
      };
    }

    return base;
  }

  function normalizeQuestion(question, index) {
    if (!question || typeof question !== "object") throw new Error(`question ${index + 1} 不是对象`);
    const type = question.type || (Array.isArray(question.options) ? "mcq" : "completion");
    const answer = question.answer ?? "";
    if (type !== "completion" && !Array.isArray(question.options)) {
      throw new Error(`question ${index + 1} 缺少 options`);
    }
    return {
      ...question,
      id: String(question.id || `Q${index + 1}`),
      number: Number(question.number || index + 1),
      type,
      prompt: String(question.prompt || `Question ${index + 1}`),
      options: Array.isArray(question.options) ? question.options : [],
      answer,
      evidence: question.evidence || "",
      explanation: question.explanation || "",
      card: question.card || null
    };
  }

  function renderSourceCard(item) {
    return `
      <article class="source-card">
        <div class="toolbar">
          <h3>${escapeHtml(item.title)}</h3>
          <a class="small-button" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">打开</a>
        </div>
        <p>${escapeHtml(item.use)}</p>
        <p>${escapeHtml(item.fit || "")}</p>
        <div class="tag-row">
          <span class="tag">${escapeHtml(item.provider)}</span>
          <span class="tag">${escapeHtml(item.type || "资料")}</span>
          <span class="tag">${escapeHtml(item.format || "link")}</span>
        </div>
      </article>
    `;
  }

  function exportCsv(rows, filename, fields) {
    const body = [
      fields.join(","),
      ...rows.map((row) =>
        fields
          .map((field) => {
            const value = String(row[field] ?? "").replaceAll('"', '""');
            return `"${value}"`;
          })
          .join(",")
      )
    ].join("\n");
    download(body, filename, "text/csv;charset=utf-8");
  }

  function download(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function updateLiveAnswerState(qid) {
    if (!state.session || !qid) return;
    const button = document.querySelector(`.question-strip button[data-qid="${CSS.escape(qid)}"]`);
    if (button) {
      button.classList.toggle("is-answered", Boolean(String(state.session.answers[qid] || "").trim()));
    }
    const progress = document.querySelector("[data-answer-progress]");
    if (progress) {
      const test = getSessionTest(state.session);
      const total = navigationQuestions(test, state.session).length;
      const answered = Object.values(state.session.answers || {}).filter((value) => String(value || "").trim()).length;
      progress.textContent = `${answered}/${total} answered`;
    }
  }

  function handleInput(target) {
    if (target.dataset.action === "history-field") {
      updateHistoryField(target);
      return;
    }
    if (!state.session) return;
    const action = target.dataset.action;
    if (action === "answer-input") {
      state.session.answers[target.dataset.qid] = target.value;
      updateLiveAnswerState(target.dataset.qid);
    } else if (action === "answer-radio") {
      state.session.answers[target.dataset.qid] = target.value;
      updateLiveAnswerState(target.dataset.qid);
    } else if (action === "session-field") {
      state.session[target.dataset.field] = target.value;
    } else if (action === "writing-text") {
      state.session.writingText = target.value;
      const wc = document.querySelector("[data-word-count]");
      if (wc) wc.textContent = `${wordCount(target.value)} words`;
    } else if (action === "score-field") {
      state.session.selfScores[target.dataset.field] = target.value;
    }
    saveState();
  }

  async function startRecording() {
    const output = document.getElementById("recording-output");
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      if (output) output.textContent = "当前浏览器不支持录音 API。";
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) recordedChunks.push(event.data);
      });
      mediaRecorder.addEventListener("stop", () => {
        const blob = new Blob(recordedChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        if (output) {
          output.innerHTML = `<audio controls src="${url}"></audio>`;
        }
        stream.getTracks().forEach((track) => track.stop());
      });
      mediaRecorder.start();
      if (output) output.textContent = "录音中...";
    } catch (error) {
      if (output) output.textContent = `录音失败：${error.message}`;
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "open-view") setView(target.dataset.viewTarget);
    if (action === "set-mode") setMode(target.dataset.mode);
    if (action === "start-session") startSession(target.dataset.mode);
    if (action === "prev-question" && state.session) {
      state.session.currentIndex = Math.max(0, state.session.currentIndex - 1);
      saveState();
      render();
    }
    if (action === "next-question" && state.session) {
      state.session.currentIndex = Math.min(navigationQuestionCount(getSessionTest(state.session), state.session) - 1, state.session.currentIndex + 1);
      saveState();
      render();
    }
    if (action === "jump-question" && state.session) {
      state.session.currentIndex = Number(target.dataset.index);
      saveState();
      render();
    }
    if (action === "toggle-current-flag" && state.session) {
      const test = getSessionTest(state.session);
      const qid = target.dataset.qid || currentNavigationQuestion(test, state.session)?.id;
      if (qid) {
        state.session.flagged[qid] = target.checked;
        saveState();
        render();
      }
    }
    if (action === "toggle-flag" && state.session) {
      const qid = target.dataset.qid;
      state.session.flagged[qid] = !state.session.flagged[qid];
      saveState();
      render();
    }
    if (action === "finish-session" && state.session) {
      state.session.finishConfirm = true;
      saveState();
      render();
    }
    if (action === "cancel-finish-session" && state.session) {
      state.session.finishConfirm = false;
      saveState();
      render();
    }
    if (action === "confirm-finish-session") finishSession();
    if (action === "open-exam-settings" && state.session) {
      state.session.settingsOpen = true;
      saveState();
      render();
    }
    if (action === "close-exam-settings" && state.session) {
      state.session.settingsOpen = false;
      saveState();
      render();
    }
    if (action === "set-exam-text-size" && state.session) {
      state.session.textSize = target.dataset.size || "medium";
      saveState();
      render();
    }
    if (action === "open-exam-help" && state.session) {
      state.session.helpOpen = true;
      saveState();
      render();
    }
    if (action === "close-exam-help" && state.session) {
      state.session.helpOpen = false;
      saveState();
      render();
    }
    if (action === "toggle-exam-chrome" && state.session) {
      state.session.chromeHidden = !state.session.chromeHidden;
      state.session.helpOpen = false;
      state.session.settingsOpen = false;
      saveState();
      render();
    }
    if (action === "add-history-anki") addHistoryAnki(target.dataset.historyId);
    if (action === "export-errors") {
      exportCsv(state.errors, "ielts-error-log.csv", ["createdAt", "mode", "source", "question", "userAnswer", "correctAnswer", "errorType", "evidence", "nextAction"]);
    }
    if (action === "export-anki") {
      exportCsv(state.anki, "ielts-anki-candidates.csv", ["front", "back", "tags", "source", "createdAt"]);
    }
    if (action === "export-json") {
      download(JSON.stringify(state, null, 2), "ielts-mock-loop-backup.json", "application/json;charset=utf-8");
    }
    if (action === "add-material") {
      const title = document.getElementById("material-title").value.trim();
      const provider = document.getElementById("material-provider").value.trim();
      const url = document.getElementById("material-url").value.trim();
      const use = document.getElementById("material-use").value.trim();
      if (title && url) {
        state.customMaterials.push({ id: uid("mat"), title, provider, url, use, type: "自定义", format: "link" });
        saveState();
        render();
      }
    }
    if (action === "import-bank") {
      importTestBank(document.getElementById("test-bank-json").value);
    }
    if (action === "download-template") {
      download(sampleImportJson, "ielts-test-bank-template.json", "application/json;charset=utf-8");
    }
    if (action === "clear-import-message") {
      state.importMessage = "";
      saveState();
      render();
    }
    if (action === "use-imported-test") {
      setSelectedTest(target.dataset.mode, target.dataset.testId);
      state.activeMode = target.dataset.mode;
      state.view = "practice";
      saveState();
      render();
    }
    if (action === "record-start") startRecording();
    if (action === "record-stop") stopRecording();
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-action]")) handleInput(event.target);
  });

  document.addEventListener("change", (event) => {
    if (event.target.dataset.action === "select-test") {
      setSelectedTest(event.target.dataset.mode, event.target.value);
      return;
    }
    if (event.target.matches("[data-action]")) handleInput(event.target);
  });

  navButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  render();
})();
