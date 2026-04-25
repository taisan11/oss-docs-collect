export interface Repos {
  [name: string]: {
    gitUrl: string;
    path: string[];
    license: string;
    branch?: string;
    licenseUrl?: string;
    lang:string
  }
}

export const repos: Repos = {
  "honojs/website": {
    gitUrl: "https://github.com/honojs/website.git",
    path: ["docs"],
    branch:"main",
    license: "MIT",
    lang:"en"
  }
}
