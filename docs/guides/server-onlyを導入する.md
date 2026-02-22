# `server-only` の導入ルール

## 方針

| 対象 | 方針 | 理由 |
|------|------|------|
| `services/` | 全ファイルに追加 | DB・APIキーを扱うサーバー専用モジュール |
| `lib/` 内のサーバー専用モジュール | 個別に追加 | 例: `lib/supabase/server.ts`。`lib/utils.ts`等の共用モジュールには入れない |
| `actions/` | 不要 | `'use server'` が既にサーバー専用を保証する |
| `hooks/` | 不要 | `useState`等を使っている時点でServer Componentからimportすればエラーになる |

## 使い方

```ts
// services/bookmark.ts
import 'server-only'

export async function getRecentBookmarks(limit = 20) {
  // ...
}
```
