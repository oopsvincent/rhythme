// app/(auth)/auth/confirm/route.tsx

import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      // Get the user to check if they need onboarding
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user has completed onboarding
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('user_preferences_id')
          .eq('user_id', user.id)
          .single()
        
        // If no preferences exist, redirect to onboarding
        if (!preferences) {
          redirect('/onboarding')
        }
      }
      
      // User has completed onboarding or next param specified
      redirect(next)
    }
  }

  // If verification failed, redirect to error page
  redirect('/auth/auth-code-error')
}