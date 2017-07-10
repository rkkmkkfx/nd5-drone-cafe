'use strict';

angular
	.module('droneCafe')
	.controller('userCtrl', function($scope, $cacheFactory, userService) {

		let socket = io();
		$scope.auth = false;

		$scope.accountData = function(user) {
			$scope.auth = true;
			$scope.user = user;
			userService.getUserInfo($scope.user)
				.then(activeUser => {
						if(activeUser.data === null) {
							userService.createNewUser($scope.user)
								.then(newUser => {
									$scope.user = newUser.data;
									Materialize.toast(`Новый пользователь "${newUser.data.name}" создан!`, 4000);
								});
						} else {
							$scope.user = activeUser.data;
							userService.getUserOrders(activeUser)
								.then(orders => {
									$scope.userOrder = orders.data;
								});
							Materialize.toast(`С возвращением, ${activeUser.data.name}!`, 4000);
						}
					}
				);
			userService.getMenu().then(menu => {
				$scope.meals = menu.data;
				//init tooltips
				$(document).ready(function(){
					$('.tooltipped').tooltip({delay: 50});
				});
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

			$(document).ready(function(){
				$('.tooltipped').tooltip({delay: 50});
			});

			$scope.user.points -= meal.price;

			userService.updatePoints($scope.user._id, $scope.user.points);

			userService.createOrder($scope.user, meal);
		};

		$scope.addMealToOrderWithSale = function(order){
			$scope.user.points -= order.price - (order.price/100*5);
			order.price -= order.price/100*5;
			userService.updatePoints($scope.user._id, $scope.user.points);

			order.status = 'Заказано';
			socket.emit('order status changed', order);
			Materialize.toast(`Повторяем заказ со скидкой, новая цена - ${order.price}`, 4000);
			userService.updateOrderStatus(order._id, order.status, order.price);
		};

		$scope.cancelOrder = function(order, orderIndex){
			$scope.user.points = $scope.user.points + order.price;
			userService.updatePoints($scope.user._id, $scope.user.points);

			userService.deleteOrder(order);
			$scope.userOrder.splice(orderIndex, 1);
		};

		$scope.deleteOrder = function(order, orderIndex){
			userService.deleteOrder(order);
			$scope.userOrder.splice(orderIndex, 1);
		};

		socket.on('order created', function(){
			userService.getUserOrders($scope.user).then(function(orders) {
				if(orders.data.length !== undefined) {
					$scope.userOrder = orders.data;
				}
			});
		});

		socket.on('status changed', function(order){
			Materialize.toast(`Статус заказа изменен на "${order.status}"`, 4000);
			if ($scope.userOrder.length !== 0) {
				for (let item of $scope.userOrder){
					if(item._id === order._id){
						item.status = order.status;
						item.price = order.price;
						if (item.status === 'Возникли сложности') {
							$scope.user.points = $scope.user.points + item.price
							userService.updatePoints($scope.user._id, $scope.user.points);
						}
						$scope.$apply();
						break;
					}
				}
			}
		});

		socket.on('order deleted', function(){
			Materialize.toast(`Заказ удален`, 4000);
			userService.getUserOrders($scope.user).then(function(orders) {
				if(orders.data.length !== undefined) {
					$scope.userOrder = orders.data;
				}
			});
		});

		socket.on('connect_error', function() {
			socket.disconnect();
		});

	})
