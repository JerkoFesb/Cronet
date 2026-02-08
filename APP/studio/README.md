# Sanity CMS Setup

## 1. Initialize Sanity Project

If you don't have a Sanity project yet:

```bash
cd studio
npx sanity@latest init
```

Or link to existing:
```bash
npx sanity@latest link
```

## 2. Install Dependencies

From root directory:
```bash
npm install next-sanity @sanity/client
```

## 3. Environment Variables

Add to `.env.local` (root):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
SANITY_WEBHOOK_SECRET=your_secret_here
```

Get these from Sanity dashboard:
- **Project ID**: Manage -> Project settings -> Project ID
- **API Token**: API -> Tokens (create with "read" or "read+write" permissions)
- **Webhook Secret**: Any random string you choose

## 4. Run Studio Locally

```bash
npm run dev
```

Then open Studio at: `http://localhost:3000/studio`

(This requires adding Sanity Studio route to your Next.js app - see next step)

## 5. Add Studio Route to Next.js (Optional)

Create `app/studio/[[...index]]/page.tsx`:

```tsx
'use client'

import { NextStudioLoading } from 'next-sanity/studio/next-studio-loading'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import config from '@/studio/sanity.config'

const Studio = dynamic(() => import('sanity').then((mod) => mod.Studio), {
  ssr: false,
  loading: NextStudioLoading,
})

export default function StudioPage() {
  return useMemo(
    () => <Studio config={config} />,
    []
  )
}
```

## 6. Configure Webhook in Sanity

1. Go to Sanity Manage dashboard
2. Project -> API -> Webhooks
3. Add webhook:
   - **URL**: `https://your-site.com/api/sanity-webhook`
   - **Events**: Document published
   - **Headers** (optional): `x-sanity-webhook-secret: your_secret_here`

## 7. Create Content

1. Open Studio
2. Create documents of type "Page"
3. Set `title`, `slug`, `enabled` (true/false)
4. Publish

## 8. Use Pages in Next.js

In your pages:

```ts
import { getPageBySlug } from '@/lib/sanity'

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)
  
  if (!page || !page.enabled) {
    return <div>Page not found</div>
  }

  return <div>{page.title}</div>
}
```

Only `enabled: true` pages will be served. If you disable a page in Sanity, it won't show in production.
