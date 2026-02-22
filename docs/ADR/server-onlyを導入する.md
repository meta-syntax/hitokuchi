# `server-only`を導入する

**ステータス:** 採用

**日付:** 2026-02-22

---

## コンテキスト

`src/services/`はDBアクセスやAPIキーを扱うサーバー専用のモジュール群である。JavaScriptのモジュールシステムはServer ComponentとClient Componentを区別しないため、Client Componentから`services/`のモジュールを誤ってimportしてもビルドは通ってしまう。

Next.jsは`NEXT_PUBLIC_`プレフィックスのない環境変数をクライアントバンドルで空文字に置き換えるため、APIキーが直接漏洩するわけではない。しかし、認証なしのリクエストが飛ぶなど意図しない動作の温床になる。

## 決定

以下の範囲に`import 'server-only'`を追加する。

| 対象 | 方針 | 理由 |
|------|------|------|
| `services/` | 全ファイルに追加 | DB・APIキーを扱うサーバー専用モジュール |
| `lib/`内のサーバー専用モジュール | 個別に追加 | 例: `lib/supabase/server.ts`など。`lib/utils.ts`等の共用モジュールには入れない |
| `actions/` | 不要 | `'use server'`ディレクティブが既にサーバー専用を保証する |
| `hooks/` | 不要（`client-only`も不要） | `useState`等を使っている時点でServer Componentからimportすればreact自体がエラーを出す |

```ts
// src/services/bookmark.ts
import 'server-only'

export async function getRecentBookmarks(limit = 20) {
  // ...
}
```

```ts
// src/lib/supabase/server.ts
import 'server-only'

export async function createClient() {
  // ...
}
```

## 根拠

- Client Componentから誤ってimportした場合、ビルド時にエラーで検知できる
- コードレビューで見落としても機械的にブロックできる
- 導入コストがほぼゼロ（import文を1行追加するだけ）
- `lib/`は全体がサーバー専用ではないため、一律ではなくファイル単位で判断する
