let express = require('express'),
    request = require('request'),
    cors = require('cors');

let app = express();

const root = 'https://fantasy.premierleague.com';

app.use(cors())

app.options('*', cors()) // Enable pre-flight across-the-board

/**
 * Handle request to the API endpoint
 */
app.use('/api', (req, res) => {
  req.pipe(request(`${root}/api${req.url}`)).pipe(res);
});

/**
 * Handle request to the DIST endpoint. (mainly images = cache them?)
 */
app.use('/dist', (req, res) => {
  req.pipe(request(`${root}/dist${req.url}`)).pipe(res);
});

/**
 * Serve static images
 */
app.use('/static', express.static('public'));

app.listen();