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
				return $http.get('/api/orders', config);
			},
			updateOrderStatus: function(orderId, newStatus, orderPrice){
				let orderData = {
					status: newStatus,
					price: orderPrice
				};
				return $http({
					method: 'PUT',
					url: '/api/orders/' + orderId,
					data: orderData
				});
			}
		}

	});
