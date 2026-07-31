const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const reviewUtils = require("../review-utils.js");
const intensiveParser = require("../intensive-reading-parser.js");
const intensiveUtils = require("../intensive-reading-utils.js");

const APP_SOURCE = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const STORAGE_KEY = "ieltsMockLoopState.v1";
const INTENSIVE_ITEM = {
  id: "cambridge-04-reading-test-1-passage-1",
  book: "04",
  testNo: 1,
  passageNo: 1,
  title: "Children's ideas about rainforests",
  displayTitle: "Cambridge 04 · Test 1 · Passage 1",
  canonicalPath: "fixture-intensive-reading.md",
  englishWordCount: 120
};
const INTENSIVE_MARKDOWN = `# Children's ideas about rainforests

This passage examines how children form ideas about rainforests.

## 01 逐句精读

### Paragraph A

#### 1

**Children develop ideas about rainforests from several sources.**

儿童通过多种来源形成对热带雨林的认识。

主干是 Children develop ideas。`;

function createClassList() {
  return {
    toggle() {},
    add() {},
    remove() {}
  };
}

function readingTest() {
  return {
    id: "reading-test",
    mode: "reading",
    title: "Reading Test",
    source: "Test source",
    durationSec: 1200,
    passageTitle: "Passage",
    passage: ["A short passage."],
    questions: [
      {
        id: "Q1",
        number: 1,
        passage: 1,
        type: "tfng",
        prompt: "Statement",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        answer: "TRUE",
        evidence: "Evidence"
      }
    ]
  };
}

function initialState(overrides = {}) {
  return {
    view: "practice",
    activeMode: "reading",
    history: [],
    errors: [],
    anki: [],
    customMaterials: [],
    userTests: [],
    selectedTestIds: { reading: "reading-test" },
    importMessage: "",
    settings: { targetBand: "7.0", examDate: "" },
    session: {
      id: "draft-1",
      mode: "reading",
      testId: "reading-test",
      startedAt: "2026-07-21T01:00:00.000Z",
      durationSec: 1200,
      remainingSec: 900,
      currentIndex: 0,
      answers: { Q1: "FALSE" },
      flagged: {},
      notes: "",
      review: "",
      writingText: "",
      transcript: "",
      textSize: "medium",
      selfScores: {}
    },
    ...overrides
  };
}

function boot(savedState = initialState()) {
  const documentListeners = new Map();
  const windowListeners = new Map();
  const activeIntervals = new Set();
  const storage = new Map([[STORAGE_KEY, JSON.stringify(savedState)]]);
  const app = { innerHTML: "", classList: createClassList() };
  let intervalId = 0;

  const document = {
    hidden: false,
    body: { classList: createClassList() },
    getElementById(id) {
      return id === "app" ? app : null;
    },
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    },
    addEventListener(type, handler) {
      documentListeners.set(type, handler);
    }
  };

  const seedReading = readingTest();
  const seed = {
    reading: seedReading,
    listening: { id: "listening-test", mode: "listening", title: "Listening", durationSec: 1200, questions: [] },
    writing: { id: "writing-test", mode: "writing", title: "Writing", durationSec: 1200, task1: {}, task2: {} },
    speaking: { id: "speaking-test", mode: "speaking", title: "Speaking", durationSec: 900, cue: { bullets: [], followUps: [] } }
  };

  const window = {
    IELTS_SEED_TESTS: seed,
    IELTS_SOURCE_LIBRARY: [],
    CAMBRIDGE_RESOURCE_INDEX: { books: [], summary: {} },
    CAMBRIDGE_TEST_BANK: { tests: [seedReading], summary: {} },
    IELTS_REVIEW_UTILS: reviewUtils,
    IELTS_INTENSIVE_READING_CATALOG: {
      summary: { canonicalCount: 1, duplicateIdCount: 0 },
      items: [INTENSIVE_ITEM]
    },
    IELTS_INTENSIVE_READING_PARSER: intensiveParser,
    IELTS_INTENSIVE_READING_UTILS: intensiveUtils,
    addEventListener(type, handler) {
      windowListeners.set(type, handler);
    }
  };

  const context = {
    window,
    document,
    navigator: {},
    localStorage: {
      getItem(key) {
        return storage.has(key) ? storage.get(key) : null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      }
    },
    structuredClone,
    console,
    Date,
    Math,
    JSON,
    Blob,
    URL,
    CSS: { escape: (value) => String(value) },
    fetch: async (url) => ({
      ok: url === INTENSIVE_ITEM.canonicalPath,
      status: url === INTENSIVE_ITEM.canonicalPath ? 200 : 404,
      async text() {
        return INTENSIVE_MARKDOWN;
      }
    }),
    setInterval(callback) {
      const id = ++intervalId;
      activeIntervals.add(id);
      return id;
    },
    clearInterval(id) {
      activeIntervals.delete(id);
    }
  };
  window.window = window;
  vm.runInNewContext(APP_SOURCE, context, { filename: "app.js" });

  return {
    app,
    document,
    activeIntervals,
    saved() {
      return JSON.parse(storage.get(STORAGE_KEY));
    },
    click(action, dataset = {}) {
      const target = {
        dataset: { action, ...dataset },
        closest() {
          return this;
        }
      };
      documentListeners.get("click")({ target });
    },
    input(action, dataset = {}, value = "") {
      const target = {
        dataset: { action, ...dataset },
        value,
        matches(selector) {
          return selector === "[data-action]";
        }
      };
      documentListeners.get("input")({ target });
    },
    pagehide() {
      const handler = windowListeners.get("pagehide");
      assert.ok(handler, "pagehide should force a final save");
      handler();
    },
    async settle() {
      await new Promise((resolve) => setImmediate(resolve));
    }
  };
}

