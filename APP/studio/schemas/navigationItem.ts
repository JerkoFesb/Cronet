export default {
  name: 'navigationItem',
  title: 'Navigation Item',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Menu Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'path',
      title: 'Path',
      type: 'string',
      description: 'e.g. /, /pretraga, /pomoc',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    },
  ],
}
