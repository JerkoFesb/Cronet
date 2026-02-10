import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
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
