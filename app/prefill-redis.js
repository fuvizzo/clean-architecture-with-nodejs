const Redis = require('ioredis');

const db = new Redis();
db.multi()
  .hmset('users:gsk', {
    id: '1',
    username: 'user',
    password: 'password',
  })
  .hmset('clients:avis', {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  .exec((errs) => {
    if (errs) {
      console.error(errs[0].message);
      process.exit(1);
    }

    console.log('Client and user added successfully');
    process.exit();
  });
