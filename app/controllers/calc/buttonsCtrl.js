	var app = angular.module("buttonsCtrl", ["itemsFactory"]);
	
	app.controller("buttonsCtrl", function(itemsFactory, $scope) {
		$scope.keepItems = function() {
			for (item in currentItems)
				if (!currentItems[item].duplicate)
					itemsOwned[currentItems[item].rarity]++;
		
			updateLocalStorage();
			newChest($("#chest-type").val());
			displayCollection();
		}
	
		$scope.rerollItems = function() {
			itemsFactory.reset($scope.model.currentItems, $scope.model.currentChest);
		}
	});