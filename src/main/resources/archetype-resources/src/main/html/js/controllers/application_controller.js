function ApplicationCtrl($scope, $rootScope, User, Session, $state, $timeout) {



	var sockjs = new SockJS("http://node.foursevensix.com/sockjs", null, { debug: true, devel: true });


	    sockjs.onopen    = function()  {console.log('[*] open', sockjs.protocol);};

	    sockjs.onmessage = function(e) {
	    	$scope.$apply(function() {
	    		var data = $.parseJSON(e.data);
	 			console.log(data);

	 			//$scope.notifications.unshift(data);
	 			$rootScope.$broadcast("notification", data);

	    	});
	    };

		$scope.$on("notification", function(event, notification) {
			if (notification.type == "some-notification") {
				$state.go("application.page1");

			}
		});
}

//ApplicationCtrl.$inject = ['$scope', 'User', 'Session'];

