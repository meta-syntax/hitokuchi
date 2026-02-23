返答は全て日本語で行うこと

# hitokuchi

```
ウイスキーレビューサイト。
Next.js 16 + Supabaseで構築。
```

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui

## Architecture

- Server Components をデフォルトとし、インタラクティブな部分のみ `"use client"` を使用する
- App Router のファイルベースルーティングに従う

### Directory

- `docs/ディレクトリ構造.md`を参照する

## Coding Rules

### 1. Style

- ESLint設定に従う
- コミット前に必ずlintとtype checkを通す

### 2. File Naming

- コンポーネント: PascalCase (例: `AboutSection.tsx`)
- その他: kebab-case

### 3. Component Structure

- 関数コンポーネントを使用する
- Server Components をデフォルトとし、状態やブラウザAPIが必要な場合のみ `"use client"` を付与する

```tsx
// Server Component（デフォルト）
interface Props {
    title: string
}

export function AboutSection({title}: Props) {
    return <section>{title}</section>
}
```

```tsx
// Client Component（インタラクティブな場合のみ）
"use client"

import {useState} from "react"

interface Props {
    initialCount: number
}

export function Counter({initialCount}: Props) {
    const [count, setCount] = useState(initialCount)
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### 4. Props Definition

- TypeScriptの`interface`で型定義する
- オプショナルなpropsにはデフォルト値を分割代入で指定する

```tsx
// BAD: any や型なし
function Card({data}: any) { ...
}

// GOOD: interface で明示的に型定義
interface Props {
    title: string
    description: string
    isVisible?: boolean
}

export function Card({title, description, isVisible = false}: Props) {
...
}
```

### 5. Styling

- Tailwind CSSを優先
- カスタムCSSは`src/app/globals.css`に配置

### 6. Test

- テスティングトロフィーを意識したテスト設計を行う
    - E2Eは機能を絞って実装すること
    - 統合テストとユニットテストを主に実装すること

## Quality

コーディング後は**必須で**以下のコマンドを実行し、エラーがある場合は修正して品質を担保すること。

```bash
npm run lint
npm run typecheck
```
