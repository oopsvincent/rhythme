// =============================================================================
// DEAD FILE — COMMENTED OUT
// =============================================================================
// These server actions (login/signup with email+password) are UNUSED.
// The actual login is handled client-side in components/auth/login-form.tsx
// using supabase.auth.signInWithPassword() directly.
// Safe to delete.
// =============================================================================

// 'use server'
//
// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
//
// import { createClient } from '@/lib/supabase/server'
//
// export async function login(formData: FormData) {
//   const supabase = await createClient()
//
//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }
//
//   const { error } = await supabase.auth.signInWithPassword(data)
//
//   if (error) {
//     redirect('/error')
//   }
//
//   revalidatePath('/', 'layout')
//   redirect('/')
// }
//
// export async function signup(formData: FormData) {
//   const supabase = await createClient()
//
//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }
//
//   const { error } = await supabase.auth.signUp(data)
//
//   if (error) {
//     redirect('/error')
//   }
//
//   revalidatePath('/', 'layout')
//   redirect('/')
// }