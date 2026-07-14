from __future__ import annotations

import argparse
import json
import re
from datetime import datetime
from pathlib import Path


BOOK_RE = re.compile(r"cambridge-ielts-(\d{2})\.pages\.json$", re.IGNORECASE)
MODULES = ("listening", "reading", "writing")


def safe_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def clean_line(line: str) -> str:
    line = line.replace("กช", "-")
    line = line.replace("บช", "-")
    line = line.replace("бк", "-")
    line = line.replace("—", "-")
    line = line.replace("–", "-")
    line = re.sub(r"\bANDIOR\b", "AND/OR", line, flags=re.IGNORECASE)
    line = re.sub(r"\bWoRD\b", "WORD", line)
    line = re.sub(r"\boNLY\b", "ONLY", line)
    line = re.sub(r"\banSWer\b", "answer", line)
    line = re.sub(r"\breguired\b", "required", line, flags=re.IGNORECASE)
    line = re.sub(r"\s+", " ", line.strip())
    line = fix_question_ranges(line)
    return line


def fix_question_ranges(line: str) -> str:
    def expand(match: re.Match) -> str:
        digits = match.group(1)
        if "-" in digits:
            return match.group(0)
        if len(digits) == 3:
            return f"Questions {digits[0]}-{digits[1:]}"
        if len(digits) == 4:
            return f"Questions {digits[:2]}-{digits[2:]}"
        return match.group(0)

    line = re.sub(r"\bQuestions\s*([0-9]{3,4})\b", expand, line, flags=re.IGNORECASE)
    line = re.sub(r"\bQuestion\s+(\d+)\s*-\s*(\d+)\b", r"Questions \1-\2", line, flags=re.IGNORECASE)
    line = re.sub(r"\bQuestions\s*(\d+)\s*-\s*(\d+)\b", r"Questions \1-\2", line, flags=re.IGNORECASE)
    line = re.sub(r"\bQuestions\s*(\d+)\s+and\s+(\d+)\b", r"Questions \1 and \2", line, flags=re.IGNORECASE)
    line = re.sub(r"\b(SECTION|PART)\s*(\d+)\b", r"\1 \2", line, flags=re.IGNORECASE)
    short = re.fullmatch(r"Questions\s+([1-9])([1-9])", line, flags=re.IGNORECASE)
    if short and int(short.group(1)) < int(short.group(2)):
        return f"Questions {short.group(1)}-{short.group(2)}"
    return line


def page_lines(page: dict) -> list[str]:
    lines = []
    for line in str(page.get("text") or "").splitlines():
        cleaned = clean_line(line)
        if cleaned and not is_noise_line(cleaned):
            lines.append(cleaned)
    return lines


def is_noise_line(line: str) -> bool:
    upper = line.upper()
    return (
        line.startswith("本资料仅用于学习交流参考")
        or line.startswith("扫描二维码")
        or "CAMBRIDGE UNIVERSITY PRESS" in upper
        or upper.startswith("978-")
        or "IELTS 20 ACADEMIC STUDENT'S BOOK" in upper
        or upper in {"CAMBRIDGE", "AUTHENTIC", "EXAMINATION", "PAPERS", "FROM", "ENGLISH"}
    )


def has_exact_line(lines: list[str], value: str) -> bool:
    return any(line.upper() == value for line in lines)


def starts_with_marker(lines: list[str], marker: str) -> bool:
    marker = marker.upper()
    return any(line.upper().startswith(marker) for line in lines[:12])


def is_intro_or_contents(lines: list[str]) -> bool:
    if not lines:
        return True
    first = lines[0].upper()
    return first in {"INTRODUCTION", "CONTENTS"} or first.startswith("ACKNOWLEDG")


def has_question_marker(lines: list[str]) -> bool:
    return any(re.search(r"\bQuestions?\s+\d", line, re.IGNORECASE) for line in lines[:14])


def has_section_or_part_marker(lines: list[str]) -> bool:
    return any(re.match(r"^(PART|SECTION|SECTBON|SECTSON)\s*\d+", line, re.IGNORECASE) for line in lines[:14])


def is_back_matter(page: dict) -> bool:
    lines = page_lines(page)
    first = "\n".join(lines[:5]).upper()
    return any(
        marker in first
        for marker in (
            "AUDIOSCRIPT",
            "AUDIOSENPT",
            "TAPESCRIPT",
            "ANSWER KEY",
            "ANSWER KEYS",
            "SAMPLE ANSWER",
            "MODELANSWER",
            "MODEL AND SAMPLE",
            "GENERAL TRAINING",
        )
    )


