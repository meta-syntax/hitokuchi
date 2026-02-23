import 'server-only'

import { cacheLife, cacheTag, updateTag } from 'next/cache'
import { createCacheClient } from '@/lib/supabase/cache'
import { createClient } from '@/lib/supabase/server'
import type { TablesUpdate } from '@/types/database'

export async function getProfile(userId: string) {
  'use cache'
  cacheLife('max')
  cacheTag(`profile:${userId}`)

  const supabase = createCacheClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }
  return data
}

export async function updateProfile(
  userId: string,
  values: Pick<TablesUpdate<'profiles'>, 'display_name' | 'avatar_url'>,
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(values)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  updateTag(`profile:${userId}`)
  return { data, error: null }
}
