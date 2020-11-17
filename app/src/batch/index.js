const batchService = require('./batch-service');

module.exports = () => setInterval(async () => {
  await batchService();
}, process.env.POLLING_INTERVAL);
