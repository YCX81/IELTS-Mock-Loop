import json
from pathlib import Path
from typing import Any


CANONICAL_RELATIVE_PATH = (
    Path("data") / "canonical" / "reading-question-calibration.v1.json"
)
ANSWER_FIELDS = {
    "number",
    "answer",
    "answers",
    "acceptedAnswers",
    "acceptableAnswers",
}
TEST_FIELDS = (
    "draftStatus",
    "parseConfidence",
    "calibrationSource",
    "verification",
)


def load_canonical_reading_calibrations(project_root: Path) -> dict[str, Any]:
    path = project_root / CANONICAL_RELATIVE_PATH
    return json.loads(path.read_text(encoding="utf-8"))


def merge_canonical_reading_calibrations(
    bank: dict[str, Any],
    canonical: dict[str, Any],
) -> dict[str, int]:
    if canonical.get("schemaVersion") != 1:
        raise ValueError("Unsupported canonical calibration schema")
    if canonical.get("kind") != "ielts-reading-question-calibration":
        raise ValueError("Unexpected canonical calibration source")

    reading_tests = 0
    questions_merged = 0
    canonical_tests = canonical.get("tests", {})

    for test in bank.get("tests", []):
        if test.get("mode") != "reading":
            continue

        test_id = test.get("id", "<missing-id>")
        test_calibration = canonical_tests.get(test_id)
        if not test_calibration:
            raise ValueError(f"Canonical calibration missing for {test_id}")

        question_calibrations = test_calibration.get("questions", {})
        for question in test.get("questions", []):
            number = str(int(question.get("number")))
            entry = question_calibrations.get(number)
            if not entry or not str(entry.get("evidence", "")).strip():
                raise ValueError(
                    f"Canonical calibration missing evidence for {test_id} Q{number}"
                )

            preserved = {
                field: question[field]
                for field in ANSWER_FIELDS
                if field in question
            }
            question.clear()
            question.update(preserved)
            question.update(entry)
            questions_merged += 1

        for field in TEST_FIELDS:
            if field in test_calibration:
                test[field] = test_calibration[field]
            else:
                test.pop(field, None)
        reading_tests += 1

    return {
        "readingTests": reading_tests,
        "questionsMerged": questions_merged,
    }


def apply_canonical_reading_calibrations(
    bank: dict[str, Any],
    project_root: Path,
) -> dict[str, int]:
    canonical = load_canonical_reading_calibrations(project_root)
    return merge_canonical_reading_calibrations(bank, canonical)
