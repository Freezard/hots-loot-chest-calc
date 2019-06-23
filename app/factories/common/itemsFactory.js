var app = angular.module("itemsFactory", []);

app.factory('itemsFactory', ['$window', function($window) {
	return {
		new: function(items, chestRarity) {
			if (chestRarity != "legendary" && items[5] != undefined)
				delete items[5];
			else if (chestRarity == "legendary" && items[5] == undefined) {
				items[5] = {};
				items[5].rarity = "common";
				items[5].duplicate = false;
			}
			this.reset(items, chestRarity);
		},
		reset: function(items, chestRarity) {
			for (var i = 1; i < Object.keys(items).length + 1; i++) {
				items[i].rarity = "common";
				items[i].duplicate = false;
			}
			
			items[1].rarity = chestRarity;
		}
	}
}]);