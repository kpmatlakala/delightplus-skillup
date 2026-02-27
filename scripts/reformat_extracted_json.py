#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


DEFAULT_KEYWORDS = [
    "objective",
    "outcome",
    "activity",
    "assessment",
    "resource",
    "session",
    "content",
]


def normalize_lines(raw_text: str) -> list[str]:
    text = raw_text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("\xa0", " ")
    text = text.replace("\t", " ")

    normalized: list[str] = []
    for line in text.split("\n"):
        cleaned = re.sub(r"\s+", " ", line).strip()
        if cleaned:
            normalized.append(cleaned)

    return normalized


def is_heading(line: str) -> bool:
    if len(line) > 120:
        return False

    if re.match(r"^(SESSION\s+\d+|SECTION\s+\d+|PART\s+\d+|CHAPTER\s+\d+)\b", line, flags=re.IGNORECASE):
        return True

    if re.match(r"^\d+(\.\d+)*\s+[A-Za-z]", line):
        return True

    if line.isupper() and any(ch.isalpha() for ch in line):
        return True

    heading_terms = (
        "learning outcomes",
        "assessment criteria",
        "purpose",
        "instructions",
        "assessment process",
        "candidate feedback report",
        "moderator's report",
        "assessment decision",
    )
    if line.lower() in heading_terms:
        return True

    return False


def build_sections(lines: list[str]) -> list[dict[str, str]]:
    sections: list[dict[str, str]] = []
    current_heading = "Document"
    buffer: list[str] = []

    def flush() -> None:
        nonlocal buffer
        if buffer:
            sections.append({"heading": current_heading, "text": "\n".join(buffer)})
            buffer = []

    for line in lines:
        if is_heading(line):
            flush()
            current_heading = line
        else:
            buffer.append(line)

    flush()
    return sections


def extract_keyword_hits(lines: list[str], keywords: list[str], window: int = 2) -> dict[str, list[str]]:
    hits: dict[str, list[str]] = {key: [] for key in keywords}
    lowered = [line.lower() for line in lines]

    for index, line in enumerate(lowered):
        for keyword in keywords:
            if keyword in line:
                start = max(0, index - window)
                end = min(len(lines), index + window + 1)
                snippet = " ".join(lines[start:end]).strip()
                if snippet and snippet not in hits[keyword]:
                    hits[keyword].append(snippet)

    return {key: value for key, value in hits.items() if value}


def reformat_file(path: Path, keywords: list[str]) -> bool:
    payload = json.loads(path.read_text(encoding="utf-8"))
    raw_text = payload.get("raw_text")
    if not isinstance(raw_text, str) or not raw_text.strip():
        return False

    lines = normalize_lines(raw_text)
    if not lines:
        return False

    sections = build_sections(lines)
    normalized_raw_text = "\n\n".join(lines)

    payload["paragraph_count"] = len(lines)
    payload["word_count"] = len(re.findall(r"\b\w+\b", " ".join(lines)))
    payload["sections"] = sections
    payload["keyword_hits"] = extract_keyword_hits(lines, keywords)
    payload["raw_text"] = normalized_raw_text

    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Reformat extracted JSON files using raw_text")
    parser.add_argument("--input", required=True, help="Folder containing extracted JSON files")
    parser.add_argument("--keywords", nargs="*", default=DEFAULT_KEYWORDS, help="Keywords for contextual snippets")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    input_dir = Path(args.input).resolve()

    if not input_dir.exists():
        raise SystemExit(f"Input folder does not exist: {input_dir}")

    files = sorted(path for path in input_dir.glob("*.json") if path.name != "index.json")
    if not files:
        raise SystemExit(f"No extracted JSON files found in: {input_dir}")

    reformatted_count = 0
    index_entries: list[dict[str, object]] = []
    for file_path in files:
        try:
            if reformat_file(file_path, [keyword.lower() for keyword in args.keywords]):
                reformatted_count += 1
            payload = json.loads(file_path.read_text(encoding="utf-8"))
            index_entries.append(
                {
                    "source_path": payload.get("source_path"),
                    "unit_standard_id": payload.get("unit_standard_id"),
                    "word_count": payload.get("word_count", 0),
                    "paragraph_count": payload.get("paragraph_count", 0),
                }
            )
        except Exception as error:
            print(f"[WARN] Skipped {file_path.name}: {error}")

    index_payload = {
        "total_files": len(index_entries),
        "files": index_entries,
    }
    (input_dir / "index.json").write_text(json.dumps(index_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Reformatted {reformatted_count} files in {input_dir}")


if __name__ == "__main__":
    main()
