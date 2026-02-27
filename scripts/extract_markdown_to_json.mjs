#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_KEYWORDS = [
  'objective',
  'outcome',
  'activity',
  'assessment',
  'resource',
  'session',
  'content',
];

function parseArgs(argv) {
  const args = {
    input: '',
    output: '',
    include: [],
    keywords: [...DEFAULT_KEYWORDS],
  };

  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--input') {
      args.input = argv[++index] ?? '';
    } else if (token === '--output') {
      args.output = argv[++index] ?? '';
    } else if (token === '--include') {
      args.include.push(argv[++index] ?? '');
    } else if (token === '--keywords') {
      const remainder = argv.slice(index + 1).filter((value) => !value.startsWith('--'));
      if (remainder.length > 0) {
        args.keywords = remainder.map((value) => value.toLowerCase());
      }
      break;
    }
  }

  if (!args.input || !args.output) {
    throw new Error('Usage: node scripts/extract_markdown_to_json.mjs --input <path> --output <path> [--include <glob>]');
  }

  return args;
}

function normalizePath(inputPath) {
  return inputPath.replaceAll('\\', '/');
}

function globToRegExp(globPattern) {
  const normalized = normalizePath(globPattern);
  const escaped = normalized.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const withStars = escaped
    .replace(/\*\*/g, '::DOUBLE_STAR::')
    .replace(/\*/g, '[^/]*')
    .replace(/::DOUBLE_STAR::/g, '.*');
  return new RegExp(`^${withStars}$`, 'i');
}

