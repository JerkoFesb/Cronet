import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Revalidate the sanity-live tag so SanityLive triggers router.refresh()
    revalidateTag('sanity-live')

    // Sanity GROQ webhooks send the document at root level, not nested under "document"
    const docType = body?._type
    const slug = body?.slug?.current || body?.slug

    if (docType === 'navigationItem') {
      try {
        revalidatePath('/api/navigation')
        revalidatePath('/', 'layout')
      } catch (revalidateError) {
      }
      return NextResponse.json({ ok: true, type: 'navigationItem' })
    }

    if (docType === 'pageStatus') {
      try {
        revalidatePath('/api/page-status')
        revalidatePath('/', 'layout')
        if (slug) {
          revalidatePath(`/${slug}`)
        }
      } catch (revalidateError) {
      }
      return NextResponse.json({ ok: true, type: 'pageStatus' })
    }

    if (!slug) {
      return NextResponse.json(
        { ok: true, message: 'No slug to revalidate' },
        { status: 200 }
      )
    }

    try {
      revalidatePath(`/${slug}`)
      revalidatePath('/', 'layout')
    } catch (revalidateError) {
    }

    return NextResponse.json({ ok: true, slug })
  } catch (error) {
    console.error('[sanity-webhook] Error:', error)
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    )
  }
}
