/*  main.js
    HotS Reroll Calc
*/
var HotSRerollCalc = (function() {
	/*********************************************************
	***************************DATA***************************
	*********************************************************/
	var raritiesEnum = {
	  common: "common",
	  rare: "rare",
	  epic: "epic",
	  legendary: "legendary"
	};
	
	var itemsTotal = {
		common: 693,
		rare: 535,
		epic: 369,
		legendary: 177
	};
	
	var itemsOwned = {
		common: 0,
		rare: 0,
		epic: 0,
		legendary: 0
	};

	var craftingCost = {
		common: 40,
		rare: 100,
		epic: 400,
		legendary: 1600
	};
	
    var duplicateValue = {
		common: 5,
		rare: 20,
		epic: 100,
		legendary: 400
	};
	
	// https://www.pcgamesn.com/heroes-of-the-storm/hots-loot-chest-opening-chances
	var chanceOfGetting = {
		common: 0.7176,
		rare: 0.1913,
		epic: 0.0706,
		legendary: 0.0205
	};

	var currentItems = {};
	/*********************************************************
	***************************INIT***************************
	*********************************************************/
	function initEventListeners() {
		// eventListener for entering collection data
		$(".collection-panel :text").on("focusout", setItemsOwned);	

		// eventListener for clicking the Reroll Items button
		$("#buttonRerollItems").on("click", function() {
			$(this).tooltip('hide'); newChest($("#chest-type").val());});
		
		// eventListener for clicking the Keep Items button
		$("#buttonKeepItems").on("click", function() {
			$(this).tooltip('hide'); keepItems();});
		
		// eventListener for selecting chest type
		$("#chest-type").on("change", function() { newChest($(this).val()) });
	}
	
	function initDisplay() {
		newChest($("#chest-type").val());
			
		// Display collection data
		displayCollection();

		// Activate tooltips
		$('[data-toggle="tooltip"]').tooltip({ trigger: "hover",
     		delay: { show: 750, hide: 0 } });
	}
	
	function initItems(nrItems) {
		currentItems = {};
		for (var i = 1; i <= nrItems; i++) {
			currentItems[i] = {};
			currentItems[i].rarity = "common";
			currentItems[i].duplicate = false;
		}
			
	}
	/*********************************************************
	**********************CHEST FUNCTIONS*********************
	*********************************************************/
	function newChest(rarity) {
		var nrItems = rarity == "legendary" ? 5 : 4;
		
		initItems(nrItems);
		buildItemBoxes(nrItems);
		resetItems();
		currentItems[nrItems].rarity = rarity;
		displaySelectedItems();
		updateChestValue();
		updateAverageValue(rarity);
		displayResult();
		$("#image-panel img").attr("src", "images/chest_" + rarity + ".jpg");
	}
	
	function updateChestValue() {
		var chestValue = 0;
		
		for (item in currentItems)
			chestValue += currentItems[item].duplicate ?
			    duplicateValue[currentItems[item].rarity] :
				craftingCost[currentItems[item].rarity];
		
		$("#chest-value").html((chestValue));		
	}
	
	function updateAverageValue(rarity) {
		var averageValue = 0;

		if (rarity == "common")
			averageValue = getCommonValue() * 4;
		else if (rarity == "rare")
			averageValue = getCommonValue() * 3 + getRareValue();
		else if (rarity == "epic")
			averageValue = getCommonValue() * 3 + getEpicValue();
		else if (rarity == "legendary")
			averageValue = getCommonValue() * 4 + getLegendaryValue();
		
		$("#average-value").html((averageValue).toFixed(1));
	}
	
	function getCommonValue() {
		var value = 0;
		
		for (rarity in chanceOfGetting) {
		    value += chanceOfGetting[rarity] * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		          + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * craftingCost[rarity]);
		}
		return value;
	}
	
	function getRareValue() {
		var value = 0;
		
		for (rarity in chanceOfGetting) {
			if (rarity == "common") continue;
			else if (rarity == "rare")
		        value += (1 - (chanceOfGetting.epic + chanceOfGetting.legendary)) * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		              + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * craftingCost[rarity]);
			else value += chanceOfGetting[rarity] * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		               + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * craftingCost[rarity]);
		}
		return value;
	}
		
	function getEpicValue() {
		var value = 0;
		
		for (rarity in chanceOfGetting) {
			if (rarity == "common" || rarity == "rare") continue;
			else if (rarity == "epic")
		        value += (1 - chanceOfGetting.legendary) * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		              + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * craftingCost[rarity]);
			else value += chanceOfGetting[rarity] * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		               + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * craftingCost[rarity]);
		}
		return value;
	}
	
	function getLegendaryValue() {
		var value = 0;
		value += 1 * ((itemsOwned.legendary / itemsTotal.legendary) * duplicateValue.legendary
		      + ((itemsTotal.legendary - itemsOwned.legendary) / itemsTotal.legendary) * craftingCost.legendary);

		return value;
	}
	/*********************************************************
	**************************DISPLAY*************************
	*********************************************************/
	function buildItemBoxes(nrItems) {
		$("#items-row").html("");
		
		var columns = nrItems == 5 ? "5ths" : 12 / nrItems;
		for (var i = 1; i <= nrItems; i++) {
		    var div = $("<div/>", { class: "col-xs-" + columns + " item-panel", text: "Item " + i });
			var ul = $("<ul/>", { id: "item" + i }).on("click", setItem);
			ul.append($("<li/>").append($("<a/>", { class: "common", text: "C" })));
			ul.append($("<li/>").append($("<a/>", { class: "rare", text: "R" })));
			ul.append($("<li/>").append($("<a/>", { class: "epic", text: "E" })));
			ul.append($("<li/>").append($("<a/>", { class: "legendary", text: "L" })));
			ul.append($("<li/>").append($("<a/>", { class: "duplicate", text: "Duplicate" })));
			div.append(ul);
			$("#items-row").append(div);
		}
	}
	
	function displayResult() {
		if (parseFloat($("#chest-value").html()) > parseFloat($("#average-value").html())) {
			$("#result-average").css("background-color", "#FFFFFF");
		    $("#result-chest").css("background-color", "#98FF21");
		}
		else {
			$("#result-average").css("background-color", "#98FF21");
			$("#result-chest").css("background-color", "#FFFFFF");
		}
	}
	
	function displayCollection() {
		for (rarity in raritiesEnum) {
		    $(".collection-panel." + rarity + " :text").val(itemsOwned[rarity]);
			$(".collection-panel." + rarity + " .items-total").html(itemsTotal[rarity]);
		}
	}
	
	function displaySelectedItems() {
		for (item in currentItems) {
			for (rarity in raritiesEnum)
			    $("#item" + item + " a." + rarity).removeClass("selected");
			
			$("#item" + item + " a.duplicate").removeClass("selected");
		}		
		// Select item rarity for each item
		for (item in currentItems)
			$("#item" + item + " a." + currentItems[item].rarity).addClass("selected");
	}
	/*********************************************************
	**********************ITEM FUNCTIONS**********************
	*********************************************************/		
	function setItem(evt) {
	  if ($(evt.target).html().length == 1) {
		  var itemBoxes = $(this).find("a");
		  for (var i = 0; i < 4; i++)
			  $(itemBoxes[i]).removeClass("selected");
		
	      currentItems[$(this).attr("id").charAt(4)].rarity = 
		      $(evt.target).attr("class").split(" ")[0];
		  $(evt.target).toggleClass("selected");
	  }
	  else {
		  var duplicate = currentItems[$(this).attr("id").charAt(4)].duplicate;
	      currentItems[$(this).attr("id").charAt(4)].duplicate = !duplicate;
		  $(evt.target).toggleClass("selected");
	  }
	  
	  updateChestValue();
	  displayResult();
	}
	
	function setItemsOwned(evt) {
		var rarity = $(this).parent().attr("class").split(" ").pop();
		itemsOwned[rarity] = $(this).val();
		
		updateLocalStorage();
		updateAverageValue($("#chest-type").val());
		displayResult();
	}
	
	function keepItems() {
		for (item in currentItems)
			if (!currentItems[item].duplicate)
				itemsOwned[currentItems[item].rarity]++;
		
		updateLocalStorage();
		newChest($("#chest-type").val());
		displayCollection();
	}
	
	function resetItems() {
		for (item in currentItems) {
			currentItems[item].rarity = "common";
			currentItems[item].duplicate = false;
		}
		
		displaySelectedItems();
		updateChestValue();
		displayResult();
	}
	/*********************************************************
	**********************LOCAL STORAGE***********************
	*********************************************************/	
	function loadLocalStorage() {
		var collection = JSON.parse(localStorage.getItem('collection'));
		if (collection)
			itemsOwned = collection;
	}
	
	function updateLocalStorage() {
		localStorage.setItem("collection", JSON.stringify(itemsOwned));
	}
	/*********************************************************
	***********************MAIN FUNCTION**********************
	*********************************************************/
	return {
		init: function() {
			// Check for HTML5 storage support
			if (typeof(Storage) !== "undefined")
				// Load collection
				loadLocalStorage();
			
			initEventListeners();
			initDisplay();
		}
	};
})();
window.onload = HotSRerollCalc.init();