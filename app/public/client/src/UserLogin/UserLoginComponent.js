'use strict';

clientApp
	.controller('UserLoginCtrl', function UserLoginCtrl() {
		this.data = {};
	})
	.component('userLogin', {

	bindings: {
		name: '=',
		email: '='
	},

	controller: function () {
		this.login = (data) => {
			this.data = data;
			console.log(data);
		}
	},

	templateUrl: './src/UserLogin/UserLogin.html'

});