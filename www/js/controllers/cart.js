(function () {

  angular.module('app.controllers.cart', [])

    .controller('CartCtrl', function ($scope, $stateParams, $window, $ionicModal, $ionicPopup, CartHelperService) {
      $scope.cartProducts = CartHelperService.initializeCart();
      $scope.totalPrice = 0;
      $scope.isSpinning = false;
      $scope.edit = {};

      $ionicModal.fromTemplateUrl('templates/cart.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      CartHelperService.getCart().then(function ($success) {
          $window.localStorage.setItem('cart', $success.data.data);
        },
        function () {
          $window.localStorage.setItem('cart', []);
        });

      $scope.openCart = function () {
        $scope.cartProducts = CartHelperService.initializeCart();

        var $results = CartHelperService.openCart($scope.modal, $scope.cartProducts);

        $scope.shipping = $results.shipping;
        $scope.additional = $results.additional;
        $scope.totalPrice = $results.totalPrice;
      };

      $scope.editProductQuantity = function ($index) {
        $scope.edit.quantity = $scope.cartProducts[$index].quantity;

        $ionicPopup.show({
          title: 'Edit Quantity',
          subTitle: $scope.cartProducts[$index].name,
          scope: $scope,
          templateUrl: 'templates/edit-product-quantity.html',
          buttons: [
            {
              text: 'Ok',
              type: 'button-positive',
              onTap: function () {
                var $priceDifference = ($scope.edit.quantity - $scope.cartProducts[$index].quantity)
                  * $scope.cartProducts[$index].unitPrice;
                $scope.cartProducts[$index].price += $priceDifference;
                $scope.totalPrice += $priceDifference;
                $scope.cartProducts[$index].quantity = $scope.edit.quantity;
                $window.localStorage.setItem('cart', JSON.stringify($scope.cartProducts));
                CartHelperService.updateCart();
              }
            },
            {
              text: 'Cancel'
            }
          ]
        });
      };

      $scope.deleteProduct = function ($index) {
        var $results = CartHelperService.deleteProduct($index, $scope.modal, $scope.cartProducts, $scope.totalPrice);

        $scope.cartProducts = $results.cartProducts;
        $scope.shipping -= $results.shipping;
        $scope.additional -= $results.additional;
        $scope.totalPrice = $results.totalPrice;

        CartHelperService.updateCart();
      };

      $scope.buy = function () {
        // Confirm dialog
        $ionicPopup.show({
          title: 'Purchase products',
          template: 'Are you sure that you want to make this purchase?',
          buttons: [
            {
              text: "No"
            },
            {
              text: "Yes",
              type: 'button-positive',
              onTap: function () {
                $scope.isSpinning = true;

                var $results = CartHelperService.purchase($scope.modal, $scope.cartProducts, $scope.totalPrice);

                $scope.cartProducts = $results.cartProducts;
                $scope.totalPrice = $results.totalPrice;

                if (!$results.failed) {
                  $scope.shipping = 0;
                  $scope.additional = 0;
                }

                $scope.isSpinning = false;
              }
            }
          ]
        });
      };
    })
})();
