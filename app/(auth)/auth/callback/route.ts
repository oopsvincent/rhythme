// app/(auth)/auth/callback/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  
  // Check if this is an account linking callback
  const next = requestUrl.searchParams.get('next')
  const linked = requestUrl.searchParams.get('linked')
  // Read the redirect destination set by the middleware/login flow
  const redirectTo = requestUrl.searchParams.get('redirect')

  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // If this is an account linking callback, redirect back to settings with success message
        if (linked) {
          return NextResponse.redirect(`${origin}/settings/connections?linked=${linked}`)
        }
        
        // If there's a specific next URL, use it
        if (next) {
          return NextResponse.redirect(`${origin}${next}`)
        }
        
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
        
        // If middleware set a redirect destination, honour it
        if (redirectTo) {
          return NextResponse.redirect(`${origin}${redirectTo}`)
        }
        
        // Existing user with no specific redirect - go to dashboard
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`)
}