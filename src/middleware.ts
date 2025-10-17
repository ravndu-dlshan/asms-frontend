import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwtTokenMiddleware } from './app/services/JwtDecoderMiddleware'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

 
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') || 
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


  const token = req.cookies.get('authToken')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    const decoded = await decodeJwtTokenMiddleware(token)
    const role = decoded.role 

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

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}
