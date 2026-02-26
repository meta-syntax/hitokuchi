"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createReviewAction } from "../_actions/review"
import { ReviewRatingInput } from "./ReviewRatingInput"
import { DrinkingStyleSelector } from "./DrinkingStyleSelector"
import { TasteTagSelector } from "./TasteTagSelector"
import { WouldRepeatSelector } from "./WouldRepeatSelector"

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

  const handleSubmit = async (e: React.SubmitEvent) => {
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

    const { error: actionError } = await createReviewAction({
      whiskeyId,
      rating,
      comment,
      drinkingStyle,
      tasteTags: selectedTags,
      wouldRepeat,
    })

    if (actionError === "ログインが必要です。") {
      router.push("/login")
      return
    }

    if (actionError) {
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
          <ReviewRatingInput value={rating} onChange={setRating}/>
          <DrinkingStyleSelector value={drinkingStyle} onChange={setDrinkingStyle}/>
          <TasteTagSelector value={selectedTags} onChange={setSelectedTags}/>

          <div className="grid gap-1.5">
            <Label htmlFor="comment">コメント</Label>
            <Textarea
              id="comment"
              placeholder="ひとことレビューを書いてみましょう"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <WouldRepeatSelector value={wouldRepeat} onChange={setWouldRepeat}/>

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
