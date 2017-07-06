angular
	.module('droneCafe')
	.factory('userService', function($http) {

		return {
			getUserInfo: user => {
				let userInfo = {
					params: {
						email: user.email
					}
				};
				return $http.get('/api/v0/users', userInfo);
			},

			createNewUser: user => {
				let userInfo = {
					name: user.name,
					email: user.email
				};
				return $http({
					method: 'POST',
					url: '/api/v0/users',
					data: userInfo
				});
			},

			updatePoints: function(userId, pointsLeft) {
				let userInfo = {
					points: pointsLeft
				};
				return $http({
					method: 'PUT',
					url: '/api/v0/users/' + userId,
					data: userInfo
				});
			},

			getMenu: () => {
				return $http.get('/api/v0/orders/meals')
			},

			getUserOrders: function(user) {
				const ordersQuery = {
					params: {
						user
					}
				};
				return $http.get('/api/v0/orders', ordersQuery);
			},

			createOrder: function(user, meal){
				let orderInfo = {
					user: user,
					meal: meal
				};

				return $http({
					method: 'POST',
					url: '/api/v0/orders',
					data: orderInfo
				});
			},

			deleteOrder: function(order){
				return $http({
					method: 'DELETE',
					url: '/api/v0/orders/' + order._id
				});
			},

			updateOrderStatus: function(orderid, newStatus, orderPrice){
				let orderInfo = {
					status: newStatus,
					price: orderPrice
				};
				return $http({
					method: 'PUT',
					url: '/api/v0/orders/' + orderid,
					data: orderInfo
				});
			}
		}

	});
