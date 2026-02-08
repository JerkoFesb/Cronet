import { sanityClient } from './lib/sanity'

const pages = [
  { title: 'Početna', slug: 'pocetna', enabled: true },
  { title: 'Pomoć', slug: 'pomoc', enabled: true },
  { title: 'Pretraga', slug: 'pretraga', enabled: true },
  { title: 'Prijava', slug: 'prijava', enabled: true },
  { title: 'Usporedba', slug: 'usporedba', enabled: true },
]

async function seedPages() {
  try {
    for (const page of pages) {
      // Check if page already exists
      const exists = await sanityClient.fetch(
        `*[_type == "pageStatus" && slug.current == $slug][0]._id`,
        { slug: page.slug }
      )

      if (exists) {
        console.log(`✓ Page "${page.title}" already exists`)
        continue
      }

      // Create new page
      const doc = {
        _type: 'pageStatus',
        title: page.title,
        slug: {
          _type: 'slug',
          current: page.slug,
        },
        enabled: page.enabled,
      }

      const result = await sanityClient.create(doc)
      console.log(`✓ Created page "${page.title}" (${result._id})`)
    }

    console.log('\n✅ All pages seeded!')
  } catch (error) {
    console.error('❌ Error seeding pages:', error)
    process.exit(1)
  }
}

seedPages()
