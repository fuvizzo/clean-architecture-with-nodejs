const Redis = require('ioredis');
const prefillRedis = require('./src/frameworks/persistence/redis/in-memory/prefill-redis');

const client = new Redis();
prefillRedis(client);
