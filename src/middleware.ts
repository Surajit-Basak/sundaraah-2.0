
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

  // Define public and protected routes
  const protectedRoutes = ['/account'];
  const adminLoginRoute = '/admin/login';
  const adminDashboardRoute = '/admin/dashboard';
  const adminBaseRoute = '/admin';

  // --- Handle Public User Routes ---
  if (!session && protectedRoutes.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // --- Handle Admin Routes ---

  // Allow access to the admin login page
  if (pathname === adminLoginRoute) {
    // If an admin is already logged in, redirect them to the dashboard
    if (session) {
       const { data: userProfile } = await supabase.from('users').select('user_role').single();
       if (userProfile?.user_role === 'admin') {
         return NextResponse.redirect(new URL(adminDashboardRoute, request.url));
       }
    }
    return response; // Allow non-admins and unauthenticated users to see the login page
  }

  // Protect all other admin routes
  if (pathname.startsWith(adminBaseRoute)) {
    if (!session) {
      return NextResponse.redirect(new URL(adminLoginRoute, request.url));
    }

    const { data: userProfile } = await supabase.from('users').select('user_role').single();

    if (userProfile?.user_role !== 'admin') {
      // If not an admin, redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
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
};
