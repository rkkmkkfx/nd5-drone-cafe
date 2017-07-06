const config = require('./../../../config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	orderAPI = express.Router(),
	app = module.exports = orderAPI;

const drone = require('netology-fake-drone-api');

/* MEALS */
orderAPI.route('/meals')
//READ
	.get((req, res) => {
		config.mealModel.find({}, (err, meals) => {
			if (err){
				res.send(err);
			} else {
				res.json(meals);
			};
		});
	});

/* ORDERS */
orderAPI.route('/')
//CREATE
	.post((req, res) => {
		const newOrder = new config.orderModel({
			user : req.body.user,
			meal : req.body.meal,
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
		if (req.query.status) {
			config.orderModel.find({status: req.query.status}, (err, orders) => {
				if (err) res.send(err);
				res.json(orders);
			});
		} else if (req.query.user) {
			const query = JSON.parse(req.query.user),
				userId = (query.data) ? query.data._id : query._id;
			config.orderModel.find({'user._id': userId}, (err, orders) => {
				if (err) res.send(err);
				res.json(orders);
			});
		}
	});

orderAPI.route('/:orderId')
//UPDATE
	.put((req, res) => {
		config.orderModel.findById(req.params.orderId, (err, order) => {
			if (err) {
				res.send(err);
			} else if (order !== null) {
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
												res.send(err);
											} else {
												io.emit('status changed', order);
											}
										});

									})
									.catch(() => {
										order.status = 'Возникли сложности';
										order.save((err) => {
											if (err) {
												console.log(err);
												res.send(err);
											} else {
												io.emit('status changed', order);
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
		config.orderModel.findOneAndRemove({_id: req.params.orderId}, (err) => {
			if (err) {
				res.send(err);
			} else {
				res.send('Заказ удален')
			};
		});
	});

app.use('/', orderAPI);