def classify_page(page: dict) -> str | None:
    lines = page_lines(page)
    if is_intro_or_contents(lines) or is_back_matter(page):
        return None
    upper_text = "\n".join(lines).upper()
    early = lines[:14]
    if (
        (has_exact_line(early, "LISTENING") or has_section_or_part_marker(early))
        and has_section_or_part_marker(early)
        and has_question_marker(early)
    ):
        return "listening"
    if re.search(r"\bREADING PASSAGE\s+(?:1|I)\b", "\n".join(early).upper()):
        return "reading"
    if any(re.search(r"\bTASK\s+(?:1|I)\b", line.upper()) for line in early) and "SPEND ABOUT 20 MINUTES" in upper_text:
        return "writing"
    return None


def find_main_events(pages: list[dict]) -> list[dict]:
    events = []
    last_module = None
    for page in pages:
        page_no = int(page["page"])
        if is_back_matter(page):
            continue
        module = classify_page(page)
        if not module:
            continue
        if module == last_module:
            continue
        if events and page_no - int(events[-1]["page"]) <= 1 and events[-1]["module"] == module:
            continue
        events.append({"page": page_no, "module": module})
        last_module = module
    return events


def choose_test_events(events: list[dict]) -> list[dict]:
    triples = []
    cursor = 0
    while cursor < len(events) and len(triples) < 12:
        listening = next((event for event in events[cursor:] if event["module"] == "listening"), None)
        if not listening:
            break
        reading = next((event for event in events if int(event["page"]) > int(listening["page"]) and event["module"] == "reading"), None)
        writing = next((event for event in events if reading and int(event["page"]) > int(reading["page"]) and event["module"] == "writing"), None)
        if not reading or not writing:
            break
        triples.extend([listening, reading, writing])
        cursor = events.index(writing) + 1
    return triples


def fallback_test_events(pages: list[dict]) -> list[dict]:
    total = len(pages)
    events = []
    for test_no in range(4):
        start = 1 + round(test_no * total * 0.22)
        events.extend([
            {"page": start, "module": "listening"},
            {"page": min(total, start + 6), "module": "reading"},
            {"page": min(total, start + 18), "module": "writing"},
        ])
    return events


def is_writing_tail_page(page: dict) -> bool:
    lines = page_lines(page)
    if not lines:
        return False
    first = lines[0].upper()
    early = "\n".join(lines[:10]).upper()
    if first == "SPEAKING" or first.startswith("SPEAKING "):
        return True
    if re.match(r"^TEST\s+\d+$", first) and "NUMBER OF QUESTIONS" in early:
        return True
    if any(
        marker in early
        for marker in (
            "ANSWER KEY",
            "ANSWER KEYS",
            "SAMPLE ANSWER",
            "SAMPLE WRITING",
            "MODEL ANSWER",
            "MODEL AND SAMPLE",
            "AUDIOSCRIPT",
            "TAPESCRIPT",
        )
    ):
        return True
    return False


def is_writing_task2_completion_page(page: dict) -> bool:
    text = "\n".join(page_lines(page)).upper()
    return "WRITING TASK 2" in text and "AT LEAST 250 WORDS" in text


def page_range_text(pages_by_no: dict[int, dict], start: int, end: int, mode: str | None = None) -> tuple[list[str], list[int]]:
    selected = []
    selected_pages = []
    for page_no in range(start, max(start, end)):
        page = pages_by_no.get(page_no)
        if not page:
            continue
        if mode == "writing" and selected_pages and is_writing_tail_page(page):
            break
        text = str(page.get("text") or "").strip()
        if text:
            selected.append(text)
            selected_pages.append(page_no)
        if mode == "writing" and is_writing_task2_completion_page(page):
            break
    return selected, selected_pages


def clean_page_lines(page: dict) -> list[str]:
    raw_lines = str(page.get("text") or "").splitlines()
    lines = []
    for raw in raw_lines:
        line = clean_line(raw)
        if not line:
            continue
        if is_noise_line(line):
            continue
        if re.match(r"^p\.\s*\d+$", line, re.IGNORECASE):
            continue
        lines.extend(split_inline_option_line(line))
    while lines and re.match(r"^\d{1,3}$", lines[-1]):
        lines.pop()
    return lines


def split_inline_option_line(line: str) -> list[str]:
    if not re.match(r"^[A-P]\s+", line):
        return [line]
    matches = list(re.finditer(r"(?:^|\s)([A-P])\s+(?=[A-Z0-9'\"(])", line))
    if len(matches) < 2:
        return [line]
    parts = []
    for index, match in enumerate(matches):
        start = match.start(1)
        end = matches[index + 1].start(1) if index + 1 < len(matches) else len(line)
        part = line[start:end].strip()
        if part:
            parts.append(part)
    return parts or [line]


