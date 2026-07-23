const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const groupDir = path.join(repoRoot, "data", "generated", "intensive-reading", "cambridge-04-06");
const manifestPath = path.join(groupDir, "manifest.json");

const specs = [
  {
    file: "Cambridge-IELTS-04-Test-1-Passage-1-双语精读.md",
    title: "Adults and children are frequently confronted with statements about the alarming rate of loss of tropical rainforests",
    questionRange: "1-14",
    titleCn: "雨林危机与儿童理解",
    paragraphCount: 10,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 009：文章页", "images/cambridge-ielts-04-test-1-passage-1-page-009.png"],
      ["渲染页 010：文章页", "images/cambridge-ielts-04-test-1-passage-1-page-010.png"],
      ["渲染页 011：文章页与题目页", "images/cambridge-ielts-04-test-1-passage-1-page-011.png"],
      ["渲染页 012：题目页", "images/cambridge-ielts-04-test-1-passage-1-page-012.png"],
      ["渲染页 013：题目页", "images/cambridge-ielts-04-test-1-passage-1-page-013.png"],
      ["渲染页 014：题目页与下一篇起始页", "images/cambridge-ielts-04-test-1-passage-1-page-014.png"]
    ],
    answers: {
      1: "FALSE",
      2: "FALSE",
      3: "TRUE",
      4: "FALSE",
      5: "FALSE",
      6: "NOT GIVEN",
      7: "TRUE",
      8: "NOT GIVEN",
      9: "M",
      10: "E",
      11: "G",
      12: "P",
      13: "J",
      14: "B"
    }
  },
  {
    file: "Cambridge-IELTS-04-Test-1-Passage-2-双语精读.md",
    title: "What Do Whales Feel?",
    questionRange: "15-26",
    titleCn: "鲸类如何感知世界",
    paragraphCount: 6,
    questionSectionCount: 2,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["Cambridge IELTS 04 Test 1 Passage 2 Page 14", "images/cambridge-ielts-04-test-1-passage-2-page-014.png"],
      ["Cambridge IELTS 04 Test 1 Passage 2 Page 15", "images/cambridge-ielts-04-test-1-passage-2-page-015.png"],
      ["Cambridge IELTS 04 Test 1 Passage 2 Page 16", "images/cambridge-ielts-04-test-1-passage-2-page-016.png"],
      ["Cambridge IELTS 04 Test 1 Passage 2 Page 17", "images/cambridge-ielts-04-test-1-passage-2-page-017.png"],
      ["Cambridge IELTS 04 Test 1 Passage 2 Page 18", "images/cambridge-ielts-04-test-1-passage-2-page-018.png"],
      ["Cambridge IELTS 04 Test 1 Passage 2 Page 19", "images/cambridge-ielts-04-test-1-passage-2-page-019.png"]
    ],
    answers: {
      15: "taste buds",
      16: "baleen species",
      17: "forward and downward",
      18: "freshwater dolphins",
      19: "water",
      20: "lower frequencies",
      21: "bowhead and humpback",
      22: "touch",
      23: "freshwater dolphins",
      24: "airborne flying fish",
      25: "clear open waters",
      26: "acoustic sense"
    }
  },
  {
    file: "Cambridge-IELTS-04-Test-1-Passage-3-双语精读.md",
    title: "Visual Symbols and the Blind",
    questionRange: "27-40",
    titleCn: "盲人与视觉符号",
    paragraphCount: 8,
    questionSectionCount: 4,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["Cambridge IELTS 04 Test 1 Passage 3 Page 20", "images/cambridge-ielts-04-test-1-passage-3-page-020.png"],
      ["Cambridge IELTS 04 Test 1 Passage 3 Page 21", "images/cambridge-ielts-04-test-1-passage-3-page-021.png"],
      ["Cambridge IELTS 04 Test 1 Passage 3 Page 22", "images/cambridge-ielts-04-test-1-passage-3-page-022.png"],
      ["Cambridge IELTS 04 Test 1 Passage 3 Page 23", "images/cambridge-ielts-04-test-1-passage-3-page-023.png"],
      ["Cambridge IELTS 04 Test 1 Passage 3 Page 24", "images/cambridge-ielts-04-test-1-passage-3-page-024.png"],
      ["Cambridge IELTS 04 Test 1 Passage 3 Page 25", "images/cambridge-ielts-04-test-1-passage-3-page-025.png"],
      ["Cambridge IELTS 04 Test 1 Passage 3 Page 26", "images/cambridge-ielts-04-test-1-passage-3-page-026.png"],
      ["Cambridge IELTS 04 Test 1 Passage 3 Page 27", "images/cambridge-ielts-04-test-1-passage-3-page-027.png"]
    ],
    answers: {
      27: "C",
      28: "C",
      29: "A",
      30: "E",
      31: "C",
      32: "A",
      33: "pairs",
      34: "shapes",
      35: "sighted",
      36: "sighted",
      37: "deep",
      38: "blind",
      39: "similar",
      40: "B"
    }
  },
  {
    file: "Cambridge-IELTS-04-Test-2-Passage-1-双语精读.md",
    title: "Lost for Words",
    questionRange: "1-13",
    titleCn: "语言正在失声",
    paragraphCount: 9,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["Cambridge IELTS 04 Test 2 Passage 1 Page 43", "images/cambridge-ielts-04-test-2-passage-1-page-043.png"],
      ["Cambridge IELTS 04 Test 2 Passage 1 Page 44", "images/cambridge-ielts-04-test-2-passage-1-page-044.png"],
      ["Cambridge IELTS 04 Test 2 Passage 1 Page 45", "images/cambridge-ielts-04-test-2-passage-1-page-045.png"],
      ["Cambridge IELTS 04 Test 2 Passage 1 Page 46", "images/cambridge-ielts-04-test-2-passage-1-page-046.png"],
      ["Cambridge IELTS 04 Test 2 Passage 1 Page 47", "images/cambridge-ielts-04-test-2-passage-1-page-047.png"],
      ["Cambridge IELTS 04 Test 2 Passage 1 Page 48", "images/cambridge-ielts-04-test-2-passage-1-page-048.png"]
    ],
    answers: {
      1: "isolation",
      2: "economic globalization",
      3: "cultural identity",
      4: "traditional skill",
      5: "E",
      6: "B",
      7: "D",
      8: "C",
      9: "B",
      10: "NO",
      11: "YES",
      12: "NOT GIVEN",
      13: "YES"
    }
  },
  {
    file: "Cambridge-IELTS-04-Test-2-Passage-2-双语精读.md",
    title: "Alternative Medicine in Australia",
    questionRange: "14-26",
    titleCn: "澳大利亚的替代医学",
    paragraphCount: 10,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["Cambridge IELTS 04 Test 2 Passage 2 Page 48", "images/cambridge-ielts-04-test-2-passage-2-page-048.png"],
      ["Cambridge IELTS 04 Test 2 Passage 2 Page 49", "images/cambridge-ielts-04-test-2-passage-2-page-049.png"],
      ["Cambridge IELTS 04 Test 2 Passage 2 Page 50", "images/cambridge-ielts-04-test-2-passage-2-page-050.png"],
      ["Cambridge IELTS 04 Test 2 Passage 2 Page 51", "images/cambridge-ielts-04-test-2-passage-2-page-051.png"],
      ["Cambridge IELTS 04 Test 2 Passage 2 Page 52", "images/cambridge-ielts-04-test-2-passage-2-page-052.png"],
      ["Cambridge IELTS 04 Test 2 Passage 2 Page 53", "images/cambridge-ielts-04-test-2-passage-2-page-053.png"]
    ],
    answers: {
      14: "C",
      15: "B",
      16: "YES",
      17: "NO",
      18: "YES",
      19: "YES",
      20: "YES",
      21: "NOT GIVEN",
      22: "NO",
      23: "YES",
      24: "emotional problems",
      25: "Headache",
      26: "general ill health"
    }
  },
  {
    file: "Cambridge-IELTS-04-Test-2-Passage-3-双语精读.md",
    title: "Play is a Serious Business",
    questionRange: "27-40",
    titleCn: "玩耍与大脑发育",
    paragraphCount: 9,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["Cambridge IELTS 04 Test 2 Passage 3 Page 54", "images/cambridge-ielts-04-test-2-passage-3-page-054.png"],
      ["Cambridge IELTS 04 Test 2 Passage 3 Page 55", "images/cambridge-ielts-04-test-2-passage-3-page-055.png"],
      ["Cambridge IELTS 04 Test 2 Passage 3 Page 56", "images/cambridge-ielts-04-test-2-passage-3-page-056.png"],
      ["Cambridge IELTS 04 Test 2 Passage 3 Page 57", "images/cambridge-ielts-04-test-2-passage-3-page-057.png"],
      ["Cambridge IELTS 04 Test 2 Passage 3 Page 58", "images/cambridge-ielts-04-test-2-passage-3-page-058.png"],
      ["Cambridge IELTS 04 Test 2 Passage 3 Page 59", "images/cambridge-ielts-04-test-2-passage-3-page-059.png"]
    ],
    answers: {
      27: "H",
      28: "F",
      29: "A",
      30: "H",
      31: "I",
      32: "B",
      33: "A",
      34: "C",
      35: "F",
      36: "B",
      37: "G",
      38: "E",
      39: "D",
      40: "A"
    }
  },
  {
    file: "Cambridge-IELTS-04-Test-3-Passage-1-双语精读.md",
    title: "Micro-Enterprise Credit for Street Youth",
    questionRange: "1-13",
    titleCn: "街头儿童微型创业贷款",
    paragraphCount: 12,
    questionSectionCount: 4,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["Cambridge IELTS 04 Test 3 Passage 1 Page 74", "images/cambridge-ielts-04-test-3-passage-1-page-074.png"],
      ["Cambridge IELTS 04 Test 3 Passage 1 Page 75", "images/cambridge-ielts-04-test-3-passage-1-page-075.png"],
      ["Cambridge IELTS 04 Test 3 Passage 1 Page 76", "images/cambridge-ielts-04-test-3-passage-1-page-076.png"],
      ["Cambridge IELTS 04 Test 3 Passage 1 Page 77", "images/cambridge-ielts-04-test-3-passage-1-page-077.png"],
      ["Cambridge IELTS 04 Test 3 Passage 1 Page 78", "images/cambridge-ielts-04-test-3-passage-1-page-078.png"],
      ["Cambridge IELTS 04 Test 3 Passage 1 Page 79", "images/cambridge-ielts-04-test-3-passage-1-page-079.png"],
      ["Cambridge IELTS 04 Test 3 Passage 1 Page 80", "images/cambridge-ielts-04-test-3-passage-1-page-080.png"],
      ["Cambridge IELTS 04 Test 3 Passage 1 Page 81", "images/cambridge-ielts-04-test-3-passage-1-page-081.png"]
    ],
    answers: {
      1: "A",
      2: "D",
      3: "C",
      4: "C",
      5: "Sudan and India",
      6: "bicycles",
      7: "Shoe Shine Collective",
      8: "life skills",
      9: "NO",
      10: "NOT GIVEN",
      11: "NO",
      12: "YES",
      13: "A"
    }
  },
  {
    file: "Cambridge-IELTS-04-Test-3-Passage-3-双语精读.md",
    title: "Obtaining Linguistic Data",
    questionRange: "27-40",
    titleCn: "语言学数据如何获得",
    paragraphCount: 7,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["文章页 88", "images/cambridge-ielts-04-test-3-passage-3-page-088.png"],
      ["文章页 89", "images/cambridge-ielts-04-test-3-passage-3-page-089.png"],
      ["文章页 90", "images/cambridge-ielts-04-test-3-passage-3-page-090.png"],
      ["文章与题目页 91", "images/cambridge-ielts-04-test-3-passage-3-page-091.png"],
      ["表格题页 92", "images/cambridge-ielts-04-test-3-passage-3-page-092.png"],
      ["摘要题页 93", "images/cambridge-ielts-04-test-3-passage-3-page-093.png"]
    ],
    answers: {
      27: "D",
      28: "E",
      29: "C",
      30: "D",
      31: "F",
      32: "linguist",
      33: "foreign languages",
      34: "poor quality",
      35: "non-verbal behavior",
      36: "camera",
      37: "frequency of usage",
      38: "particular linguistic feature",
      39: "size",
      40: "intuitions"
    }
  },
  {
    file: "Cambridge-IELTS-04-Test-4-Passage-1-双语精读.md",
    title: "How Much Higher? How Much Faster?",
    questionRange: "1-13",
    titleCn: "人类运动极限仍未到来",
    paragraphCount: 7,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["文章页 107", "images/cambridge-ielts-04-test-4-passage-1-page-107.png"],
      ["文章页 108", "images/cambridge-ielts-04-test-4-passage-1-page-108.png"],
      ["文章页 109", "images/cambridge-ielts-04-test-4-passage-1-page-109.png"],
      ["文章与题目页 110", "images/cambridge-ielts-04-test-4-passage-1-page-110.png"],
      ["题目页 111", "images/cambridge-ielts-04-test-4-passage-1-page-111.png"],
      ["题目页 112", "images/cambridge-ielts-04-test-4-passage-1-page-112.png"]
    ],
    answers: {
      1: "TRUE",
      2: "NOT GIVEN",
      3: "FALSE",
      4: "FALSE",
      5: "NOT GIVEN",
      6: "TRUE",
      7: "genetics",
      8: "power",
      9: "injuries",
      10: "training",
      11: "A",
      12: "D",
      13: "B"
    }
  },
  {
    file: "Cambridge-IELTS-04-Test-4-Passage-2-双语精读.md",
    title: "The Nature and Aims of Archaeology",
    questionRange: "14-27",
    titleCn: "考古学的性质与目标",
    paragraphCount: 9,
    questionSectionCount: 4,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["文章页 113", "images/cambridge-ielts-04-test-4-passage-2-page-113.png"],
      ["文章页 114", "images/cambridge-ielts-04-test-4-passage-2-page-114.png"],
      ["文章页 115", "images/cambridge-ielts-04-test-4-passage-2-page-115.png"],
      ["文章与题目页 116", "images/cambridge-ielts-04-test-4-passage-2-page-116.png"],
      ["题目页 117", "images/cambridge-ielts-04-test-4-passage-2-page-117.png"],
      ["题目页 118", "images/cambridge-ielts-04-test-4-passage-2-page-118.png"]
    ],
    answers: {
      14: "YES",
      15: "NOT GIVEN",
      16: "NO",
      17: "YES",
      18: "NOT GIVEN",
      19: "NO",
      20: "D",
      21: "E",
      22: "C",
      23: "D",
      24: "oral histories",
      25: "humanistic study",
      26: "historical discipline",
      27: "scientist"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-1-Passage-1-双语精读.md",
    title: "Johnson's Dictionary",
    questionRange: "1-13",
    titleCn: "约翰逊词典与英语标准化",
    paragraphCount: 12,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 017：文章页", "images/cambridge-ielts-05-test-1-passage-1-page-017.png"],
      ["渲染页 018：文章页", "images/cambridge-ielts-05-test-1-passage-1-page-018.png"],
      ["渲染页 019：题目页", "images/cambridge-ielts-05-test-1-passage-1-page-019.png"],
      ["渲染页 020：题目页", "images/cambridge-ielts-05-test-1-passage-1-page-020.png"],
      ["渲染页 021：下一篇起始页", "images/cambridge-ielts-05-test-1-passage-1-page-021.png"]
    ],
    answers: {
      1: "D",
      2: "E",
      3: "G",
      4: "clerks / copying clerks",
      5: "library",
      6: "stability",
      7: "pension",
      8: "TRUE",
      9: "FALSE",
      10: "NOT GIVEN",
      11: "FALSE",
      12: "FALSE",
      13: "TRUE"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-1-Passage-2-双语精读.md",
    title: "Nature or Nurture?",
    questionRange: "14-26",
    titleCn: "服从、权威与人性解释",
    paragraphCount: 9,
    materialExtension: "web_enriched",
    webSource: "https://en.wikipedia.org/wiki/Milgram_experiment",
    recovered: true,
    recoveredPath: "data\\generated\\intensive-reading\\cambridge-04-06\\recovered-sources\\Cambridge-IELTS-05-Test-1-Passage-2-recovered-source.md",
    images: [
      ["渲染页 021：文章页", "images/cambridge-ielts-05-test-1-passage-2-page-021.png"],
      ["渲染页 022：文章页", "images/cambridge-ielts-05-test-1-passage-2-page-022.png"],
      ["渲染页 023：题目页", "images/cambridge-ielts-05-test-1-passage-2-page-023.png"],
      ["渲染页 024：题目页", "images/cambridge-ielts-05-test-1-passage-2-page-024.png"]
    ],
    answers: {
      14: "F",
      15: "A",
      16: "B",
      17: "D",
      18: "I",
      19: "C",
      20: "B",
      21: "D",
      22: "C",
      23: "NOT GIVEN",
      24: "TRUE",
      25: "FALSE",
      26: "FALSE"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-1-Passage-3-双语精读.md",
    title: "The Truth about the Environment",
    questionRange: "27-40",
    titleCn: "环境悲观论的反转",
    paragraphCount: 14,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 025：文章页", "images/cambridge-ielts-05-test-1-passage-3-page-025.png"],
      ["渲染页 026：文章页", "images/cambridge-ielts-05-test-1-passage-3-page-026.png"],
      ["渲染页 027：题目页", "images/cambridge-ielts-05-test-1-passage-3-page-027.png"],
      ["渲染页 028：题目页", "images/cambridge-ielts-05-test-1-passage-3-page-028.png"],
      ["渲染页 029：题目页", "images/cambridge-ielts-05-test-1-passage-3-page-029.png"]
    ],
    answers: {
      27: "YES",
      28: "NOT GIVEN",
      29: "NO",
      30: "NOT GIVEN",
      31: "YES",
      32: "NO",
      33: "C",
      34: "D",
      35: "C",
      36: "B",
      37: "B",
      38: "E",
      39: "D",
      40: "I"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-2-Passage-1-双语精读.md",
    title: "BAKELITE: The birth of modern plastics",
    questionRange: "1-13",
    titleCn: "Bakelite 与现代塑料的诞生",
    paragraphCount: 9,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 039：文章页", "images/cambridge-ielts-05-test-2-passage-1-page-039.png"],
      ["渲染页 040：文章页", "images/cambridge-ielts-05-test-2-passage-1-page-040.png"],
      ["渲染页 041：题目页", "images/cambridge-ielts-05-test-2-passage-1-page-041.png"],
      ["渲染页 042：题目页", "images/cambridge-ielts-05-test-2-passage-1-page-042.png"],
      ["渲染页 043：题目页", "images/cambridge-ielts-05-test-2-passage-1-page-043.png"]
    ],
    answers: {
      1: "candlewax",
      2: "synthetic",
      3: "chemistry",
      4: "Novalak",
      5: "fillers",
      6: "hexa",
      7: "raw",
      8: "pressure",
      9: "B",
      10: "C",
      11: "TRUE",
      12: "FALSE",
      13: "FALSE"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-2-Passage-2-双语精读.md",
    title: "What's so funny?",
    questionRange: "14-27",
    titleCn: "幽默、笑声与大脑机制",
    paragraphCount: 16,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 044：文章页", "images/cambridge-ielts-05-test-2-passage-2-page-044.png"],
      ["渲染页 045：文章页", "images/cambridge-ielts-05-test-2-passage-2-page-045.png"],
      ["渲染页 046：题目页", "images/cambridge-ielts-05-test-2-passage-2-page-046.png"],
      ["渲染页 047：题目页与脑区图", "images/cambridge-ielts-05-test-2-passage-2-page-047.png"],
      ["渲染页 048：题目页", "images/cambridge-ielts-05-test-2-passage-2-page-048.png"]
    ],
    answers: {
      14: "FALSE",
      15: "NOT GIVEN",
      16: "TRUE",
      17: "FALSE",
      18: "TRUE",
      19: "NOT GIVEN",
      20: "TRUE",
      21: "problem solving",
      22: "temporal lobes",
      23: "evaluating information",
      24: "C",
      25: "A",
      26: "F",
      27: "D"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-2-Passage-3-双语精读.md",
    title: "The Birth of Scientific English",
    questionRange: "28-40",
    titleCn: "科学英语的诞生",
    paragraphCount: 10,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: true,
    recoveredPath: "data\\generated\\intensive-reading\\cambridge-04-06\\recovered-sources\\Cambridge-IELTS-05-Test-2-Passage-3-recovered-source.md",
    images: [
      ["渲染页 049：文章页", "images/cambridge-ielts-05-test-2-passage-3-page-049.png"],
      ["渲染页 050：文章页", "images/cambridge-ielts-05-test-2-passage-3-page-050.png"],
      ["渲染页 051：题目页", "images/cambridge-ielts-05-test-2-passage-3-page-051.png"],
      ["渲染页 052：题目页", "images/cambridge-ielts-05-test-2-passage-3-page-052.png"]
    ],
    answers: {
      28: "Latin",
      29: "doctors",
      30: "technical vocabulary",
      31: "grammatical resources",
      32: "Royal Society",
      33: "German",
      34: "industrial revolution",
      35: "NOT GIVEN",
      36: "FALSE",
      37: "TRUE",
      38: "popular",
      39: "Principia / mathematical treatise",
      40: "local audience"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-3-Passage-1-双语精读.md",
    title: "Early Childhood Education",
    questionRange: "1-13",
    titleCn: "早期儿童教育与家长参与",
    paragraphCount: 18,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 063：文章页", "images/cambridge-ielts-05-test-3-passage-1-page-063.png"],
      ["渲染页 064：文章页", "images/cambridge-ielts-05-test-3-passage-1-page-064.png"],
      ["渲染页 065：题目页", "images/cambridge-ielts-05-test-3-passage-1-page-065.png"],
      ["渲染页 066：题目页", "images/cambridge-ielts-05-test-3-passage-1-page-066.png"]
    ],
    answers: {
      1: "D",
      2: "B",
      3: "C",
      4: "E",
      5: "B",
      6: "D",
      7: "A",
      8: "B",
      9: "D",
      10: "C",
      11: "TRUE",
      12: "FALSE",
      13: "NOT GIVEN"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-3-Passage-2-双语精读.md",
    title: "Disappearing Delta",
    questionRange: "14-26",
    titleCn: "正在消失的尼罗河三角洲",
    paragraphCount: 6,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: true,
    recoveredPath: "data\\generated\\intensive-reading\\cambridge-04-06\\recovered-sources\\Cambridge-IELTS-05-Test-3-Passage-2-recovered-source.md",
    images: [
      ["渲染页 067：题目页", "images/cambridge-ielts-05-test-3-passage-2-page-067.png"],
      ["渲染页 068：文章页", "images/cambridge-ielts-05-test-3-passage-2-page-068.png"],
      ["渲染页 069：文章页与地图", "images/cambridge-ielts-05-test-3-passage-2-page-069.png"],
      ["渲染页 070：题目页", "images/cambridge-ielts-05-test-3-passage-2-page-070.png"],
      ["渲染页 071：题目页", "images/cambridge-ielts-05-test-3-passage-2-page-071.png"]
    ],
    answers: {
      14: "iv",
      15: "i",
      16: "v",
      17: "viii",
      18: "YES",
      19: "NOT GIVEN",
      20: "NO",
      21: "YES",
      22: "NOT GIVEN",
      23: "YES",
      24: "F",
      25: "A",
      26: "B"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-3-Passage-3-双语精读.md",
    title: "The Return of Artificial Intelligence",
    questionRange: "27-40",
    titleCn: "人工智能的回归",
    paragraphCount: 7,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 072：文章页", "images/cambridge-ielts-05-test-3-passage-3-page-072.png"],
      ["渲染页 073：文章页", "images/cambridge-ielts-05-test-3-passage-3-page-073.png"],
      ["渲染页 074：题目页", "images/cambridge-ielts-05-test-3-passage-3-page-074.png"],
      ["渲染页 075：题目页", "images/cambridge-ielts-05-test-3-passage-3-page-075.png"]
    ],
    answers: {
      27: "E",
      28: "B",
      29: "A",
      30: "F",
      31: "B",
      32: "NOT GIVEN",
      33: "FALSE",
      34: "NOT GIVEN",
      35: "TRUE",
      36: "FALSE",
      37: "TRUE",
      38: "B",
      39: "A",
      40: "D"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-4-Passage-1-双语精读.md",
    title: "The Impact of Wilderness Tourism",
    questionRange: "1-13",
    titleCn: "荒野旅游的影响",
    paragraphCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: true,
    recoveredPath: "data\\generated\\intensive-reading\\cambridge-04-06\\recovered-sources\\Cambridge-IELTS-05-Test-4-Passage-1-recovered-source.md",
    images: [
      ["渲染页 086：题目页", "images/cambridge-ielts-05-test-4-passage-1-page-086.png"],
      ["渲染页 087：文章页", "images/cambridge-ielts-05-test-4-passage-1-page-087.png"],
      ["渲染页 088：文章页", "images/cambridge-ielts-05-test-4-passage-1-page-088.png"],
      ["渲染页 089：题目页", "images/cambridge-ielts-05-test-4-passage-1-page-089.png"]
    ],
    answers: {
      1: "iii",
      2: "v",
      3: "ii",
      4: "YES",
      5: "YES",
      6: "NO",
      7: "YES",
      8: "NO",
      9: "NOT GIVEN",
      10: "cheese",
      11: "tourism / tourist / tour",
      12: "pottery",
      13: "jewellery / jewelry"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-4-Passage-2-双语精读.md",
    title: "Flawed Beauty: the problem with toughened glass",
    questionRange: "14-26",
    titleCn: "钢化玻璃的隐藏缺陷",
    paragraphCount: 8,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 090：文章页", "images/cambridge-ielts-05-test-4-passage-2-page-090.png"],
      ["渲染页 091：文章页", "images/cambridge-ielts-05-test-4-passage-2-page-091.png"],
      ["渲染页 092：题目页", "images/cambridge-ielts-05-test-4-passage-2-page-092.png"],
      ["渲染页 093：题目页", "images/cambridge-ielts-05-test-4-passage-2-page-093.png"]
    ],
    answers: {
      14: "G",
      15: "A",
      16: "H",
      17: "C",
      18: "F",
      19: "I",
      20: "C",
      21: "K",
      22: "E",
      23: "L",
      24: "TRUE",
      25: "NOT GIVEN",
      26: "FALSE"
    }
  },
  {
    file: "Cambridge-IELTS-05-Test-4-Passage-3-双语精读.md",
    title: "The effects of light on plant and animal species",
    questionRange: "27-40",
    titleCn: "光如何支配动植物节律",
    paragraphCount: 6,
    questionSectionCount: 2,
    materialExtension: "web_enriched",
    webSource: "https://en.wikipedia.org/wiki/Photoperiodism",
    recovered: false,
    images: [
      ["渲染页 095：文章页", "images/cambridge-ielts-05-test-4-passage-3-page-095.png"],
      ["渲染页 096：文章页", "images/cambridge-ielts-05-test-4-passage-3-page-096.png"],
      ["渲染页 097：题目页", "images/cambridge-ielts-05-test-4-passage-3-page-097.png"],
      ["渲染页 098：题目页", "images/cambridge-ielts-05-test-4-passage-3-page-098.png"]
    ],
    answers: {
      27: "TRUE",
      28: "TRUE",
      29: "NOT GIVEN",
      30: "FALSE",
      31: "FALSE",
      32: "TRUE",
      33: "FALSE",
      34: "temperatures",
      35: "day-neutral / day-neutral plants",
      36: "food / food resources / adequate food / adequate food resources",
      37: "insects / fertilization by insects",
      38: "rainfall / suitable rainfall",
      39: "sugarcane",
      40: "classification"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-1-Passage-1-双语精读.md",
    title: "AUSTRALIA'S SPORTING SUCCESS",
    questionRange: "1-13",
    titleCn: "澳大利亚体育成功的科学系统",
    paragraphCount: 7,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 019：文章页", "images/cambridge-ielts-06-test-1-passage-1-page-019.png"],
      ["渲染页 020：文章页", "images/cambridge-ielts-06-test-1-passage-1-page-020.png"],
      ["渲染页 021：题目页", "images/cambridge-ielts-06-test-1-passage-1-page-021.png"],
      ["渲染页 022：题目页", "images/cambridge-ielts-06-test-1-passage-1-page-022.png"]
    ],
    answers: {
      1: "B",
      2: "C",
      3: "B",
      4: "F",
      5: "D",
      6: "A",
      7: "E",
      8: "A",
      9: "B",
      10: "A",
      11: "C",
      12: "(a) competition model",
      13: "(by) 2 per cent/%"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-1-Passage-2-双语精读.md",
    title: "DELIVERING THE GOODS",
    questionRange: "14-26",
    titleCn: "货运革命与国际贸易扩张",
    paragraphCount: 9,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 023：文章页", "images/cambridge-ielts-06-test-1-passage-2-page-023.png"],
      ["渲染页 024：文章页", "images/cambridge-ielts-06-test-1-passage-2-page-024.png"],
      ["渲染页 025：题目页", "images/cambridge-ielts-06-test-1-passage-2-page-025.png"],
      ["渲染页 026：题目页", "images/cambridge-ielts-06-test-1-passage-2-page-026.png"]
    ],
    answers: {
      14: "I",
      15: "F",
      16: "E",
      17: "D",
      18: "TRUE",
      19: "FALSE",
      20: "NOT GIVEN",
      21: "TRUE",
      22: "NOT GIVEN",
      23: "G",
      24: "B",
      25: "C",
      26: "A"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-1-Passage-3-双语精读.md",
    title: "Climate Change and the Inuit",
    questionRange: "27-40",
    titleCn: "气候变化与 Inuit 人",
    paragraphCount: 7,
    questionSectionCount: 2,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: true,
    recoveredPath: "data\\generated\\intensive-reading\\cambridge-04-06\\recovered-sources\\Cambridge-IELTS-06-Test-1-Passage-3-recovered-source.md",
    images: [
      ["渲染页 027：题目页", "images/cambridge-ielts-06-test-1-passage-3-page-027.png"],
      ["渲染页 028：文章页", "images/cambridge-ielts-06-test-1-passage-3-page-028.png"],
      ["渲染页 029：文章页", "images/cambridge-ielts-06-test-1-passage-3-page-029.png"],
      ["渲染页 030：题目页", "images/cambridge-ielts-06-test-1-passage-3-page-030.png"]
    ],
    answers: {
      27: "i",
      28: "vi",
      29: "iii",
      30: "vii",
      31: "iv",
      32: "ii",
      33: "farming",
      34: "sea mammals",
      35: "fish",
      36: "Thule",
      37: "islands",
      38: "nomadic",
      39: "nature",
      40: "Imported"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-2-Passage-1-双语精读.md",
    title: "Advantages of public transport",
    questionRange: "1-13",
    titleCn: "公共交通的优势",
    paragraphCount: 12,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: true,
    recoveredPath: "data\\generated\\intensive-reading\\cambridge-04-06\\recovered-sources\\Cambridge-IELTS-06-Test-2-Passage-1-recovered-source.md",
    images: [
      ["渲染页 041：题目页", "images/cambridge-ielts-06-test-2-passage-1-page-041.png"],
      ["渲染页 042：文章页", "images/cambridge-ielts-06-test-2-passage-1-page-042.png"],
      ["渲染页 043：文章页", "images/cambridge-ielts-06-test-2-passage-1-page-043.png"],
      ["渲染页 044：题目页", "images/cambridge-ielts-06-test-2-passage-1-page-044.png"]
    ],
    answers: {
      1: "ii",
      2: "vii",
      3: "iv",
      4: "i",
      5: "iii",
      6: "FALSE",
      7: "TRUE",
      8: "NOT GIVEN",
      9: "FALSE",
      10: "TRUE",
      11: "F",
      12: "D",
      13: "C"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-2-Passage-2-双语精读.md",
    title: "GREYING POPULATION STAYS IN THE PINK",
    questionRange: "14-26",
    titleCn: "老龄化未必等于衰弱",
    paragraphCount: 12,
    questionSectionCount: 2,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 045：文章页", "images/cambridge-ielts-06-test-2-passage-2-page-045.png"],
      ["渲染页 046：文章页", "images/cambridge-ielts-06-test-2-passage-2-page-046.png"],
      ["渲染页 047：题目页", "images/cambridge-ielts-06-test-2-passage-2-page-047.png"],
      ["渲染页 048：题目页", "images/cambridge-ielts-06-test-2-passage-2-page-048.png"]
    ],
    answers: {
      14: "B",
      15: "I",
      16: "F",
      17: "M",
      18: "J",
      19: "N",
      20: "K",
      21: "G",
      22: "A",
      23: "G",
      24: "E",
      25: "H",
      26: "C"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-2-Passage-3-双语精读.md",
    title: "Numeration",
    questionRange: "27-40",
    titleCn: "计数系统的起源",
    paragraphCount: 7,
    questionSectionCount: 2,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 049：文章页", "images/cambridge-ielts-06-test-2-passage-3-page-049.png"],
      ["渲染页 050：文章页", "images/cambridge-ielts-06-test-2-passage-3-page-050.png"],
      ["渲染页 051：题目页", "images/cambridge-ielts-06-test-2-passage-3-page-051.png"],
      ["渲染页 052：题目页", "images/cambridge-ielts-06-test-2-passage-3-page-052.png"]
    ],
    answers: {
      27: "B",
      28: "E",
      29: "A",
      30: "C",
      31: "G",
      32: "TRUE",
      33: "FALSE",
      34: "TRUE",
      35: "FALSE",
      36: "NOT GIVEN",
      37: "TRUE",
      38: "FALSE",
      39: "TRUE",
      40: "NOT GIVEN"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-3-Passage-1-双语精读.md",
    title: "The power of the big screen",
    questionRange: "1-13",
    titleCn: "大银幕的力量",
    paragraphCount: 10,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 064：文章页", "images/cambridge-ielts-06-test-3-passage-1-page-064.png"],
      ["渲染页 065：文章页", "images/cambridge-ielts-06-test-3-passage-1-page-065.png"],
      ["渲染页 066：题目页", "images/cambridge-ielts-06-test-3-passage-1-page-066.png"],
      ["渲染页 067：题目页", "images/cambridge-ielts-06-test-3-passage-1-page-067.png"]
    ],
    answers: {
      1: "A",
      2: "I",
      3: "J",
      4: "E",
      5: "G",
      6: "YES",
      7: "NOT GIVEN",
      8: "NOT GIVEN",
      9: "NO",
      10: "B",
      11: "C",
      12: "D",
      13: "D"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-3-Passage-2-双语精读.md",
    title: "Motivating Employees under Adverse Conditions",
    questionRange: "14-27",
    titleCn: "逆境中如何激励员工",
    paragraphCount: 8,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: true,
    recoveredPath: "data\\generated\\intensive-reading\\cambridge-04-06\\recovered-sources\\Cambridge-IELTS-06-Test-3-Passage-2-recovered-source.md",
    images: [
      ["渲染页 068：题目页", "images/cambridge-ielts-06-test-3-passage-2-page-068.png"],
      ["渲染页 069：文章页", "images/cambridge-ielts-06-test-3-passage-2-page-069.png"],
      ["渲染页 070：文章页", "images/cambridge-ielts-06-test-3-passage-2-page-070.png"],
      ["渲染页 071：题目页", "images/cambridge-ielts-06-test-3-passage-2-page-071.png"]
    ],
    answers: {
      14: "vii",
      15: "iii",
      16: "ii",
      17: "iv",
      18: "i",
      19: "NO",
      20: "NOT GIVEN",
      21: "NO",
      22: "YES",
      23: "NOT GIVEN",
      24: "YES",
      25: "B",
      26: "C",
      27: "A"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-3-Passage-3-双语精读.md",
    title: "The Search for the Anti-aging Pill",
    questionRange: "28-40",
    titleCn: "抗衰老药丸的科学边界",
    paragraphCount: 7,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 072：文章页", "images/cambridge-ielts-06-test-3-passage-3-page-072.png"],
      ["渲染页 073：文章页", "images/cambridge-ielts-06-test-3-passage-3-page-073.png"],
      ["渲染页 074：题目页", "images/cambridge-ielts-06-test-3-passage-3-page-074.png"],
      ["渲染页 075：题目页", "images/cambridge-ielts-06-test-3-passage-3-page-075.png"]
    ],
    answers: {
      28: "NO",
      29: "YES",
      30: "YES",
      31: "NOT GIVEN",
      32: "YES",
      33: "A",
      34: "B",
      35: "C",
      36: "A",
      37: "B",
      38: "glucose",
      39: "free radicals",
      40: "preservation"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-4-Passage-1-双语精读.md",
    title: "Doctoring sales",
    questionRange: "1-13",
    titleCn: "药企销售如何影响医生",
    paragraphCount: 7,
    questionSectionCount: 2,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: true,
    recoveredPath: "data\\generated\\intensive-reading\\cambridge-04-06\\recovered-sources\\Cambridge-IELTS-06-Test-4-Passage-1-recovered-source.md",
    images: [
      ["渲染页 086：题目页", "images/cambridge-ielts-06-test-4-passage-1-page-086.png"],
      ["渲染页 087：文章页", "images/cambridge-ielts-06-test-4-passage-1-page-087.png"],
      ["渲染页 088：文章页", "images/cambridge-ielts-06-test-4-passage-1-page-088.png"],
      ["渲染页 089：题目页", "images/cambridge-ielts-06-test-4-passage-1-page-089.png"]
    ],
    answers: {
      1: "v",
      2: "vi",
      3: "iii",
      4: "ix",
      5: "i",
      6: "vii",
      7: "x",
      8: "NO",
      9: "YES",
      10: "NO",
      11: "YES",
      12: "NOT GIVEN",
      13: "YES"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-4-Passage-2-双语精读.md",
    title: "Do literate women make better mothers?",
    questionRange: "14-26",
    titleCn: "识字女性与儿童生存",
    paragraphCount: 10,
    questionSectionCount: 3,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: false,
    images: [
      ["渲染页 090：文章页", "images/cambridge-ielts-06-test-4-passage-2-page-090.png"],
      ["渲染页 091：文章页", "images/cambridge-ielts-06-test-4-passage-2-page-091.png"],
      ["渲染页 092：题目页", "images/cambridge-ielts-06-test-4-passage-2-page-092.png"],
      ["渲染页 093：题目页", "images/cambridge-ielts-06-test-4-passage-2-page-093.png"]
    ],
    answers: {
      14: "B",
      15: "F",
      16: "C",
      17: "J",
      18: "F",
      19: "NOT GIVEN",
      20: "NO",
      21: "YES",
      22: "YES",
      23: "NO",
      24: "NOT GIVEN",
      25: "C",
      26: "E"
    }
  },
  {
    file: "Cambridge-IELTS-06-Test-4-Passage-3-双语精读.md",
    title: "Persistent bullying is one of the worst experiences a child can face",
    questionRange: "27-40",
    titleCn: "校园欺凌：从危机应对到预防",
    paragraphCount: 6,
    questionSectionCount: 4,
    materialExtension: "needs_web_enrichment",
    webSource: "",
    recovered: true,
    recoveredPath: "data\\generated\\intensive-reading\\cambridge-04-06\\recovered-sources\\Cambridge-IELTS-06-Test-4-Passage-3-recovered-source.md",
    images: [
      ["渲染页 094：题目页", "images/cambridge-ielts-06-test-4-passage-3-page-094.png"],
      ["渲染页 095：文章页", "images/cambridge-ielts-06-test-4-passage-3-page-095.png"],
      ["渲染页 096：文章页", "images/cambridge-ielts-06-test-4-passage-3-page-096.png"],
      ["渲染页 097：题目页", "images/cambridge-ielts-06-test-4-passage-3-page-097.png"],
      ["渲染页 098：题目页", "images/cambridge-ielts-06-test-4-passage-3-page-098.png"]
    ],
    answers: {
      27: "iv",
      28: "vi",
      29: "v",
      30: "vii",
      31: "B",
      32: "D",
      33: "D",
      34: "A",
      35: "policy",
      36: "(explicit) guidelines",
      37: "(school) curriculum",
      38: "victims",
      39: "playful fighting",
      40: "D"
    }
  }
];

const banned = [
  /Endangered_language/i,
  /Make_believe/i,
  /游戏不是小事/,
  /Caloric_restriction_mimetic/i,
  /Pharmaceutical_sales_representative/i,
  /Nicaraguan_Literacy_Campaign/i
];
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) {
    fail(`${label}: missing ${needle}`);
  }
}

function parseAnswerRows(markdown) {
  const rows = {};
  for (const match of markdown.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|$/gm)) {
    rows[Number(match[1])] = normalize(match[2]);
  }
  return rows;
}

function assertImages(markdown, spec, filePath) {
  if (/!\[[^\]]*\]\([^)]*(?:answer-)?page-\d{3}\.png\)/i.test(markdown)) {
    fail(`${spec.file}: full-page source screenshots must not be embedded`);
  }
}

function assertSections(markdown, spec) {
  assertIncludes(markdown, `## ${spec.title}`, spec.file);
  assertIncludes(markdown, "## 01 逐句精读", spec.file);
  assertIncludes(markdown, "## 02 题目与选项精讲", spec.file);
  assertIncludes(markdown, "## 03 B1+ 词汇深讲总表", spec.file);
  assertIncludes(markdown, "## 05 答案汇总", spec.file);
}

function assertAnswers(markdown, spec) {
  const rows = parseAnswerRows(markdown);
  for (const [question, answer] of Object.entries(spec.answers)) {
    if (rows[Number(question)] !== answer) {
      fail(`${spec.file}: answer ${question} expected ${answer}, got ${rows[Number(question)] || "<missing>"}`);
    }
  }
}

function assertNoBanned(text, label) {
  for (const pattern of banned) {
    if (pattern.test(text)) {
      fail(`${label}: banned stale-template marker ${pattern}`);
    }
  }
}

function assertManifest(manifest, spec) {
  const manifestFile = path.join(groupDir, spec.file);
  const expectedFile = path.relative(repoRoot, manifestFile);
  const record = manifest.records.find((item) => path.normalize(item.file) === path.normalize(expectedFile));
  if (!record) {
    fail(`${spec.file}: missing manifest record`);
    return;
  }

  const checks = {
    questionRange: spec.questionRange,
    titleCn: spec.titleCn,
    paragraphCount: spec.paragraphCount,
    materialExtension: spec.materialExtension,
    webSource: spec.webSource,
    recovered: spec.recovered
  };
  for (const [key, expected] of Object.entries(checks)) {
    if (record[key] !== expected) {
      fail(`${spec.file}: manifest ${key} expected ${expected}, got ${record[key]}`);
    }
  }
  if ("questionSectionCount" in spec && record.questionSectionCount !== spec.questionSectionCount) {
    fail(`${spec.file}: manifest questionSectionCount expected ${spec.questionSectionCount}, got ${record.questionSectionCount}`);
  }
  if ("recoveredPath" in spec && record.recoveredPath !== spec.recoveredPath) {
    fail(`${spec.file}: manifest recoveredPath mismatch`);
  }
  assertNoBanned(JSON.stringify(record), `${spec.file} manifest`);
}

const manifest = JSON.parse(read(manifestPath));

for (const spec of specs) {
  const filePath = path.join(groupDir, spec.file);
  const markdown = read(filePath);
  assertNoBanned(markdown, spec.file);
  assertSections(markdown, spec);
  assertImages(markdown, spec, filePath);
  assertAnswers(markdown, spec);
  assertManifest(manifest, spec);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${specs.length} completed intensive-reading files.`);
