#!/usr/bin/env python3
"""
Extract text from DOCX files and build fast JSON summaries for CET content mapping.

Usage:
  python scripts/extract_docx_for_cet.py \
    --input public/docs/SAQA_78965_CET_Training \
    --output public/docs/SAQA_78965_CET_Training/_extracted

Optional:
  --keywords objectives outcomes activity activities assessment resource session content
"""

from __future__ import annotations

import argparse
import json
import re
import zipfile
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET

from docx.document import Document as DocxDocument
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph

try:
    from docx import Document
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: python-docx\n"
        "Install with: pip install python-docx"
    ) from exc


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


@dataclass
class ContentItem:
    kind: str
    style: str
    text: str


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def clean_soft(text: str) -> str:
    return text.replace("\xa0", " ").replace("\r\n", "\n").replace("\r", "\n")


def extract_unit_standard_id(path: Path) -> str | None:
    match = re.search(r"\b(\d{5,6})\b", path.as_posix())
    return match.group(1) if match else None


def iter_block_items(doc: DocxDocument) -> Iterable[Paragraph | Table]:
    parent = doc.element.body
    for child in parent.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, doc)
        elif isinstance(child, CT_Tbl):
            yield Table(child, doc)


def serialize_table(table: Table) -> str:
    rows: list[str] = []
    for row in table.rows:
        cells = [clean(cell.text) for cell in row.cells if clean(cell.text)]
        if cells:
            rows.append(" | ".join(cells))
    return "\n".join(rows)


def extract_raw_openxml_text(docx_path: Path) -> str:
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    xml_targets: list[str] = ["word/document.xml"]

    with zipfile.ZipFile(docx_path) as archive:
        headers = sorted(name for name in archive.namelist() if re.match(r"word/header\d+\.xml", name))
        footers = sorted(name for name in archive.namelist() if re.match(r"word/footer\d+\.xml", name))
        xml_targets.extend(headers)
        xml_targets.extend(footers)

        chunks: list[str] = []
        for xml_path in xml_targets:
            if xml_path not in archive.namelist():
                continue

            xml_bytes = archive.read(xml_path)
            root = ET.fromstring(xml_bytes)

            parts: list[str] = []
            for element in root.iter():
                tag = element.tag.rsplit("}", 1)[-1]

                if tag == "p":
                    parts.append("\n\n")
                elif tag == "tr":
                    parts.append("\n")
                elif tag == "tc":
                    parts.append("\t")
                elif tag == "tab":
                    parts.append("\t")
                elif tag in {"br", "cr"}:
                    parts.append("\n")
                elif tag == "t":
                    value = element.text or ""
                    if value:
                        parts.append(value)

            text = "".join(parts)
            text = clean_soft(text)
            text = re.sub(r"\n{3,}", "\n\n", text)
            text = re.sub(r"\t{2,}", "\t", text)
            text = text.strip()
            if text:
                chunks.append(text)

    return "\n\n---\n\n".join(chunks)


def iter_non_empty_content(doc: Document) -> Iterable[ContentItem]:
    for block in iter_block_items(doc):
        if isinstance(block, Paragraph):
            text = clean(block.text)
            if text:
                style_name = block.style.name if block.style else ""
                yield ContentItem(kind="paragraph", style=style_name, text=text)
        elif isinstance(block, Table):
            text = serialize_table(block)
            if text:
                yield ContentItem(kind="table", style="Table", text=text)


def is_heading(style_name: str, text: str) -> bool:
    if style_name.lower().startswith("heading"):
        return True

    normalized = text.strip()
    upper_word_count = len(normalized.split())
    if (
        len(normalized) <= 90
        and upper_word_count >= 2
        and normalized.isupper()
        and any(character.isalpha() for character in normalized)
    ):
        return True

    if re.match(r"^(SESSION\s+\d+|Learning Outcomes|Assessment Criteria|Purpose|Outcomes)\b", normalized, flags=re.IGNORECASE):
        return True

    return False


