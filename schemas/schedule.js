export default {
  name: 'schedule',
  type: 'document',
  title: 'schedule',
  fields: [
    {
      name: 'date',
      type: 'string',
      title: 'Date',
    },
    {
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [{type: 'event'}],
    },
  ],
}
