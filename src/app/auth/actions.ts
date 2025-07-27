
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
  
  // This now only signs up the user in auth.users. The trigger will handle the public.users table.
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
  
  // Revalidate the users path to show the new user in the admin panel
  revalidatePath('/admin/users');

  // Redirect to a page that tells the user to confirm their email
  return redirect('/auth/confirm');
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
    return
  }

  const { data: userProfile } = await supabase.from('users').select('user_role').single();

  if (userProfile?.user_role !== 'admin') {
    await supabase.auth.signOut();
    redirect('/admin/login?error=Access Denied');
    return
  }


  revalidatePath('/admin', 'layout')
  redirect('/admin/dashboard')
}
