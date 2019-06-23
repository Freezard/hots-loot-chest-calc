	var app = angular.module("itemBoxesCtrl", []);
	
	app.controller("itemBoxesCtrl", function($scope) {
		$scope.clickDuplicate = function(item) {
			item.duplicate = !item.duplicate;
		};
		
		$scope.clickRarity = function(item, rarity) {
			item.rarity = rarity;
		};
	});