test("temporarily leaving a practice saves the draft and pauses its timer", () => {
  const harness = boot();
  assert.equal(harness.activeIntervals.size, 1);

  harness.click("pause-session");

  assert.equal(harness.saved().session.id, "draft-1");
  assert.equal(harness.saved().view, "dashboard");
  assert.equal(harness.activeIntervals.size, 0);
  assert.match(harness.app.innerHTML, /继续未完成练习/);
});

test("pagehide performs a final save for abrupt tab or browser closure", () => {
  const harness = boot();
  harness.pagehide();

  assert.equal(harness.saved().session.answers.Q1, "FALSE");
  assert.ok(harness.saved().lastSavedAt);
});

test("starting another module cannot overwrite an unfinished draft", () => {
  const harness = boot(initialState({ view: "dashboard" }));

  harness.click("start-session", { mode: "listening" });

  assert.equal(harness.saved().session.id, "draft-1");
  assert.equal(harness.saved().session.mode, "reading");
  assert.equal(harness.saved().view, "practice");
});

test("finishing reading creates a durable review card and one automatic Anki candidate", () => {
  const harness = boot();
  harness.click("finish-session");
  harness.click("confirm-finish-session");

  const completed = harness.saved();
  assert.equal(completed.errors.length, 1);
  assert.equal(completed.history[0].errors.length, 1);
  assert.equal(completed.anki.length, 1);
  assert.equal(completed.errors[0].prompt, "Statement");
  assert.equal(completed.errors[0].errorType, "判断题证据边界");
  assert.deepEqual(completed.errors[0].reviewSchedule.map((entry) => entry.day), [1, 3, 7]);
  assert.match(harness.app.innerHTML, /data-review-errors/);
  assert.match(harness.app.innerHTML, /data-question-prompt/);
  assert.match(harness.app.innerHTML, /已自动加入 Anki/);

  const errorId = completed.errors[0].id;
  harness.input("error-field", { errorId, field: "learnerDiagnosis" }, "把 FALSE 当成了 NOT GIVEN。");
  harness.click("mark-error-review", { errorId, reviewStage: "1" });
  const edited = harness.saved();
  assert.equal(edited.errors[0].learnerDiagnosis, "把 FALSE 当成了 NOT GIVEN。");
  assert.equal(edited.history[0].errors[0].learnerDiagnosis, "把 FALSE 当成了 NOT GIVEN。");
  assert.ok(edited.errors[0].reviewSchedule[0].completedAt);
  assert.ok(edited.history[0].errors[0].reviewSchedule[0].completedAt);

  const reloaded = boot(edited);
  reloaded.input("error-field", { errorId, field: "learnerDiagnosis" }, "刷新后继续修改。");
  reloaded.click("add-error-anki", { errorId });
  assert.equal(reloaded.saved().errors[0].learnerDiagnosis, "刷新后继续修改。");
  assert.equal(reloaded.saved().history[0].errors[0].learnerDiagnosis, "刷新后继续修改。");
  assert.equal(reloaded.saved().anki.length, 1);
});

test("intensive-reading progress survives reload and resumes at the saved learning stage", async () => {
  const harness = boot(
    initialState({
      view: "intensive",
      session: null,
      intensiveReading: {
        selectedId: "",
        bookFilter: "all",
        search: "",
        displayMode: "english",
        level: "B1-B2",
        progressById: {},
        expressions: [],
        draftsById: {}
      }
    })
  );

  assert.match(harness.app.innerHTML, /双语精读/);
  assert.match(harness.app.innerHTML, /1\/1/);

  harness.click("open-intensive-passage", { passageId: INTENSIVE_ITEM.id });
  await harness.settle();
  assert.match(harness.app.innerHTML, /Children&#039;s ideas about rainforests/);
  assert.match(harness.app.innerHTML, /预读预测/);

  harness.input("intensive-field", { field: "prediction" }, "The text may compare children's sources.");
  harness.click("complete-intensive-stage");
  const saved = harness.saved();
  assert.equal(saved.intensiveReading.selectedId, INTENSIVE_ITEM.id);
  assert.equal(saved.intensiveReading.progressById[INTENSIVE_ITEM.id].stage, "timed-read");
  assert.equal(
    saved.intensiveReading.draftsById[INTENSIVE_ITEM.id].prediction,
    "The text may compare children's sources."
  );

  const reloaded = boot(saved);
  assert.match(reloaded.app.innerHTML, /载入并继续/);
  reloaded.click("open-intensive-passage", { passageId: INTENSIVE_ITEM.id });
  await reloaded.settle();
  assert.match(reloaded.app.innerHTML, /英文限时通读/);
});
