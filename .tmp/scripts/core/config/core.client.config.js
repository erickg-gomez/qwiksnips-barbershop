'use strict';

// Configuring the Core module
angular.module('core')

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
  // Lazy Load modules configuration
  $ocLazyLoadProvider.config({
    debug: false,
    events: true,
    modules: APP_REQUIRES.modules
  });

}])
.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
  function ( $controllerProvider, $compileProvider, $filterProvider, $provide) {
  // registering components after bootstrap
  angular.module('core').controller = $controllerProvider.register;
  angular.module('core').directive  = $compileProvider.directive;
  angular.module('core').filter     = $filterProvider.register;
  angular.module('core').factory    = $provide.factory;
  angular.module('core').service    = $provide.service;
  angular.module('core').constant   = $provide.constant;
  angular.module('core').value      = $provide.value;

}])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {

  cfpLoadingBarProvider.includeBar = true;
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.latencyThreshold = 500;
  cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]);
