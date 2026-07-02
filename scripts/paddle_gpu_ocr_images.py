from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

from paddleocr import PaddleOCR


def natural_page_key(path: Path) -> tuple[int, str]:
    match = re.search(r"-(\d+)\.png$", path.name, re.IGNORECASE)
    if match:
        return (int(match.group(1)), path.name)
    return (10**9, path.name)


def safe_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def result_to_text(result) -> str:
    if not result:
        return ""
    item = result[0]
    if isinstance(item, dict):
        texts = item.get("rec_texts") or []
    else:
        texts = getattr(item, "rec_texts", None) or []
        if not texts and hasattr(item, "get"):
            texts = item.get("rec_texts") or []
    return "\n".join(str(text).strip() for text in texts if str(text).strip())


def main() -> int:
    parser = argparse.ArgumentParser(description="Run PaddleOCR GPU over rendered PDF page images.")
    parser.add_argument("--book", required=True)
    parser.add_argument("--input-dir", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-md", type=Path, required=True)
    parser.add_argument("--cleanup", action="store_true")
    args = parser.parse_args()

    images = sorted(args.input_dir.glob("page-*.png"), key=natural_page_key)
    if not images:
        raise SystemExit(f"no page images found in {args.input_dir}")

    ocr = PaddleOCR(
        lang="en",
        use_doc_orientation_classify=False,
        use_doc_unwarping=False,
        use_textline_orientation=False,
    )

    pages = []
    for index, image_path in enumerate(images, start=1):
        page_no = natural_page_key(image_path)[0]
        result = ocr.predict(str(image_path))
        text = result_to_text(result)
        pages.append({"page": page_no, "text": text, "engine": "paddleocr_gpu"})
        if index % 10 == 0 or index == len(images):
            print(f"book={args.book} pages_done={index}/{len(images)} chars={sum(len(page['text']) for page in pages)}", flush=True)

    payload = {"book": args.book, "method": "paddleocr_gpu", "pages": pages}
    safe_write_text(args.output_json, json.dumps(payload, ensure_ascii=False, indent=2))

    markdown = [
        f"# Cambridge IELTS {args.book} raw text",
        "",
        "Extraction method: paddleocr_gpu. This is a local working draft. Check all question numbers, options, and answer keys before using it as a mock test.",
        "",
    ]
    for page in pages:
        markdown.extend([f"## Page {page['page']}", "", page["text"].strip(), ""])
    safe_write_text(args.output_md, "\n".join(markdown))

    if args.cleanup:
        shutil.rmtree(args.input_dir, ignore_errors=True)

    print(
        f"book={args.book} complete pages={len(pages)} pages_with_text={sum(1 for page in pages if page['text'].strip())} chars={sum(len(page['text']) for page in pages)}",
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
