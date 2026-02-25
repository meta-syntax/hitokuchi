"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface Props {
  whiskeyId: string
  initialBookmarked: boolean
}

export function BookmarkButton({ whiskeyId, initialBookmarked }: Props) {
  const router = useRouter()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    if (bookmarked) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("whiskey_id", whiskeyId)

      if (!error) {
        setBookmarked(false)
        startTransition(() => router.refresh())
      }
    } else {
      const { error } = await supabase
        .from("bookmarks")
        .insert({ user_id: user.id, whiskey_id: whiskeyId })

      if (!error) {
        setBookmarked(true)
        startTransition(() => router.refresh())
      }
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
