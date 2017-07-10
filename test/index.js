const supertest = require('supertest');

const   expect  = require('chai').expect,
		should  = require('chai').should(),
		assert  = require('chai').assert;

const config = require('../config');

const userData = {
	name: 'test',
	email: 'test@test.test'
};

let meals, testUser, testOrder;

describe('REST API для DroneCafeApp', () => {
	let server, userExist = false;
	before((done) => {
		require('../server');
		setTimeout(() => {
			server = supertest.agent('http://localhost:4321');
			done();
		}, 1000);
		supertest.agent('http://localhost:4321').get('/api/v0/users/?email=' + userData.email).end((err, res) => {
			if (res.body !== null) {
				userExist = true;
			}
		});
	});

	describe('/api/v0/users', () => {
		if (userExist) {
			it('POST / создает пользователя, если нет в БД, и возвращает объект с данными', done => {
				server
					.post('/api/v0/users')
					.send(userData)
					.end((err, res) => {
						if (err) done(err);
						res.status.should.equal(200);
						res.body.name.should.equal('test');
						res.body.email.should.equal('test@test.test');
						done();
					});
			});
		}

		it('GET / возвращает объект с данными пользователя', done => {
			server
				.get('/api/v0/users/?email=' + userData.email)
				.end((err, res) => {
					if (err) done(err);
					res.status.should.equal(200);
					res.body.points.should.equal(100);
					testUser = res.body;
					done();
				});
		});
	});

	describe('/api/v0/orders', () => {
		it('GET /meals должен вернуть массив объектов с данными блюд', done => {
			server
				.get('/api/v0/orders/meals')
				.end((err, res) => {
					if (err) done(err);
					res.status.should.equal(200);
					res.body.should.be.a('array');
					meals = res.body;
					done();
				});
		});

		it('POST / должен создать заказ', done => {
			let newOrder = new config.orderModel({
				user: testUser,
				meal: meals[0],
			});
			server
				.post('/api/v0/orders')
				.send(newOrder)
				.end((err, res) => {
					if (err) done(err);
					res.text.should.equal('Заказ создан');
					done();
				});
		});

		it('GET / должен вернуть список блюд, заказанных пользователем', done => {
			server
				.get('/api/v0/orders/?user=' + JSON.stringify(testUser))
				.end((err, res) => {
					if (err) done(err);
					res.body.should.be.a('array');
					res.body[0].user.name.should.equal(testUser.name);
					if (userExist) {
						res.body[0].status.should.equal('Готовится');
					} else {
						res.body[0].status.should.equal('Заказано');
					}
					res.body[0].should.have.property('meal');
					testOrder = res.body[0];
					done();
				});
		});

		it('PUT /:orderId меняет статус заказа', done => {
			let orderData = {
				status: 'Готовится',
				price: testOrder.price
			};
			server
				.put("/api/v0/orders/" + testOrder._id)
				.send({
					status: "Готовится"
				})
				.end((err, res) => {
				if (err) done(err);
				res.body.status.should.equal('Готовится');
				done();
			});
		});
	});

});