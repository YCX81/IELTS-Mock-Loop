import unittest

from canonical_reading_answers import merge_canonical_reading_answers


class CanonicalReadingAnswerMergeTest(unittest.TestCase):
    def test_merges_authoritative_answers_without_replacing_question_content(self):
        bank = {
            "tests": [
                {
                    "id": "reading-test",
                    "mode": "reading",
                    "questions": [
                        {
                            "number": 1,
                            "prompt": "Keep this prompt",
                            "evidence": "Keep this evidence",
                            "answer": "stale OCR answer",
                            "answers": ["stale alias"],
                            "acceptableAnswers": ["another stale alias"],
                        },
                        {"number": 2, "prompt": "Second prompt", "answer": ""},
                    ],
                },
                {
                    "id": "listening-test",
                    "mode": "listening",
                    "questions": [{"number": 1, "answer": "unchanged"}],
                },
            ]
        }
        canonical = {
            "schemaVersion": 1,
            "kind": "ielts-reading-answer-key",
            "tests": {
                "reading-test": {
                    "answers": {
                        "1": {"answer": "TRUE", "acceptedAnswers": ["true"]},
                        "2": {"answer": "FALSE"},
                    }
                }
            },
        }

        result = merge_canonical_reading_answers(bank, canonical)

        self.assertEqual(result, {"readingTests": 1, "answersMerged": 2})
        self.assertEqual(bank["tests"][0]["questions"][0]["answer"], "TRUE")
        self.assertEqual(bank["tests"][0]["questions"][0]["acceptedAnswers"], ["true"])
        self.assertNotIn("answers", bank["tests"][0]["questions"][0])
        self.assertNotIn("acceptableAnswers", bank["tests"][0]["questions"][0])
        self.assertEqual(bank["tests"][0]["questions"][0]["prompt"], "Keep this prompt")
        self.assertEqual(bank["tests"][0]["questions"][0]["evidence"], "Keep this evidence")
        self.assertEqual(bank["tests"][1]["questions"][0]["answer"], "unchanged")

    def test_rejects_missing_canonical_answers(self):
        bank = {
            "tests": [
                {
                    "id": "reading-test",
                    "mode": "reading",
                    "questions": [{"number": 1, "answer": ""}],
                }
            ]
        }
        canonical = {
            "schemaVersion": 1,
            "kind": "ielts-reading-answer-key",
            "tests": {"reading-test": {"answers": {}}},
        }

        with self.assertRaisesRegex(ValueError, "reading-test Q1"):
            merge_canonical_reading_answers(bank, canonical)


if __name__ == "__main__":
    unittest.main()
