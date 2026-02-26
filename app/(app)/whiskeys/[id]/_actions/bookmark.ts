"use server"

import { createClient } from "@/lib/supabase/server"
import { createBookmark, deleteBookmark } from "@/services/bookmarks"

export async function toggleBookmarkAction(whiskeyId: string, bookmarked: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "ログインが必要です。" }
  }

  if (bookmarked) {
    const { error } = await deleteBookmark(user.id, whiskeyId)
    return { error }
  } else {
    const { error } = await createBookmark(user.id, whiskeyId)
    return { error }
  }
}
