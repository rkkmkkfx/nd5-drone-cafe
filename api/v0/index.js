const express = require('express');
const app = module.exports = express();

app.use('/users', require('./users'));
app.use('/orders', require('./orders'))