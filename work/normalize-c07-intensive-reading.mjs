import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonDir = path.join(
  repoRoot,
  "data",
  "generated",
  "intensive-reading",
  "cambridge-07-09",
);

const specs = [
  [1, 1, "Let's Go Bats"],
  [1, 2, "Making Every Drop Count"],
  [1, 3, "Educating Psyche"],
  [2, 1, "Why pagodas don't fall down"],
  [2, 2, "The True Cost of Food"],
  [2, 3, "Makete Integrated Rural Transport Project"],
  [3, 1, "Ant Intelligence"],
  [3, 2, "Population movements and genetics"],
  [3, 3, "Plans to protect the forests of Europe"],
  [4, 1, "Pulling strings to build pyramids"],
  [4, 2, "Endless Harvest"],
  [4, 3, "Effects of Noise"],
];

const questionVocabularySupplements = {
  "1-1": [
    ["wildlife", "B1", "野生动物的总称，不可数；题干用它概括蝙蝠以外的动物。"],
    ["rely on", "B1", "依赖、依靠；后接名词或动名词，语气比 use 更强调必要性。"],
    ["vision", "B2", "视觉能力；题干中的 rely on vision 指依靠眼睛导航。"],
    ["navigate", "B2", "辨认方向并行进；navigate by vision 表示借助视觉导航。"],
    ["mammal", "B2", "哺乳动物；early mammals 指早期哺乳动物群体。"],
    ["die out", "B2", "灭绝、完全消失；与单个生物 die 不同，主语通常是物种或群体。"],
    ["particular", "B1", "特定的；限定 discovery，提示定位某一项发现而非泛泛研究。"],
    ["discovery", "B1", "发现；how ... has helped 强调这项发现对理解蝙蝠的贡献。"],
    ["military", "B2", "军事的；early military uses 指回声定位原理早期的军用场景。"],
    ["echolocation", "C1", "回声定位；通过发声并分析回声判断物体位置。"],
    ["so-called", "B2", "所谓的；可中性标示名称，也可暗含对名称是否准确的保留。"],
    ["comparable to", "B2", "可与……相比；强调相似到足以比较，不等于完全相同。"],
    ["sensation", "B2", "感觉、感知；这里指面部仿佛被触碰的主观感觉。"],
    ["phantom", "B2", "幻觉般存在的；phantom limb 指截肢后仍感觉肢体存在的幻肢。"],
    ["perceive", "C1", "感知、察觉；比 notice 正式，强调感官或认知接收到信息。"],
    ["principle", "B2", "原理；题干指回声反射可用于测距这一基本机制。"],
    ["instrument", "B1", "仪器；这里是执行测量任务的技术设备，不是乐器。"],
    ["calculate", "B1", "计算、测定；calculate the depth 指根据回声测出深度。"],
    ["seabed", "C1", "海床、海底地面；depth of the seabed 即海底深度。"],
    ["wartime application", "B2", "战时应用；application 在这里是“用途”，不是申请。"],
    ["device", "B1", "装置、设备；比 instrument 更泛，可指用于探测的机械或电子设备。"],
    ["result in", "B1", "导致；后接结果，题干用过去完成时回溯雷达发明前的演化结果。"],
    ["sophisticated", "B2", "复杂而先进的；不只是 complicated，还含设计成熟、功能精密之意。"],
    ["inaccurate", "B2", "不准确的；题干要求解释 radar 一词为何不能精确描述蝙蝠系统。"],
    ["refer to", "B1", "指称、谈到；when referring to bats 表示在描述蝙蝠时。"],
    ["navigation system", "B2", "导航系统；指蝙蝠用于定位和避障的一整套感知机制。"],
    ["sonar", "C1", "声呐；利用声波及其回声探测水下物体或距离。"],
    ["theory", "B2", "理论；mathematical theories 指支撑雷达与声呐的数学理论。"],
    ["zoologist", "B2", "动物学家；由 zoology 加表示职业的 -ist 构成。"],
  ],
  "2-1": [
    ["yet", "B1", "然而、可是；放在句首引出与前文预期相反的事实。"],
    ["pagoda", "B2", "（东亚的）塔、宝塔；本文特指日本多层木塔。"],
    ["further", "B1", "更进一步地；用于在已有解释之外追加新的论据。"],
    ["even", "B1", "甚至；把后面的情况标成超出通常预期的极端例子。"],
  ],
  "2-3": [
    ["within", "B1", "在……范围内；本文既可指时间期限，也可指项目或地区范围。"],
    ["project", "B1", "项目、工程；本文指有目标、阶段和资源安排的农村交通计划。"],
    ["goods", "B1", "货物、商品；是复数形式，强调需要运输的物资。"],
    ["solution", "B1", "解决方案；常与 problem 搭配，指可执行的处理办法。"],
    ["improvement", "B1", "改善、改进；既可指过程，也可指具体改善成果。"],
    ["path", "B1", "小路、通道；本文多指村庄日常步行和运输使用的道路。"],
    ["phase", "B2", "阶段；项目管理中指具有独立目标和任务的一段时期。"],
    ["district", "B1", "地区、行政区；本文用于界定项目实施的地理范围。"],
    ["cost", "B1", "成本、费用；既可作名词，也可作动词表示“花费”。"],
  ],
  "4-1": [
    ["exactly", "B1", "究竟、到底；放在疑问词 how 后加强追问的精确程度。"],
    ["reckon", "B2", "认为、估计；这里接 that 从句表示研究者提出自己的判断，语气比 prove 弱。"],
    ["hang in the air", "B2", "悬在空中；既描写巨石的视觉效果，也突出建造方法令人难以置信。"],
  ],
};

