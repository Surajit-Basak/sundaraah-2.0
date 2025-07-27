
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = createSupabaseServerClient()

  const data = Object.fromEntries(formData)

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email as string,
    password: data.password as string,
  })

  if (error) {
    console.error('Login error:', error.message)
    // In a real app, you'd want to redirect back with an error message
    // For simplicity, we'll just redirect to login again.
    redirect('/login?error=Invalid credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/admin/dashboard')
}
