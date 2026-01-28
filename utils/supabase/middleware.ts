import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protected routes that require authentication
  // We explicitly check for /dashboard, /settings, /user, /onboarding
  const isProtectedRoute = 
    path.startsWith('/dashboard') ||
    path.startsWith('/settings') ||
    path.startsWith('/user') ||
    path.startsWith('/onboarding')

  // Auth routes that logged-in users shouldn't access (login, signup, etc.)
  // EXCLUDING /logout because logged-in users need to access it to log out
  const isAuthRoute = 
    path === '/login' ||
    path === '/signup' ||
    path === '/forgot-password' ||
    (path.startsWith('/auth') && path !== '/auth/callback' && path !== '/auth/logout')

  // 1. Redirect unauthenticated users trying to access protected routes
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    // Save the page they were trying to access to redirect them back after login
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Redirect authenticated users trying to access auth routes (like login/signup)
  // But allow them to access /logout
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. Special case: If root path '/' is accessed
  // Optional: Redirect logged-in users directly to dashboard? 
  // For now, we leave the landing page accessible to everyone.
  
  return supabaseResponse
}