async function walkDirectory(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDirectory(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function sanitizeHeading(line) {
  let heading = line.trim().replace(/^#{1,6}\s+/, '').trim();
  heading = heading.replace(/!\[[^\]]*\]\([^)]*\)/g, '').trim();
  heading = heading.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  heading = heading.replace(/[*_`~]/g, '').trim();
  return heading || 'Section';
}

function cleanLine(line) {
  let text = line.replace(/\r/g, '');
  const trimmed = text.trim();

  if (/^-{3,}$/.test(trimmed)) {
    return '';
  }

  const isSeparator = /^\|?\s*:?[-]{3,}:?\s*(\|\s*:?[-]{3,}:?\s*)+\|?\s*$/.test(trimmed);
  if (isSeparator) {
    return '';
  }

  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  text = text.replace(/!\[[^\]]*\]\((?:[^)(]+|\([^)(]*\))*\)/g, ' ');
  text = text.replace(/\[([^\]]+)\]\((?:[^)(]+|\([^)(]*\))*\)/g, '$1');

  const cleanedTrimmed = text.trim();
  if (cleanedTrimmed.startsWith('|')) {
    let row = cleanedTrimmed;
    if (row.startsWith('|')) {
      row = row.slice(1);
    }
    if (row.endsWith('|')) {
      row = row.slice(0, -1);
    }

    const parts = row
      .split('|')
      .map((part) => part.replace(/\u00A0/g, ' ').trim())
      .filter(Boolean);
    text = parts.join(' | ');
  }

  text = text.replace(/!\[[^\]]*\]\((?:[^)(]+|\([^)(]*\))*\)/g, ' ');
  text = text.replace(/\[([^\]]+)\]\((?:[^)(]+|\([^)(]*\))*\)/g, '$1');

  text = text.replace(/\s\|\s---+\s(?=\||$)/g, ' | ');
  text = text.replace(/(^|\s)---+(?=\s|$)/g, ' ');
  text = text.replace(/\|\s*---+\s*\|/g, ' | ');

  text = text.replace(/^\s*[-*+]\s+/, '• ');
  text = text.replace(/^\s*\d+\.\s+/, '• ');

  text = text.replace(/\\([\\_*`|\[\]])/g, '$1');
  text = text.replace(/\\{2,}/g, '\\');
  text = text.replace(/\s{0,1}#{1,6}\s*/g, ' ');
  text = text.replace(/[*_`~]/g, '');
  text = text.replace(/\s*\|\s*/g, ' | ');
  text = text.replace(/\s*\|\s*\|+/g, ' | ');
  text = text.replace(/\s*\|\s*$/g, '');
  text = text.replace(/^\s*\|\s*/g, '');
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

function buildSections(markdownText) {
  const sections = [];
  let currentHeading = 'Document';
  let buffer = [];

  const flush = () => {
    const text = buffer.filter(Boolean).join('\n').trim();
    if (text) {
      sections.push({ heading: currentHeading, text });
    }
    buffer = [];
  };

  const lines = markdownText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  for (const rawLine of lines) {
    if (/^#{1,6}\s+/.test(rawLine.trim())) {
      flush();
      currentHeading = sanitizeHeading(rawLine);
      continue;
    }

    const cleaned = cleanLine(rawLine);
    if (cleaned) {
      buffer.push(cleaned);
    }
  }

  flush();
  return sections;
}

function buildRawText(sections) {
  return sections
    .map((section) => `${section.heading}\n${section.text}`.trim())
    .filter(Boolean)
    .join('\n\n');
}

function extractKeywordHits(lines, keywords, window = 2) {
  const lowered = lines.map((line) => line.toLowerCase());
  const hits = Object.fromEntries(keywords.map((keyword) => [keyword, []]));

  lowered.forEach((line, index) => {
    keywords.forEach((keyword) => {
      if (!line.includes(keyword)) {
        return;
      }
      const start = Math.max(0, index - window);
      const end = Math.min(lines.length, index + window + 1);
      const snippet = lines.slice(start, end).join(' ').replace(/\s+/g, ' ').trim();
      if (snippet && !hits[keyword].includes(snippet)) {
        hits[keyword].push(snippet);
      }
    });
  });

  return Object.fromEntries(Object.entries(hits).filter(([, value]) => value.length > 0));
}

function extractUnitStandardId(relativePath) {
  const match = relativePath.match(/\b(\d{5,6})\b/);
  return match ? match[1] : null;
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function main() {
  const args = parseArgs(process.argv);
  const inputRoot = path.resolve(args.input);
  const outputRoot = path.resolve(args.output);

  const includePatterns = args.include.length > 0 ? args.include : ['**/*.md'];
  const includeRegexes = includePatterns.map((pattern) => globToRegExp(pattern));

  const allFiles = await walkDirectory(inputRoot);
  const markdownFiles = allFiles.filter((filePath) => {
    if (path.extname(filePath).toLowerCase() !== '.md') {
      return false;
    }
    const relative = normalizePath(path.relative(inputRoot, filePath));
    return includeRegexes.some((regex) => regex.test(relative));
  });

  if (markdownFiles.length === 0) {
    throw new Error('No markdown files found for include patterns.');
  }

  await ensureDirectory(outputRoot);

  const indexFiles = [];
  for (const filePath of markdownFiles.sort()) {
    const sourcePath = normalizePath(path.relative(inputRoot, filePath));
    const fileName = path.basename(filePath);
    const markdownText = await fs.readFile(filePath, 'utf-8');

    const sections = buildSections(markdownText);
    const rawText = buildRawText(sections);
    const lines = rawText.split('\n').map((line) => line.trim()).filter(Boolean);
    const wordCount = rawText.length > 0 ? rawText.split(/\s+/).filter(Boolean).length : 0;

    const payload = {
      source_path: sourcePath,
      file_name: fileName,
      unit_standard_id: extractUnitStandardId(sourcePath),
      paragraph_count: lines.length,
      word_count: wordCount,
      sections,
      keyword_hits: extractKeywordHits(lines, args.keywords.map((keyword) => keyword.toLowerCase())),
      raw_text: rawText,
    };

    const outputFileName = `${sourcePath.replaceAll('/', '__')}.json`;
    const outputPath = path.join(outputRoot, outputFileName);
    await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');

    indexFiles.push({
      source_path: sourcePath,
      unit_standard_id: payload.unit_standard_id,
      word_count: payload.word_count,
      paragraph_count: payload.paragraph_count,
    });
  }

  const indexPayload = {
    total_files: indexFiles.length,
    files: indexFiles.sort((left, right) => left.source_path.localeCompare(right.source_path)),
  };

  await fs.writeFile(path.join(outputRoot, 'index.json'), `${JSON.stringify(indexPayload, null, 2)}\n`, 'utf-8');
  console.log(`Extracted ${indexFiles.length} markdown files to ${outputRoot}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
