// app/actions/auth.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.log('No user found, should redirect')
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email!.split('@')[0],
    avatar:
      user.user_metadata?.avatar_url ||
      `https://avatar.vercel.sh/${user.email}`,
  }
}

export async function getFullUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.log('No user found, should redirect')
    return null
  }

  return user
}

export async function signInWithProviderAction(
  provider: 'google' | 'github' | 'discord' | 'spotify' | 'apple' | 'facebook',
) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) throw new Error(error.message)

  redirect(data.url)
}
