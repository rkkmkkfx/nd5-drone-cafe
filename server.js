const config = require('./config')
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	APIv0 = express.Router(),
	server = require('http').createServer(app),
	io = require('socket.io')(server);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

const drone = require('netology-fake-drone-api');

const mongoose = require('mongoose');

mongoose.connect(config.db.url);

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения:'));
db.once('open', function() {
	const loadFromJSON = (data) => {
		config.mealModel.find({}, (err, items) => {
			if (items.length === 0) {
				data.map(
					item => {
						const itemConfig = {
							id: item.id,
							rating: item.rating,
							title: item.title,
							image: item.image,
							ingredients: item.ingredients,
							price: item.price
						}
						config.mealModel.create(itemConfig, err => {
							if (err) {
								console.log(err);
							}
						});
					}
				);
			}
		});
	}
	try {
		loadFromJSON(config.db.data);
	} catch(err) {
		throw err;
	}
	console.log('MongoDB Connected');

	/* USER */
	APIv0.route('/users')
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
			const userData = {
				name : req.query.name,
				email : req.query.email
			};
			config.userModel.findOne({email: req.query.email}, (err, user) => {
				if (err) {
					res.send(err);
				} else {
					res.json(user);
				};
			});
		});

	APIv0.route('/users/:userId')
		//UPDATE
		.put((req, res) => {
			config.userModel.findById(req.params.userId, (err, user) => {
				if (err) {
					res.send(err);
				} else {
					user.points += 100;
					user.save();
					res.json(user);

				};
			});
		});

	/* MEALS */
	APIv0.route('/meals')
		//READ
		.get((req, res) => {
			config.mealModel.find((err, meals) => {
				if (err){
					res.send(err);
				} else {
					res.json(meals);
				};
			});
		});

	/* ORDERS */
	APIv0.route('/orders')
		//CREATE
		.post((req, res) => {
			const newOrder = new model.Order({
				userId : req.body.user,
				mealId : req.body.meal,
				status : 'Заказано',
				price  : req.body.meal.price
			});
			newOrder.save((err) => {
				if (err) {
					res.send(err);
				} else {
					res.send('Заказ создан');
					io.emit('order created');
				}
			});
		})
		//READ
		.get((req, res) => {
			config.orderModel.find({user: req.body.user}, (err, orders) => {
				if (err) res.send(err);
				console.log(orders);
				res.json(orders);
			});
		});

	APIv0.route('/orders/:orderId')
		//UPDATE
		.put((req, res) => {
			config.orderModel.findById(req.params.orderId, (err, order) => {
				if (err) {
					res.send(err);
				} else {
					order.status = req.body.status;
					order.price = req.body.price;
					let amount = order.price
					order.save((err) => {
						if (err) {
							res.send(err);
						} else {
							switch (order.status) {
								case 'Заказано' : {
									io.emit('order created');
									break
								}
								case 'Доставляется' : {
									drone
										.deliver()
										.then(() => {
											order.status = 'Подано';
											order.price = amount;
											order.save((err) => {
												if (err) {
													console.log(err);
												} else {
													io.emit('status changed', order);
													setTimeout(() => {
														config.orderModel.remove({_id: req.params.order_id}, (function (err) {
															if (err) {
																res.send(err);
															} else {
																io.emit('order deleted');
																res.send('Выполненный заказ удален')
															}
															;
														}))
													}, 120000);
												}
											});

										})
										.catch(() => {
											order.status = 'Возникли сложности';
											order.save((err) => {
												if (err) {
													console.log(err);
												} else {
													io.emit('status changed', order);
													setTimeout(() => {
														config.orderModel.remove({_id: req.params.order_id}, (function (err) {
															if (err) {
																res.send(err);
															} else {
																io.emit('order deleted');
																res.send('Не выполненный заказ удален')
															}
															;
														}))
													}, 120000);
												}
											});
										})
								}
							}
						}
					});
				}
			})
		})
		//DELETE
		.delete((req, res) => {
			config.orderModel.remove({_id: req.params.orderId}, (err) => {
				if (err) {
					res.send(err);
				} else {
					res.send('Заказ удален')
				};
			});
		});
})

app.use('/api', APIv0);

server.listen(config.server.port, function () {
	console.log('Подключение к порту %d', config.server.port);
});

io.on('connection', function (socket) {
	console.log('Подключение пользователя');

	socket.on('status changed', (order) => {
		io.emit('status changed', order);
	});

	socket.on('disconnect', function () {
		console.log('Отключение пользователя');
	});
});
