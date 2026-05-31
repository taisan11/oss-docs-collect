export interface Repos {
  [name: string]: {
    gitUrl: string;
    path: string[];
    license: string;
    branch?: string;
    licenseUrl?: string;
    translateFrom?:string;
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
    translateFrom:"honojs/website",
    lang:"ja"
  },
  "nananapo/veryl-riscv-book": {
    gitUrl: "https://github.com/nananapo/veryl-riscv-book.git",
    path: ["basic","advanced"],
    branch:"main",
    license: "BSD 3-Clause \"New\" or \"Revised\" License",
    licenseUrl:"https://github.com/nananapo/veryl-riscv-book/blob/main/LICENSE",
    lang:"ja"
  },
  "sircmpwn/wayland-book": {
    gitUrl:"https://git.sr.ht/~sircmpwn/wayland-book",
    path:["src"],
    branch:"master",
    license:"CC BY-SA 4.0",
    licenseUrl:"http://creativecommons.org/licenses/by-sa/4.0/",
    lang:"en"
  },
  "vitejs/vite": {
    gitUrl:"https://github.com/vitejs/vite",
    path:["docs"],
    branch:"main",
    license:"MIT License",
    licenseUrl:"https://github.com/vitejs/vite/blob/main/LICENSE",
    lang:"en"
  },
  "vitejs/docs-es": {
    gitUrl:"https://github.com/vitejs/docs-es",
    path:["docs"],
    branch:"main",
    license:"MIT License",
    licenseUrl:"https://github.com/vitejs/docs-es/blob/main/LICENSE",
    translateFrom:"vitejs/vite",
    lang:"es"
  },
  "vitejs/docs-de": {
    gitUrl:"https://github.com/vitejs/docs-de",
    path:["docs"],
    branch:"main",
    license:"MIT License",
    licenseUrl:"https://github.com/vitejs/docs-de/blob/main/LICENSE",
    translateFrom:"vitejs/vite",
    lang:"de"
  },
  "vitejs/docs-pt": {
    gitUrl:"https://github.com/vitejs/docs-pt",
    path:["docs"],
    branch:"main",
    license:"MIT License",
    licenseUrl:"https://github.com/vitejs/docs-pt/blob/main/LICENSE",
    translateFrom:"vitejs/vite",
    lang:"pt"
  },
  "vitejs/docs-fa": {
    gitUrl:"https://github.com/vitejs/docs-fa",
    path:["docs"],
    branch:"main",
    license:"MIT License",
    licenseUrl:"https://github.com/vitejs/docs-fa/blob/main/LICENSE",
    translateFrom:"vitejs/vite",
    lang:"fa"
  },
  "vitejs/docs-cn": {
    gitUrl:"https://github.com/vitejs/docs-cn",
    path:["blog","changes","config","guide","plugins"],
    branch:"main",
    license:"MIT License",
    licenseUrl:"https://github.com/vitejs/docs-cn/blob/main/LICENSE",
    translateFrom:"vitejs/vite",
    lang:"cn"
  },
  "vitejs/docs-ja": {
    gitUrl:"https://github.com/vitejs/docs-ja",
    path:["blog","changes","config","guide","plugins"],
    branch:"main",
    license:"MIT License",
    licenseUrl:"https://github.com/vitejs/docs-ja/blob/main/LICENSE",
    translateFrom:"vitejs/vite",
    lang:"ja"
  },  
  "vitejs/docs-ko": {
    gitUrl:"https://github.com/vitejs/docs-ko",
    path:["blog","changes","config","guide","plugins"],
    branch:"main",
    license:"MIT License",
    licenseUrl:"https://github.com/vitejs/docs-ko/blob/main/LICENSE",
    translateFrom:"vitejs/vite",
    lang:"ko"
  },
  "oxc-project/website": {
    gitUrl:"https://github.com/oxc-project/website",
    path:["src"],
    branch:"main",
    license:"unknown",
    lang:"en"
  },
  "rolldown/rolldown": {
    gitUrl:"https://github.com/rolldown/rolldown",
    path:["docs"],
    branch:"main",
    license:"MIT License",
    licenseUrl:"https://github.com/rolldown/rolldown/blob/main/LICENSE",
    lang:"en"
  },
}
