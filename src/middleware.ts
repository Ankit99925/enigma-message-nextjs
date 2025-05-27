import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from "next-auth/middleware"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Only redirect from auth-related pages if user is authenticated
  if (token && (
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/verify')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect to sign-in if trying to access protected routes without auth
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // See "Matching Paths" below to learn more
}

export const config = {
  matcher: ['/signup/:path*', '/sign-in/:path*', '/dashboard/:path*', '/', '/verify/:path*'],
}