'use strict';

clientApp.component('dishesList', {

	controller: function DishesListCtrl(MenuService, CartService) {
		this.dishes = MenuService.query();

		this.addToCart = function(item) {
			CartService.addItem(item);
		};

	},

	templateUrl: './src/DishesList/DishesList.html'

});