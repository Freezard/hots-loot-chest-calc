	var app = angular.module("resultPanelCtrl", []);
	
	app.controller("resultPanelCtrl", function($scope) {
		$scope.chestValueBigger = function() {
			return this.chestValue() > this.averageValue($scope.model.currentChest);
		}
		
		$scope.chestValue = function() {
			var chestValue = 0;
			
			for (var item in $scope.model.currentItems) {
				chestValue += $scope.model.currentItems[item].duplicate ?
					$scope.duplicateValue[$scope.model.currentItems[item].rarity] :
					$scope.craftingCost[$scope.model.currentItems[item].rarity];
			}
			return chestValue;
		}

		$scope.averageValue = function(currentChest) {
			var averageValue = 0;

			if (currentChest == "common")
				averageValue = getCommonValue($scope) * 4;
			else if (currentChest == "rare")
				averageValue = getCommonValue($scope) * 3 + getRareValue($scope);
			else if (currentChest == "epic")
				averageValue = getCommonValue($scope) * 3 + getEpicValue($scope);
			else if (currentChest == "legendary")
				averageValue = getCommonValue($scope) * 4 + getLegendaryValue($scope);

			return averageValue;
		}
		
		function getCommonValue($scope) {
			var value = 0;
			
			for (rarity in $scope.chanceOfGetting) {
				value += $scope.chanceOfGetting[rarity] * (($scope.itemsOwned[rarity] / $scope.itemsTotal[rarity]) * $scope.duplicateValue[rarity]
					  + (($scope.itemsTotal[rarity] - $scope.itemsOwned[rarity]) / $scope.itemsTotal[rarity]) * $scope.craftingCost[rarity]);
			}
			return value;
		}
		
		function getRareValue($scope) {
			var value = 0;
			
			for (rarity in $scope.chanceOfGetting) {
				if (rarity == "common") continue;
				else if (rarity == "rare")
					value += (1 - ($scope.chanceOfGetting.epic + $scope.chanceOfGetting.legendary)) * (($scope.itemsOwned[rarity] / $scope.itemsTotal[rarity]) * $scope.duplicateValue[rarity]
						  + (($scope.itemsTotal[rarity] - $scope.itemsOwned[rarity]) / $scope.itemsTotal[rarity]) * $scope.craftingCost[rarity]);
				else value += $scope.chanceOfGetting[rarity] * (($scope.itemsOwned[rarity] / $scope.itemsTotal[rarity]) * $scope.duplicateValue[rarity]
						   + (($scope.itemsTotal[rarity] - $scope.itemsOwned[rarity]) / $scope.itemsTotal[rarity]) * $scope.craftingCost[rarity]);
			}
			return value;
		}
			
		function getEpicValue($scope) {
			var value = 0;
			
			for (rarity in $scope.chanceOfGetting) {
				if (rarity == "common" || rarity == "rare") continue;
				else if (rarity == "epic")
					value += (1 - $scope.chanceOfGetting.legendary) * (($scope.itemsOwned[rarity] / $scope.itemsTotal[rarity]) * $scope.duplicateValue[rarity]
						  + (($scope.itemsTotal[rarity] - $scope.itemsOwned[rarity]) / $scope.itemsTotal[rarity]) * $scope.craftingCost[rarity]);
				else value += $scope.chanceOfGetting[rarity] * (($scope.itemsOwned[rarity] / $scope.itemsTotal[rarity]) * $scope.duplicateValue[rarity]
						   + (($scope.itemsTotal[rarity] - $scope.itemsOwned[rarity]) / $scope.itemsTotal[rarity]) * $scope.craftingCost[rarity]);
			}
			return value;
		}
		
		function getLegendaryValue($scope) {
			var value = 0;
			value += 1 * (($scope.itemsOwned.legendary / $scope.itemsTotal.legendary) * $scope.duplicateValue.legendary
				  + (($scope.itemsTotal.legendary - $scope.itemsOwned.legendary) / $scope.itemsTotal.legendary) * $scope.craftingCost.legendary);

			return value;
		}		
	});