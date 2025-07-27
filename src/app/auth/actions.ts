
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
  const email = data.email as string;
  const password = data.password as string;
  
  const { error: signUpError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: data.fullName as string,
      }
    }
  });

  if (signUpError) {
    console.error('Signup error:', signUpError.message)
    return redirect(`/signup?error=${encodeURIComponent(signUpError.message)}`)
  }
  
  // For this showcase, we'll log the user in right after signup to bypass email confirmation.
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
     console.error('Sign-in after signup error:', signInError.message)
     // Redirect to login even if auto sign-in fails, so they can try manually.
    return redirect(`/login?message=Signup successful. Please log in.`);
  }

  revalidatePath('/', 'layout')
  redirect('/');
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
