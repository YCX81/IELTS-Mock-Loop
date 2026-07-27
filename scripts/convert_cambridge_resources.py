from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import zipfile
from datetime import datetime
from pathlib import Path

from canonical_reading_answers import apply_canonical_reading_answers
from canonical_reading_calibrations import apply_canonical_reading_calibrations


PDF_RE = re.compile(r"Cambridge-IELTS-(\d{2})\.pdf$", re.IGNORECASE)
ZIP_RE = re.compile(r"Cambridge-IELTS---Listening-(\d{2})\.zip$", re.IGNORECASE)


def import_pdfplumber():
    try:
        import pdfplumber  # type: ignore
    except Exception as exc:  # pragma: no cover - environment dependent
        print(f"pdfplumber import failed: {exc}", file=sys.stderr)
        raise SystemExit(2)
    return pdfplumber


def rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def safe_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def resolve_tool(explicit: str | None, names: list[str]) -> str | None:
    if explicit:
        path = Path(explicit)
        if path.exists():
            return str(path)
    for name in names:
        found = shutil.which(name)
        if found:
            return found
    return None


def safe_zip_output_path(base_dir: Path, name: str) -> Path | None:
    raw_parts = Path(name.replace("\\", "/")).parts
    clean_parts = []
    for part in raw_parts:
        if part in ("", ".", "..") or part.endswith(":"):
            continue
        clean_parts.append(re.sub(r"[^A-Za-z0-9._ -]+", "_", part))
    if not clean_parts:
        return None
    return base_dir.joinpath(*clean_parts)


def convert_wma_to_mp3(source_path: Path, ffmpeg_path: str | None) -> dict | None:
    if source_path.suffix.lower() != ".wma" or not ffmpeg_path:
        return None
    target_path = source_path.with_suffix(".mp3")
    completed = subprocess.run(
        [
            ffmpeg_path,
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(source_path),
            "-codec:a",
            "libmp3lame",
            "-q:a",
            "3",
            str(target_path),
        ],
        text=True,
        capture_output=True,
    )
    if completed.returncode != 0:
        return {"error": completed.stderr.strip() or "ffmpeg conversion failed"}
    return {"path": target_path, "bytes": target_path.stat().st_size}


def scan_zip(zip_path: Path, out_dir: Path, project_root: Path, extract_audio: bool, ffmpeg_path: str | None) -> dict:
    info = {
        "file": zip_path.name,
        "bytes": zip_path.stat().st_size,
        "entries": [],
        "audioEntries": 0,
        "extractedAudio": [],
        "error": None,
    }
    try:
        audio_exts = (".mp3", ".m4a", ".wav", ".flac", ".ogg", ".wma")
        book_match = ZIP_RE.search(zip_path.name)
        book_no = book_match.group(1) if book_match else "unknown"
        with zipfile.ZipFile(zip_path) as zf:
            names = zf.namelist()
            audio_names = [name for name in names if name.lower().endswith(audio_exts)]
            if extract_audio:
                audio_dir = out_dir / "audio" / f"cambridge-ielts-{book_no}"
                for name in audio_names:
                    target = safe_zip_output_path(audio_dir, name)
                    if target is None:
                        continue
                    target.parent.mkdir(parents=True, exist_ok=True)
                    with zf.open(name) as source, target.open("wb") as dest:
                        shutil.copyfileobj(source, dest)
                    converted = convert_wma_to_mp3(target, ffmpeg_path)
                    web_target = converted["path"] if converted and converted.get("path") else target
                    info["extractedAudio"].append({
                        "source": name,
                        "path": rel(web_target, project_root),
                        "bytes": web_target.stat().st_size,
                        "originalPath": rel(target, project_root) if web_target != target else None,
                        "conversionError": converted.get("error") if converted and converted.get("error") else None,
                    })
        info["entries"] = audio_names[:80]
        info["audioEntries"] = len(audio_names)
    except Exception as exc:
        info["error"] = str(exc)
    return info


def natural_page_key(path: Path) -> tuple[int, str]:
    match = re.search(r"-(\d+)\.png$", path.name, re.IGNORECASE)
    if match:
        return (int(match.group(1)), path.name)
    return (10**9, path.name)


