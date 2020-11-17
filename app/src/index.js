const debug = require('debug')('app');
const expressServer = require('./express');
const batchService = require('./batch');

const startGracefulShutdown = () => {
  debug('Starting shutdown of express...');
  expressServer.close(() => {
    debug('Express shut down.');
  });
};

const init = () => {
  try {
    batchService.start();
    expressServer.listen(process.env.LISTENING_PORT, () => debug(`Server running on port ${process.env.LISTENING_PORT}`));
  } catch (err) {
    debug(err);
  }
};

init();

process.on('unhandledRejection', (reason, p) => {
  // Recommended: send the information to a crash reporting service (i.e. sentry.io)
  debug('Unhandled Rejection:', reason.stack);
  process.exit(1);
});

process.on('SIGTERM', startGracefulShutdown);
process.on('SIGINT', startGracefulShutdown);
