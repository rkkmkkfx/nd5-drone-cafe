angular
	.module('ClientApp')
	.factory('UserService', function($resource, $http) {

		return $resource('/api/v0/user', {
			query: {
				method: 'GET',
				isArray: true,
				transformResponse: function(responseData) {
					return angular.fromJson(responseData).data;
				}
			}
		})
	});