'use strict';

clientApp.component('dishesList', {

	controller: function DishesListCtrl(ClientService) {

		this.dishes = ClientService.query();

	},

	templateUrl: './src/DishesList/DishesList.html'

});