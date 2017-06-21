var clientApp = angular.module('ClientApp', ['ngRoute', 'ngResource', 'restangular']);

angular.
module('ClientApp')

	.config(['$routeProvider', 'RestangularProvider',
		function config($routeProvider, RestangularProvider) {

			$routeProvider.
			when('/', {
				template: '<dishes-list></dishes-list>'
			}).
			otherwise({
				redirectTo: '/'
			});

			RestangularProvider.setBaseUrl('/api/v1/data/');

		}
	])