def line_starts_section(line: str, mode: str) -> str | None:
    upper = line.upper()
    if mode == "listening":
        if re.match(r"^(PART|SECTION|SECTBON|SECTSON)\s+[1-4](\b|$)", upper):
            return line.title()
        if re.match(r"^QUESTIONS?\s+\d+", upper):
            return line
    if mode == "reading":
        if re.match(r"^READING PASSAGE\s+[1-3]$", upper):
            return line.title()
        if re.match(r"^QUESTIONS?\s+\d+", upper):
            return line
    if mode == "writing":
        if re.search(r"TASK\s+(?:[12]|I)$", upper) or re.search(r"TASK\s+(?:[12]|I)\b", upper):
            task = re.search(r"TASK\s+([12I])", upper).group(1)
            return "Writing Task " + ("1" if task == "I" else task)
    return None


def should_skip_display_line(line: str, mode: str) -> bool:
    upper = line.upper()
    if re.match(r"^TEST\s+\d+$", upper):
        return True
    if upper in {"LISTENING", "READING", "WRITING"}:
        return True
    if mode in {"listening", "reading"} and upper.startswith("WRITE YOUR ANSWERS IN BOXES"):
        return False
    return False


def paragraphize(lines: list[str]) -> list[str]:
    paragraphs = []
    buffer = []
    table_buffer = []

    def join_buffer() -> str:
        return re.sub(r"([A-Za-z])-\s+([a-z])", r"\1\2", " ".join(buffer))

    def flush_buffer() -> None:
        nonlocal buffer
        if buffer:
            paragraphs.append(join_buffer())
            buffer = []

    def flush_table() -> None:
        nonlocal table_buffer
        if table_buffer:
            paragraphs.append("\n".join(table_buffer))
            table_buffer = []

    for line in lines:
        if line.startswith("|"):
            flush_buffer()
            table_buffer.append(line)
            continue
        flush_table()

        if re.match(r"^!\[[^\]]*\]\([^)]+\)$", line):
            flush_buffer()
            paragraphs.append(line)
            continue

        is_bullet = bool(re.match(r"^[-•]\s+", line))
        if buffer and re.match(r"^[-•]\s+", buffer[-1]) and not is_bullet:
            flush_buffer()

        starts_new = (
            re.match(r"^[A-G]\s*$", line)
            or re.match(r"^\d{1,2}\s+", line)
            or re.match(r"^[A-P]\s+", line)
            or re.match(r"^Experiment\s+\d+\s*:", line, re.IGNORECASE)
            or is_bullet
        )
        if buffer and starts_new:
            flush_buffer()
        buffer.append(line)
        if line.endswith((".", "?", "!", ":")) and len(" ".join(buffer)) > 90:
            flush_buffer()
    flush_table()
    flush_buffer()
    return paragraphs


def build_structured_text(mode: str, pages_by_no: dict[int, dict], page_numbers: list[int]) -> dict:
    sections = []
    current = None
    raw_blocks = []
    stop = False
    for page_no in page_numbers:
        if stop:
            break
        page = pages_by_no.get(page_no)
        if not page:
            continue
        lines = clean_page_lines(page)
        if lines:
            raw_blocks.append("\n".join(lines))
        for line in lines:
            if stop:
                break
            if should_skip_display_line(line, mode):
                continue
            title = line_starts_section(line, mode)
            if title:
                current = {
                    "title": title,
                    "kind": "questions" if title.upper().startswith("QUESTIONS") else mode,
                    "pages": [page_no],
                    "paragraphs": [],
                    "lines": [],
                }
                sections.append(current)
                continue
            if not current:
                current = {"title": "Overview", "kind": mode, "pages": [page_no], "paragraphs": [], "lines": []}
                sections.append(current)
            if page_no not in current["pages"]:
                current["pages"].append(page_no)
            current["lines"].append(line)
            if (
                mode == "writing"
                and str(current.get("title") or "").lower() == "writing task 2"
                and re.search(r"at least 250 words\.?$", line, re.IGNORECASE)
            ):
                stop = True

    for section in sections:
        section["paragraphs"] = paragraphize(section.pop("lines"))
    text = "\n\n".join(
        "\n".join([section["title"], *section["paragraphs"]]).strip()
        for section in sections
        if section["paragraphs"] or section["title"] != "Overview"
    )
    return {
        "mode": mode,
        "sections": sections,
        "text": text,
        "rawText": "\n\n".join(raw_blocks),
    }


