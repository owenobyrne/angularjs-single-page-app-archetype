angular.module('ajsspa', ['ajsspaServices', 'ui.router', 'ui-gravatar', 'LocalStorageModule'])
	.config(['$stateProvider', '$urlRouterProvider', 
	   function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/app"); 
		 
		$stateProvider
			.state('application', {
				url: "/app", 
				views: {
					// the @ signifies that this view is in the rootview rather than a 
					// child view of accounts. (after the @ is the state name)
					
					"applicationview@": {
						templateUrl: "templates/application.html",
						controller: ApplicationCtrl
					}
				}
			});
		}])
	.config(['$httpProvider', function($httpProvider) {
		// set up the base HTTP provider to do CORS
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
	])
	// called when the application starts up.
	.run(function ($rootScope, $state, $stateParams, localStorageService) {
		// set up the localStorage service.
		localStorageService.setPrefix('ajsspa');
		
		// make the route/template state available to everything
	    $rootScope.$state = $state;
	    $rootScope.$stateParams = $stateParams;
	});
