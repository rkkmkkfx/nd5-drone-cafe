const   express     = require('express'),
		config      = require('./../../config'),
		mongoose    = require('mongoose'),
		data        = config.db.data,
		app         = module.exports = express(),
		db          = mongoose.connection,
		menuModel   = config.menuModel,
		dbUrl       = config.db.url;

const loadFromJSON = () => {
	menuModel.find({}, (err, items) => {
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
					menuModel.create(itemConfig, err => {
						if (err) {
							console.log(err);
						}
					});
				}
			);
		}
	});
}

app.connect = () => {
	mongoose.connect(dbUrl);
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', () => {
		console.log('Mongoose сonnected');
		try {
			loadFromJSON();
		} catch(err) {
			throw err;
		}

	});
};

app.disconnect = () => {
	mongoose.disconnect();
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('close', () => console.log('Mongoose disсonnected'));
};
