const   mongoose    = require('mongoose'),
		Schema      = mongoose.Schema,
		menuSchema  = new Schema({
			id: { type: String, unique: true },
			rating: Number,
			title: { type: String, required: true, unique: true	},
			image: String,
			ingredients: [String],
			price: Number
		}),
		menuModel = mongoose.model('menuItem', menuSchema);

module.exports = {
	server: {
		port: 4321
	},
	db: {
		url: 'mongodb://localhost:27017/droneCafe',
		data: require('./../menu.json')
	},
	menuModel
}