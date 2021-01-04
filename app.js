const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const root = 'https://fantasy.premierleague.com';
const resources = 'https://resources.premierleague.com/premierleague';
const search = 'https://www.premierfantasytools.com/search.php';

app.use(cors())
app.options('*', cors()) // Enable pre-flight across-the-board

/**
 * Handle request to the API endpoint
 * Caching from: https://vercel.com/docs/edge-network/caching
 */
app.use('/api', (req, res) => {
  req.pipe(request(`${root}/api${req.url}`)).on('response', (res) => {
    res.headers['cache-control'] = 's-max-age=1, stale-while-revalidate';
  }).pipe(res);
});

/**
 * Handle request to the DIST endpoint. (mainly images = cache them?)
 */
app.use('/dist', (req, res) => {
  req.pipe(request(`${root}/dist${req.url}`)).pipe(res);
});

/**
 * Handle request to the photos endpoint.
 */
app.use('/photos', (req, res) => {
  req.pipe(request(`${resources}/photos${req.url}`)).pipe(res);
});

/**
 * Send queries to external page to find team with
 * Team ID, Team Name or Team Owner
 */
app.use('/search/:query', (req, res) => {
  let query = req.params.query;
  if (query && query.length >= 3) {
    req.pipe(request(`${search}?query=${query}`)).pipe(res);
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid query'
    });
  };
});

/**
 * Serve static images.
 */
app.use('/static', express.static('public'));

/**
 * Handle all other routes.
 */
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'route not defined',
  });
});

module.exports = app;