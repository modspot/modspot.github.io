const https = require('https');

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || '127.0.0.1';

app.use('/', express.static('docs'));

const client_id = '496a9c8ed9399e973d19';
const client_secret = process.env.SECRET || 'change-it-during-tests';

const cors_options = {
  origin: 'https://modspot.github.io'
};

app.get('/api/github-proxy/:code', cors(cors_options), (req, res) => {
  const query = `code=${req.params.code}&client_id=${client_id}&client_secret=${client_secret}`;

  console.log('received request', query);

  const options = {
    hostname: 'github.com',
    path: `/login/oauth/access_token?${query}`,
    headers: {
      'Accept': 'application/json'
    },
    port: 443,
  };

  const request = https.request(options, response => {
    response.setEncoding('utf8');

    let raw_data = '';
    response.on('data', d => {
      raw_data += d;
    });

    response.on('end', () => {
      console.log('result', raw_data);
      res.send(raw_data);
    });
  });

  request.on('error', error => {
    console.error(error);
    res.send(error);
  });

  request.write('');
  request.end();
});

/**
 * for testing purpose you can redirect the proxy to this endpoint.
 * 
 */
app.post('/login/oauth/access_token', (req, res) => {
  console.log(req.query);

  res.send({
    access_token: String(Math.random()),
    token_type: "bearer",
    scope: ""
  });
});

app.listen(port, host, () => {
  console.log(`server listening at http://localhost:${port}/`);
});