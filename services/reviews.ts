import 'server-only'

import { cacheLife, cacheTag, revalidateTag, updateTag } from 'next/cache'
import { createCacheClient } from '@/lib/supabase/cache'
import { createClient } from '@/lib/supabase/server'
import type { TablesInsert, TablesUpdate } from '@/types/database'

export async function getReviewsByWhiskey(whiskeyId: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`whiskey-reviews:${whiskeyId}`)

  const supabase = createCacheClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(display_name, avatar_url)')
    .eq('whiskey_id', whiskeyId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }
  return data
}

export async function getReviewsByUser(userId: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`user-reviews:${userId}`)

  const supabase = createCacheClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, whiskeys(id, name, image_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }
  return data
}

export async function getReview(userId: string, whiskeyId: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`user-reviews:${userId}`, `whiskey-reviews:${whiskeyId}`)

  const supabase = createCacheClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('whiskey_id', whiskeyId)
    .single()

  if (error) {
    throw error
  }
  return data
}

export async function createReview(
  values: Omit<TablesInsert<'reviews'>, 'id' | 'created_at' | 'updated_at'>,
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .insert(values)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  revalidateTag(`whiskey-reviews:${values.whiskey_id}`, 'hours')
  updateTag(`user-reviews:${values.user_id}`)
  return { data, error: null }
}

export async function updateReview(
  id: string,
  userId: string,
  whiskeyId: string,
  values: Omit<TablesUpdate<'reviews'>, 'id' | 'user_id' | 'whiskey_id' | 'created_at' | 'updated_at'>,
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .update(values)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  revalidateTag(`whiskey-reviews:${whiskeyId}`, 'hours')
  updateTag(`user-reviews:${userId}`)
  return { data, error: null }
}

export async function deleteReview(id: string, userId: string, whiskeyId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }
  revalidateTag(`whiskey-reviews:${whiskeyId}`, 'hours')
  updateTag(`user-reviews:${userId}`)
  return { error: null }
}
