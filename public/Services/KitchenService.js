angular
	.module('droneCafe')
	.factory('kitchenService', function($http) {

		return {
			getOrders: function(mealStatus) {
				let config = {
					params: {
						status: mealStatus
					}
				};
				return $http.get('/api/v0/orders', config);
			},
			updateOrderStatus: function(orderId, newStatus, orderPrice){
				let orderData = {
					status: newStatus,
					price: orderPrice
				};
				return $http({
					method: 'PUT',
					url: '/api/v0/orders/' + orderId,
					data: orderData
				});
			}
		}

	});
