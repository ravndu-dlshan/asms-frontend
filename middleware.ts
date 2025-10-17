import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

console.log('========== TEST MIDDLEWARE LOADED ==========')

export function middleware(request: NextRequest) {
  console.log('========== TEST MIDDLEWARE RUNNING FOR:', request.nextUrl.pathname)
  return NextResponse.next()
}

// Config is required in Next.js 15+
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
