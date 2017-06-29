'use strict';

angular
    .module('ClientApp')
    .component('cartComponent', {
        templateUrl: './src/CartComponent/CartComponent.html',
        controller: function(CartService) {
            this.cartItems = CartService.getItems();

            this.removeFromCart = function(dish) {
                CartService.removeItem(dish);
            };
        }
    })