const sentenceVocabularySupplements = {
  "2-3": {
    2: [["within", "B1", "在……范围内；这里限定马凯特区内部。"]],
    6: [["project", "B1", "项目；这里是 MIRTP 全称中的核心名词。"]],
    13: [["goods", "B1", "货物；本句指家庭日常运输的物资。"]],
    15: [["solutions", "B1", "解决方案；复数表示需要比较多种可行办法。"]],
    17: [["improvement", "B1", "改善；这里具体指公路网络的改进。"]],
    18: [["improvements", "B1", "改善工程；复数回指上一句的道路改进措施。"]],
    19: [["improvement", "B1", "改善；in addition to 引出道路改善以外的培训。"]],
    21: [
      ["goods", "B1", "货物；作 transported 的运输对象。"],
      ["paths", "B1", "小路；本句两次出现，既是运输捷径也是安全风险。"],
    ],
    22: [["paths", "B1", "小路；这里是 improve 的直接宾语。"]],
    27: [
      ["project", "B1", "项目；本句把 MIRTP 作为决策主体。"],
      ["costs", "B1", "价格为；cost 作动词，第三人称单数形式不加 to。"],
    ],
    28: [["Phase II", "B2", "第二阶段；用于标示项目时间和工作分期。"]],
    29: [["phase", "B2", "阶段；Phase III 是项目第三阶段。"]],
    30: [["improvements", "B1", "改善工程；具体指道路改造及配套维护。"]],
    32: [["paths", "B1", "小路；与 secondary roads 并列作被改善对象。"]],
    33: [
      ["paths", "B1", "小路；improved paths 指已经修整的小路。"],
      ["improvements", "B1", "改善项目；few 强调完成数量仍少。"],
    ],
    34: [["district", "B1", "地区；限定车辆发生故障的地理范围。"]],
    37: [["costs", "B1", "成本；production time and costs 是并列宾语。"]],
    39: [
      ["cost / costs", "B1", "费用、售价；本句两次作动词、一次作名词。"],
    ],
    43: [["costs", "B1", "价格为；这里比较驴与自行车的购置价格。"]],
    47: [["paths", "B1", "小路；improved paths 指已获得当地认可的改良道路。"]],
  },
};

