const debug = require('debug')('express-server');
const app = require('express')();
const bodyParser = require('body-parser');

const dependencies = require('../config/dependencies');
const authRouter = require('../routes/auth.js')(dependencies);

const AppError = require('../error/app-error');
const errorMiddleware = require('../error');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/_health', require('express-healthcheck')());

app.use('/auth', authRouter);

app.all('*', (req, res) => {
  res.json(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

app.listen(process.env.LISTENING_PORT, () => debug(`Server running on port ${process.env.LISTENING_PORT}`));

process.on('unhandledRejection', (reason, p) => {
  // Recommended: send the information to a crash reporting service (i.e. sentry.io)
  debug('Unhandled Rejection:', reason.stack);
  process.exit(1);
});
