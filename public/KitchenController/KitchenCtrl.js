'use strict';

angular
	.module('droneCafe')
	.controller('kitchenCtrl', function($scope, kitchenService) {

		let socket = io();

		kitchenService.getOrders('Заказано').then(function(res) {
			$scope.pending = res.data;
		});

		kitchenService.getOrders('Готовится').then(function(res) {
			$scope.processed = res.data;
		});

		$scope.start = function(order, orderIndex) {
			order.status = 'Готовится';
			$scope.pending.splice(orderIndex, 1);
			$scope.processed.push(order);

			socket.emit('status changed', order);

			kitchenService.updateOrderStatus(order._id, order.status, order.price);
		};

		$scope.finish = function(order, orderIndex) {
			order.status = 'Доставляется';
			$scope.processed.splice(orderIndex, 1);

			socket.emit('status changed', order);

			kitchenService.updateOrderStatus(order._id, order.status, order.price);
		};

		socket.on('order created', function(){
			kitchenService.getOrders('Заказано').then(function(data) {
				if(data.data.length !== undefined) {
					$scope.pending = data.data;
				};
			});
		});

		socket.on('order deleted', function(){
			kitchenService.getOrders('Заказано').then(function(data) {
				$scope.pending = data.data;
			});
			kitchenService.getOrders('Готовится').then(function(data) {
				$scope.processed = data.data;
			});
		});

		socket.on('connect_error', function() {
			socket.disconnect();
		});

	});
