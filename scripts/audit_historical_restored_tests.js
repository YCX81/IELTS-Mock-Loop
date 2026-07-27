const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BANK_PATH = path.join(ROOT, "data", "cambridge-test-bank.json");
const REPORT_PATH = path.join(
  ROOT,
  "reports",
  "reading-answer-restoration-audit-2026-07-27.md"
);

const RESTORED_BOOKS = new Set(["04", "05", "06", "08", "12", "16", "18", "19", "20", "21"]);
const PRIORITY_TESTS = new Set([
  "cambridge-16-reading-test-3",
  "cambridge-16-reading-test-4",
  "cambridge-17-reading-test-1",
  "cambridge-17-reading-test-2",
  "cambridge-17-reading-test-3",
  "cambridge-17-reading-test-4",
  "cambridge-18-reading-test-1",
  "cambridge-18-reading-test-2",
  "cambridge-21-reading-test-3",
  "cambridge-21-reading-test-4",
]);

function text(value) {
  return value == null ? "" : String(value).trim();
}

function normalized(value) {
  return text(value)
    .normalize("NFKD")
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, "-")
    .toLowerCase()
    .replace(/\b(?:in either order|in any order|and|or)\b/g, " ")
    .replace(/[^a-z0-9%]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function answerCandidates(question) {
  const candidates = Array.isArray(question.acceptedAnswers)
    ? question.acceptedAnswers
    : [question.answer];
  return [...new Set(candidates.map(normalized).filter(Boolean))];
}

function candidateAppears(candidate, officialRaw) {
  const official = ` ${normalized(officialRaw)} `;
  const exact = ` ${candidate} `;
  if (official.includes(exact)) {
    return true;
  }

  const words = candidate.split(" ").filter(Boolean);
  return words.length > 0 && words.every((word) => official.includes(` ${word} `));
}

function parseAnswerKey(answerKeyText) {
  const mapping = new Map();
  const lines = text(answerKeyText).split(/\r?\n/);
  let pendingNumber = null;
  let pendingGroup = null;

  function assign(number, raw) {
    if (number >= 1 && number <= 40 && text(raw) && !mapping.has(number)) {
      mapping.set(number, text(raw));
    }
  }

  function assignGroup(start, end, raw) {
    for (let number = start; number <= end; number += 1) {
      assign(number, raw);
    }
  }

  for (const originalLine of lines) {
    const chunks = originalLine.split(";").map((part) => part.trim()).filter(Boolean);
    for (let chunk of chunks) {
      chunk = chunk.replace(/^(?:Test \d+ Reading:\s*)/i, "").trim();
      if (!chunk) {
        continue;
      }

      if (pendingNumber != null && !/^\d/.test(chunk)) {
        assign(pendingNumber, chunk);
        pendingNumber = null;
        continue;
      }

      if (pendingGroup && !/^\d/.test(chunk)) {
        pendingGroup.answers.push(chunk);
        if (pendingGroup.answers.length >= pendingGroup.end - pendingGroup.start + 1) {
          const raw = pendingGroup.answers.join(" / ");
          assignGroup(pendingGroup.start, pendingGroup.end, raw);
          pendingGroup = null;
        }
        continue;
      }

      const group = chunk.match(
        /^(\d+)\s*(?:&|\/|[-–])\s*(\d+)\s*(.*)$/i
      );
      if (group) {
        const start = Number(group[1]);
        const end = Number(group[2]);
        const remainder = text(group[3]);
        const withoutDirective = remainder
          .replace(/^IN (?:EITHER|ANY) ORDER\b/i, "")
          .trim();
        if (withoutDirective) {
          assignGroup(start, end, withoutDirective);
        } else if (start >= 1 && end <= 40 && end >= start) {
          pendingGroup = { start, end, answers: [] };
        }
        continue;
      }

      const numbered = chunk.match(/^(\d+)\s*[.]?\s+(.+)$/);
      if (numbered) {
        assign(Number(numbered[1]), numbered[2]);
        continue;
      }

      const numberOnly = chunk.match(/^(\d+)$/);
      if (numberOnly) {
        const number = Number(numberOnly[1]);
        if (number >= 1 && number <= 40) {
          pendingNumber = number;
        }
      }
    }
  }

  return mapping;
}

function answerKeyAssessment(test) {
  const mapping = parseAnswerKey(test.answerKeyText);
  const unsupported = [];
  const unparsed = [];

  for (const question of test.questions) {
    const raw = mapping.get(question.number);
    if (!raw) {
      unparsed.push(question.number);
      continue;
    }
    const candidates = answerCandidates(question);
    if (!candidates.some((candidate) => candidateAppears(candidate, raw))) {
      unsupported.push({
        number: question.number,
        answer: text(question.answer),
        officialRaw: raw,
      });
    }
  }

  return {
    parsed: mapping.size,
    unsupported,
    unparsed,
    supported: 40 - unsupported.length - unparsed.length,
  };
}

function formatNumbers(numbers) {
  return numbers.length ? numbers.join(", ") : "无";
}

function compactNumberRanges(numbers) {
  if (!numbers.length) {
    return "";
  }
  const ranges = [];
  let start = numbers[0];
  let end = numbers[0];
  for (const number of numbers.slice(1)) {
    if (number === end + 1) {
      end = number;
      continue;
    }
    ranges.push(start === end ? `Q${start}` : `Q${start}–${end}`);
    start = number;
    end = number;
  }
  ranges.push(start === end ? `Q${start}` : `Q${start}–${end}`);
  return ranges.join(", ");
}

function main() {
  const bank = JSON.parse(fs.readFileSync(BANK_PATH, "utf8"));
  const tests = bank.tests
    .filter((test) => {
      const match = /^cambridge-(\d+)-reading-test-\d+$/.exec(test.id);
      return (
        match &&
        RESTORED_BOOKS.has(match[1]) &&
        !PRIORITY_TESTS.has(test.id)
      );
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  if (tests.length !== 34) {
    throw new Error(`Expected 34 historical-restored tests, found ${tests.length}.`);
  }

  const results = tests.map((test) => {
    const numbers = test.questions.map((question) => question.number);
    const expectedNumbers = Array.from({ length: 40 }, (_, index) => index + 1);
    const invalidNumbering =
      numbers.length !== 40 ||
      numbers.some((number, index) => number !== expectedNumbers[index]);
    const missingAnswers = test.questions
      .filter((question) => !text(question.answer))
      .map((question) => question.number);
    const placeholderPrompts = test.questions
      .filter((question) => /^Answer\s+\d+$/i.test(text(question.prompt)))
      .map((question) => question.number);
    const missingEvidence = test.questions
      .filter((question) => !text(question.evidence))
      .map((question) => question.number);
    const key = answerKeyAssessment(test);

    return {
      id: test.id,
      questionCount: test.questions.length,
      invalidNumbering,
      missingAnswers,
      placeholderPrompts,
      missingEvidence,
      draftStatus: text(test.draftStatus),
      parseConfidence: text(test.parseConfidence),
      answerKeyLength: text(test.answerKeyText).length,
      key,
    };
  });

  const totalQuestions = results.reduce((sum, result) => sum + result.questionCount, 0);
  const missingAnswers = results.flatMap((result) =>
    result.missingAnswers.map((number) => `${result.id} Q${number}`)
  );
  const placeholderPrompts = results.flatMap((result) =>
    result.placeholderPrompts.map((number) => `${result.id} Q${number}`)
  );
  const missingEvidence = results.flatMap((result) =>
    result.missingEvidence.map((number) => `${result.id} Q${number}`)
  );
  const keyUnsupported = results.flatMap((result) =>
    result.key.unsupported.map((item) => ({
      id: result.id,
      ...item,
    }))
  );
  const keyUnparsed = results.flatMap((result) =>
    result.key.unparsed.map((number) => `${result.id} Q${number}`)
  );
  const missingEvidenceLocations = results
    .filter((result) => result.missingEvidence.length)
    .map(
      (result) =>
        `${result.id} ${compactNumberRanges(result.missingEvidence)}`
    );
  const statusCounts = {};
  for (const result of results) {
    const key = `${result.draftStatus} / ${result.parseConfidence}`;
    statusCounts[key] = (statusCounts[key] || 0) + 1;
  }

  const lines = [
    "# 34 套历史恢复 Reading 答案审计（2026-07-27）",
    "",
    "## 范围与方法",
    "",
    "- 范围：最初 44 套历史恢复题中，排除当前优先重新校准的 10 套后剩余的 34 套，共 1,360 题。",
    "- 数据源：`data/cambridge-test-bank.json` 当前工作区快照。",
    "- 只读检查：题数与题号、答案非空、题干是否为 `Answer N` 占位、evidence 覆盖、状态字段，以及 `answerKeyText` 中题号—答案对应关系。",
    "- `answerKeyText` 支持度为结构化文本比对结果：脚本兼容逐行、分号列表、跨行表格以及 `IN EITHER/ANY ORDER` 组合答案。它能证明当前答案与本地官方答案页文本一致，但不能替代逐页视觉复核。",
    "",
    "## 总结",
    "",
    `- 套数：${results.length}；题数：${totalQuestions}。`,
    `- 40 题且题号 1–40 连续：${results.filter((result) => !result.invalidNumbering).length}/34 套。`,
    `- 答案非空：${totalQuestions - missingAnswers.length}/${totalQuestions} 题。`,
    `- 非 \`Answer N\` 占位题干：${totalQuestions - placeholderPrompts.length}/${totalQuestions} 题。`,
    `- evidence 非空：${totalQuestions - missingEvidence.length}/${totalQuestions} 题。`,
    `- 可从 \`answerKeyText\` 建立题号映射并支持当前答案：${results.reduce((sum, result) => sum + result.key.supported, 0)}/${totalQuestions} 题。`,
    `- 标准化 \`verification\` 状态完整：${tests.filter((test) => test.verification?.answerKey === "verified_against_local_official_answer_key_text" && test.verification?.evidence === "complete").length}/${tests.length} 套。`,
    "",
    "## 逐套结果",
    "",
    "| 测试 | 题数/题号 | 空答案 | 占位题干 | evidence | 状态 | answerKeyText 支持 |",
    "|---|---:|---:|---:|---:|---|---:|",
    ...results.map(
      (result) =>
        `| ${result.id} | ${result.invalidNumbering ? "异常" : "40/连续"} | ${result.missingAnswers.length} | ${result.placeholderPrompts.length} | ${40 - result.missingEvidence.length}/40 | ${result.draftStatus} / ${result.parseConfidence} | ${result.key.supported}/40 |`
    ),
    "",
    "## 异常与风险",
    "",
  ];

  if (!missingAnswers.length && !placeholderPrompts.length && !keyUnsupported.length && !keyUnparsed.length) {
    lines.push(
      "- 未发现空答案、`Answer N` 占位题干或当前答案与 `answerKeyText` 的机器可见冲突。"
    );
  }
  lines.push(
    `- 缺 evidence：${missingEvidence.length} 题；位置：${formatNumbers(missingEvidenceLocations)}。`,
    `- answerKeyText 未解析：${keyUnparsed.length} 题；位置：${formatNumbers(keyUnparsed)}。`,
    `- answerKeyText 已解析但不支持当前答案：${keyUnsupported.length} 题。`
  );
  if (keyUnsupported.length) {
    lines.push(
      "",
      ...keyUnsupported.map(
        (item) =>
          `  - ${item.id} Q${item.number}：当前 \`${item.answer}\`；答案页解析为 \`${item.officialRaw}\`。`
      )
    );
  }
  lines.push(
    "",
    "### 状态字段分布",
    "",
    ...Object.entries(statusCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([status, count]) => `- \`${status}\`：${count} 套。`),
    "",
    "## 结论",
    "",
    missingAnswers.length || placeholderPrompts.length || keyUnsupported.length || keyUnparsed.length
      ? "- 这 34 套尚不能整体标记为答案键机器审计通过；应先处理上列冲突或未解析项。"
      : "- 这 34 套的题目结构与答案键恢复完整，且当前答案均能由本地 `answerKeyText` 支持。",
    missingEvidence.length
      ? "- 但它们还不能整体宣称为“逐题证据校准完成”：存在 evidence 空缺，需单列后续补齐。"
      : "- 每题均有 evidence，可进入抽样视觉复核。",
    "- 旧 `draftStatus` / `parseConfidence` 值继续保留作历史来源；统一状态由 `verification.answerKey` 与 `verification.evidence` 分别表达答案键和逐题证据的核对结果。",
    ""
  );

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        tests: results.length,
        questions: totalQuestions,
        missingAnswers: missingAnswers.length,
        placeholderPrompts: placeholderPrompts.length,
        missingEvidence: missingEvidence.length,
        keySupported: results.reduce((sum, result) => sum + result.key.supported, 0),
        keyUnparsed: keyUnparsed.length,
        keyUnsupported: keyUnsupported.length,
        report: path.relative(ROOT, REPORT_PATH),
      },
      null,
      2
    )
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  answerKeyAssessment,
  parseAnswerKey,
};
