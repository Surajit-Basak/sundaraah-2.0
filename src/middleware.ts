
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
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession();
  
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isAdminLogin = pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin');
  const isAccountRoute = pathname.startsWith('/account');

  // If user is not logged in, redirect them to the appropriate login page.
  if (!session) {
    if (isAccountRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (isAdminRoute && !isAdminLogin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If user is logged in, handle redirects away from auth pages and enforce admin role.
  if (session) {
    if (isAuthRoute) {
       return NextResponse.redirect(new URL('/', request.url));
    }

    const isAdminUser = session.user.user_metadata?.user_role === 'admin';

    if (isAdminLogin) {
      if (isAdminUser) {
         return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    if (isAdminRoute && !isAdminLogin) {
        if (!isAdminUser) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
  }

  return response
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
