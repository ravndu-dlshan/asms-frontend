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


  const token = req.cookies.get('accessToken')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    const decoded = await decodeJwtTokenMiddleware(token)
    const role = decoded.role 

  
    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/forbidden', req.url))
    }

    if (isCustomerRoute && role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/forbidden', req.url))
    }
    if (isEmployeeRoute && role !== 'EMPLOYEE') {
      return NextResponse.redirect(new URL('/forbidden', req.url))
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
