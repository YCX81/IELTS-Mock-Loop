const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const APP_SOURCE = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const STORAGE_KEY = "ieltsMockLoopState.v1";

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
    pagehide() {
      const handler = windowListeners.get("pagehide");
      assert.ok(handler, "pagehide should force a final save");
      handler();
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
