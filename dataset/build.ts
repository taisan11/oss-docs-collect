import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { repos } from "../repos";

type DatasetRow = {
  id: string;
  repo: string;
  path: string;
  title: string;
  content: string;
  language: string;
  license: string;
  license_url?: string;
  source_url: string;
  github_url?: string;
  commit: string;
  collected_at: string;
};

const root = path.resolve(import.meta.dir, "..");
const outputDir = path.join(root, "dataset", "dist");
const docsDir = path.join(root, "docs");
const state = await Bun.file(path.join(root, "state.json")).json() as Record<string, string>;
const collectedAt = new Date().toISOString();

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

function titleFromMarkdown(content: string, filePath: string): string {
  const frontMatter = content.match(/^---\s*\n([\s\S]*?)\n---/);
  const frontTitle = frontMatter?.[1]?.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1];
  if (frontTitle) return frontTitle.trim();

  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  if (heading) return heading.trim();

  return path.basename(filePath, path.extname(filePath));
}

function githubUrl(repoName: string, filePath: string, commit: string): string | undefined {
  if (!repoName.includes("/")) return undefined;
  return `https://github.com/${repoName}/blob/${commit}/${filePath}`;
}

const rows: DatasetRow[] = [];

for (const [repoName, repo] of Object.entries(repos)) {
  const safeName = repoName.replace("/", "__");
  const repoDocsDir = path.join(docsDir, safeName);
  const commit = state[repoName];

  if (!commit) {
    console.warn(`skip ${repoName}: no commit in state.json`);
    continue;
  }

  const files = await Array.fromAsync(new Bun.Glob("**/*.{md,mdx}").scan({
    cwd: repoDocsDir,
    absolute: false,
  }));

  for (const relativePath of files) {
    const absolutePath = path.join(repoDocsDir, relativePath);
    const content = await Bun.file(absolutePath).text();
    const normalizedPath = relativePath.replaceAll(path.sep, "/");
    const id = `${repoName}:${normalizedPath}`;
    const sourceUrl = `https://${repoName.split("/")[1]}.invalid`;

    rows.push({
      id,
      repo: repoName,
      path: normalizedPath,
      title: titleFromMarkdown(content, normalizedPath),
      content,
      language: repo.lang,
      license: repo.license,
      ...(repo.licenseUrl ? { license_url: repo.licenseUrl } : {}),
      source_url: sourceUrl,
      ...(githubUrl(repoName, normalizedPath, commit) ? { github_url: githubUrl(repoName, normalizedPath, commit) } : {}),
      commit,
      collected_at: collectedAt,
    });
  }
}

rows.sort((a, b) => a.id.localeCompare(b.id));

const jsonl = rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : "");
await Bun.write(path.join(outputDir, "data.jsonl"), jsonl);

const manifest = {
  schema_version: 1,
  generated_at: collectedAt,
  documents: rows.length,
  repositories: new Set(rows.map((row) => row.repo)).size,
  sha256: crypto.createHash("sha256").update(jsonl).digest("hex"),
};
await Bun.write(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const datasetCard = `---
pretty_name: OSS Documentation Collection
language:
${[...new Set(rows.map((row) => row.language))].sort().map((lang) => `  - ${lang}`).join("\n")}
tags:
  - documentation
  - software-engineering
  - open-source
  - programming
task_categories:
  - text-retrieval
  - text-generation
---

# OSS Documentation Collection

A daily snapshot of selected open-source software documentation collected by [oss-docs-collect](https://github.com/taisan11/oss-docs-collect).

## Dataset

- Documents: ${rows.length}
- Repositories: ${manifest.repositories}
- Generated: ${collectedAt}
- Format: JSONL

## Schema

- `id`: stable document identifier
- `repo`: source repository
- `path`: source path
- `title`: extracted document title
- `content`: Markdown/MDX source
- `language`: configured document language
- `license`: source license
- `license_url`: license reference when configured
- `source_url`: source project URL
- `github_url`: exact source file at the collected commit when available
- `commit`: source repository commit
- `collected_at`: collection timestamp

## Licensing

This dataset contains documentation from multiple projects. **Each document retains the license declared for its source project.** Check the individual source license before redistribution or downstream use.
`;
await Bun.write(path.join(outputDir, "README.md"), datasetCard);

console.log(`built ${rows.length} documents from ${manifest.repositories} repositories`);
console.log(`sha256: ${manifest.sha256}`);