def write_pages_outputs(book_no: str, pages: list[dict], out_dir: Path, project_root: Path, method: str) -> tuple[str, str]:
    stem = f"cambridge-ielts-{book_no}"
    markdown_path = out_dir / "text-pages" / f"{stem}.raw.md"
    json_path = out_dir / "page-json" / f"{stem}.pages.json"
    markdown = [
        f"# Cambridge IELTS {book_no} raw text",
        "",
        f"Extraction method: {method}. This is a local working draft. Check all question numbers, options, and answer keys before using it as a mock test.",
        "",
    ]
    for item in pages:
        markdown.append(f"## Page {item['page']}")
        markdown.append("")
        markdown.append(str(item.get("text") or "").strip())
        markdown.append("")
    safe_write_text(markdown_path, "\n".join(markdown))
    safe_write_text(json_path, json.dumps({"book": book_no, "method": method, "pages": pages}, ensure_ascii=False, indent=2))
    return rel(markdown_path, project_root), rel(json_path, project_root)


def ocr_pdf(
    pdf_path: Path,
    out_dir: Path,
    project_root: Path,
    book_no: str,
    tesseract_path: str | None,
    pdftoppm_path: str | None,
    dpi: int,
    force: bool,
) -> dict:
    result = {
        "status": "needs_ocr",
        "textMarkdown": None,
        "pagesJson": None,
        "ocrChars": 0,
        "ocrPagesWithText": 0,
        "ocrError": None,
    }

    stem = f"cambridge-ielts-{book_no}"
    cached_json = out_dir / "page-json" / f"{stem}.pages.json"
    cached_md = out_dir / "text-pages" / f"{stem}.raw.md"
    if not force and cached_json.exists() and cached_md.exists():
        try:
            payload = json.loads(cached_json.read_text(encoding="utf-8"))
            pages = payload.get("pages", [])
            total_chars = sum(len(str(page.get("text") or "")) for page in pages)
            result.update({
                "status": "ocr_extracted" if total_chars else "ocr_no_text",
                "textMarkdown": rel(cached_md, project_root),
                "pagesJson": rel(cached_json, project_root),
                "ocrChars": total_chars,
                "ocrPagesWithText": sum(1 for page in pages if str(page.get("text") or "").strip()),
            })
            return result
        except Exception:
            pass

    if not tesseract_path or not pdftoppm_path:
        result["ocrError"] = "tesseract or pdftoppm not found"
        return result

    render_dir = out_dir / "ocr-images" / stem
    if render_dir.exists():
        shutil.rmtree(render_dir)
    render_dir.mkdir(parents=True, exist_ok=True)
    prefix = render_dir / "page"
    render = subprocess.run(
        [pdftoppm_path, "-r", str(dpi), "-png", str(pdf_path), str(prefix)],
        text=True,
        capture_output=True,
    )
    if render.returncode != 0:
        result["ocrError"] = render.stderr.strip() or "pdftoppm render failed"
        return result

    pages = []
    for image_path in sorted(render_dir.glob("page-*.png"), key=natural_page_key):
        page_no = natural_page_key(image_path)[0]
        ocr = subprocess.run(
            [tesseract_path, str(image_path), "stdout", "-l", "eng", "--psm", "3"],
            text=True,
            encoding="utf-8",
            errors="replace",
            capture_output=True,
        )
        text = ocr.stdout.replace("\f", "").strip() if ocr.returncode == 0 else ""
        pages.append({
            "page": page_no,
            "text": text,
            "ocrError": None if ocr.returncode == 0 else (ocr.stderr.strip() or "tesseract failed"),
        })
        try:
            image_path.unlink()
        except OSError:
            pass
    try:
        render_dir.rmdir()
    except OSError:
        pass

    text_markdown, pages_json = write_pages_outputs(book_no, pages, out_dir, project_root, "tesseract_ocr")
    total_chars = sum(len(page["text"]) for page in pages)
    result.update({
        "status": "ocr_extracted" if total_chars else "ocr_no_text",
        "textMarkdown": text_markdown,
        "pagesJson": pages_json,
        "ocrChars": total_chars,
        "ocrPagesWithText": sum(1 for page in pages if page["text"]),
    })
    return result


