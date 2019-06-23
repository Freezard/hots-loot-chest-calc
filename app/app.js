/*  app.js
    HotS Reroll Calc
*/
var HotSRerollCalc = (function() {
	var app = angular.module("HotSRerollCalc",
		["ngRoute",
		"chestCtrl",
		"itemBoxesCtrl",
		"resultPanelCtrl",
		"buttonsCtrl",
		"collectionCtrl",
		"capitalizeFilter"]);
	app.config(function($routeProvider) {
		$routeProvider
		.when("/", {
			templateUrl : "login.htm"
		})
		.when("/logout", {
			templateUrl : "logout.htm"
		})
		.when("/register", {
			templateUrl : "register.htm"
		});
	});
	app.run(function($rootScope) {
		$rootScope.raritiesEnum = {
			common: "common",
			rare: "rare",
			epic: "epic",
			legendary: "legendary"
		};
		
		$rootScope.itemsTotal = {
			common: 827,
			rare: 654,
			epic: 418,
			legendary: 223
		};
		
		$rootScope.itemsOwned = {
			common: 0,
			rare: 0,
			epic: 0,
			legendary: 0
		};

		$rootScope.craftingCost = {
			common: 40,
			rare: 100,
			epic: 400,
			legendary: 1600
		};
	
		$rootScope.duplicateValue = {
			common: 5,
			rare: 20,
			epic: 100,
			legendary: 400
		};
	
		// https://www.pcgamesn.com/heroes-of-the-storm/hots-loot-chest-opening-chances
		$rootScope.chanceOfGetting = {
			common: 0.7176,
			rare: 0.1913,
			epic: 0.0706,
			legendary: 0.0205
		};

		$rootScope.model = {
			currentItems : {
			1 : { rarity: "common", duplicate: false },
			2 : { rarity: "common", duplicate: false },
			3 : { rarity: "common", duplicate: false },
			4 : { rarity: "common", duplicate: false }
		},
			currentChest : "common"
		};
		
		if (typeof(Storage) !== "undefined")
			loadLocalStorage($rootScope);
	});
	/*********************************************************
	**********************LOCAL STORAGE***********************
	*********************************************************/	
	function loadLocalStorage($rootScope) {
		var collection = JSON.parse(localStorage.getItem('collection'));
		
		if (collection)
			$rootScope.itemsOwned = collection;
	}
})();
