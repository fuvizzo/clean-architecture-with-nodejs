const Redis = require('ioredis');

const db = new Redis();

db.multi()
  .hmset('users:test-user', {
    id: '1',
    username: 'test-user',
    password: 'password',
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
    process.exit();
  });
