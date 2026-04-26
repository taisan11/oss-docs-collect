# oss docs collect
OSSドキュメントを集めます。
それぞれのドキュメントのlicenseをしっかり確認してください。
## ドキュメントを追加するとき
issueにリクエストを送るか、自身でrepos.tsに書き込んでPRしてください。
issueにリクエスト送る際の文面はURLだけでもいいです。

## 開発するとき
```sh
git clone --depth=1 --filter=blob:none --sparse https://github.com/taisan11/oss-docs-collect.git
cd oss-docs-collect
git sparse-checkout set . .github 
```
これをすることでarchiveには一切手を触れずにコード等の修正ができます。
