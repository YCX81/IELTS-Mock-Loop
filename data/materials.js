window.IELTS_SOURCE_LIBRARY = [
  {
    id: "ielts-org-academic",
    provider: "IELTS.org",
    title: "IELTS Academic sample test questions",
    type: "官方样题",
    format: "Paper + computer links",
    url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test",
    use: "官方 Academic 听力、阅读、写作、口语样题入口；机考部分链接到 Inspera 题型体验。",
    fit: "优先用于熟悉题型、时间和界面，不建议整套复制进本地库。"
  },
  {
    id: "bc-practice-hub",
    provider: "British Council",
    title: "Free online IELTS practice tests",
    type: "官方练习",
    format: "Listening / Reading / Writing / Speaking pages",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests",
    use: "每日练习入口；听力有分 Part 页面，阅读和写作提供 Academic 与 General Training 练习入口。",
    fit: "适合作为每天正式练习来源，本地项目记录答案、错因和复盘。"
  },
  {
    id: "bc-computer",
    provider: "British Council",
    title: "IELTS on computer preparation",
    type: "机考熟悉",
    format: "Computer familiarisation",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests/ielts-on-computer",
    use: "熟悉机考流程：听读写在电脑上完成，口语仍为面对面。",
    fit: "用于校准本地界面的体验目标。"
  },
  {
    id: "idp-practice-tests",
    provider: "IDP IELTS",
    title: "IELTS practice tests and preparation materials",
    type: "官方题型索引",
    format: "Computer + paper filters",
    url: "https://ielts.idp.com/prepare/all-test-types/all-skills/practice-test",
    use: "IDP 按题型列出多项机考样题和答案 PDF，包括 T/F/NG、matching、completion 等。",
    fit: "适合按弱题型定向练习，复盘时记录同义替换和错误类型。"
  },
  {
    id: "cambridge-preparation",
    provider: "Cambridge English",
    title: "IELTS preparation and official practice books",
    type: "官方出版资料",
    format: "Guide + sample paper + IELTS 21",
    url: "https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/",
    use: "Cambridge 说明其开发并编写 IELTS 测试，并列出 sample paper、IELTS Guide、IELTS 21 Academic/General Training。",
    fit: "适合作为真题书清单和购买/导入来源，本地项目只保存索引与复盘记录。"
  }
];