const questionTypeNotes = {
  matching_headings:
    "段落标题匹配先提炼每段的主功能，再排除只复述局部细节的标题；同义改写比原词复现更可靠。",
  yes_no_not_given:
    "YES / NO / NOT GIVEN 判断的是作者观点：同义支持选 YES，明确冲突选 NO，原文没有足够信息才选 NOT GIVEN。",
  true_false_not_given:
    "TRUE / FALSE / NOT GIVEN 只比较题干与原文事实：一致、矛盾、未说明三种状态必须严格分开。",
  multiple_choice:
    "选择题先确定题干限定词，再回原文比较完整含义；不要因选项复现个别原词就直接作答。",
  summary_completion:
    "摘要填空先用语法判断词性和单复数，再用段落逻辑定位；最后检查题目规定的字数上限。",
  sentence_completion:
    "句子填空同时核对语法衔接、语义搭配和字数限制，答案必须来自原文允许的词语。",
  matching_information:
    "信息匹配先抓题干中的独特概念，再寻找同义改写；同一段可能被使用多次时不要自行排除。",
  matching_features:
    "特征匹配要建立人物、机构或类别与观点的对应表，尤其注意代词和转述句。",
  matching_sentence_endings:
    "句尾匹配先独立预测语义，再检查语法和逻辑是否都能闭合，避免只凭表面搭配。",
  short_answer:
    "简答题先圈定疑问词要求的答案类型，并严格遵守字数限制与原文措辞。",
};

function lessonPath(test, passage) {
  return path.join(
    lessonDir,
    `Cambridge-IELTS-07-Test-${test}-Passage-${passage}-双语精读.md`,
  );
}

function calibrationPath(test, passage) {
  return path.join(repoRoot, "work", `c07-t${test}-p${passage}-calibration.json`);
}

function cleanCell(value) {
  return String(value)
    .replace(/\|/g, "\\|")
    .replace(/\s+/g, " ")
    .trim();
}

function stripMarkup(value) {
  return String(value)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .trim();
}

