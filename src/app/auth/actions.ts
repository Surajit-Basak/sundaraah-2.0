
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

  // 1. Authenticate the user
  const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email as string,
    password: data.password as string,
  })

  if (signInError || !user) {
    console.error('Admin Login error:', signInError?.message)
    return redirect('/admin/login?error=Invalid credentials')
  }

  // 2. Check for a profile in public.users table
  let { data: userProfile } = await supabase
    .from('users')
    .select('user_role')
    .eq('id', user.id)
    .single();

  // 3. (Self-Healing) If no profile, create one. This handles users created before the trigger existed.
  if (!userProfile) {
      const { data: newUserProfile, error: insertError } = await supabase
        .from('users')
        .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata.full_name,
            user_role: 'user' // Default to 'user'
        })
        .select('user_role')
        .single();
      
      if (insertError) {
          console.error('Error creating user profile on-the-fly:', insertError);
          await supabase.auth.signOut();
          return redirect('/admin/login?error=Could not verify user profile.');
      }
      userProfile = newUserProfile;
  }

  // 4. Check if the user is an admin
  if (userProfile?.user_role !== 'admin') {
    await supabase.auth.signOut(); // Sign out non-admins
    return redirect('/admin/login?error=Access Denied');
  }

  // 5. Success: Revalidate and redirect to dashboard
  revalidatePath('/admin', 'layout')
  redirect('/admin/dashboard')
}
