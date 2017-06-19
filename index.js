'use strict';

const   config      = require('./app/config'),
		express     = require('express'),
		bodyParser  = require('body-parser'),
		app         = express(),
		server      = require('./app/server'),
		port        = config.server.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', require('./app/server/api'));

app.all('*', (req, res) => {
	res.send('ok');
	console.log('!!!');
});

server.connect(port);
server.db.connect();

