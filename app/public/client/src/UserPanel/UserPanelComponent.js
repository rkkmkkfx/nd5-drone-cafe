'use strict';

clientApp.component('userPanel', {

	controller: function ($http, $location) {
		const vm = this;
		this.login = () => {

			const url = '/api/v0/user/?email=' + this.userLogin.email + '&name=' + this.userLogin.name;
			const userData = {"name": this.userLogin.name, "email": this.userLogin.email};
			$http.get(url).then(
				function successCallback(res) {
					vm.activeUser = res.data;
					if (res.data === null) {
						const url = '/api/v0/user/';
						$http.post(url, userData)
							.then(
								function(res) {
									vm.activeUser = res.data;
								},
								function () {

								}
							)
					}
				},
				function errorCallback(err) {
				}
			)
		}
	},

	templateUrl: './src/UserPanel/UserPanel.html'

});