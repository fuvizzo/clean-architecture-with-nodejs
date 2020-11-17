const batchService = require('./service');

setInterval(async () => {
  await batchService();
}, 5000);
