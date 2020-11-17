const batchService = require('./batch-service');

module.exports = {
  start: () => setInterval(async () => {
    await batchService();
  }, process.env.BATCH_POLLING_INTERVAL),
};