def extract_pdf(
    pdf_path: Path,
    out_dir: Path,
    project_root: Path,
    min_avg_chars: int,
    use_ocr: bool,
    tesseract_path: str | None,
    pdftoppm_path: str | None,
    ocr_dpi: int,
    force_ocr: bool,
) -> dict:
    pdfplumber = import_pdfplumber()
    book_match = PDF_RE.search(pdf_path.name)
    book_no = book_match.group(1) if book_match else "unknown"
    result = {
        "book": book_no,
        "pdf": rel(pdf_path, project_root),
        "pdfBytes": pdf_path.stat().st_size,
        "pages": 0,
        "avgCharsFirstPages": 0,
        "status": "unknown",
        "textMarkdown": None,
        "pagesJson": None,
        "ocrChars": 0,
        "ocrPagesWithText": 0,
        "ocrError": None,
        "error": None,
    }

    try:
        pages = []
        with pdfplumber.open(pdf_path) as doc:
            result["pages"] = len(doc.pages)
            first_char_count = 0
            first_checked = min(8, len(doc.pages))
            for idx, page in enumerate(doc.pages, start=1):
                text = page.extract_text() or ""
                if idx <= first_checked:
                    first_char_count += len(text)
                pages.append({"page": idx, "text": text})
        avg = round(first_char_count / max(1, first_checked))
        result["avgCharsFirstPages"] = avg
        if avg < min_avg_chars:
            if use_ocr:
                ocr_result = ocr_pdf(pdf_path, out_dir, project_root, book_no, tesseract_path, pdftoppm_path, ocr_dpi, force_ocr)
                result.update(ocr_result)
            else:
                result["status"] = "needs_ocr"
            return result

        text_markdown, pages_json = write_pages_outputs(book_no, pages, out_dir, project_root, "pdfplumber_text")
        result["status"] = "text_extracted"
        result["textMarkdown"] = text_markdown
        result["pagesJson"] = pages_json
    except Exception as exc:
        result["status"] = "error"
        result["error"] = str(exc)
    return result


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


