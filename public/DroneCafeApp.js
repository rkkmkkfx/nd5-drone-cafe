const droneCafeApp = angular.module('droneCafe', ['ngRoute', 'ngResource', 'ngMessages']);

droneCafeApp
	.config(['$routeProvider',
		function config($routeProvider) {

			$routeProvider
				.when('/', {
					templateUrl:'UserController/UserCtrl.html',
					controller:'userCtrl'
				})
				.when('/kitchen', {
					templateUrl:'KitchenController/KitchenCtrl.html',
					controller:'kitchenCtrl'
				})
				.otherwise({
					redirectTo: '/'
				})
		}
	]);
