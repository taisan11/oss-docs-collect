import { $ } from "bun";
import fs from "fs/promises";
import path from "path";
import { repos } from "./repos";

const state = await Bun.file("state.json").json() as Record<string, string>;
const githubToken = process.env.GITHUB_TOKEN;

function githubRepo(repo: { gitUrl: string }) {
  const match = repo.gitUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) return null;
  return { owner: match[1], name: match[2] };
}

async function getRemoteCommit(
  repo: { gitUrl: string; branch?: string },
): Promise<string | null> {
  const github = githubRepo(repo);
  if (!github) return null;

  const branch = repo.branch || "main";
  const url = `https://api.github.com/repos/${github.owner}/${github.name}/git/ref/heads/${encodeURIComponent(branch)}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
  };
  if (githubToken) headers.Authorization = `Bearer ${githubToken}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${github.owner}/${github.name}: ${await response.text()}`);
  }

  const data = await response.json() as {
    object?: { type?: string; sha?: string };
  };

  if (data.object?.type !== "commit" || !data.object.sha) {
    throw new Error(`GitHub API returned an unexpected ref for ${github.owner}/${github.name}:${branch}`);
  }

  return data.object.sha;
}

for (const [name, repo] of Object.entries(repos)) {
  const repoDir = `tmp/${name.replace("/", "__")}`;
  const docsOutDir = `docs/${name.replace("/", "__")}`;
  const remoteCommit = await getRemoteCommit(repo);

  if (remoteCommit && state[name] === remoteCommit) {
    console.log(`skip ${name}: ${remoteCommit}`);
    continue;
  }

  await $`rm -rf ${repoDir}`;
  await $`git clone --depth=1 --branch ${repo.branch || "main"} ${repo.gitUrl} ${repoDir}`;

  const commit = (await $`git -C ${repoDir} rev-parse HEAD`).text().trim();

  if (state[name] === commit) {
    console.log(`skip ${name}: ${commit}`);
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
    }
  }

  state[name] = commit;
  // cleanup memory
  Bun.gc();
}

await Bun.file("state.json").write(JSON.stringify(state, null, 2));
