import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const docType = body?.document?._type
    if (docType === 'navigationItem') {
      try {
        revalidatePath('/api/navigation')
        revalidatePath('/')
      } catch (revalidateError) {
      }
      return NextResponse.json({ ok: true, type: 'navigationItem' })
    }

    if (docType === 'pageStatus') {
      try {
        revalidatePath('/api/page-status')
        revalidatePath('/')
        const slug = body?.document?.slug?.current
        if (slug) {
          revalidatePath(`/${slug}`)
        }
      } catch (revalidateError) {
      }
      return NextResponse.json({ ok: true, type: 'pageStatus' })
    }

    const slug = body?.document?.slug?.current || body?.slug

    if (!slug) {
      return NextResponse.json(
        { ok: true, message: 'No slug to revalidate' },
        { status: 200 }
      )
    }

    try {
      revalidatePath(`/${slug}`)
      revalidatePath('/')
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
