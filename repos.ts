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
    path: ["docs","examples"],
    branch:"main",
    license: "MIT",
    lang:"en"
  },
  "akku1139/hono-ja": {
    gitUrl: "https://github.com/akku1139/hono-ja.git",
    path: ["docs","examples"],
    branch:"main",
    license: "MIT",
    lang:"ja"
  },
  "sircmpwn/wayland-book": {
    gitUrl:"https://git.sr.ht/~sircmpwn/wayland-book",
    path:["src"],
    branch:"master",
    license:"CC BY-SA 4.0",
    licenseUrl:"http://creativecommons.org/licenses/by-sa/4.0/",
    lang:"en"
  }
}
