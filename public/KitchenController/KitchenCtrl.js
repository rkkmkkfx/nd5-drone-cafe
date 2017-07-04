'use strict';

angular
	.module('droneCafe')
	.controller('kitchenCtrl', function($scope, kitchenService) {

		let socket = io();

		//получение списка заказанных блюд
		kitchenService.getOrders('Заказано').then(function(data) {
			$scope.pending = data.data;
		});
		//получение списка готовящихся блюд
		kitchenService.getOrders('Готовится').then(function(data) {
			$scope.processed = data.data;
		});
		//переход к приготовлению заказа
		$scope.start = function(order, orderIndex) {
			order.status = 'Готовится';
			$scope.pending.splice(orderIndex, 1);
			$scope.processed.push(order);

			socket.emit('status changed', order);

			kitchenService.updateOrderStatus(order._id, order.status, order.price);
		};
		//переход к доставке заказа
		$scope.finish = function(order, orderIndex) {
			order.status = 'Доставляется';
			$scope.cookingMeals.splice(orderIndex, 1);

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
