"use strict";

const   config = require('./app/config'),
		server = require('./app/server'),
		express = require('express'),
		bodyParser = require('body-parser'),
		app = module.exports = express(),
		kitchen = express(),
		mongoose = require('mongoose'),
		db = mongoose.connection,
		url = config.db.url,
		api = server.api;

server.db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', api);

app.use(express.static(__dirname + '/node_modules'));

app.use(express.static('./app/public/client'));

kitchen.use(express.static('./app/public/kitchen'));

app.use('/kitchen', kitchen);

app.listen(config.server.port, () => console.log(`Listening on port ${config.server.port}`));