const config = require('./config')
	express = require('express'),
	bodyParser = require('body-parser'),
	app = module.exports = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

const mongoose = require('mongoose');
mongoose.connect(config.db.url, {
	useMongoClient: true
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

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
})

app.use('/api', require('./api'));

server.listen(config.server.port, function () {
	console.log('Подключение к порту %d', config.server.port);
});

io.on('connection', function (socket) {
	console.log('User connected');

	socket.on('status changed', (order) => {
		io.emit('status changed', order);
	});

	socket.on('disconnect', function () {
		console.log('User disconnected');
	});
});