window.IELTS_SEED_TESTS = {
  reading: {
    id: "reading-workforce-mini",
    title: "Academic Reading Mini Test: Older Workers",
    source: "原创迷你练习，用于机考界面和错因流程演示",
    durationSec: 20 * 60,
    passageTitle: "Older Workers and the Changing Labour Market",
    passage: [
      "In many developed economies, the average age of the workforce is rising. Longer life expectancy, delayed retirement, and skill shortages have encouraged employers to keep experienced staff in work for longer. Yet the effect is not uniform across industries. In sectors where technology changes quickly, older employees often need structured retraining before they can move into new roles.",
      "Research teams studying age-diverse workplaces have found that mixed-age groups can be highly productive when responsibilities are clearly divided. Older staff tend to contribute procedural knowledge and judgement built through repeated experience, while younger staff may bring recent technical training and familiarity with new software. The strongest teams are not those that simply contain a wide age range, but those that actively exchange knowledge.",
      "Some managers assume that older workers are resistant to change. The evidence is more complicated. Surveys show that resistance is often linked to poor communication during workplace reforms rather than age itself. When employees are told why a new system is being introduced and are given enough time to practise, age differences in adoption rates become much smaller.",
      "However, age discrimination remains a practical barrier. Applicants over fifty often receive fewer interview invitations than younger candidates with similar qualifications. This pattern is costly for employers because it reduces the pool of experienced candidates at the same time that many organisations report shortages in supervision, compliance, and customer-facing roles.",
      "Policy responses vary. Some countries subsidise mid-career training, while others focus on flexible hours or anti-discrimination enforcement. Analysts argue that no single policy is sufficient. Retaining older workers usually requires a combination of training, job redesign, and a culture in which learning is treated as a normal part of work rather than a signal that someone is falling behind."
    ],
    questions: [
      {
        id: "R1",
        number: 1,
        type: "tfng",
        prompt: "The workforce is getting older in many developed economies.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        answer: "TRUE",
        evidence: "the average age of the workforce is rising",
        explanation: "题干与原文直接同义：getting older = average age is rising。",
        card: {
          front: "getting older = average age is rising",
          back: "阅读同义替换：题干说 workforce is getting older，原文说 average age is rising。",
          tags: "ielts reading synonym"
        }
      },
      {
        id: "R2",
        number: 2,
        type: "tfng",
        prompt: "Older workers are usually better at learning new software than younger workers.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        answer: "FALSE",
        evidence: "younger staff may bring recent technical training and familiarity with new software",
        explanation: "原文明确把 new software familiarity 放在 younger staff 一侧，题干反向绝对化。",
        card: {
          front: "FALSE vs NOT GIVEN in IELTS Reading",
          back: "如果原文明确支持相反信息，选 FALSE；如果只是不够证明，才是 NOT GIVEN。",
          tags: "ielts reading tfng"
        }
      },
      {
        id: "R3",
        number: 3,
        type: "mcq",
        prompt: "According to the passage, age-diverse teams work best when they",
        options: [
          "avoid changing responsibilities",
          "make knowledge exchange a deliberate practice",
          "allow older employees to supervise all technical decisions",
          "separate younger and older employees into different units"
        ],
        answer: "make knowledge exchange a deliberate practice",
        evidence: "those that actively exchange knowledge",
        explanation: "best teams 的限定来自 actively exchange knowledge。",
        card: {
          front: "actively exchange knowledge",
          back: "主动交换知识；IELTS 阅读常被改写为 make knowledge exchange deliberate/systematic。",
          tags: "ielts collocation reading"
        }
      },
      {
        id: "R4",
        number: 4,
        type: "completion",
        prompt: "Resistance to workplace reforms is often connected to poor ______.",
        answer: "communication",
        evidence: "resistance is often linked to poor communication",
        explanation: "completion 题优先找语法位置和原词复现：poor 后接名词。",
        card: {
          front: "be linked to",
          back: "与……有关；原文 resistance is linked to poor communication。",
          tags: "ielts phrase reading"
        }
      },
      {
        id: "R5",
        number: 5,
        type: "mcq",
        prompt: "Why is discrimination against applicants over fifty described as costly?",
        options: [
          "It increases the cost of software training.",
          "It reduces access to experienced candidates when some roles already lack staff.",
          "It forces companies to offer flexible hours to every employee.",
          "It makes younger employees leave more quickly."
        ],
        answer: "It reduces access to experienced candidates when some roles already lack staff.",
        evidence: "reduces the pool of experienced candidates ... shortages in supervision, compliance, and customer-facing roles",
        explanation: "costly 的原因是 candidate pool 变小，同时若干岗位短缺。",
        card: {
          front: "candidate pool",
          back: "候选人池；reduce the pool of experienced candidates = 减少有经验候选人的来源。",
          tags: "ielts vocabulary work"
        }
      },
      {
        id: "R6",
        number: 6,
        type: "completion",
        prompt: "Analysts think retaining older workers requires training, job redesign, and workplace ______.",
        answer: "culture",
        evidence: "a combination of training, job redesign, and a culture",
        explanation: "并列结构定位：training, job redesign, and a culture。",
        card: {
          front: "job redesign",
          back: "工作再设计；常用于老龄化、自动化、组织管理话题。",
          tags: "ielts vocabulary work"
        }
      }
    ]
  },
  listening: {
    id: "listening-import-workspace",
    title: "Listening Review Workspace",
    durationSec: 30 * 60,
    source: "配合官方听力页面或自有音频使用",
    questions: [
      { id: "L1", number: 1, prompt: "Answer 1", answer: "" },
      { id: "L2", number: 2, prompt: "Answer 2", answer: "" },
      { id: "L3", number: 3, prompt: "Answer 3", answer: "" },
      { id: "L4", number: 4, prompt: "Answer 4", answer: "" },
      { id: "L5", number: 5, prompt: "Answer 5", answer: "" },
      { id: "L6", number: 6, prompt: "Answer 6", answer: "" },
      { id: "L7", number: 7, prompt: "Answer 7", answer: "" },
      { id: "L8", number: 8, prompt: "Answer 8", answer: "" },
      { id: "L9", number: 9, prompt: "Answer 9", answer: "" },
      { id: "L10", number: 10, prompt: "Answer 10", answer: "" }
    ],
    officialLinks: [
      {
        label: "British Council Listening practice tests",
        url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests/listening"
      },
      {
        label: "IELTS.org computer Listening sample tasks",
        url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test#computer-delivered"
      }
    ]
  },
  writing: {
    id: "writing-task-loop",
    title: "Academic Writing Mock Desk",
    durationSec: 60 * 60,
    source: "原创 Task 1 图表 + Task 2 题目，用于闭环训练",
    task1: {
      title: "Task 1: Remote work participation",
      instruction: "The chart below shows the percentage of employees working remotely at least two days a week in three sectors from 2015 to 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      data: [
        { year: "2015", tech: 18, finance: 9, education: 6 },
        { year: "2020", tech: 42, finance: 31, education: 24 },
        { year: "2025", tech: 55, finance: 44, education: 37 }
      ]
    },
    task2: {
      title: "Task 2: Technology and older workers",
      instruction: "Some people believe that employers should invest more in training older workers to use new technology. Others think resources should be focused on younger workers entering the labour market. Discuss both views and give your own opinion."
    }
  },
  speaking: {
    id: "speaking-daily-cue",
    title: "Speaking Part 2 + Part 3 Loop",
    durationSec: 15 * 60,
    cue: {
      topic: "Describe a time when you had to learn a new skill quickly.",
      bullets: [
        "what the skill was",
        "why you needed to learn it",
        "how you practised",
        "and explain how successful you were"
      ],
      followUps: [
        "Why do some adults find it difficult to learn new skills?",
        "Should companies pay for employees' training?",
        "How has technology changed the way people learn?"
      ]
    }
  }
};
