module.exports = (client) => client.multi()
  .hmset('users:test-user', {
    id: '1',
    username: 'test-user',
    password: 'password',
    email: 'test-user@foo.foo',
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