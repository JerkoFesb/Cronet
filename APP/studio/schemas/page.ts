export default {
  name: 'pageStatus',
  title: 'Page Status',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'enabled',
      title: 'Visible in Production',
      description: 'Toggle to show or hide this page in production',
      type: 'boolean',
      initialValue: true,
    },
  ],
}
