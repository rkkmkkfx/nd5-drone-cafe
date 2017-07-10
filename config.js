const   mongoose    = require('mongoose'),
	Schema      = mongoose.Schema,
	mealSchema  = new Schema({
		id: { type: String, unique: true },
		rating: Number,
		title: { type: String, required: true, unique: true	},
		image: String,
		ingredients: [String],
		price: Number
	}),
	mealModel   = mongoose.model('meal', mealSchema),
	userSchema  = new Schema({
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
	userModel   = mongoose.model('user', userSchema),
	orderSchema = new Schema({
		meal: {
			_id: mongoose.Schema.ObjectId,
			title: String,
			image: String
		},
		user: {
			_id: mongoose.Schema.ObjectId,
			name: String
		},
		status: {
			type: String,
			enum: ['Заказано', 'Готовится', 'Доставляется', 'Возникли сложности', 'Подано'],
			default: 'Заказано'
		},
		price: Number

	}),
	orderModel  = mongoose.model('order', orderSchema);

module.exports = {
	server: {
		port: 4321
	},
	db: {
		url: 'mongodb://heroku_59x0zvdx:urk4ptmpq4lg6skjkkh9k6r18b@ds151702.mlab.com:51702/heroku_59x0zvdx',
		data: require('./menu.json')
	},
	mealModel,
	userModel,
	orderModel
}