const   config      = require('./../../../../config');
		express     = require('express'),
		mongoose    = require('mongoose'),
		app         = module.exports = express(),
		db          = mongoose.connection,
		Schema      = mongoose.Schema;
		dbUrl       = config.db.url;

app.get('/', (req, res) => {
	menuModel.find({}, (err, items) => {
		if (err) {
			res.send(err);
		} else {
			res.send(items);
		}
	});
});

