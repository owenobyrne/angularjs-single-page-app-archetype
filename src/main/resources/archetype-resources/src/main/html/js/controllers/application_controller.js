function ApplicationCtrl($scope, $rootScope, User, Session, $state, $timeout) {

	var socket = new SockJS('/aibaccountmonitor/websockets/portfolio');
    var stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        console.log('Connected ');
        console.log(frame);
        
        stompClient.subscribe("/greeting", function(message) {
        	console.log(message.body);
        	//$rootScope.$broadcast("notification", data);

        });
        
        
    }, function(error) {
        console.log("STOMP protocol error " + error);
    });
    
	$scope.$on("notification", function(event, notification) {
		if (notification.type == "some-notification") {
			$state.go("application.page1");

		}
	});
}
//ApplicationCtrl.$inject = ['$scope', 'User', 'Session'];

