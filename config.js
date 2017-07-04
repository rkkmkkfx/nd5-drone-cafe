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
		url: 'mongodb://localhost:27017/droneCafe',
		data: require('./menu.json')
	},
	mealModel,
	userModel,
	orderModel
}