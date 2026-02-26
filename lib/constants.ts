export const DRINKING_STYLES = [
  { value: "straight", label: "ストレート" },
  { value: "rock", label: "ロック" },
  { value: "highball", label: "ハイボール" },
  { value: "mizuwari", label: "水割り" },
] as const

export const DRINKING_STYLE_LABEL: Record<string, string> = Object.fromEntries(
  DRINKING_STYLES.map(({ value, label }) => [value, label]),
)

export const TASTE_TAGS = [
  "スモーキー", "フルーティー", "スパイシー", "甘い",
  "バニラ", "ハチミツ", "ナッツ", "チョコレート",
  "シトラス", "フローラル", "ウッディ", "ピーティー",
] as const

export const WOULD_REPEAT_OPTIONS = [
  { value: "yes", label: "また飲みたい" },
  { value: "maybe", label: "機会があれば" },
  { value: "no", label: "一度でいいかな" },
] as const

export const WOULD_REPEAT_LABEL: Record<string, string> = Object.fromEntries(
  WOULD_REPEAT_OPTIONS.map(({ value, label }) => [value, label]),
)

export const WHISKEY_TYPE_OPTIONS = [
  "シングルモルト",
  "ブレンデッド",
  "バーボン",
  "ライ",
  "アイリッシュ",
  "ジャパニーズ",
  "その他",
] as const

export const PRICE_RANGE_OPTIONS = [
  { value: "low", label: "$ (〜3,000円)" },
  { value: "medium", label: "$$ (3,000〜6,000円)" },
  { value: "high", label: "$$$ (6,000〜15,000円)" },
  { value: "premium", label: "$$$$ (15,000円〜)" },
] as const

export const PRICE_RANGE_LABEL: Record<string, string> = Object.fromEntries(
  PRICE_RANGE_OPTIONS.map(({ value, label }) => [value, label.split(" ")[0]]),
)
