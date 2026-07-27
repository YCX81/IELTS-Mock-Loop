const assert = require("assert");
const { answerMatches, acceptedAnswerVariants } = require("../answer-utils.js");

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

console.log("PASS: official alternative and optional-word answer variants are accepted.");
