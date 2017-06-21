'use strict';

const   express         = require('express'),
	app             = module.exports = express(),
	config          = require('./../config'),
	db              = require('./db'),
	api             = require('./api');

const connect = (port) => app.listen(port, () => console.log(`Listening on port ${config.server.port}`));

module.exports = {
	app,
	db,
	api,
	connect
}