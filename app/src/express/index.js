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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

module.exports = app;
