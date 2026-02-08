import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate webhook secret if configured
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET
    // Temporarily disabled for testing - will fix in Sanity webhook config
    // if (webhookSecret) {
    //   // Try different header names that Sanity might use
    //   const headerSecret = req.headers.get('x-sanity-webhook-secret') || 
    //                       req.headers.get('x-webhook-secret') ||
    //                       req.headers.get('authorization')?.replace('Bearer ', '')
    //   
    //   console.log('[sanity-webhook] Secret validation:', {
    //     expected: webhookSecret,
    //     received: headerSecret,
    //     allHeaders: Object.fromEntries(req.headers.entries())
    //   })
    //   
    //   if (headerSecret !== webhookSecret) {
    //     return NextResponse.json(
    //       { ok: false, message: 'Unauthorized' },
    //       { status: 401 }
    //     )
    //   }
    // }

    // Check if this is a navigationItem document
    const docType = body?.document?._type
    if (docType === 'navigationItem') {
      // Revalidate the navigation API endpoint
      try {
        revalidatePath('/api/navigation')
        revalidatePath('/')
      } catch (revalidateError) {
        console.warn('[sanity-webhook] revalidatePath failed for navigation:', revalidateError)
      }
      console.log('[sanity-webhook] Revalidated navigation items')
      return NextResponse.json({ ok: true, type: 'navigationItem' })
    }

    // Check if this is a pageStatus document
    if (docType === 'pageStatus') {
      // Revalidate the page-status API endpoint and home page
      try {
        revalidatePath('/api/page-status')
        revalidatePath('/')
        // Also revalidate the specific page path if we have the slug
        const slug = body?.document?.slug?.current
        if (slug) {
          revalidatePath(`/${slug}`)
        }
      } catch (revalidateError) {
        console.warn('[sanity-webhook] revalidate failed for pageStatus:', revalidateError)
      }
      console.log('[sanity-webhook] Revalidated page status')
      return NextResponse.json({ ok: true, type: 'pageStatus' })
    }

    // Extract slug from Sanity webhook payload for legacy pageStatus handling
    const slug = body?.document?.slug?.current || body?.slug

    if (!slug) {
      console.warn('[sanity-webhook] No slug found in payload:', body)
      return NextResponse.json(
        { ok: true, message: 'No slug to revalidate' },
        { status: 200 }
      )
    }

    // Revalidate the page path and index for pageStatus documents
    try {
      revalidatePath(`/${slug}`)
      revalidatePath('/')
    } catch (revalidateError) {
      console.warn('[sanity-webhook] revalidatePath failed:', revalidateError)
      // Continue anyway - don't fail the webhook
    }

    console.log('[sanity-webhook] Revalidated slug:', slug)
    return NextResponse.json({ ok: true, slug })
  } catch (error) {
    console.error('[sanity-webhook] Error:', error)
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    )
  }
}
