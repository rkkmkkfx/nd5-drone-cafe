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
		menuModel = mongoose.model('menuItem', menuSchema),
		userSchema = new Schema({
			name: {
				type: String,
				required: true
			},
			email: {
				type: String,
				required: true,
				unique: true
			},
			points: {
				type: Number,
				default: 100
			}
		}),
		userModel = mongoose.model('user', userSchema);

module.exports = {
	server: {
		port: 4321
	},
	db: {
		url: 'mongodb://localhost:27017/droneCafe',
		data: require('./../menu.json')
	},
	menuModel,
	userModel
}