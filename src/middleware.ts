import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwtTokenMiddleware } from './app/services/JwtDecoderMiddleware'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') || // Skip files with extensions (images, fonts, etc.)
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/debug-token')
  ) {
    return NextResponse.next()
  }

  // Only protect /admin and /customer routes
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isCustomerRoute = pathname === '/customer' || pathname.startsWith('/customer/')

  if (!isAdminRoute && !isCustomerRoute) {
    return NextResponse.next()
  }

  console.log('🔐 Protected route detected:', pathname)

  const token = req.cookies.get('authToken')?.value

  if (!token) {
    console.log('❌ No token found - Redirecting to /')
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    const decoded = await decodeJwtTokenMiddleware(token)
    const role = decoded.role 
    console.log('✅ Token verified. Role:', role, '| Path:', pathname)

    // Determine the correct home page based on user's role
    const getRoleBasedRedirect = (userRole: string): string => {
      switch (userRole) {
        case 'ROLE_ADMIN':
          return '/admin'
        case 'ROLE_CUSTOMER':
          return '/customer'
        case 'ROLE_EMPLOYEE':
          return '/employee'
        default:
          return '/'
      }
    }

    // Block access based on role and redirect to their correct dashboard
    if (isAdminRoute && role !== 'ROLE_ADMIN') {
      const redirectTo = getRoleBasedRedirect(role)
      return NextResponse.redirect(new URL(redirectTo, req.url))
    }

    if (isCustomerRoute && role !== 'ROLE_CUSTOMER') {
      const redirectTo = getRoleBasedRedirect(role)
      return NextResponse.redirect(new URL(redirectTo, req.url))
    }
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL('/', req.url))
  }
}

// Match all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}
