import { NextRequest, NextResponse } from 'next/server'

// Middleware - keep it lightweight
export async function middleware(request: NextRequest) {
  // Just pass through - page components will handle availability checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/pocetna',
    '/pomoc',
    '/pretraga',
    '/pretraga/:path*',
    '/prijava',
    '/usporedba',
  ],
}