def question_shells(prefix: str, total: int = 40) -> list[dict]:
    return [
        {
            "id": f"{prefix}{number}",
            "number": number,
            "type": "completion",
            "prompt": f"Answer {number}",
            "answer": "",
            "evidence": "",
        }
        for number in range(1, total + 1)
    ]


def structured_section_text(section: dict) -> str:
    parts = [str(section.get("title") or "").strip()]
    parts.extend(str(paragraph).strip() for paragraph in section.get("paragraphs", []) if str(paragraph).strip())
    return "\n".join(part for part in parts if part).strip()


def writing_task_text(writing_structured: dict, task_no: int, fallback: str) -> str:
    title = f"Writing Task {task_no}"
    sections = [
        structured_section_text(section)
        for section in writing_structured.get("sections", [])
        if str(section.get("title") or "").strip().lower() == title.lower()
    ]
    text = "\n\n".join(section for section in sections if section).strip()
    if text:
        return text
    next_task = 2 if task_no == 1 else None
    stop = rf"(?=Writing Task {next_task}\b|\Z)" if next_task else r"(?=\Z)"
    match = re.search(rf"(Writing Task {task_no}\b.*?){stop}", fallback, flags=re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else fallback


def split_audio_tracks(book: dict) -> list[list[dict]]:
    tracks = ((book.get("listening") or {}).get("extractedAudio") or [])
    groups = [[] for _ in range(4)]
    for track in tracks:
        source = str(track.get("source") or track.get("path") or "")
        match = re.search(r"Test\s*([1-4])", source, re.IGNORECASE)
        if match:
            groups[int(match.group(1)) - 1].append(track)
            continue
        match = re.search(r"Track\s*([0-9]+)", source, re.IGNORECASE)
        if match:
            groups[min(3, max(0, (int(match.group(1)) - 1) // 4))].append(track)
            continue
    if any(groups):
        return groups
    chunk = max(1, (len(tracks) + 3) // 4)
    return [tracks[index * chunk:(index + 1) * chunk] for index in range(4)]


def answer_key_start(events: list[dict], pages: list[dict]) -> int:
    if len(events) >= 12:
        last_writing = int(events[11]["page"])
        for page in pages:
            page_no = int(page["page"])
            if page_no <= last_writing + 5:
                continue
            lines = page_lines(page)
            upper = "\n".join(lines).upper()
            if has_exact_line(lines, "LISTENING") or has_exact_line(lines, "READING") or "ANSWER KEY" in upper:
                return page_no
        return min(len(pages), last_writing + 12)
    return max(1, int(len(pages) * 0.82))


def build_tests_for_book(book: dict, pages_payload: dict, project_root: Path) -> tuple[list[dict], dict]:
    book_no = pages_payload["book"]
    pages = pages_payload.get("pages", [])
    pages_by_no = {int(page["page"]): page for page in pages}
    detected_events = find_main_events(pages)
    events = choose_test_events(detected_events)
    confidence = "detected" if len(events) == 12 else "fallback"
    if len(events) != 12:
        events = fallback_test_events(pages)
    answer_start = answer_key_start(events, pages)
    audio_groups = split_audio_tracks(book)
    tests = []

    for test_index in range(4):
        test_no = test_index + 1
        listening_start = int(events[test_index * 3]["page"])
        reading_start = int(events[test_index * 3 + 1]["page"])
        writing_start = int(events[test_index * 3 + 2]["page"])
        next_start = int(events[test_index * 3 + 3]["page"]) if test_index < 3 else answer_start

        listening_text, listening_pages = page_range_text(pages_by_no, listening_start, reading_start, "listening")
        reading_text, reading_pages = page_range_text(pages_by_no, reading_start, writing_start, "reading")
        writing_text, writing_pages = page_range_text(pages_by_no, writing_start, next_start, "writing")
        answer_text, answer_pages = page_range_text(pages_by_no, answer_start, min(len(pages) + 1, answer_start + 18), "answer")
        listening_structured = build_structured_text("listening", pages_by_no, listening_pages)
        reading_structured = build_structured_text("reading", pages_by_no, reading_pages)
        writing_structured = build_structured_text("writing", pages_by_no, writing_pages)

        tracks = [
            {"label": f"Track {idx + 1}", "url": track["path"], "source": track.get("source", "")}
            for idx, track in enumerate(audio_groups[test_index] if test_index < len(audio_groups) else [])
        ]

        common = {
            "source": f"Local Cambridge IELTS {int(book_no)} structured OCR draft",
            "draftStatus": "structured_ocr_draft",
            "parseConfidence": confidence,
            "pdf": book.get("pdf"),
            "answerKeyText": "\n\n".join(answer_text),
            "answerKeyPages": answer_pages,
        }

        tests.append({
            **common,
            "mode": "listening",
            "id": f"cambridge-{book_no}-listening-test-{test_no}",
            "title": f"Cambridge IELTS {int(book_no)} Listening Test {test_no}",
            "durationSec": 1800,
            "audioUrl": tracks[0]["url"] if tracks else "",
            "audioTracks": tracks,
            "questions": question_shells("L", 40),
            "questionText": listening_structured["text"] or "\n\n".join(listening_text),
            "rawOcrText": listening_structured["rawText"],
            "listeningSections": listening_structured["sections"],
            "sourcePages": listening_pages,
            "officialLinks": [],
        })
        tests.append({
            **common,
            "mode": "reading",
            "id": f"cambridge-{book_no}-reading-test-{test_no}",
            "title": f"Cambridge IELTS {int(book_no)} Reading Test {test_no}",
            "durationSec": 3600,
            "passageTitle": f"Cambridge IELTS {int(book_no)} Reading Test {test_no}",
            "passage": reading_structured["text"].split("\n\n") if reading_structured["text"] else reading_text or [f"Cambridge IELTS {int(book_no)} Reading Test {test_no}"],
            "rawOcrText": reading_structured["rawText"],
            "readingSections": reading_structured["sections"],
            "questions": question_shells("R", 40),
            "sourcePages": reading_pages,
        })
        writing_body = writing_structured["text"] or "\n\n".join(writing_text)
        task1_body = writing_task_text(writing_structured, 1, writing_body)
        task2_body = writing_task_text(writing_structured, 2, writing_body)
        tests.append({
            **common,
            "mode": "writing",
            "id": f"cambridge-{book_no}-writing-test-{test_no}",
            "title": f"Cambridge IELTS {int(book_no)} Writing Test {test_no}",
            "durationSec": 3600,
            "task1": {"title": "Task 1", "instruction": task1_body, "data": []},
            "task2": {"title": "Task 2", "instruction": task2_body},
            "rawOcrText": writing_structured["rawText"],
            "writingSections": writing_structured["sections"],
            "sourcePages": writing_pages,
        })

    debug = {
        "book": book_no,
        "confidence": confidence,
        "events": events,
        "detectedEvents": detected_events,
        "answerKeyStart": answer_start,
    }
    return tests, debug


def main() -> int:
    parser = argparse.ArgumentParser(description="Build structured CBT draft JSON from OCR page JSON and audio index.")
    parser.add_argument("--project", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()

    project_root = args.project.resolve()
    data_dir = project_root / "data"
    generated = data_dir / "generated"
    manifest_path = generated / "reports" / "cambridge-resource-manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    books_by_no = {book["book"]: book for book in manifest.get("books", [])}
    all_tests = []
    debug_items = []

    for page_json in sorted((generated / "page-json").glob("cambridge-ielts-*.pages.json")):
        match = BOOK_RE.search(page_json.name)
        if not match:
            continue
        book_no = match.group(1)
        pages_payload = json.loads(page_json.read_text(encoding="utf-8"))
        tests, debug = build_tests_for_book(books_by_no.get(book_no, {"book": book_no}), pages_payload, project_root)
        all_tests.extend(tests)
        debug_items.append(debug)

    summary = {
        "tests": len(all_tests),
        "reading": sum(1 for test in all_tests if test["mode"] == "reading"),
        "listening": sum(1 for test in all_tests if test["mode"] == "listening"),
        "writing": sum(1 for test in all_tests if test["mode"] == "writing"),
        "audioTracks": sum(len(test.get("audioTracks", [])) for test in all_tests),
        "structuredDetectedBooks": sum(1 for item in debug_items if item["confidence"] == "detected"),
        "fallbackBooks": sum(1 for item in debug_items if item["confidence"] == "fallback"),
    }
    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "summary": summary,
        "tests": all_tests,
    }
    safe_write_text(generated / "reports" / "cambridge-test-bank.json", json.dumps(payload, ensure_ascii=False, indent=2))
    safe_write_text(generated / "reports" / "cambridge-structured-debug.json", json.dumps(debug_items, ensure_ascii=False, indent=2))
    safe_write_text(data_dir / "cambridge-test-bank.js", "window.CAMBRIDGE_TEST_BANK = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n")
    print(json.dumps(summary, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
