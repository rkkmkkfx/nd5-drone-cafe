"use strict";

const   express = require('express'),
	app = module.exports = express();

app.use('/v0', require('./v0'));