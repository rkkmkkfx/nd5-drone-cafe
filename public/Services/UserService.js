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
				return $http.get('/api/users', userInfo);
			},

			createNewUser: user => {
				let userInfo = {
					name: user.name,
					email: user.email
				};
				return $http({
					method: 'POST',
					url: '/api/users',
					data: userInfo
				});
			},

			updatePoints: function(userId, newBalance) {
				let userInfo = {
					points: newBalance
				};
				return $http({
					method: 'PUT',
					url: '/api/users/' + userId,
					data: userInfo
				});
			},

			getMenu: () => {
				return $http.get('/api/meals')
			},

			getUserOrders: function(data) {
				let ordersInfo = {
					params: {
						user: data
					}
				};
				return $http.get('/api/orders', ordersInfo);
			},

			createOrder: function(user, meal){
				let orderInfo = {
					user: user,
					meal: meal
				};

				return $http({
					method: 'POST',
					url: '/api/orders',
					data: orderInfo
				});
			},

			deleteOrder: function(orderid){
				return $http({
					method: 'DELETE',
					url: '/api/orders/' + orderid
				});
			},

			updateOrderStatus: function(orderid, newStatus, orderPrice){
				let orderInfo = {
					status: newStatus,
					price: orderPrice
				};
				return $http({
					method: 'PUT',
					url: '/api/orders/' + orderid,
					data: orderInfo
				});
			}
		}

	});
