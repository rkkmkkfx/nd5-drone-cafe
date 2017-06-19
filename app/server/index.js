'use strict';

const   express         = require('express'),
		app             = express(),
		config          = require('./../config'),
		db              = require('./db'),
		api             = require('./api');

const connect = (port) => app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = {
	db,
	api,
	connect
}
