module.exports = (client) => client.multi()
  .hmset('users:test-user-1', {
    id: 'abc123',
    username: 'test-user-1',
    password: 'password',
    email: 'test-user-1@foo.foo',
  })
  .hmset('users:test-user-2', {
    id: 'xyz456',
    username: 'test-user-2',
    password: 'password',
    email: 'test-user-2@foo.foo',
  })
  .hmset(`clients:${process.env.CLIENT_ID}`, {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  .sadd(`clients:${process.env.CLIENT_ID}:grant_types`, [
    'password',
    'refresh_token',
  ])
  .exec((errs) => {
    if (errs) {
      console.error(errs[0].message);
      process.exit(1);
    }
    console.log('Client and user added successfully');
  });
