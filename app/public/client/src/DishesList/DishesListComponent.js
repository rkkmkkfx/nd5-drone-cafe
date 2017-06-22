'use strict';

clientApp.component('dishesList', {

	controller: function DishesListCtrl(MenuService) {

		this.dishes = MenuService.query();

	},

	templateUrl: './src/DishesList/DishesList.html'

});