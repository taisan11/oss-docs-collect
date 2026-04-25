# 開発するとき
```sh
git clone --depth=1 --filter=blob:none --sparse https://github.com/taisan11/oss-docs-collect.git
cd oss-docs-collect
git sparse-checkout set . .github 
```
これをすることでarchiveには一切手を触れずにコード等の修正ができます。
