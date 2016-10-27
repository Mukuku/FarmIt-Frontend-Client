// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
(function () {

  angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

    .run(function ($ionicPlatform, $rootScope, $window, NetworkHelperService) {
      $rootScope.server = "http://83.212.96.240:80/farmit/";

      var checkRememberMeOption = function () {
        // If user has selected the remember me option
        if ($window.localStorage.getItem('remember_me') === true) {
          LogInService.logInBackstage($window.localStorage.getItem('email'), $window.localStorage.getItem('token'))
            .then(function ($success) {
              $window.localStorage.setItem('token', $success.data.token);

              if (!$success.data.addresses)
                $state.go('first-address');
              else
                $state.go('home.menu-content');
            });
        }
      };

      $ionicPlatform.ready(function () {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        // If the user isn't connected to the internet,
        // a popup will be shown and the app will exit when he presses the ok button.
        NetworkHelperService.addListener();

        // If the user has selected the remember me option, then login for him, in order to take a token,
        // and redirect him at the home view.
        checkRememberMeOption();
      });
    });
})();
