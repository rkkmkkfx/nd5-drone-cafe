'use strict';

angular
	.module('droneCafe')
	.controller('userCtrl', function($scope, userService) {

		let socket = io();

		$scope.auth = false;

		$scope.accountData = function(user) {
			$scope.auth = true;

			$scope.user = user;
			userService.getUserInfo($scope.user).then(function(data) {
				if(data.data.length == 0) {
					userService.createNewUser($scope.user).then(function(data) {
						$scope.user = data.data;
					});
				} else {
					$scope.user = data.data;
					userService.getUserOrders($scope.user._id).then(function(data) {
						if(data.data.length !== undefined) {
							$scope.userOrder = data.data;
						};
					});
				}
			});
		};
		$scope.meals = userService.getMenu().then(meals => {return meals.data});
		$scope.addAmount = function(){
			$scope.user.points += 100;
			userService.updateUserBalance($scope.user._id, $scope.user.points)
		};
		$scope.addMealToOrder = function(singleMealId, singleMealTitle, singleMealPrice){
			$scope.user.points = $scope.user.points - singleMealPrice;

			userService.updateUserBalance($scope.user._id, $scope.user.balance);

			userService.createOrder($scope.user._id, singleMealId);
		};
		$scope.addMealToOrderWithSale = function(order, orderIndex){
			$scope.user.points = $scope.user.points - (order.price/100*5);
			order.price = order.price/100*5;
			userService.updateUserBalance($scope.user._id, $scope.user.points);

			order.status = 'Заказано';
			socket.emit('order status changed', order);
			userService.updateOrderStatus(order._id, order.status, order.price);
		};
		$scope.deleteMealFromOrder = function(order, orderIndex){
			$scope.user.points = $scope.user.points + order.price;
			userService.updateUserBalance($scope.user._id, $scope.user.points);

			userService.deleteOrder(order._id);
			$scope.userOrder.splice(orderIndex, 1);
		};
		$scope.orderCancellation = function(order, orderIndex){
			userService.deleteOrder(order._id);
			$scope.userOrder.splice(orderIndex, 1);
		};

		socket.on('order created', function(){
			userService.getUserOrders($scope.user._id).then(function(data) {
				if(data.data.length !== undefined) {
					$scope.userOrder = data.data;
				};
			});
		});

		socket.on('status changed', function(order){
			if ($scope.userOrder.length != 0) {
				for (let i=0; i<$scope.userOrder.length; i++){
					if($scope.userOrder[i]._id == order._id){
						$scope.userOrder[i].status = order.status;
						$scope.userOrder[i].price = order.price;
						if ($scope.userOrder[i].status == 'Возникли сложности') {
							$scope.user.balance = $scope.user.balance + $scope.userOrder[i].price
							userService.updateUserBalance($scope.user._id, $scope.user.balance);
						}
						$scope.$apply();
						break;
					}
				};
			}
		});

		socket.on('order deleted', function(){
			userService.getUserOrders($scope.user._id).then(function(data) {
				if(data.data.length !== undefined) {
					$scope.userOrder = data.data;
				};
			});
		});

		socket.on('connect_error', function() {
			socket.disconnect();
		});

	})
