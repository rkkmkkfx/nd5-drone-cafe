const express = require('express');
const app = module.exports = express();

app.use('/v0', require('./v0'));