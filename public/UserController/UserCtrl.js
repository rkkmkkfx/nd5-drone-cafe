'use strict';

angular
	.module('droneCafe')
	.controller('userCtrl', function($scope, userService) {

		let socket = io();

		$scope.auth = false;

		$scope.accountData = function(user) {
			$scope.auth = true;
			$scope.user = user;
			userService.getUserInfo($scope.user)
				.then(activeUser => {
						console.log(activeUser);
						if(activeUser.data === null) {
							userService.createNewUser($scope.user)
								.then(newUser => $scope.user = newUser.data);
						} else {
							$scope.user = activeUser.data;
							userService.getUserOrders(activeUser)
								.then(orders => $scope.userOrder = orders.data);
						}
					}
				);
			userService.getMenu().then(menu => {
				$scope.meals = menu.data;
				//init grid
				let grid = $('.grid').imagesLoaded( function() {
					grid.masonry({
						itemSelector: '.grid-item',
						columnWidth: '.grid-sizer',
						percentPosition: true
					});
				});
			});
		};
		$scope.addAmount = function(){
			$scope.user.points += 100;
			userService.updatePoints($scope.user._id, $scope.user.points)
		};

		$scope.addMealToOrder = function(meal){
			setTimeout(() => {
				$('.mainMenu').removeClass('pulse');
			}, 5000);
			$('.mainMenu').addClass('pulse');

			$scope.user.points = $scope.user.points - meal.price;

			userService.updatePoints($scope.user._id, $scope.user.points);

			userService.createOrder($scope.user, meal);
		};

		$scope.addMealToOrderWithSale = function(order, orderIndex){
			$scope.user.points = $scope.user.points - (order.price/100*5);
			order.price = order.price/100*5;
			userService.updatePoints($scope.user._id, $scope.user.points);

			order.status = 'Заказано';
			socket.emit('order status changed', order);
			userService.updateOrderStatus(order._id, order.status, order.price);
		};

		$scope.deleteMealFromOrder = function(order, orderIndex){
			$scope.user.points = $scope.user.points + order.price;
			userService.updatePoints($scope.user._id, $scope.user.points);

			userService.deleteOrder(order);
			$scope.userOrder.splice(orderIndex, 1);
		};

		$scope.cancelOrder = function(order, orderIndex){
			userService.deleteOrder(order);
			$scope.userOrder.splice(orderIndex, 1);
		};

		socket.on('order created', function(){
			userService.getUserOrders($scope.user).then(function(orders) {
				if(orders.data.length !== undefined) {
					$scope.userOrder = orders.data;
				};
			});
		});

		socket.on('status changed', function(order){
			if ($scope.userOrder.length !== 0) {
				for (let i=0; i<$scope.userOrder.length; i++){
					if($scope.userOrder[i]._id === order._id){
						$scope.userOrder[i].status = order.status;
						$scope.userOrder[i].price = order.price;
						if ($scope.userOrder[i].status === 'Возникли сложности') {
							$scope.user.balance = $scope.user.balance + $scope.userOrder[i].price
							userService.updatePoints($scope.user._id, $scope.user.balance);
						}
						$scope.$apply();
						break;
					}
				}
			}
		});

		socket.on('order deleted', function(){
			userService.getUserOrders($scope.user).then(function(orders) {
				if(orders.data.length !== undefined) {
					$scope.userOrder = orders.data;
				};
			});
		});

		socket.on('connect_error', function() {
			socket.disconnect();
		});

	})
