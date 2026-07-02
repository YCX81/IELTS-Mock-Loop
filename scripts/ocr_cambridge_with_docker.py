from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


DEFAULT_IMAGE = "ccr-2vdh3abv-pub.cnc.bj.baidubce.com/paddlepaddle/paddleocr-vl:latest-nvidia-gpu-sm120"
DEFAULT_NEEDS_OCR = ["05", "06", "07", "08", "10", "11", "12", "13", "15", "16", "17", "18", "19", "21"]


def run(command: list[str], cwd: Path | None = None) -> None:
    print(" ".join(command), flush=True)
    completed = subprocess.run(command, cwd=str(cwd) if cwd else None)
    if completed.returncode != 0:
        raise SystemExit(completed.returncode)


def output(command: list[str]) -> str:
    completed = subprocess.run(command, text=True, encoding="utf-8", errors="replace", capture_output=True)
    if completed.returncode != 0:
        raise SystemExit(completed.stderr.strip() or completed.stdout.strip() or f"command failed: {command}")
    return completed.stdout


def find_pdftoppm(explicit: str | None) -> str:
    if explicit and Path(explicit).exists():
        return explicit
    found = shutil.which("pdftoppm")
    if found:
        return found
    raise SystemExit("pdftoppm not found; pass --pdftoppm")


def find_pdfinfo(pdftoppm: str, explicit: str | None) -> str | None:
    if explicit and Path(explicit).exists():
        return explicit
    found = shutil.which("pdfinfo")
    if found:
        return found
    sibling = Path(pdftoppm).with_name("pdfinfo.exe")
    return str(sibling) if sibling.exists() else None


def pdf_page_count(pdfinfo: str | None, pdf: Path) -> int | None:
    if not pdfinfo:
        return None
    text = output([pdfinfo, str(pdf)])
    match = re.search(r"^Pages:\s+(\d+)", text, re.MULTILINE)
    return int(match.group(1)) if match else None


def existing_paddle_output(output_json: Path) -> bool:
    if not output_json.exists():
        return False
    try:
        payload = json.loads(output_json.read_text(encoding="utf-8"))
        return payload.get("method") == "paddleocr_gpu" and bool(payload.get("pages"))
    except Exception:
        return False


def render_pdf(pdftoppm: str, pdfinfo: str | None, pdf: Path, image_dir: Path, dpi: int, force: bool) -> None:
    existing = list(image_dir.glob("page-*.png"))
    expected_pages = pdf_page_count(pdfinfo, pdf)
    if existing and not force:
        if expected_pages is None or len(existing) >= expected_pages:
            print(f"render skip existing {pdf.name}: {len(existing)} images", flush=True)
            return
        print(f"render incomplete {pdf.name}: {len(existing)}/{expected_pages}; rerender", flush=True)
    if image_dir.exists():
        shutil.rmtree(image_dir)
    image_dir.mkdir(parents=True, exist_ok=True)
    run([pdftoppm, "-r", str(dpi), "-png", str(pdf), str(image_dir / "page")])


def docker_path(path: Path, project_root: Path) -> str:
    rel = path.resolve().relative_to(project_root.resolve()).as_posix()
    return f"/project/{rel}"


def main() -> int:
    parser = argparse.ArgumentParser(description="OCR Cambridge IELTS scanned PDFs with PaddleOCR GPU Docker image.")
    parser.add_argument("--project", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--books", default=",".join(DEFAULT_NEEDS_OCR))
    parser.add_argument("--image", default=DEFAULT_IMAGE)
    parser.add_argument("--pdftoppm", default=None)
    parser.add_argument("--pdfinfo", default=None)
    parser.add_argument("--dpi", type=int, default=180)
    parser.add_argument("--force-render", action="store_true")
    parser.add_argument("--force-ocr", action="store_true")
    parser.add_argument("--cleanup-images", action="store_true")
    args = parser.parse_args()

    project_root = args.project.resolve()
    pdftoppm = find_pdftoppm(args.pdftoppm)
    pdfinfo = find_pdfinfo(pdftoppm, args.pdfinfo)
    scripts_dir = project_root / "scripts"
    if not (scripts_dir / "paddle_gpu_ocr_images.py").exists():
        raise SystemExit(f"missing {scripts_dir / 'paddle_gpu_ocr_images.py'}")

    books = [book.strip().zfill(2) for book in args.books.split(",") if book.strip()]
    generated = project_root / "data" / "generated"
    cache_dir = generated / "paddle-cache"
    cache_dir.mkdir(parents=True, exist_ok=True)

    for book in books:
        pdf = project_root / "data" / f"Cambridge-IELTS-{book}.pdf"
        if not pdf.exists():
            print(f"skip missing {pdf}", flush=True)
            continue
        image_dir = generated / "ocr-images" / f"cambridge-ielts-{book}"
        output_json = generated / "page-json" / f"cambridge-ielts-{book}.pages.json"
        output_md = generated / "text-pages" / f"cambridge-ielts-{book}.raw.md"
        if existing_paddle_output(output_json) and not args.force_ocr:
            print(f"book={book} skip existing paddleocr output", flush=True)
            continue

        print(f"book={book} render", flush=True)
        render_pdf(pdftoppm, pdfinfo, pdf, image_dir, args.dpi, args.force_render)

        print(f"book={book} docker_ocr", flush=True)
        command = [
            "docker",
            "run",
            "--rm",
            "--gpus",
            "all",
            "-e",
            "PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK=True",
            "-v",
            f"{project_root}:/project",
            "-v",
            f"{cache_dir}:/home/paddleocr/.paddlex",
            args.image,
            "python",
            "/project/scripts/paddle_gpu_ocr_images.py",
            "--book",
            book,
            "--input-dir",
            docker_path(image_dir, project_root),
            "--output-json",
            docker_path(output_json, project_root),
            "--output-md",
            docker_path(output_md, project_root),
        ]
        if args.cleanup_images:
            command.append("--cleanup")
        run(command)

    print("docker paddle ocr complete", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
