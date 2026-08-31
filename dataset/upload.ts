import { pathToFileURL } from "node:url";
import { createRepo, uploadFiles } from "@huggingface/hub";

type RepoDesignation = {
  type: "dataset";
  name: string;
};

const token = process.env.HF_TOKEN;
const repoId = process.env.HF_DATASET_REPO ?? "taisan11/oss-docs-collect";

if (!token) {
  throw new Error("HF_TOKEN is required");
}

const repo: RepoDesignation = {
  type: "dataset",
  name: repoId,
};

await createRepo({
  repo,
  accessToken: token,
  private: false,
});

const dist = new URL("./dist/", import.meta.url);

const result = await uploadFiles({
  repo,
  accessToken: token,
  commitTitle: `data: update ${new Date().toISOString().slice(0, 10)}`,
  files: [
    {
      path: "README.md",
      content: pathToFileURL(new URL("README.md", dist).pathname),
    },
    {
      path: "data/data.jsonl",
      content: pathToFileURL(new URL("data.jsonl", dist).pathname),
    },
    {
      path: "manifest.json",
      content: pathToFileURL(new URL("manifest.json", dist).pathname),
    },
  ],
});

console.log(result);
console.log(`uploaded dataset to https://huggingface.co/datasets/${repoId}`);
