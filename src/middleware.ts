
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/config'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAccountRoute = pathname.startsWith('/account');
  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isAdminLoginPage = pathname === '/admin/login';

  // If the user is logged in
  if (session) {
    const isAdminUser = session.user.user_metadata?.user_role === 'admin';

    // If a logged-in user tries to access a public auth page (/login, /signup)
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // If an admin is logged in and visits the admin login page, redirect to dashboard
    if (isAdminUser && isAdminLoginPage) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // If a non-admin user tries to access any admin page, redirect them to the home page
    if (!isAdminUser && isAdminRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }
  } 
  // If the user is not logged in
  else {
    // Protect the account page
    if (isAccountRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Protect all admin pages except the login page itself
    if (isAdminRoute && !isAdminLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/confirm (the supabase email confirmation page)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/confirm|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
