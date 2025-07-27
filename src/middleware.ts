
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/config';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Define routes that require authentication
  const protectedRoutes = ['/account'];
  const adminRoutes = '/admin';

  // If user is not logged in and trying to access a protected route, redirect to login
  if (!session && protectedRoutes.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Handle admin routes separately
  if (pathname.startsWith(adminRoutes)) {
    // If user is not logged in, redirect to admin login page
    if (!session) {
      if (pathname === '/admin/login') {
        return response; // Allow access to the login page
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If user is logged in, check their role
    const { data: userProfile } = await supabase
      .from('users')
      .select('user_role')
      .single();

    const isAdmin = userProfile?.user_role === 'admin';

    // If user is not an admin, redirect them away from all admin pages
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If an admin is already logged in and tries to access the login page, redirect to dashboard
    if (isAdmin && pathname === '/admin/login') {
       return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // If a logged-in user tries to access login/signup pages, redirect to home
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
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
};
