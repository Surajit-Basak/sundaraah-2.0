
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
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}


export async function signup(formData: FormData) {
  const supabase = createSupabaseServerClient()
  const data = Object.fromEntries(formData);
  
  const { error } = await supabase.auth.signUp({
    email: data.email as string,
    password: data.password as string,
    options: {
      data: {
        full_name: data.fullName as string,
      }
    }
  });

  if (error) {
    console.error('Signup error:', error.message)
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }
  
  revalidatePath('/', 'layout')
  // For this showcase, we'll redirect to a page that tells the user to check their email.
  // In a real app, Supabase sends a confirmation email.
  redirect('/auth/confirm');
}

export async function logout() {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}


export async function adminLogin(formData: FormData) {
  const supabase = createSupabaseServerClient()

  const data = Object.fromEntries(formData)

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email as string,
    password: data.password as string,
  })

  if (error) {
    console.error('Admin Login error:', error.message)
    redirect('/admin/login?error=Invalid credentials')
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin/dashboard')
}
