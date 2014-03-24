var serviceEndpoint = "http://localhost\:3000/api";

angular.module('ajsspaServices', ['ngResource'])
    .factory('Accounts', function($resource){
    	return $resource(serviceEndpoint + '/accounts/:sparkline:accountName/:transactionType/:accountNameTo', {}, {
    		all: {
    			method:'GET', 
    			params: {accountName:""}, 
    			isArray:true
    		},
    		sparklines: {
    			method:'GET', 
    			params: {sparkline:"sparklines"}, 
    			isArray:false
    		},
    		details: {
    			method:'GET', 
    			isArray:false
    		},
    		transactions: {
    			method:'GET', 
    			params: {accountName:"@accountName", transactionType:"transactions"}, 
    			isArray:true
    		},
    		transfer: {
    			method:'POST', 
    			params: {
    				accountName:"@accountName", 
    				transactionType:"transferto", 
    				accountNameTo:"@accountNameTo"
    				}, 
    			isArray:false
    		},
    		pendingtransactions: {
    			method:'GET', 
    			params: {accountName:"@accountName", transactionType:"pending"}, 
    			isArray:true
    		}

    		
    	});
    })
    .factory('User', function($resource){
		return $resource(serviceEndpoint + '/user', {}, {
			get: {
				method:'GET', 
				isArray:false
			}
		});
    })
    .factory('Session', function($resource){
		return $resource(serviceEndpoint + '/:action', {}, {
			login: {
				params: {"action": "login"},
				method:'POST',
				isArray:false
			},
			logout: {
				params: {"action": "logout"},
				method:'GET'
			}
		});
    });