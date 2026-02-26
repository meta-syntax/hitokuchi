---
name: nextjs-search
description: Next.js の API、機能、設定、ベストプラクティスについて調べるときに使用します。Next.js のドキュメントや最新情報を Web 検索して回答します。cacheTag, cacheLife, revalidateTag, Server Actions, App Router, use cache など Next.js 固有の機能について質問されたときに自動的に呼び出されます。
allowed-tools: WebSearch, WebFetch, Read, Grep, Glob
---

# Next.js 情報検索スキル

Next.js に関する質問に対して、Web 検索を活用して最新の情報を提供します。

## 手順

1. ユーザーの質問から Next.js のキーワードを特定する
2. 以下の検索戦略で情報を収集する：
   - `site:nextjs.org` を付けて Next.js 公式ドキュメントを優先的に検索
   - 必要に応じて GitHub Issues/Discussions (`site:github.com/vercel/next.js`) も検索
   - 最新の情報を得るために現在の年を検索クエリに含める
3. 検索結果から関連するページを `WebFetch` で取得し、詳細を確認する
4. 取得した情報をもとに、質問に対する回答をまとめる

## 検索クエリの例

- `site:nextjs.org revalidateTag API reference`
- `site:nextjs.org "use cache" directive`
- `site:nextjs.org cacheLife cacheTag`
- `Next.js 16 new features site:nextjs.org`
- `next.js server actions revalidation site:github.com/vercel/next.js`

## 回答のルール

- 公式ドキュメントの情報を優先する
- バージョン固有の情報には、どのバージョンから利用可能かを明記する
- コード例がある場合は含める
- 情報源（URL）を明記する

## 引数

`$ARGUMENTS` が指定された場合、その内容を検索キーワードとして使用する。
