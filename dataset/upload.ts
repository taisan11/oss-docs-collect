const token = process.env.HF_TOKEN;
const repoId = process.env.HF_DATASET_REPO ?? "taisan11/oss-docs-collect";

if (!token) {
  throw new Error("HF_TOKEN is required");
}

const outputDir = new URL("./dist/", import.meta.url);

async function hfRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`https://huggingface.co${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Hugging Face API ${response.status}: ${body}`);
  }
  return response;
}

// Create the dataset repository if it does not exist.
const repoCheck = await fetch(`https://huggingface.co/api/repos/create`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: repoId.split("/").at(-1),
    organization: repoId.includes("/") ? repoId.split("/")[0] : undefined,
    private: false,
    type: "dataset",
  }),
});

if (!repoCheck.ok && repoCheck.status !== 409) {
  const body = await repoCheck.text();
  throw new Error(`Could not create/check dataset repo: ${repoCheck.status}: ${body}`);
}

const files = ["README.md", "data.jsonl", "manifest.json"];

for (const file of files) {
  const bytes = await Bun.file(new URL(file, outputDir)).bytes();
  const pathInRepo = file === "data.jsonl" ? "data/data.jsonl" : file;

  const response = await hfRequest(`/api/datasets/${repoId}/commit/main`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operations: [
        {
          operation: "addOrUpdate",
          path: pathInRepo,
          content: Array.from(bytes),
        },
      ],
      commit_message: `data: update ${new Date().toISOString().slice(0, 10)}`,
    }),
  });

  console.log(`${file}: ${response.status}`);
}

console.log(`uploaded dataset to https://huggingface.co/datasets/${repoId}`);
