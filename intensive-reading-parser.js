(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.IELTS_INTENSIVE_READING_PARSER = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const DANGEROUS_BLOCK_TAGS = "script|style|iframe|object|embed|template";

  function emptyModel() {
    return {
      schemaVersion: 1,
      title: "",
      lead: "",
      sections: [],
      paragraphs: [],
      units: [],
      deepDives: [],
      questionSection: null,
      takeaways: [],
    };
  }

  function removeUnsafeBlocks(value) {
    return String(value || "")
      .replace(
        new RegExp(`<(${DANGEROUS_BLOCK_TAGS})\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>`, "gi"),
        ""
      )
      .replace(new RegExp(`<(?:${DANGEROUS_BLOCK_TAGS})\\b[^>]*\\/?>`, "gi"), "")
      .replace(/<!--[\s\S]*?-->/g, "");
  }

  function removeFencedCode(lines) {
    const safe = [];
    let fence = "";

    lines.forEach((line) => {
      const match = line.match(/^\s*(`{3,}|~{3,})/);
      if (match) {
        const marker = match[1][0];
        if (!fence) {
          fence = marker;
        } else if (fence === marker) {
          fence = "";
        }
        return;
      }
      if (!fence) safe.push(line);
    });

    return safe;
  }

  function normalizeMarkdown(markdown) {
    if (typeof markdown !== "string") return "";
    const withoutBlocks = removeUnsafeBlocks(markdown.replace(/^\uFEFF/, ""));
    return removeFencedCode(withoutBlocks.replace(/\r\n?/g, "\n").split("\n")).join("\n");
  }

  function stripInlineMarkdown(value) {
    let text = removeUnsafeBlocks(value);
    text = text
      .replace(/^\s{0,3}#{1,6}\s+/, "")
      .replace(/^\s*>\s?/, "")
      .replace(/^\s*[-+*]\s+/, "")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\*\*([\s\S]*?)\*\*/g, "$1")
      .replace(/__([\s\S]*?)__/g, "$1")
      .replace(/<[^>]*>/g, "")
      .replace(/^\s*\|?[-:| ]+\|?\s*$/, "")
      .trim();
    return text;
  }

  function sanitizeIdPart(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u3400-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function makeId(prefix, kind, index) {
    return [prefix, kind, index].filter((part) => part !== "").join("-");
  }

  function parseHeading(line) {
    const match = String(line || "").match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!match) return null;
    return {
      level: match[1].length,
      title: stripInlineMarkdown(match[2]),
    };
  }

  function isQuestionTitle(value) {
    return /(?:题目|选项|questions?|answers?|答案|判断题|填空题|匹配题|简答题)/i.test(
      String(value || "")
    );
  }

  function isTakeawayTitle(value) {
    return /(?:全文回收|今日带走|词汇(?:深讲|汇总|总表)|阅读提醒|复习|总结|takeaways?)/i.test(
      String(value || "")
    );
  }

  function isReadingTitle(value) {
    return /(?:逐句|精读|原文|正文)/i.test(String(value || ""));
  }

  function isDeepDiveTitle(value) {
    return /(?:A\s*层\s*深挖|深挖表达|高价值表达)/i.test(String(value || ""));
  }

  function isStructuralHeadingTitle(value) {
    return /^(?:Section|Paragraph)\s+[A-Z](?:\s*[：:].*)?$/i.test(
      stripInlineMarkdown(value)
    );
  }

  function unitHeadingInfo(heading) {
    if (!heading || heading.level < 2 || heading.level > 4) return null;
    let match = heading.title.match(
      /^(?:句\s*)?(\d+)(?:\s*[（(][^）)]*[）)])?[.)、]?\s*$/
    );
    if (match) {
      return { number: Number(match[1]), english: "" };
    }
    match = heading.title.match(/^(\d+)[.)]\s+(.+)$/);
    if (match && looksEnglish(match[2])) {
      return { number: Number(match[1]), english: stripInlineMarkdown(match[2]) };
    }
    return null;
  }

  function standaloneNumber(line) {
    const match = stripInlineMarkdown(line).match(/^\s*(\d+)[.)、]?\s*$/);
    return match ? Number(match[1]) : null;
  }

  function inlineNumberedEnglish(line) {
    const text = stripInlineMarkdown(line);
    const match = text.match(/^(\d+)[.)]\s+(.+)$/);
    if (!match || !looksEnglish(match[2])) return null;
    return {
      number: Number(match[1]),
      english: stripInlineMarkdown(match[2]),
    };
  }

  function looksEnglish(value) {
    const text = String(value || "");
    if (/[\u3400-\u9fff]/.test(text)) return false;
    const latinLetters = (text.match(/[A-Za-z]/g) || []).length;
    return latinLetters >= 3;
  }

  function looksChinese(value) {
    return /[\u3400-\u9fff]/.test(String(value || ""));
  }

  function looksLikeExplanation(value) {
    return /^(?:[-+*]\s*)?(?:主干|结构|句子|本句|这句|这里|词汇|表达|文章作用|语法|破折号|分号|冒号|作者|A\s*层|考点|定位|解析|说明)[：:\s]/i.test(
      stripInlineMarkdown(value)
    );
  }

  function labeledValue(line, labels) {
    const clean = stripInlineMarkdown(line);
    const match = clean.match(new RegExp(`^(?:${labels})\\s*[：:]\\s*(.+)$`, "i"));
    return match ? match[1].trim() : "";
  }

  function isUnitMarkerLine(line) {
    const heading = parseHeading(line);
    return (
      unitHeadingInfo(heading) !== null ||
      standaloneNumber(line) !== null ||
      inlineNumberedEnglish(line) !== null ||
      Boolean(labeledValue(line, "原句|原文|英文原句|英文"))
    );
  }

  function hasUnitMarker(lines) {
    return lines.some(isUnitMarkerLine);
  }

  function splitTopLevelBlocks(lines) {
    const blocks = [];
    let current = { title: "", lines: [] };

    lines.forEach((line) => {
      const heading = parseHeading(line);
      if (heading?.level === 2) {
        blocks.push(current);
        current = { title: heading.title, lines: [] };
      } else {
        current.lines.push(line);
      }
    });
    blocks.push(current);
    return blocks;
  }

  function linesToPlainText(lines) {
    const paragraphs = [];
    let current = [];

    function flush() {
      if (!current.length) return;
      paragraphs.push(current.join(" ").replace(/\s+/g, " ").trim());
      current = [];
    }

    lines.forEach((line) => {
      const clean = stripInlineMarkdown(line);
      if (!clean) {
        flush();
      } else {
        current.push(clean);
      }
    });
    flush();
    return paragraphs.filter(Boolean).join("\n\n");
  }

  function deepDiveMarker(line) {
    const heading = parseHeading(line);
    if (heading && isDeepDiveTitle(heading.title)) {
      return {
        title: heading.title,
        trailing: "",
      };
    }

    const source = String(line || "");
    const bold = source.match(/(\*\*|__)(.*?A\s*层\s*深挖.*?)\1/i);
    if (!bold || !isDeepDiveTitle(bold[2])) return null;
    return {
      title: stripInlineMarkdown(bold[2]),
      trailing: source
        .slice((bold.index || 0) + bold[0].length)
        .replace(/^[\s。，、；;：:—–-]+/, "")
        .trim(),
    };
  }

  function extractDeepDiveEntries(lines) {
    const entries = [];
    for (let index = 0; index < lines.length; index += 1) {
      const marker = deepDiveMarker(lines[index]);
      if (!marker) continue;

      const contentLines = marker.trailing ? [marker.trailing] : [];
      let cursor = index + 1;
      for (; cursor < lines.length; cursor += 1) {
        if (deepDiveMarker(lines[cursor])) break;
        const heading = parseHeading(lines[cursor]);
        if (heading) break;
        contentLines.push(lines[cursor]);
      }
      entries.push({
        title: marker.title,
        content: linesToPlainText(contentLines),
      });
      index = cursor - 1;
    }
    return entries;
  }

  function deepDiveSentenceNumber(title) {
    const match = stripInlineMarkdown(title).match(/句\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  }

  function deepDiveExpression(title) {
    return stripInlineMarkdown(title)
      .replace(
        /^A\s*层\s*深挖(?:表达)?\s*(?:\d+(?:\s*\/\s*\d+)?)?\s*[：:｜|—–-]?\s*/i,
        ""
      )
      .replace(/^句\s*\d+\s*[：:｜|—–-]?\s*/i, "")
      .replace(/\s*[（(][A-C]\d[^）)]*[）)]\s*$/i, "")
      .replace(/[。；;：:]+\s*$/, "")
      .trim();
  }

  function searchableWords(value) {
    const stopWords = new Set([
      "a",
      "an",
      "and",
      "at",
      "be",
      "been",
      "being",
      "in",
      "of",
      "on",
      "one",
      "someone",
      "something",
      "the",
      "to",
      "with",
    ]);
    const matches = String(value || "")
      .toLowerCase()
      .replace(/[’]/g, "'")
      .match(/[a-z]+(?:'[a-z]+)?/g);
    return matches ? matches.filter((word) => !stopWords.has(word)) : [];
  }

  function searchWordsMatch(left, right) {
    if (left === right) return true;
    if (
      (left === "hold" && right === "held") ||
      (left === "held" && right === "hold")
    ) {
      return true;
    }
    if (Math.min(left.length, right.length) < 4) return false;
    return left.startsWith(right) || right.startsWith(left);
  }

  function findDeepDiveUnit(entry, units) {
    if (!units.length) return null;
    const sentenceNumber = deepDiveSentenceNumber(entry.title);
    if (sentenceNumber !== null) {
      const numberedUnit = units.find((unit) => unit.number === sentenceNumber);
      if (numberedUnit) return numberedUnit;
    }

    const expressionWords = searchableWords(deepDiveExpression(entry.title));
    if (expressionWords.length) {
      let bestUnit = null;
      let bestScore = 0;
      units.forEach((unit) => {
        const englishWords = searchableWords(unit.english);
        const score = expressionWords.reduce(
          (count, word) =>
            count +
            (englishWords.some((englishWord) => searchWordsMatch(word, englishWord)) ? 1 : 0),
          0
        );
        if (score > bestScore) {
          bestScore = score;
          bestUnit = unit;
        }
      });
      if (bestUnit && bestScore >= Math.min(2, expressionWords.length)) return bestUnit;
    }

    // Title-level explanations precede the first numbered sentence in several
    // completed lessons. Keeping them on the first usable unit makes the
    // explanation visible without inventing a synthetic source sentence.
    return units[0];
  }

  function blockPlainText(block, includeTitle) {
    const lines = includeTitle && block.title ? [`### ${block.title}`, ...block.lines] : block.lines;
    return linesToPlainText(lines);
  }

  function parseReadingBlock(block, context) {
    const section = {
      id: makeId(context.prefix, "section", ++context.sectionCount),
      title: block.title,
      paragraphs: [],
      units: [],
    };
    let currentParagraph = null;
    let currentUnit = null;
    let currentDive = null;

    function ensureParagraph(title) {
      if (currentParagraph && (!title || currentParagraph.title === title)) return currentParagraph;
      currentParagraph = {
        id: makeId(context.prefix, "paragraph", ++context.paragraphCount),
        title: title || "",
        sectionId: section.id,
        units: [],
      };
      section.paragraphs.push(currentParagraph);
      context.paragraphs.push(currentParagraph);
      return currentParagraph;
    }

    function finishDive() {
      if (!currentDive) return;
      currentDive.content = linesToPlainText(currentDive._lines);
      delete currentDive._lines;
      if (currentUnit?.english) {
        context.deepDives.push(currentDive);
      }
      currentDive = null;
    }

    function finishUnit() {
      finishDive();
      if (!currentUnit) return;
      if (currentUnit.english) {
        currentUnit.explanation = linesToPlainText(currentUnit._explanationLines);
        delete currentUnit._explanationLines;
        section.units.push(currentUnit);
        currentUnit._paragraph.units.push(currentUnit);
        delete currentUnit._paragraph;
        context.units.push(currentUnit);
      }
      currentUnit = null;
    }

    function startUnit(number, english) {
      finishUnit();
      const paragraph = ensureParagraph("");
      currentUnit = {
        id: makeId(context.prefix, "unit", ++context.unitCount),
        number: number ?? context.unitCount,
        sectionId: section.id,
        paragraphId: paragraph.id,
        english: english || "",
        chinese: "",
        explanation: "",
        _explanationLines: [],
        _paragraph: paragraph,
      };
    }

    function startDive(title) {
      finishDive();
      if (!currentUnit) return;
      currentDive = {
        id: makeId(context.prefix, "deep-dive", ++context.deepDiveCount),
        title,
        unitId: currentUnit.id,
        content: "",
        _lines: [],
      };
    }

    const blockUnit = unitHeadingInfo({ level: 2, title: block.title });
    if (blockUnit) startUnit(blockUnit.number, blockUnit.english);

    block.lines.forEach((line) => {
      const heading = parseHeading(line);
      const headingUnit = unitHeadingInfo(heading);
      const plainLineNumber = heading ? null : standaloneNumber(line);
      const numberedEnglish = heading ? null : inlineNumberedEnglish(line);
      const clean = stripInlineMarkdown(line);
      const original = heading ? "" : labeledValue(line, "原句|原文|英文原句|英文");
      const translation = heading ? "" : labeledValue(line, "译文|翻译|中文译文");

      if (headingUnit) {
        startUnit(headingUnit.number, headingUnit.english);
        return;
      }

      if (plainLineNumber !== null) {
        startUnit(plainLineNumber, "");
        return;
      }

      if (numberedEnglish) {
        startUnit(numberedEnglish.number, numberedEnglish.english);
        return;
      }

      if (heading && isDeepDiveTitle(heading.title)) {
        startDive(heading.title);
        return;
      }

      if (!heading && isDeepDiveTitle(clean) && /^\s*(?:>\s*)?(?:\*\*|__)/.test(line)) {
        startDive(clean);
        return;
      }

      if (heading && heading.level >= 3) {
        if (
          looksEnglish(heading.title) &&
          !isStructuralHeadingTitle(heading.title) &&
          currentParagraph &&
          /(?:标题|开场)/.test(currentParagraph.title)
        ) {
          startUnit(null, heading.title);
          return;
        }
        finishUnit();
        ensureParagraph(heading.title);
        return;
      }

      if (!clean) {
        if (currentDive) currentDive._lines.push("");
        else if (currentUnit?.english) currentUnit._explanationLines.push("");
        return;
      }

      if (original) {
        if (!currentUnit || currentUnit.english) startUnit(null, "");
        currentUnit.english = original;
        return;
      }

      if (translation && currentUnit) {
        currentUnit.chinese = translation;
        return;
      }

      if (currentDive) {
        currentDive._lines.push(line);
        return;
      }

      if (
        !currentUnit &&
        currentParagraph &&
        /(?:标题|开场)/.test(currentParagraph.title) &&
        looksEnglish(clean) &&
        /^\s*(?:>\s*)?(?:\*\*|__)/.test(line)
      ) {
        startUnit(null, clean);
        return;
      }

      if (!currentUnit) return;

      if (!currentUnit.english) {
        if (looksEnglish(clean)) {
          currentUnit.english = clean;
        }
        return;
      }

      if (!currentUnit.chinese && looksChinese(clean) && !looksLikeExplanation(clean)) {
        currentUnit.chinese = clean;
        return;
      }

      currentUnit._explanationLines.push(line);
    });

    finishUnit();
    section.paragraphs = section.paragraphs.filter((paragraph) => paragraph.units.length);
    for (let index = context.paragraphs.length - 1; index >= 0; index -= 1) {
      if (!context.paragraphs[index].units.length) context.paragraphs.splice(index, 1);
    }
    return section;
  }

  function parseIntensiveReadingMarkdown(markdown, options) {
    const model = emptyModel();
    const normalized = normalizeMarkdown(markdown);
    if (!normalized) return model;

    const safeOptions = options && typeof options === "object" ? options : {};
    const lines = normalized.split("\n");
    const titleIndex = lines.findIndex((line) => {
      const heading = parseHeading(line);
      return heading?.level === 1;
    });
    if (titleIndex >= 0) {
      model.title = parseHeading(lines[titleIndex]).title;
      lines[titleIndex] = "";
    } else {
      model.title = stripInlineMarkdown(safeOptions.title || "");
    }

    const context = {
      prefix: sanitizeIdPart(safeOptions.idPrefix),
      sectionCount: 0,
      paragraphCount: 0,
      unitCount: 0,
      deepDiveCount: 0,
      paragraphs: model.paragraphs,
      units: model.units,
      deepDives: model.deepDives,
    };
    const questionBlocks = [];
    const leadParts = [];
    let sawReading = false;

    splitTopLevelBlocks(lines).forEach((block) => {
      if (isDeepDiveTitle(block.title)) {
        const unit = model.units[model.units.length - 1];
        const nextUnitIndex = block.lines.findIndex(isUnitMarkerLine);
        const deepDiveLines =
          nextUnitIndex >= 0 ? block.lines.slice(0, nextUnitIndex) : block.lines;
        if (unit) {
          model.deepDives.push({
            id: makeId(context.prefix, "deep-dive", ++context.deepDiveCount),
            title: block.title,
            unitId: unit.id,
            content: linesToPlainText(deepDiveLines),
          });
        }
        if (nextUnitIndex >= 0) {
          const section = parseReadingBlock(
            { title: "", lines: block.lines.slice(nextUnitIndex) },
            context
          );
          if (section.units.length || section.paragraphs.length) {
            model.sections.push(section);
            sawReading = true;
          }
        }
        return;
      }

      if (isQuestionTitle(block.title)) {
        questionBlocks.push({
          title: block.title,
          content: blockPlainText(block, false),
        });
        return;
      }

      if (isTakeawayTitle(block.title)) {
        model.takeaways.push({
          id: makeId(context.prefix, "takeaway", model.takeaways.length + 1),
          title: block.title,
          content: blockPlainText(block, false),
        });
        return;
      }

      const readingBlock =
        Boolean(unitHeadingInfo({ level: 2, title: block.title })) ||
        isReadingTitle(block.title) ||
        hasUnitMarker(block.lines);
      if (readingBlock) {
        const section = parseReadingBlock(block, context);
        if (section.units.length || section.paragraphs.length) {
          model.sections.push(section);
          sawReading = true;
        }
        return;
      }

      const plain = blockPlainText(block, Boolean(block.title));
      if (!plain) return;
      if (!sawReading) {
        leadParts.push(plain);
      } else {
        model.takeaways.push({
          id: makeId(context.prefix, "takeaway", model.takeaways.length + 1),
          title: block.title,
          content: blockPlainText(block, false),
        });
      }
    });

    model.lead = leadParts.join("\n\n");
    if (questionBlocks.length) {
      model.questionSection = {
        title: questionBlocks[0].title,
        content: questionBlocks
          .map((section) => section.content)
          .filter(Boolean)
          .join("\n\n"),
        sections: questionBlocks,
      };
    }

    const extractedDeepDives = extractDeepDiveEntries(lines);
    if (extractedDeepDives.length) {
      model.deepDives = extractedDeepDives
        .map((entry, index) => {
          const unit = findDeepDiveUnit(entry, model.units);
          if (!unit) return null;
          return {
            id: makeId(context.prefix, "deep-dive", index + 1),
            title: entry.title,
            unitId: unit.id,
            content: entry.content,
          };
        })
        .filter(Boolean);
    }
    return model;
  }

  function extractIntensiveReadingSummary(value, options) {
    const model =
      typeof value === "string"
        ? parseIntensiveReadingMarkdown(value, options)
        : value && typeof value === "object"
          ? value
          : emptyModel();
    return {
      title: String(model.title || ""),
      unitCount: Array.isArray(model.units) ? model.units.length : 0,
      paragraphCount: Array.isArray(model.paragraphs) ? model.paragraphs.length : 0,
      deepDiveCount: Array.isArray(model.deepDives) ? model.deepDives.length : 0,
      hasQuestions: Boolean(model.questionSection),
      takeawayCount: Array.isArray(model.takeaways) ? model.takeaways.length : 0,
    };
  }

  return {
    extractIntensiveReadingSummary,
    parseIntensiveReadingMarkdown,
  };
});
