"use server"

import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/services/profiles"
import type { TablesInsert, TablesUpdate } from "@/types/database"
import { createWhiskey, deleteWhiskey, updateWhiskey } from "@/services/whiskeys"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "ログインが必要です。" }
  }

  const profile = await getProfile(user.id)

  if (profile.role !== "admin") {
    return { error: "管理者権限が必要です。" }
  }

  return { error: null }
}

export async function createWhiskeyAction(
  payload: Omit<TablesInsert<"whiskeys">, "id" | "created_at" | "updated_at">,
) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { error: auth.error }
  }

  const { error } = await createWhiskey(payload)
  return { error }
}

export async function updateWhiskeyAction(
  id: string,
  payload: Omit<TablesUpdate<"whiskeys">, "id" | "created_at" | "updated_at">,
) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { error: auth.error }
  }

  const { error } = await updateWhiskey(id, payload)
  return { error }
}

export async function deleteWhiskeyAction(id: string) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { error: auth.error }
  }

  const { error } = await deleteWhiskey(id)
  return { error }
}
