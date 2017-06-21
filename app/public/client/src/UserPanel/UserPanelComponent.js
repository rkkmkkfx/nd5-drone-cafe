'use strict';

clientApp.component('userPanel', {

	controller: function userPanelCtrl(ClientService) {

		this.user = ClientService.query();

	},

	templateUrl: './src/UserPanel/UserPanel.html'

});