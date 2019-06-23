	var app = angular.module("collectionCtrl", ["storageFactory"]);
	
	app.controller("collectionCtrl", function(storageFactory, $scope) {
		$scope.save = function() {
			storageFactory.save("collection", $scope.itemsOwned);
		}
	});