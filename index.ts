import { $ } from "bun";
import fs from "fs/promises";
import path from "path";
import {repos} from "./repos"

const state = JSON.parse(await fs.readFile("state.json", "utf-8").catch(() => "{}"));
for (const [name, repo] of Object.entries(repos)) {
  const repoDir = `tmp/${name.replace("/", "__")}`;

  await $`rm -rf ${repoDir}`;
  await $`git clone --depth=1 --branch ${repo.branch || "main"} ${repo.gitUrl} ${repoDir}`;

  const commit = (await $`git -C ${repoDir} rev-parse HEAD`).text().trim();

  if (state[name] === commit) {
    console.log(`skip ${name}`);
    continue;
  }

  for (const p of repo.path) {
    const fullPath = path.join(repoDir, p);
    const files = await $`find ${fullPath} -type f \( -name "*.md" -o -name "*.mdx" \)`.text();

    for (const file of files.trim().split("\n")) {
      const content = await fs.readFile(file, "utf-8");

      const out = {
        repo: name,
        path: file.replace(repoDir + "/", ""),
        content,
        commit,
      };

      await fs.appendFile("dataset.jsonl", JSON.stringify(out) + "\n");
    }
  }

  state[name] = commit;
}

await fs.writeFile("state.json", JSON.stringify(state, null, 2));