def split_into_tests(items: list, count: int = 4) -> list[list]:
    if not items:
        return [[] for _ in range(count)]
    size = max(1, (len(items) + count - 1) // count)
    groups = [items[index * size:(index + 1) * size] for index in range(count)]
    while len(groups) < count:
        groups.append([])
    return groups[:count]


def build_reading_tests(book: dict, generated_dir: Path, project_root: Path) -> list[dict]:
    extraction = book.get("extraction") or {}
    book_no = book["book"]
    page_chunks: list[list[dict]] = []
    if extraction.get("pagesJson"):
        pages_path = project_root / extraction["pagesJson"]
        try:
            pages_payload = json.loads(pages_path.read_text(encoding="utf-8"))
            page_chunks = split_into_tests(pages_payload.get("pages", []), 4)
        except Exception:
            page_chunks = []
    if not page_chunks:
        page_chunks = [[] for _ in range(4)]

    tests = []
    for test_no, pages in enumerate(page_chunks, start=1):
        page_numbers = [str(page.get("page")) for page in pages if page.get("page")]
        text_blocks = [str(page.get("text") or "").strip() for page in pages if str(page.get("text") or "").strip()]
        if text_blocks:
            passage = text_blocks
            status_note = "auto-extracted text draft"
        elif extraction.get("status") == "needs_ocr":
            passage = [f"Cambridge IELTS {int(book_no)} Reading Test {test_no} needs OCR before passage text can be filled."]
            status_note = "needs OCR"
        else:
            passage = [f"Cambridge IELTS {int(book_no)} Reading Test {test_no} draft placeholder."]
            status_note = "draft placeholder"
        tests.append({
            "mode": "reading",
            "id": f"cambridge-{book_no}-reading-test-{test_no}",
            "title": f"Cambridge IELTS {int(book_no)} Reading Test {test_no}",
            "source": f"Local Cambridge IELTS {int(book_no)} PDF ({status_note})",
            "durationSec": 3600,
            "passageTitle": f"Cambridge IELTS {int(book_no)} Reading Test {test_no}",
            "passage": passage,
            "questions": question_shells("R", 40),
            "sourcePages": page_numbers,
            "pdf": book.get("pdf"),
            "draftStatus": extraction.get("status", "no_pdf"),
        })
    return tests


def build_listening_tests(book: dict) -> list[dict]:
    book_no = book["book"]
    listening = book.get("listening") or {}
    extracted = listening.get("extractedAudio") or []
    groups = split_into_tests(extracted, 4)
    tests = []
    for test_no, tracks in enumerate(groups, start=1):
        audio_tracks = [
            {
                "label": f"Track {idx + 1}",
                "url": track["path"],
                "source": track.get("source", ""),
            }
            for idx, track in enumerate(tracks)
        ]
        tests.append({
            "mode": "listening",
            "id": f"cambridge-{book_no}-listening-test-{test_no}",
            "title": f"Cambridge IELTS {int(book_no)} Listening Test {test_no}",
            "source": f"Local Cambridge IELTS {int(book_no)} listening audio",
            "durationSec": 1800,
            "audioUrl": audio_tracks[0]["url"] if audio_tracks else "",
            "audioTracks": audio_tracks,
            "questions": question_shells("L", 40),
            "officialLinks": [],
            "draftStatus": "audio_extracted" if audio_tracks else "no_audio",
        })
    return tests


def build_writing_tests(book: dict) -> list[dict]:
    book_no = book["book"]
    return [
        {
            "mode": "writing",
            "id": f"cambridge-{book_no}-writing-test-{test_no}",
            "title": f"Cambridge IELTS {int(book_no)} Writing Test {test_no}",
            "source": f"Local Cambridge IELTS {int(book_no)} PDF draft",
            "durationSec": 3600,
            "task1": {
                "title": "Task 1",
                "instruction": f"Fill from Cambridge IELTS {int(book_no)} Writing Test {test_no} Task 1 after checking the PDF/OCR draft.",
                "data": [],
            },
            "task2": {
                "title": "Task 2",
                "instruction": f"Fill from Cambridge IELTS {int(book_no)} Writing Test {test_no} Task 2 after checking the PDF/OCR draft.",
            },
            "pdf": book.get("pdf"),
            "draftStatus": "prompt_placeholder",
        }
        for test_no in range(1, 5)
    ]


def build_test_bank(books: list[dict], project_root: Path) -> dict:
    tests = []
    for book in books:
        if book.get("pdf"):
            tests.extend(build_reading_tests(book, project_root / "data" / "generated", project_root))
            tests.extend(build_writing_tests(book))
        if book.get("listeningZip") or (book.get("listening") or {}).get("extractedAudio"):
            tests.extend(build_listening_tests(book))
    summary = {
        "tests": len(tests),
        "reading": sum(1 for test in tests if test["mode"] == "reading"),
        "listening": sum(1 for test in tests if test["mode"] == "listening"),
        "writing": sum(1 for test in tests if test["mode"] == "writing"),
        "audioTracks": sum(len(test.get("audioTracks", [])) for test in tests),
    }
    return {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "summary": summary,
        "tests": tests,
    }


def build_index(
    project_root: Path,
    min_avg_chars: int,
    extract_audio: bool,
    ffmpeg_path: str | None,
    use_ocr: bool,
    tesseract_path: str | None,
    pdftoppm_path: str | None,
    ocr_dpi: int,
    force_ocr: bool,
    only_books: set[str] | None,
) -> dict:
    data_dir = project_root / "data"
    generated_dir = data_dir / "generated"
    reports_dir = generated_dir / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)

    pdfs = {PDF_RE.search(path.name).group(1): path for path in data_dir.glob("Cambridge-IELTS-*.pdf") if PDF_RE.search(path.name)}
    zips = {ZIP_RE.search(path.name).group(1): path for path in data_dir.glob("Cambridge-IELTS---Listening-*.zip") if ZIP_RE.search(path.name)}
    book_numbers = sorted(set(pdfs) | set(zips), key=int)
    if only_books:
        book_numbers = [book_no for book_no in book_numbers if book_no in only_books]
    books = []

    for book_no in book_numbers:
        item = {
            "book": book_no,
            "title": f"Cambridge IELTS {int(book_no)}",
            "pdf": None,
            "listeningZip": None,
            "listening": None,
            "extraction": None,
        }
        if book_no in pdfs:
            item["extraction"] = extract_pdf(
                pdfs[book_no],
                generated_dir,
                project_root,
                min_avg_chars,
                use_ocr,
                tesseract_path,
                pdftoppm_path,
                ocr_dpi,
                force_ocr,
            )
            item["pdf"] = item["extraction"]["pdf"]
        if book_no in zips:
            zip_info = scan_zip(zips[book_no], generated_dir, project_root, extract_audio, ffmpeg_path)
            zip_info["path"] = rel(zips[book_no], project_root)
            item["listeningZip"] = zip_info["path"]
            item["listening"] = zip_info
        books.append(item)

    summary = {
        "pdfs": len(pdfs),
        "listeningZips": len(zips),
        "textExtracted": sum(1 for book in books if (book.get("extraction") or {}).get("status") == "text_extracted"),
        "needsOcr": sum(1 for book in books if (book.get("extraction") or {}).get("status") == "needs_ocr"),
        "ocrExtracted": sum(1 for book in books if (book.get("extraction") or {}).get("status") == "ocr_extracted"),
        "errors": sum(1 for book in books if (book.get("extraction") or {}).get("status") == "error"),
        "audioTracks": sum((book.get("listening") or {}).get("audioEntries", 0) for book in books),
        "extractedAudioTracks": sum(len((book.get("listening") or {}).get("extractedAudio", [])) for book in books),
    }
    index = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "summary": summary,
        "books": books,
    }

    safe_write_text(reports_dir / "cambridge-resource-manifest.json", json.dumps(index, ensure_ascii=False, indent=2))
    test_bank = build_test_bank(books, project_root)
    apply_canonical_reading_answers(test_bank, project_root)
    apply_canonical_reading_calibrations(test_bank, project_root)
    safe_write_text(reports_dir / "cambridge-test-bank.json", json.dumps(test_bank, ensure_ascii=False, indent=2))
    js = "window.CAMBRIDGE_RESOURCE_INDEX = " + json.dumps(index, ensure_ascii=False, indent=2) + ";\n"
    safe_write_text(data_dir / "cambridge-resource-index.js", js)
    test_bank_js = "window.CAMBRIDGE_TEST_BANK = " + json.dumps(test_bank, ensure_ascii=False, indent=2) + ";\n"
    safe_write_text(data_dir / "cambridge-test-bank.js", test_bank_js)
    return index


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert local Cambridge IELTS PDF/audio resources into a web index and raw text drafts.")
    parser.add_argument("--project", type=Path, default=Path(__file__).resolve().parents[1], help="IELTS-Mock-Loop project root")
    parser.add_argument("--min-avg-chars", type=int, default=300, help="Average chars in first pages required to treat a PDF as text-based")
    parser.add_argument("--no-extract-audio", action="store_true", help="Only index listening ZIPs; do not extract playable audio files")
    parser.add_argument("--ffmpeg", default=None, help="Path to ffmpeg.exe for WMA to MP3 conversion")
    parser.add_argument("--ocr", action="store_true", help="Run Tesseract OCR for scanned PDFs")
    parser.add_argument("--force-ocr", action="store_true", help="Re-run OCR even if cached OCR page JSON exists")
    parser.add_argument("--tesseract", default=None, help="Path to tesseract.exe")
    parser.add_argument("--pdftoppm", default=None, help="Path to pdftoppm.exe")
    parser.add_argument("--ocr-dpi", type=int, default=200, help="DPI for rendering scanned PDF pages before OCR")
    parser.add_argument("--books", default="", help="Comma-separated Cambridge book numbers to process, e.g. 05,06")
    args = parser.parse_args()

    project_root = args.project.resolve()
    ffmpeg_path = resolve_tool(args.ffmpeg, ["ffmpeg.exe", "ffmpeg"])
    tesseract_path = resolve_tool(args.tesseract, ["tesseract.exe", "tesseract"])
    pdftoppm_path = resolve_tool(args.pdftoppm, ["pdftoppm.exe", "pdftoppm"])
    only_books = {book.strip().zfill(2) for book in args.books.split(",") if book.strip()} or None
    index = build_index(
        project_root,
        args.min_avg_chars,
        not args.no_extract_audio,
        ffmpeg_path,
        args.ocr,
        tesseract_path,
        pdftoppm_path,
        args.ocr_dpi,
        args.force_ocr,
        only_books,
    )
    summary = index["summary"]
    test_bank_path = project_root / "data" / "generated" / "reports" / "cambridge-test-bank.json"
    test_bank = json.loads(test_bank_path.read_text(encoding="utf-8")) if test_bank_path.exists() else {"summary": {}}
    test_summary = test_bank.get("summary", {})
    print(f"project={project_root}")
    print(
        f"pdfs={summary['pdfs']} listening_zips={summary['listeningZips']} "
        f"text_extracted={summary['textExtracted']} ocr_extracted={summary['ocrExtracted']} needs_ocr={summary['needsOcr']} errors={summary['errors']} "
        f"audio_tracks={summary['audioTracks']} extracted_audio_tracks={summary['extractedAudioTracks']} "
        f"generated_tests={test_summary.get('tests', 0)}"
    )
    for book in index["books"]:
        extraction = book.get("extraction") or {}
        listening = book.get("listening") or {}
        print(
            f"{book['title']}: pdf={bool(book.get('pdf'))} "
            f"audio_entries={listening.get('audioEntries', 0)} extracted_audio={len(listening.get('extractedAudio', []))} "
            f"status={extraction.get('status', 'no_pdf')} "
            f"pages={extraction.get('pages', '-')}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
