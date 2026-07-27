import json
from pathlib import Path
from typing import Any


CANONICAL_RELATIVE_PATH = Path("data") / "canonical" / "reading-answer-key.v1.json"


def load_canonical_reading_answers(project_root: Path) -> dict[str, Any]:
    path = project_root / CANONICAL_RELATIVE_PATH
    return json.loads(path.read_text(encoding="utf-8"))


def merge_canonical_reading_answers(
    bank: dict[str, Any],
    canonical: dict[str, Any],
) -> dict[str, int]:
    if canonical.get("schemaVersion") != 1:
        raise ValueError("Unsupported canonical answer schema")
    if canonical.get("kind") != "ielts-reading-answer-key":
        raise ValueError("Unexpected canonical answer source")

    reading_tests = 0
    answers_merged = 0
    canonical_tests = canonical.get("tests", {})

    for test in bank.get("tests", []):
        if test.get("mode") != "reading":
            continue

        test_id = test.get("id", "<missing-id>")
        test_key = canonical_tests.get(test_id)
        if not test_key:
            raise ValueError(f"Canonical answers missing for {test_id}")

        answers = test_key.get("answers", {})
        for question in test.get("questions", []):
            number = str(int(question.get("number")))
            entry = answers.get(number)
            if not entry or not str(entry.get("answer", "")).strip():
                raise ValueError(f"Canonical answer missing for {test_id} Q{number}")

            question["answer"] = str(entry["answer"]).strip()
            question.pop("answers", None)
            question.pop("acceptableAnswers", None)
            if isinstance(entry.get("acceptedAnswers"), list):
                question["acceptedAnswers"] = list(entry["acceptedAnswers"])
            else:
                question.pop("acceptedAnswers", None)
            answers_merged += 1

        reading_tests += 1

    return {"readingTests": reading_tests, "answersMerged": answers_merged}


def apply_canonical_reading_answers(
    bank: dict[str, Any],
    project_root: Path,
) -> dict[str, int]:
    canonical = load_canonical_reading_answers(project_root)
    return merge_canonical_reading_answers(bank, canonical)
