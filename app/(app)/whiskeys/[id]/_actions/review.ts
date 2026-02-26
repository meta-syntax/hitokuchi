"use server"

import { createClient } from "@/lib/supabase/server"
import { createReview } from "@/services/reviews"

interface CreateReviewInput {
  whiskeyId: string
  rating: number
  comment: string
  drinkingStyle: string
  tasteTags: string[]
  wouldRepeat: string
}

export async function createReviewAction(input: CreateReviewInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "ログインが必要です。" }
  }

  const { error } = await createReview({
    user_id: user.id,
    whiskey_id: input.whiskeyId,
    rating: input.rating,
    comment: input.comment || null,
    drinking_style: input.drinkingStyle || null,
    taste_tags: input.tasteTags,
    would_repeat: input.wouldRepeat,
  })

  return { error }
}