function extractVocabulary(markdown) {
  const rows = [];
  const seen = new Set();

  function addRow(expression, level, explanation) {
    const cleanedExpression = stripMarkup(expression)
      .replace(/\*/g, "")
      .replace(/^[-–—,:：，。\s]+|[-–—,:：，。\s]+$/g, "")
      .trim();
    if (
      !cleanedExpression ||
      cleanedExpression.length > 90 ||
      /[\u3400-\u9fff]/u.test(cleanedExpression) ||
      !/[A-Za-z]/.test(cleanedExpression) ||
      /https?:|www\.|[\\/]/i.test(cleanedExpression)
    ) {
      return;
    }

    const cleanedExplanation =
      stripMarkup(explanation)
        .replace(/^[\s*）)】\]，,:：·｜\-–—]+/, "")
        .replace(/^第\s*\d+(?:\s*[、至-]\s*(?:第\s*)?\d+)?次[）)]?\s*/, "")
        .replace(/[、，,\s]+$/, "")
        .trim() || "本句中的具体含义、搭配和语气见对应逐句精读。";
    const key = `${cleanedExpression.toLowerCase()}\u0000${level}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    rows.push({
      expression: cleanedExpression,
      level,
      explanation: cleanedExplanation,
    });
  }

  function parseLevelTail(tail) {
    const levelMatch = tail.match(/\b(B1|B2|C1|C2)\b/);
    if (!levelMatch) {
      return undefined;
    }
    const afterLevel = tail.slice((levelMatch.index ?? 0) + levelMatch[1].length);
    const explanation = afterLevel
      .replace(
        /^\s*(?:\*\*)?(?:[，,｜·][^】）)\]]*)?(?:\*\*)?(?:[】）)\]])?\s*[，,:：]?\s*/,
        "",
      )
      .replace(/[；;。]\s*.*$/, "")
      .trim();
    return { level: levelMatch[1], explanation };
  }

  for (const sourceLine of markdown.split(/\r?\n/)) {
    if (!/\b(?:B1|B2|C1|C2)\b/.test(sourceLine)) {
      continue;
    }

    const normalized = sourceLine
      .replace(/^\s*[-*]\s+/, "")
      .replace(/^.*?(?:词语逐次讲解|标题词语逐次讲解)[：:]\s*/, "")
      .trim();
    const terms = [...normalized.matchAll(/`([^`]+)`/g)];

    if (terms.length > 0) {
      for (const [index, term] of terms.entries()) {
        const termEnd = (term.index ?? 0) + term[0].length;
        const nextStart = terms[index + 1]?.index ?? normalized.length;
        const tail = normalized.slice(termEnd, nextStart);
        const inlineLevel = term[1].match(/\b(B1|B2|C1|C2)\b/);
        let parsed = inlineLevel
          ? {
              level: inlineLevel[1],
              explanation: tail
                .replace(/^[\s*）)】\]，,:：·｜\-–—]+/, "")
                .replace(/[；;。]\s*.*$/, "")
                .trim(),
            }
          : parseLevelTail(tail);

        if (
          !parsed &&
          terms[index + 1] &&
          /^[、，,\s]*$/.test(tail)
        ) {
          const nextEnd =
            (terms[index + 1].index ?? 0) + terms[index + 1][0].length;
          const followingStart = terms[index + 2]?.index ?? normalized.length;
          parsed = parseLevelTail(normalized.slice(nextEnd, followingStart));
        }
        if (parsed) {
          addRow(
            term[1].replace(/[（(]?\b(?:B1|B2|C1|C2)\b[）)]?/g, "").trim(),
            parsed.level,
            parsed.explanation,
          );
        }
      }
      continue;
    }

    const levelMatch = normalized.match(/\b(B1|B2|C1|C2)\b/);
    if (levelMatch) {
      const beforeLevel = normalized.slice(0, levelMatch.index);
      const expression =
        [...beforeLevel.matchAll(/\*\*([^*]+)\*\*/g)].at(-1)?.[1] ??
        beforeLevel
          .replace(/^.*?[：:]\s*/, "")
          .replace(/[（(【][^（(【]*$/, "")
          .trim();
      const parsed = parseLevelTail(normalized);
      addRow(
        expression,
        levelMatch[1],
        parsed?.explanation ??
          "本句中的具体含义、搭配和语气见对应逐句精读。",
      );
    }
  }

  return rows;
}

function ensureCanonicalTitle(markdown, title) {
  const exactHeading = `## ${title}`;
  if (markdown.includes(exactHeading)) {
    return markdown;
  }

  const firstLineEnd = markdown.indexOf("\n");
  if (firstLineEnd < 0) {
    return `${markdown}\n\n${exactHeading}\n`;
  }
  return `${markdown.slice(0, firstLineEnd + 1)}\n${exactHeading}\n${markdown.slice(firstLineEnd + 1)}`;
}

function ensureReadingHeading(markdown, title) {
  if (markdown.includes("## 01 逐句精读")) {
    return markdown;
  }

  const titleHeading = `## ${title}`;
  const titleIndex = markdown.indexOf(titleHeading);
  const insertAt = markdown.indexOf("\n", titleIndex) + 1;
  return `${markdown.slice(0, insertAt)}\n## 01 逐句精读\n${markdown.slice(insertAt)}`;
}

