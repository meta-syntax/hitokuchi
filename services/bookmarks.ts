import 'server-only'

import { cacheLife, cacheTag, updateTag } from 'next/cache'
import { createCacheClient } from '@/lib/supabase/cache'
import { createClient } from '@/lib/supabase/server'

export async function getBookmarksByUser(userId: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag(`user-bookmarks:${userId}`)

  const supabase = createCacheClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*, whiskeys(id, name, image_url, country, type)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }
  return data
}

export async function getBookmark(userId: string, whiskeyId: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag(`user-bookmarks:${userId}`)

  const supabase = createCacheClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('whiskey_id', whiskeyId)
    .maybeSingle()

  if (error) {
    throw error
  }
  return data
}

export async function createBookmark(userId: string, whiskeyId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ user_id: userId, whiskey_id: whiskeyId })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  updateTag(`user-bookmarks:${userId}`)
  return { data, error: null }
}

export async function deleteBookmark(userId: string, whiskeyId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('whiskey_id', whiskeyId)

  if (error) {
    return { error: error.message }
  }
  updateTag(`user-bookmarks:${userId}`)
  return { error: null }
}
