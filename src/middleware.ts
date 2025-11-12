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

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isCustomerRoute = pathname === '/customer' || pathname.startsWith('/customer/')
  const isEmployeeRoute = pathname === '/employee' || pathname.startsWith('/employee/')

  if (!isAdminRoute && !isCustomerRoute && !isEmployeeRoute) {
    return NextResponse.next()
  }


  const token = req.cookies.get('authToken')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    const decoded = await decodeJwtTokenMiddleware(token)
    const role = decoded.role 
    
    // Debug logging
    console.log('Middleware - Token decoded successfully')
    console.log('Middleware - Decoded role:', role)
    console.log('Middleware - Pathname:', pathname)
    console.log('Middleware - isEmployeeRoute:', isEmployeeRoute)

  
    if (isAdminRoute && role !== 'ADMIN') {
      console.log('Middleware - Forbidden: Admin route but role is', role)
      return NextResponse.redirect(new URL('/forbidden', req.url))
    }

    if (isCustomerRoute && role !== 'CUSTOMER') {
      console.log('Middleware - Forbidden: Customer route but role is', role)
      return NextResponse.redirect(new URL('/forbidden', req.url))
    }
    if (isEmployeeRoute && role !== 'EMPLOYEE') {
      console.log('Middleware - Forbidden: Employee route but role is', role)
      return NextResponse.redirect(new URL('/forbidden', req.url))
    }
    console.log('Middleware - Access granted, continuing...')
    return NextResponse.next()
  } catch (err) {
    console.error('Middleware - Token verification error:', err)
    return NextResponse.redirect(new URL('/employee', req.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}