def build_sections(items: list[ContentItem]) -> list[Section]:
    sections: list[Section] = []
    current_heading = "Document"
    buffer: list[str] = []

    def flush() -> None:
        nonlocal buffer
        if buffer:
            sections.append(Section(heading=current_heading, text="\n".join(buffer)))
            buffer = []

    for item in items:
        if item.kind == "paragraph" and is_heading(item.style, item.text):
            flush()
            current_heading = item.text
        else:
            buffer.append(item.text)

    flush()
    return sections


def extract_keyword_hits(paragraph_texts: list[str], keywords: list[str], window: int = 2) -> dict[str, list[str]]:
    hits: dict[str, list[str]] = {kw: [] for kw in keywords}
    lowered = [p.lower() for p in paragraph_texts]

    for index, para in enumerate(lowered):
        for keyword in keywords:
            if keyword in para:
                start = max(0, index - window)
                end = min(len(paragraph_texts), index + window + 1)
                snippet = " ".join(paragraph_texts[start:end])
                snippet = clean(snippet)
                if snippet and snippet not in hits[keyword]:
                    hits[keyword].append(snippet)

    return {k: v for k, v in hits.items() if v}


def summarize_docx(file_path: Path, root: Path, keywords: list[str]) -> DocSummary:
    doc = Document(str(file_path))
    items = list(iter_non_empty_content(doc))
    texts = [item.text for item in items]
    sections = build_sections(items)
    raw_text = extract_raw_openxml_text(file_path)

    return DocSummary(
        source_path=file_path.relative_to(root).as_posix(),
        file_name=file_path.name,
        unit_standard_id=extract_unit_standard_id(file_path),
        paragraph_count=len(texts),
        word_count=sum(len(t.split()) for t in texts),
        sections=sections,
        keyword_hits=extract_keyword_hits(texts, keywords),
        raw_text=raw_text,
    )


def write_outputs(summaries: list[DocSummary], output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    index = {
        "total_files": len(summaries),
        "files": [
            {
                "source_path": s.source_path,
                "unit_standard_id": s.unit_standard_id,
                "word_count": s.word_count,
                "paragraph_count": s.paragraph_count,
            }
            for s in summaries
        ],
    }

    (output_dir / "index.json").write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8")

    for summary in summaries:
        base_name = summary.source_path.replace("/", "__")
        output_path = output_dir / f"{base_name}.json"
        payload = asdict(summary)
        output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Extract and summarize DOCX files for CET content mapping")
    parser.add_argument("--input", required=True, help="Input root folder containing DOCX files")
    parser.add_argument("--output", required=True, help="Output folder for extracted JSON summaries")
    parser.add_argument("--keywords", nargs="*", default=DEFAULT_KEYWORDS, help="Keywords to extract contextual snippets")
    parser.add_argument("--unit", help="Optional unit standard filter, e.g., 14910")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    input_root = Path(args.input).resolve()
    output_dir = Path(args.output).resolve()

    if not input_root.exists():
        raise SystemExit(f"Input folder does not exist: {input_root}")

    docx_files = sorted(input_root.rglob("*.docx"))

    if args.unit:
        unit_token = str(args.unit)
        docx_files = [
            file_path
            for file_path in docx_files
            if f"US {unit_token}" in file_path.as_posix() or re.search(rf"\b{re.escape(unit_token)}\b", file_path.name)
        ]

    if not docx_files:
        raise SystemExit(f"No .docx files found under: {input_root}")

    summaries: list[DocSummary] = []
    for file_path in docx_files:
        try:
            summaries.append(summarize_docx(file_path, input_root, [k.lower() for k in args.keywords]))
        except Exception as error:  # pragma: no cover
            print(f"[WARN] Skipped {file_path}: {error}")

    write_outputs(summaries, output_dir)
    print(f"Extracted {len(summaries)} files to {output_dir}")


if __name__ == "__main__":
    main()
