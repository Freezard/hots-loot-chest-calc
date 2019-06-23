var app = angular.module("storageFactory", []);

app.factory('storageFactory', ['$window', function($window) {
    	return {
    		save: function(key, value) {
    			$window.localStorage[key] = JSON.stringify(value);
    		}
    	}
}]);