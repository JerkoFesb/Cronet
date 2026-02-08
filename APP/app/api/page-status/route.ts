import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const query = encodeURIComponent(`*[_type == "pageStatus"] {title, "slug": slug.current, enabled}`)
    
    // Direct fetch to Sanity API without any caching
    const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${query}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    
    const data = await response.json()
    
    return NextResponse.json({
      pages: data.result || [],
      timestamp: Date.now()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
      }
    })
  } catch (error) {
    console.error('[api/page-status] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page statuses', pages: [] },
      { status: 500 }
    )
  }
}
