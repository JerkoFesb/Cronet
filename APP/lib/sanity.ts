import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

export async function isPageEnabled(slug: string): Promise<boolean> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/page-status`, {
      cache: 'no-store'
    })
    const data = await response.json()
    const page = data.pages?.find((p: any) => p.slug === slug)
    return page?.enabled === true
  } catch (error) {
    console.error('[sanity] isPageEnabled error:', error)
    return true
  }
}

export async function getPageStatuses() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/page-status`, {
      cache: 'no-store'
    })
    return await response.json()
  } catch (error) {
    console.error('[sanity] getPageStatuses error:', error)
    return { pages: [] }
  }
}
