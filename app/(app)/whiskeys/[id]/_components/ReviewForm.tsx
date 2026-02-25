"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const drinkingStyles = [
  { value: "straight", label: "ストレート" },
  { value: "rock", label: "ロック" },
  { value: "highball", label: "ハイボール" },
  { value: "mizuwari", label: "水割り" },
]

const tasteTags = [
  "スモーキー", "フルーティー", "スパイシー", "甘い",
  "バニラ", "ハチミツ", "ナッツ", "チョコレート",
  "シトラス", "フローラル", "ウッディ", "ピーティー",
]

const wouldRepeatOptions = [
  { value: "yes", label: "また飲みたい" },
  { value: "maybe", label: "機会があれば" },
  { value: "no", label: "一度でいいかな" },
]

interface Props {
  whiskeyId: string
  isLoggedIn: boolean
}

export function ReviewForm({ whiskeyId, isLoggedIn }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [drinkingStyle, setDrinkingStyle] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [wouldRepeat, setWouldRepeat] = useState("")
  const [error, setError] = useState("")

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (rating === 0) {
      setError("評価を選択してください。")
      return
    }
    if (!wouldRepeat) {
      setError("再飲意向を選択してください。")
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { error: insertError } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        whiskey_id: whiskeyId,
        rating,
        comment: comment || null,
        drinking_style: drinkingStyle || null,
        taste_tags: selectedTags,
        would_repeat: wouldRepeat,
      })

    if (insertError) {
      setError("レビューの投稿に失敗しました。")
      return
    }

    setRating(0)
    setComment("")
    setDrinkingStyle("")
    setSelectedTags([])
    setWouldRepeat("")
    startTransition(() => router.refresh())
  }

  if (!isLoggedIn) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            レビューを投稿するには
            <Link href="/login" className="text-primary underline underline-offset-4"> ログイン </Link>
            してください。
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">レビューを投稿</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* 星評価 */}
          <div className="grid gap-1.5">
            <Label>評価</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating ? "text-yellow-500" : "text-muted-foreground/30"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* 飲み方 */}
          <div className="grid gap-1.5">
            <Label>飲み方</Label>
            <div className="flex flex-wrap gap-2">
              {drinkingStyles.map((style) => (
                <Badge
                  key={style.value}
                  variant={drinkingStyle === style.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setDrinkingStyle(drinkingStyle === style.value ? "" : style.value)
                  }
                >
                  {style.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* テイストタグ */}
          <div className="grid gap-1.5">
            <Label>テイスト</Label>
            <div className="flex flex-wrap gap-1.5">
              {tasteTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* コメント */}
          <div className="grid gap-1.5">
            <Label htmlFor="comment">コメント</Label>
            <Textarea
              id="comment"
              placeholder="ひとことレビューを書いてみましょう"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* 再飲意向 */}
          <div className="grid gap-1.5">
            <Label>また飲みたい？</Label>
            <div className="flex flex-wrap gap-2">
              {wouldRepeatOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={wouldRepeat === option.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setWouldRepeat(wouldRepeat === option.value ? "" : option.value)
                  }
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "投稿中..." : "レビューを投稿"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
