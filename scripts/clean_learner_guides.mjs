import fs from "node:fs";
import path from "node:path";

const docsRoot = path.resolve("public/docs/SAQA_78965_CET_Training");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function stripMdDecorators(value) {
  return value
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanContent(content) {
  let text = content.replace(/\r\n/g, "\n");

  const headingMatch = text.match(/^#\s*Learner Guide Introduction\b/im) ?? text.match(/^Learner Guide Introduction\b/im);
  if (headingMatch?.index && headingMatch.index > 0) {
    text = text.slice(headingMatch.index);
  }

  text = text.replace(/!\[[^\]]*\]\([^\)]+\)/g, "");

  const lines = text.split("\n");
  const output = [];

  const normalizedLines = [];
  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index] ?? "";
    const trimmed = current.trim();

    if (trimmed.startsWith("|") && !trimmed.endsWith("|")) {
      let merged = trimmed;
      let cursor = index + 1;

      while (cursor < lines.length) {
        const next = (lines[cursor] ?? "").trim();
        if (!next) {
          cursor += 1;
          continue;
        }
        merged = `${merged} ${next}`;
        if (next.endsWith("|")) {
          break;
        }
        cursor += 1;
      }

      normalizedLines.push(merged);
      index = cursor;
      continue;
    }

    normalizedLines.push(current);
  }

  for (const line of normalizedLines) {
    const trimmed = line.trim();

    if (!trimmed) {
      output.push("");
      continue;
    }

    if (/^\*\*\s*\*\*$/g.test(trimmed)) {
      continue;
    }

    if (/^\|\s*$/i.test(trimmed)) {
      continue;
    }

    if (/^\|\s*:?-{2,}\s*(\|\s*:?-{2,}\s*)+\|?\s*$/i.test(trimmed) || /^\|\s*-{2,}\s*\|\s*$/i.test(trimmed)) {
      continue;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .split("|")
        .map((cell) => stripMdDecorators(cell))
        .filter(Boolean);

      if (cells.length === 0) {
        continue;
      }

      if (cells.length === 1) {
        output.push(cells[0]);
        continue;
      }

      const left = cells[0];
      const right = cells.slice(1).join(" ").trim();
      if (left && right) {
        output.push(`- **${left}**: ${right}`);
      } else if (right) {
        output.push(`- ${right}`);
      } else if (left) {
        output.push(left);
      }

      continue;
    }

    if (trimmed.endsWith("|") && !trimmed.startsWith("|")) {
      output.push(trimmed.replace(/\|\s*$/, "").trim());
      continue;
    }

    output.push(line);
  }

  return output
    .join("\n")
    .replace(/^\s*Learner Guide Introduction\s*$/im, "# Learner Guide Introduction")
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";
}

const allFiles = walk(docsRoot);
const learnerGuides = allFiles.filter((filePath) => /\b(learner guide|leaner guide)\.md$/i.test(filePath));

const changed = [];

for (const filePath of learnerGuides) {
  const before = fs.readFileSync(filePath, "utf8");
  const after = cleanContent(before);

  if (after !== before) {
    fs.writeFileSync(filePath, after, "utf8");
    changed.push(path.relative(process.cwd(), filePath).replaceAll("\\", "/"));
  }
}

console.log(`Processed ${learnerGuides.length} learner guide markdown files.`);
console.log(`Updated ${changed.length} files.`);
for (const filePath of changed) {
  console.log(` - ${filePath}`);
}
