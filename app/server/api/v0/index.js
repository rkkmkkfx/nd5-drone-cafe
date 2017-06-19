"use strict";

const   express = require('express'),
	app = module.exports = express();

app.use('/user', require('./user'));
app.use('/menu', require('./menu'));