import unittest

from canonical_reading_calibrations import merge_canonical_reading_calibrations


class CanonicalReadingCalibrationMergeTest(unittest.TestCase):
    def test_merges_evidence_and_status_without_replacing_generated_question_content(self):
        bank = {
            "tests": [
                {
                    "id": "reading-test",
                    "mode": "reading",
                    "draftStatus": "generated",
                    "parseConfidence": "ocr",
                    "questions": [
                        {
                            "number": 1,
                            "prompt": "Fresh generated prompt",
                            "answer": "TRUE",
                            "evidence": "",
                        }
                    ],
                },
                {
                    "id": "listening-test",
                    "mode": "listening",
                    "questions": [{"number": 1, "evidence": "unchanged"}],
                },
            ]
        }
        canonical = {
            "schemaVersion": 1,
            "kind": "ielts-reading-question-calibration",
            "tests": {
                "reading-test": {
                    "draftStatus": "manually_calibrated",
                    "parseConfidence": "human_verified",
                    "verification": {
                        "answerKey": "verified_against_local_official_answer_key_text",
                        "evidence": "complete",
                        "questionCount": 40,
                    },
                    "questions": {
                        "1": {
                            "prompt": "Calibrated real prompt",
                            "type": "true-false-not-given",
                            "evidence": "Calibrated source sentence.",
                            "evidenceLocation": {"paragraph": "A"},
                            "synonymSubstitutions": ["fresh ↔ calibrated"],
                            "distractors": "A bounded distractor explanation.",
                        }
                    },
                }
            },
        }

        result = merge_canonical_reading_calibrations(bank, canonical)

        self.assertEqual(result, {"readingTests": 1, "questionsMerged": 1})
        reading = bank["tests"][0]
        question = reading["questions"][0]
        self.assertEqual(reading["draftStatus"], "manually_calibrated")
        self.assertEqual(reading["parseConfidence"], "human_verified")
        self.assertEqual(reading["verification"]["evidence"], "complete")
        self.assertEqual(question["prompt"], "Calibrated real prompt")
        self.assertEqual(question["type"], "true-false-not-given")
        self.assertEqual(question["answer"], "TRUE")
        self.assertEqual(question["evidence"], "Calibrated source sentence.")
        self.assertEqual(question["evidenceLocation"], {"paragraph": "A"})
        self.assertEqual(bank["tests"][1]["questions"][0]["evidence"], "unchanged")

    def test_rejects_missing_or_blank_evidence(self):
        bank = {
            "tests": [
                {
                    "id": "reading-test",
                    "mode": "reading",
                    "questions": [{"number": 1, "prompt": "Question", "answer": "TRUE"}],
                }
            ]
        }
        canonical = {
            "schemaVersion": 1,
            "kind": "ielts-reading-question-calibration",
            "tests": {
                "reading-test": {
                    "questions": {"1": {"evidence": ""}},
                }
            },
        }

        with self.assertRaisesRegex(ValueError, "reading-test Q1"):
            merge_canonical_reading_calibrations(bank, canonical)


if __name__ == "__main__":
    unittest.main()
