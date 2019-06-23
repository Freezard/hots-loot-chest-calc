	var app = angular.module("chestCtrl", ["itemsFactory"]);
	
	app.controller("chestCtrl", function(itemsFactory, $scope) {
		$scope.changeChest = function() {
			itemsFactory.new($scope.model.currentItems, $scope.model.currentChest);
		}
	});