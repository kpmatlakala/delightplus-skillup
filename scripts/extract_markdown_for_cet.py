#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
from dataclasses import asdict, dataclass
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


@dataclass
class Section:
    heading: str
    text: str


@dataclass
class DocSummary:
    source_path: str
    file_name: str
    unit_standard_id: str | None
    paragraph_count: int
    word_count: int
    sections: list[Section]
    keyword_hits: dict[str, list[str]]
    raw_text: str


def extract_unit_standard_id(path_text: str) -> str | None:
    match = re.search(r"\b(\d{5,6})\b", path_text)
    return match.group(1) if match else None


def normalize_markdown(raw: str) -> str:
    text = raw.replace("\r\n", "\n").replace("\r", "\n").replace("\xa0", " ")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def markdown_to_sections(markdown_text: str) -> list[Section]:
    sections: list[Section] = []
    current_heading = "Document"
    buffer: list[str] = []

    def flush() -> None:
        nonlocal buffer
        text = "\n".join(line for line in buffer if line.strip()).strip()
        if text:
            sections.append(Section(heading=current_heading, text=text))
        buffer = []

    for line in markdown_text.split("\n"):
        heading_match = re.match(r"^(#{1,6})\s+(.+?)\s*$", line)
        if heading_match:
            flush()
            current_heading = heading_match.group(2).strip()
            continue

        cleaned_line = re.sub(r"\s+$", "", line)
        buffer.append(cleaned_line)

    flush()
    return sections


def build_keyword_hits(text_lines: list[str], keywords: list[str], window: int = 2) -> dict[str, list[str]]:
    lowered = [line.lower() for line in text_lines]
    hits: dict[str, list[str]] = {keyword: [] for keyword in keywords}

    for index, text in enumerate(lowered):
        for keyword in keywords:
            if keyword in text:
                start = max(0, index - window)
                end = min(len(text_lines), index + window + 1)
                snippet = " ".join(segment.strip() for segment in text_lines[start:end] if segment.strip())
                snippet = re.sub(r"\s+", " ", snippet).strip()
                if snippet and snippet not in hits[keyword]:
                    hits[keyword].append(snippet)

    return {key: value for key, value in hits.items() if value}


def summarize_markdown(file_path: Path, root: Path, keywords: list[str]) -> DocSummary:
    markdown_raw = file_path.read_text(encoding="utf-8")
    markdown_text = normalize_markdown(markdown_raw)
    sections = markdown_to_sections(markdown_text)

    lines = [line.strip() for line in markdown_text.split("\n") if line.strip()]
    word_count = len(re.findall(r"\b\w+\b", markdown_text))
    relative_source = file_path.relative_to(root).as_posix()

    return DocSummary(
        source_path=relative_source,
        file_name=file_path.name,
        unit_standard_id=extract_unit_standard_id(relative_source),
        paragraph_count=len(lines),
        word_count=word_count,
        sections=sections,
        keyword_hits=build_keyword_hits(lines, keywords),
        raw_text=markdown_text,
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Extract markdown files into CET JSON summaries")
    parser.add_argument("--input", required=True, help="Input root folder")
    parser.add_argument("--output", required=True, help="Output _extracted folder")
    parser.add_argument(
        "--include",
        action="append",
        default=[],
        help="Glob pattern relative to input root (repeatable)",
    )
    parser.add_argument("--keywords", nargs="*", default=DEFAULT_KEYWORDS, help="Keywords for contextual snippets")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    input_root = Path(args.input).resolve()
    output_root = Path(args.output).resolve()
    output_root.mkdir(parents=True, exist_ok=True)

    if not input_root.exists():
        raise SystemExit(f"Input folder does not exist: {input_root}")

    include_patterns = args.include or ["**/*.md"]
    selected_files: set[Path] = set()
    for pattern in include_patterns:
        for file_path in input_root.glob(pattern):
            if file_path.is_file() and file_path.suffix.lower() == ".md":
                selected_files.add(file_path)

    markdown_files = sorted(selected_files)
    if not markdown_files:
        raise SystemExit("No markdown files found for the include patterns.")

    summaries: list[DocSummary] = []
    for file_path in markdown_files:
        summaries.append(summarize_markdown(file_path, input_root, [keyword.lower() for keyword in args.keywords]))

    index_files: list[dict[str, object]] = []
    for summary in summaries:
        extracted_name = f"{summary.source_path.replace('/', '__')}.json"
        target_path = output_root / extracted_name
        target_path.write_text(json.dumps(asdict(summary), indent=2, ensure_ascii=False), encoding="utf-8")

        index_files.append(
            {
                "source_path": summary.source_path,
                "unit_standard_id": summary.unit_standard_id,
                "word_count": summary.word_count,
                "paragraph_count": summary.paragraph_count,
            }
        )

    index_payload = {
        "total_files": len(index_files),
        "files": sorted(index_files, key=lambda entry: str(entry["source_path"])),
    }
    (output_root / "index.json").write_text(json.dumps(index_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Extracted {len(index_files)} markdown files to {output_root}")


if __name__ == "__main__":
    main()
