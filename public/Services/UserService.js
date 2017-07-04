angular
	.module('droneCafe')
	.factory('userService', function($http) {

		return {
			getUserInfo: function(user) {
				let userInfo = {
					params: {
						name: user.name,
						email: user.email
					}
				};
				return $http.get('/api/users', userInfo);
			},

			createNewUser: function(user) {
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

			updateUserBalance: function(userId, newBalance) {
				let userInfo = {
					balance: newBalance
				};
				return $http({
					method: 'PUT',
					url: '/api/users/' + userId,
					data: userInfo
				});
			},

			getMenu: function() {
				return $http.get('/api/meals');
			},

			getUserOrders: function(user) {
				let ordersInfo = {
					params: {
						user: user
					}
				};
				return $http.get('/api/orders', ordersInfo);
			},
			//добавление блюда к заказу
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
			//удаление блюда из заказа
			deleteOrder: function(orderid){
				return $http({
					method: 'DELETE',
					url: '/api/orders/' + orderid
				});
			},
			//обновление статуса заказа
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
