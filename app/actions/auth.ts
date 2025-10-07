'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
//   console.log('Auth check:', { user: user?.email, error }) // Debug log
  
  if (error || !user) {
    console.log('No user found, should redirect') // Debug log
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email!.split('@')[0],
    avatar: user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user.email}`,
  }
}