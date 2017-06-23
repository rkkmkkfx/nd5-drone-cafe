"use strict";

const   config = require('./../../../../config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	app = module.exports = express(),
	mongoose = require('mongoose'),
	db = mongoose.connection,
	url = config.db.url;

app.get('/', (req, res) => {
	console.log(req.body);
	config.menuModel.find({}, (err, items) => {
		if (err) {
			res.send(err);
		} else {
			res.send(items);
		}
	});
});
app.post('/add', (req, res) => {
	const data = {
		name: req.body.name,
		desc: req.body.desc,
		taskStatus: req.body.status,
		user: req.body.user
	}
	config.menuModel.create(data, (err, task) => {
		if (err) {
			res.send(err);
		} else {
			console.log('task saved');
			res.send({ status: 'OK', task:task });
		}
	});
});
app.put('/edit/:id', (req, res) => {
	const id = req.params.id;
	config.menuModel.findById(id, (err, data) => {
		if (err) {
			res.send(err);
		} else {
			if (req.body.name) data.name = (data.name !== req.body.name) ? req.body.name : data.name;
			if (req.body.desc) data.desc = (data.desc !== req.body.desc) ? req.body.desc : data.desc;
			data.save();
			res.send(data);
		}
	});
});
app.put('/:id/delegateTo/:userID', (req, res) => {
	const   id = req.params.id,
		userID = req.params.userID;
	config.menuModel.findById(id, (err, data) => {
		if (err) {
			res.send(err);
		} else {
			data.userID = req.params.userID;
			data.save();
			res.send(data);
		}
	});
});
app.put('/changeStatus/:id', (req, res) => {
	const id = req.params.id;
	config.menuModel.findById(id, (err, data) => {
		if (err) {
			res.send(err);
		} else {
			data.taskStatus = (data.taskStatus) ? false : true;
			data.save();
			res.send(data);
		}
	});
});
app.delete('/del/:id', (req, res) => {
	const id = req.params.id;
	config.menuModel.findByIdAndRemove(id, err => {
		if (err) {
			res.send(err);
		} else {
			res.send('task deleted')
		}
	});
});