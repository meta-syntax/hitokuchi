"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toggleBookmarkAction } from "../_actions/bookmark"

interface Props {
  whiskeyId: string
  initialBookmarked: boolean
}

export function BookmarkButton({ whiskeyId, initialBookmarked }: Props) {
  const router = useRouter()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async () => {
    const { error } = await toggleBookmarkAction(whiskeyId, bookmarked)

    if (error === "ログインが必要です。") {
      router.push("/login")
      return
    }

    if (!error) {
      setBookmarked(!bookmarked)
      startTransition(() => router.refresh())
    }
  }

  return (
    <Button
      variant={bookmarked ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {bookmarked ? "ブックマーク済み" : "ブックマーク"}
    </Button>
  )
}
