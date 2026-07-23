---
name: ielts-learning-loop
description: Build and run an IELTS study loop around local computer-based mock tests, imported practice banks, error review, Anki candidate cards, bilingual intensive reading, and weekly planning. Use when the user asks to study IELTS, organize Cambridge or official practice resources, convert practice materials into a closed learning workflow, analyze weak points, plan daily IELTS practice, or operate the IELTS Mock Loop project.
---

# IELTS Learning Loop

## Goal

Turn IELTS preparation into a closed loop:

1. choose one focused task;
2. practise in a computer-based test interface;
3. submit and review immediately;
4. extract error causes and Anki candidates;
5. schedule the next focused task from the review result.

Prefer the local `IELTS-Mock-Loop` app as the operating surface when it is available.

## Core Rules

- Do not treat "doing more tests" as progress unless the result creates a review artifact.
- Keep copyrighted source PDFs, audio, OCR images, and raw generated files local unless the user explicitly asks for local backup. Do not upload them to public repositories or third-party services.
- Use GitHub for code, templates, scripts, and lightweight indexes; keep full Cambridge source files under local `data/`.
- Preserve the user's local `data/` directory. Cleaning OCR cache is allowed only when the user asks, and only for disposable generated directories such as `data/generated/ocr-images`.
- When editing the project, avoid committing local Cambridge PDFs, audio, OCR text, page images, or generated model caches.
- After every feature change, verify the actual browser flow, not only static code.

## Daily Workflow

### 1. Pick the Task

Choose exactly one primary task for a session:

- Reading: one passage or one section, timed.
- Listening: one part or one full test, with audio and answer sheet.
- Writing: one Task 1 or Task 2 response.
- Speaking: one Part 2 cue card plus follow-up questions.
- Intensive reading: one article or passage for expression mining.

If the user has no preference, choose the weakest recent module from the review history. If no history exists, start with Reading Passage 1 or Listening Part 1.

### 2. Prepare the Session

Use the local app flow:

1. Open `index.html` or run a local server such as `python -m http.server 5178`.
2. Go to `机考`.
3. Select the module and test bank entry.
4. Start the session.
5. Do not show raw OCR text in the practice UI; OCR output is only an import source.

For Reading, prefer the split CBT layout: passage on the left, questions on the right, bottom question navigation.

For Listening, prefer a single question panel with 1-40 bottom navigation and an audio control area. Do not add a separate answer-sheet column unless the user asks.

### 3. Submit

On finish:

1. Show a confirmation with answered, unanswered, flagged, and total counts.
2. Save answers and timing.
3. Route the user to `复盘`.
4. Highlight the latest submitted record.

The session is incomplete until the review record exists.

### 4. Review

For the latest record, require two fields:

- `本轮诊断`: the most likely cause of score loss.
- `下一步动作`: one concrete action before the next test.

Good diagnoses:

- "T/F/NG 错在证据边界，不是生词。"
- "听力数字题漏了连读和复数。"
- "Task 2 主体段解释不足，只给观点没有展开。"

Bad diagnoses:

- "粗心。"
- "多练。"
- "状态不好。"

Good next actions:

- "重做错题所在 3 个定位句，标出题干和原文同义替换。"
- "重听 Section 2 第 2 分钟到第 4 分钟，写出漏听词和拼写问题。"
- "只重写一个主体段，补充解释链，不整篇重写。"

### 5. Convert to Anki Candidates

Create cards only for reusable learning value:

- Reading: question stem expression, original evidence sentence, synonym pair, trap pattern.
- Listening: missed phrase, number/date spelling, linking or weak form, signpost language.
- Writing: one improved sentence, one paragraph skeleton, one collocation.
- Speaking: one answer frame, one topic phrase, one repair phrase.
- Intensive reading: A-layer expression, sentence pattern, collocation boundary.

Card format:

- Front: a prompt that forces recall, not recognition.
- Back: answer, context, and one use case.
- Tags: `ielts`, module, source, error type.

Do not bulk-create cards from every word in a passage.

### 6. Schedule the Next Task

Map the diagnosis to the next task:

- Evidence boundary error -> one short Reading evidence drill.
- Vocabulary gap -> intensive reading plus 5 Anki candidates.
- Listening spelling -> one dictation segment plus answer spelling check.
- Writing coherence -> one paragraph rewrite.
- Speaking fluency -> one 60-second rerecording.

The next task should be smaller than a full test unless the review result was already strong.

## Weekly Workflow

At the end of a week:

1. Count sessions by module.
2. Identify the top three error causes.
3. Check whether Anki candidates were exported or reviewed.
4. Pick one module to maintain and one module to repair.
5. Plan 5 daily sessions:
   - 2 focused drills;
   - 2 timed sections;
   - 1 full or near-full mock.

Avoid a week made only of full mocks.

## Working With Local Cambridge Data

Use these conventions in this project:

- Source PDFs and listening archives live under `data/`.
- Extracted audio may live under `data/generated/audio/`.
- OCR page images are disposable and may live under `data/generated/ocr-images/`.
- Text/page JSON/report artifacts may live under `data/generated/`.
- Do not embed full original-book pages in intensive-reading lessons, including passage pages, full question pages, or official answer-key pages. Use page renders only for internal calibration. A lesson may include a tightly cropped local diagram only when the question cannot be understood or answered from text alone.
- Browser-facing lightweight indexes are:
  - `data/materials.js`
  - `data/cambridge-resource-index.js`
  - `data/cambridge-test-bank.js`

When the user asks to rebuild the bank:

1. Check whether source PDFs and audio exist locally.
2. Prefer structured extraction before OCR.
3. Use OCR only for pages that do not yield usable text.
4. Preserve raw artifacts for debugging, but do not show them in the practice UI.
5. After generating a bank, run the app import/selection flow and verify at least one test appears.

## Project Editing Checklist

Before committing or pushing:

- Run `git status -sb`.
- Confirm no PDF, zip, mp3, m4a, wma, png OCR pages, OCR text dumps, or Paddle model cache files are staged.
- Stage only the intended code, template, script, README, or skill files.
- Run `node --check app.js` after JavaScript changes.
- Verify browser flow after UI changes.
- Push only after confirming the commit scope.

## Output Style

When advising the learner, keep the answer operational:

- say what to do next;
- explain why it follows from the last review;
- keep the next action small enough to complete today;
- avoid broad motivational language.
