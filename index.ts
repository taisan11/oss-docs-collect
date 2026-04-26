import { $ } from "bun";
import fs from "fs/promises";
import path from "path";
import {repos} from "./repos"

const state = await Bun.file("state.json").json();
for (const [name, repo] of Object.entries(repos)) {
  const repoDir = `tmp/${name.replace("/", "__")}`;
  const docsOutDir = `docs/${name.replace("/", "__")}`;

  await $`rm -rf ${repoDir}`;
  await $`git clone --depth=1 --branch ${repo.branch || "main"} ${repo.gitUrl} ${repoDir}`;

  const commit = (await $`git -C ${repoDir} rev-parse HEAD`).text().trim();

  if (state[name] === commit) {
    console.log(`skip ${name}`);
    continue;
  }

  // Clear output directory
  await $`rm -rf ${docsOutDir}`;
  await fs.mkdir(docsOutDir, { recursive: true });

  for (const p of repo.path) {
    const fullPath = path.join(repoDir, p);
    const files = await $`find ${fullPath} -type f \( -name "*.md" -o -name "*.mdx" \)`.text();

    for (const file of files.trim().split("\n")) {
      if (!file) continue;
      const content = await Bun.file(file).text();
      const relativePath = file.replace(repoDir + "/", "");

      // Create output file in docs/:name/ with same directory structure
      const outPath = path.join(docsOutDir, relativePath);
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await Bun.file(outPath).write(content);

      const out = {
        repo: name,
        path: relativePath,
        content,
        commit,
      };

      await fs.appendFile("dataset.jsonl", JSON.stringify(out) + "\n");
    }
  }

  state[name] = commit;
  // cleanup memory
  Bun.gc()
}

await Bun.file("state.json").write(JSON.stringify(state, null, 2));