function ensureQuestionHeading(markdown) {
  if (markdown.includes("## 02 题目与选项精讲")) {
    return markdown;
  }

  const questionMatch =
    markdown.match(/^#{1,3}\s+Questions?\b.*$/m) ??
    markdown.match(/^#{1,3}\s+.*题目.*精讲.*$/m);
  if (!questionMatch || questionMatch.index === undefined) {
    throw new Error("Cannot find the first question section");
  }

  return `${markdown.slice(0, questionMatch.index)}## 02 题目与选项精讲\n\n${markdown.slice(questionMatch.index)}`;
}

function normalizeLegacyHeadings(markdown, title) {
  return markdown
    .split(/\r?\n/)
    .map((line) => {
      if (
        line === `## ${title}` ||
        [
          "## 01 逐句精读",
          "## 02 题目与选项精讲",
          "## 03 B1+ 词汇深讲总表",
          "## 04 IELTS 阅读提醒",
          "## 05 答案汇总",
        ].includes(line)
      ) {
        return line;
      }
      if (/^#{1,2}\s+Questions?\b/.test(line)) {
        return line.replace(/^#{1,2}\s+/, "### ");
      }
      if (/^## (?:逐句精读|正文逐句精读)$/.test(line)) {
        return "### 原文逐句展开";
      }
      if (/^## 02 表/.test(line)) {
        return line.replace(/^## 02 /, "### ");
      }
      if (
        /^## (?:03 全部题目与选项精讲|04 答案与文章逻辑回收|答案汇总|答案总览|答案总表|全文回收|文章回收)$/.test(
          line,
        )
      ) {
        return line.replace(/^## /, "### ");
      }
      return line;
    })
    .join("\n");
}

function buildVocabularySection(rows) {
  const lines = [
    "## 03 B1+ 词汇深讲总表",
    "",
    "下表是逐句词汇讲解的检索索引；词义、搭配、语气边界和句中作用仍以对应逐句精读为准。",
    "",
    "| 表达 | CEFR | 本文义与使用提醒 |",
    "|---|---|---|",
  ];

  if (rows.length === 0) {
    lines.push("| 见逐句精读 | B1+ | 本文的 B1 及以上词汇已在各句下按语境展开。 |");
  } else {
    for (const row of rows) {
      lines.push(
        `| ${cleanCell(row.expression)} | ${row.level} | ${cleanCell(row.explanation)} |`,
      );
    }
  }
  return lines.join("\n");
}

function buildReminderSection(questionGroups) {
  const types = [...new Set(questionGroups.map((group) => group.type).filter(Boolean))];
  const notes = types.map(
    (type) =>
      questionTypeNotes[type] ??
      `处理 ${type.replaceAll("_", " ")} 时，先定位题干限定信息，再核对原文同义改写和逻辑关系。`,
  );

  return [
    "## 04 IELTS 阅读提醒",
    "",
    ...notes.map((note) => `- ${note}`),
    "- 所有题做完后都要回到原文证据复核，尤其检查否定、比较、范围词和单复数。",
  ].join("\n");
}

function buildAnswerSection(answers) {
  const lines = [
    "## 05 答案汇总",
    "",
    "| 题号 | 答案 |",
    "|---:|---|",
  ];
  for (const [question, answer] of Object.entries(answers)) {
    const displayAnswer =
      answer === "food bills / costs"
        ? "food bills/costs"
        : answer === "farmers / consumers (IN EITHER ORDER)"
          ? "farmers and consumers"
          : answer;
    lines.push(`| ${question} | ${cleanCell(displayAnswer)} |`);
  }
  return lines.join("\n");
}

function removeGeneratedTail(markdown) {
  const marker = "\n## 03 B1+ 词汇深讲总表";
  const index = markdown.indexOf(marker);
  return index >= 0 ? markdown.slice(0, index).trimEnd() : markdown.trimEnd();
}

function removeQuestionVocabularySupplement(markdown) {
  return markdown
    .replace(
      /\n?<!-- C07-QUESTION-VOCAB-START -->[\s\S]*?<!-- C07-QUESTION-VOCAB-END -->\n?/g,
      "\n",
    )
    .trimEnd();
}

function removeSentenceVocabularySupplements(markdown) {
  return markdown.replace(
    /\n?<!-- C07-SENTENCE-VOCAB-START \d+ -->[\s\S]*?<!-- C07-SENTENCE-VOCAB-END \d+ -->\n?/g,
    "\n",
  );
}

function injectSentenceVocabularySupplements(markdown, test, passage) {
  const supplements = sentenceVocabularySupplements[`${test}-${passage}`];
  if (!supplements) {
    return markdown;
  }

  let result = markdown;
  for (const [sentenceNumber, entries] of Object.entries(supplements)) {
    const heading = `#### ${sentenceNumber}\n`;
    const headingIndex = result.indexOf(heading);
    if (headingIndex < 0) {
      throw new Error(`Cannot find sentence heading ${sentenceNumber}`);
    }
    const marker = "本句词汇与表达：\n";
    const markerIndex = result.indexOf(marker, headingIndex);
    const nextHeadingIndex = result.indexOf("\n#### ", headingIndex + heading.length);
    if (
      markerIndex < 0 ||
      (nextHeadingIndex >= 0 && markerIndex > nextHeadingIndex)
    ) {
      throw new Error(`Cannot find vocabulary list for sentence ${sentenceNumber}`);
    }
    const listEnd = result.indexOf("\n\n", markerIndex + marker.length);
    if (listEnd < 0) {
      throw new Error(`Cannot find vocabulary list end for sentence ${sentenceNumber}`);
    }

    const lines = [
      `<!-- C07-SENTENCE-VOCAB-START ${sentenceNumber} -->`,
      ...entries.map(
        ([expression, level, explanation]) =>
          `- ${expression} (${level})：${explanation}`,
      ),
      `<!-- C07-SENTENCE-VOCAB-END ${sentenceNumber} -->`,
    ];
    result = `${result.slice(0, listEnd)}\n${lines.join("\n")}${result.slice(listEnd)}`;
  }
  return result;
}

function appendQuestionVocabularySupplement(markdown, test, passage) {
  const entries = questionVocabularySupplements[`${test}-${passage}`];
  if (!entries) {
    return markdown;
  }

  const lines = [
    "<!-- C07-QUESTION-VOCAB-START -->",
    "### B1+ 词汇查漏补充",
    "",
    ...entries.map(
      ([expression, level, explanation]) =>
        `- \`${expression}\`（**${level}**）：${explanation}`,
    ),
    "<!-- C07-QUESTION-VOCAB-END -->",
  ];
  return `${markdown.trimEnd()}\n\n${lines.join("\n")}`;
}

for (const [test, passage, title] of specs) {
  const filePath = lessonPath(test, passage);
  const calibration = JSON.parse(fs.readFileSync(calibrationPath(test, passage), "utf8"));
  const original = fs.readFileSync(filePath, "utf8");
  const base = removeSentenceVocabularySupplements(
    removeQuestionVocabularySupplement(removeGeneratedTail(original)),
  );
  let markdown = ensureCanonicalTitle(base, title);
  markdown = ensureReadingHeading(markdown, title);
  markdown = ensureQuestionHeading(markdown);
  markdown = normalizeLegacyHeadings(markdown, title);
  markdown = injectSentenceVocabularySupplements(markdown, test, passage);
  markdown = appendQuestionVocabularySupplement(markdown, test, passage);
  const vocabulary = extractVocabulary(markdown);

  markdown = [
    markdown.trimEnd(),
    buildVocabularySection(vocabulary),
    buildReminderSection(calibration.questionGroups ?? []),
    buildAnswerSection(calibration.answers ?? {}),
  ].join("\n\n").trimEnd() + "\n";

  fs.writeFileSync(filePath, markdown, "utf8");
  console.log(
    `Normalized C07 T${test} P${passage}: ${vocabulary.length} unique B1+ entries, ${Object.keys(calibration.answers ?? {}).length} answers.`,
  );
}
