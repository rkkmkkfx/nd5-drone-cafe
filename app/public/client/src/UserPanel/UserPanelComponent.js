'use strict';

clientApp.component('userPanel', {

	controller: function userPanelCtrl(UserService) {

		this.user = UserService.query();

	},

	templateUrl: './src/UserPanel/UserPanel.html'

});