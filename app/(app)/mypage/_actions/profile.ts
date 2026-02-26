"use server"

import { createClient } from "@/lib/supabase/server"
import { updateProfile } from "@/services/profiles"

interface UpdateProfileInput {
  displayName: string
  avatarUrl: string
}

export async function updateProfileAction(input: UpdateProfileInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "ログインが必要です。" }
  }

  const { error } = await updateProfile(user.id, {
    display_name: input.displayName || null,
    avatar_url: input.avatarUrl || null,
  })

  return { error }
}
