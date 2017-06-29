angular
	.module('ClientApp')
	.factory('CartService', function() {
		const state = {
			cartItems: {}
		};

		return {
			getItems()  {
				return state.cartItems;
			},
			addItem(item) {
				state.cartItems[item._id] = {
					title: item.title,
					quantity: state.cartItems[item._id] ? state.cartItems[item._id].quantity + 1 : 1
				};
			},
			removeItem(itemId) {
				delete state.cartItems[itemId];
			}
		};
	});