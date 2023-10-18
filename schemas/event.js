export default {
  name: 'event',
  type: 'document',
  title: 'event',
  fields: [
    {
      name: 'startTime',
      type: 'string',
      title: 'Start Time',
    },
    {
      name: 'endTime',
      type: 'string',
      title: 'End Time',
    },
    {
      name: 'message',
      type: 'text',
      title: 'Messasge',
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
    },
    {
      name: 'priority',
      type: 'string',
      title: 'Priority',
    },
  ],
}
