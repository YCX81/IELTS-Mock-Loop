# Material Extension Reference

Read this when `research=素材延申`, `reference_examples=少量素材/栏目增强`, or the user asks for影视、文学、考试、热点新闻、品牌声明、公共事件等素材.

## Search Trigger

- If the environment has search, browse, retrieval, or web tools, actually call one of those tools for material examples before writing.
- Treat search as a tool action, not a reasoning step. Do not rely on model memory, familiar examples, or training-data knowledge and describe them as searched material.
- In Codex, use `web.run`, browser search, plugin search, or an equivalent retrieval tool when visible. Make at least one explicit search/browse call before drafting when material extension is required.
- Search is still required when the user pasted complete source text if they asked for “原型栏目”, “素材延申”, “深挖和拓展”, or similar.
- Search around 1-3 A-layer expressions, not around every word.
- User says “不要核验” or “不要查背景”: do not do event-background verification or write a verification report, but still search for expression material unless the user also says “不要联网”, “不要外部素材”, or “只基于原文”.
- If no search/browse tool is available in the active environment, do not name specific film, exam, news, web, or quote material unless the user provided it. Use generic migration examples, and if the user explicitly required active search, state briefly outside the learning output that the current agent has no search tool.

## What To Search

- Search for expression examples: a word, collocation, sentence pattern, metaphor, title construction, or rhetorical move in real contexts.
- Prefer searches that can produce expression examples: `target expression + example sentence`, `target expression + movie quote`, `target expression + exam`, `target expression + news headline`, `target expression + idiom meaning`, or a near-synonym plus a concrete domain.
- Do not start with broad topic searches such as the article’s industry, brand history, or event background unless that background will become a usable example for the target expression.
- Good sources include user-provided material, original article/source pages, official statements, film or TV subtitles with identifiable work, literature, speeches, interviews, TED/open courses, official or credible exam material, reputable media headlines, public events, and brand language.
- Exam material can include 考研、四六级、专四专八、IELTS、TOEFL、GRE、GMAT、SAT、ACT. Identify the exam type, year, official/sample nature, or material type when known.
- If exact source, date, episode, exam year, or wording cannot be confirmed, do not invent it. Use a generic migration example instead.

## How To Use Material

- Build an internal “expression -> material” pairing before writing. Do not output this table.
- Use at most one external material item per A-layer expression unless the user explicitly asks for more examples.
- Place material inside the relevant expression explanation, not in the intro and not as a final appendix.
- Material must form a loop: explain the expression, introduce the real context as an example of the expression, then return to the original sentence or a migration sentence and state how it helps the learner use the expression.
- Use material mainly as expression evidence, not topic evidence. A useful material item should answer “这个词/短语/句型还能怎么用？” rather than “这篇文章说得有没有道理？”
- After a high-value expression, normally add 2-3 self-contained bilingual migration examples in different domains. These can be stable scenes such as education, workplace, platform governance, public policy, consumer trust, food safety, city life, technology products, or cultural communication.
- When appropriate, add 2-3 nearby expressions after the main expression. For each nearby expression, give a short boundary explanation and one bilingual example. Do not list synonyms without examples.
- Current events can be used, but only as a scene for the expression. For example, use a verified public event to write a sentence with `backfire`, `tainted`, or `gain a foothold`; do not turn the paragraph into a background report on that event.
- Do not use material that only adds background trivia, verifies the article’s topic, or proves a brand/event claim without helping explain the expression.

## Prototype Pattern

For an A-layer expression, follow this shape when space allows:

1. Explain the expression in the original sentence.
2. Explain image, word formation, tone, or why it differs from an ordinary word.
3. Give one real material example if available, such as film, literature, exam, headline, dictionary usage, or public event. Keep it short.
4. Give 2-3 bilingual migration examples in stable or verified topical scenes.
5. Add 2-3 nearby expressions with boundaries and bilingual examples.

The material should feel like the `backfire` prototype: the real example teaches the verb’s image or usage; the education, environmental policy, platform, or brand examples show how learners can reuse it.

## Do Not Write A Verification Report

- Do not write “我做了轻量核验”, “当前检索中未能访问”, “核验参考”, “参考来源如下”, or “下面结合这些核验信息” in the learning output.
- Search failures are internal. If the original article is inaccessible, use the user-provided text; if no text is available, make the limitation clear in one sentence and ask for the article text.
- If a background fact is genuinely needed, absorb it in one natural sentence with an absolute date only when relevant.

## Copyright And Safety

- Quote only short snippets needed for learning. Do not copy full copyrighted articles or long passages.
- Do not present unverified news, data, quotes, or exam items as confirmed.
- For sensitive, sexualized, identity-related, or insulting terms, explain the boundary and make clear that recognition is not a recommendation to use.
