'use strict';
const app = require('express')();

const bolt = require('./bolt');
require('dotenv').config();

// const authenticate = require('./src/authenticate');
const params = require('./src/params');
const proxy = require('./src/proxy');

const PORT = process.env.PORT || 3000;

app.enable('trust proxy');
// app.get('/', authenticate, params, proxy);
app.get('/', params, proxy);
// app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
