const app = require('express')();
const bodyParser = require('body-parser');

const OAuth2Service = require('./auth/oauth2-service');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.all('/oauth/token', OAuth2Service.obtainToken);

app.use(OAuth2Service.authenticateRequest);

app.get('/', (req, res) => {
  res.send('Congratulations, you are in a secret area!');
});

app.get('/healthcheck', (req, res) => {
  res.send("it's working :)");
});

const port = 3000;
app.listen(port, () => console.log('Server running...'));
