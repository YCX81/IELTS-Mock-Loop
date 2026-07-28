const assert = require("assert");
const { answerMatches, answerMatchesInContext, acceptedAnswerVariants } = require("../answer-utils.js");

assert(answerMatches({ answer: "NOT GIVEN" }, "not   given"));
assert(answerMatches({ answer: "colour", acceptedAnswers: ["colour", "color"] }, "color"));
assert(answerMatches({ answer: "shareholders", answers: ["shareholders", "investors"] }, "investors"));
assert(answerMatches({ answer: "microorganisms / micro-organisms" }, "micro-organisms"));
assert(answerMatches({ answer: "warm (winter)" }, "warm"));
assert(answerMatches({ answer: "warm (winter)" }, "warm winter"));
assert(answerMatches({ answer: "mustard plant(s) / mustard" }, "mustard plants"));
assert(answerMatches({ answer: "(the) architect(’s) (name)" }, "architect's name"));
assert(!answerMatches({ answer: "FALSE" }, "TRUE"));

const variants = acceptedAnswerVariants({
  answer: "harbour / harbor",
  acceptableAnswers: ["the harbour"],
});
assert(variants.includes("harbour"));
assert(variants.includes("harbor"));
assert(variants.includes("the harbour"));

const pairedQuestions = [
  { id: "R23", number: 23, answer: "B", acceptedAnswers: ["B"], acceptedAnswerMode: "paired_blanks_in_either_order", pairedWith: 24 },
  { id: "R24", number: 24, answer: "C", acceptedAnswers: ["C"], acceptedAnswerMode: "paired_blanks_in_either_order", pairedWith: 23 },
];
assert(answerMatchesInContext(pairedQuestions[0], "C", pairedQuestions, { R23: "C", R24: "B" }));
assert(answerMatchesInContext(pairedQuestions[1], "B", pairedQuestions, { R23: "C", R24: "B" }));
assert(answerMatchesInContext(pairedQuestions[0], "B", pairedQuestions, { R23: "B", R24: "B" }));
assert(!answerMatchesInContext(pairedQuestions[1], "B", pairedQuestions, { R23: "B", R24: "B" }));
assert(!answerMatchesInContext(pairedQuestions[1], "D", pairedQuestions, { R23: "B", R24: "D" }));

console.log("PASS: official alternative and optional-word answer variants are accepted.");
