// Get dependencies
const express    = require('express');
const path       = require('path');
const http       = require('http');
const https       = require('https');
var fs = require('fs')

const app = express();

// Point static path to dist
app.use(express.static(path.join(__dirname, 'build')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '9001';
app.set('port', port);

/**
 * Create HTTP && HTTPS server.
 */
// const server = http.createServer(app);
let server;

server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on http://localhost:${port}`));