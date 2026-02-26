import 'server-only'

import { cacheLife, cacheTag, revalidateTag } from 'next/cache'
import { createCacheClient } from '@/lib/supabase/cache'
import { createClient } from '@/lib/supabase/server'
import type { TablesInsert, TablesUpdate } from '@/types/database'

export async function getWhiskeys() {
  'use cache'
  cacheLife('max')
  cacheTag('whiskeys')

  const supabase = createCacheClient()
  const { data, error } = await supabase
    .from('whiskeys')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: true })

  if (error) {
    throw error
  }
  return data
}

export async function getWhiskey(id: string) {
  'use cache'
  cacheLife('max')
  cacheTag('whiskeys', `whiskey:${id}`)

  const supabase = createCacheClient()
  const { data, error } = await supabase
    .from('whiskeys')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }
  return data
}

export async function createWhiskey(
  values: Omit<TablesInsert<'whiskeys'>, 'id' | 'created_at' | 'updated_at'>,
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('whiskeys')
    .insert(values)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  revalidateTag('whiskeys', 'max')
  return { data, error: null }
}

export async function updateWhiskey(
  id: string,
  values: Omit<TablesUpdate<'whiskeys'>, 'id' | 'created_at' | 'updated_at'>,
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('whiskeys')
    .update(values)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  revalidateTag('whiskeys', 'max')
  revalidateTag(`whiskey:${id}`, 'max')
  return { data, error: null }
}

export async function deleteWhiskey(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('whiskeys')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }
  revalidateTag('whiskeys', 'max')
  revalidateTag(`whiskey:${id}`, 'max')
  return { error: null }
}
