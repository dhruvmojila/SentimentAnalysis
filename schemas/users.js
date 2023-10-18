export default {
  name: 'users',
  type: 'document',
  title: 'users',
  fields: [
    {
      name: 'username',
      type: 'string',
      title: 'Username',
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
    },
    {
      name: 'password',
      type: 'string',
      title: 'Password',
    },
    {
      name: 'user_code',
      type: 'number',
      title: 'User_code',
    },
    {
      name: 'profile',
      type: 'image',
      title: 'Profile picture',
      options: {
        hotspot: true,
      },
    },
  ],
}
