	var app = angular.module("saveController", ["storageFactory"]);
	
	app.controller("saveController", function(storageFactory, $scope) {
		$scope.updateLocalStorage = function() {
			saveFactory.save("collection", $scope.itemsOwned);
		};
	});