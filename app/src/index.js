const debug = require('debug')('express-server');
const app = require('./express');

const startServer = () => {
  try {
    app.listen(process.env.LISTENING_PORT, () =>
      console.log(`Server running on port ${process.env.LISTENING_PORT}`));
  } catch (err) {
    console.log(err);
  }
};

startServer();

process.on('unhandledRejection', (reason, p) => {
  // Recommended: send the information to a crash reporting service (i.e. sentry.io)
  debug('Unhandled Rejection:', reason.stack);
  process.exit(1);
});
