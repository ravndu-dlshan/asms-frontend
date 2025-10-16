import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwtTokenMiddleware } from './src/app/services/JwtDecoderMiddleware'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value


  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {

    const decoded = await decodeJwtTokenMiddleware(token)
    const role = decoded.role 
    console.log('Decoded role from token:', role)
    console.log('Current pathname:', req.nextUrl.pathname)
    const pathname = req.nextUrl.pathname

    // Role-based route access
    if (pathname.startsWith('/admin') && role !== 'ROLE_ADMIN') {
      console.log('Access denied: User with role', role, 'tried to access /admin')
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (pathname.startsWith('/customer') && role !== 'ROLE_CUSTOMER') {
      console.log('Access denied: User with role', role, 'tried to access /customer')
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Allowed → continue
    console.log('Access granted for role:', role, 'to path:', pathname)
    return NextResponse.next()
  } catch (err) {
    console.error('Invalid token:', err)
    return NextResponse.redirect(new URL('/', req.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/customer/:path*'],
}