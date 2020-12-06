const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const root = 'https://fantasy.premierleague.com';

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
 * Serve static images
 */
app.use('/static', express.static('public'));

app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'route not defined',
  });
})

module.exports = app;