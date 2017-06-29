angular
	.module('ClientApp')
	.factory('MenuService', function($resource, $http) {

		return $resource('/api/v0/menu', {
			query: {
				method: 'GET',
				isArray: true,
				transformResponse: function(responseData) {
					return angular.fromJson(responseData).data;
				}
			}
		})
	});