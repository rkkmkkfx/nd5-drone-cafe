const config = require('./../../../config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	userAPI = express.Router(),
	app = module.exports = userAPI;

/* USER */
userAPI.route('/')
//CREATE
	.post((req, res) => {
		const newUser = new config.userModel(req.body);
		newUser.save((err) => {
			if (err) {
				res.send(err);
			} else {
				res.json(newUser);
			}
		});
	})
	//READ
	.get((req, res) => {
		config.userModel.findOne({email: req.query.email}, (err, user) => {
			if (err) {
				res.send(err);
			} else {
				res.json(user);
			};
		});
	});

userAPI.route('/:userId')
//UPDATE
	.put((req, res) => {
		config.userModel.findById(req.params.userId, (err, user) => {
			if (err) {
				res.send(err);
			} else {
				user.points = req.body.points;
				user.save();
				res.json(user);

			};
		});
	});

app.use('/', userAPI);