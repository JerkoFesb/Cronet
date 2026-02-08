import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

// Check if a page is enabled (returns true/false)
// Uses API route with no-store caching for fresh data
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
    const enabled = page?.enabled === true
    
    console.log(`[isPageEnabled] slug="${slug}" -> enabled=${enabled}`, { page })
    return enabled
  } catch (error) {
    console.error('[sanity] isPageEnabled error:', error)
    return true // Default to enabled if API is down
  }
}

// Get all page statuses (for navbar visibility, etc)
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
