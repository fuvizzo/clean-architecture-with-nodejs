const app = require('express')();
const bodyParser = require('body-parser');


const dependencies = {}; // inject dependencies here
const authRouter = require('../routes/auth.js')(dependencies);

const AppError = require('../error/app-error');
const errorMiddleware = require('../error');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/healthcheck', (req, res) => {
  res.send("it's working :)");
});

app.use('/auth', authRouter);

app.all('*', (req, res) => {
  res.json(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

const port = 3000;
app.listen(port, () => console.log('Server running...'));
