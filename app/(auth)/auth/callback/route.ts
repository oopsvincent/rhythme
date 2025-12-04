// app/auth/callback/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user has completed onboarding
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('user_preferences_id')
          .eq('user_id', user.id)
          .single()
        
        // If no preferences exist, this is a new OAuth user - redirect to onboarding
        if (!preferences) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
        
        // Existing user - redirect to dashboard
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`)
}