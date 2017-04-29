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
		common: 522,
		rare: 452,
		epic: 278,
		legendary: 130
	};
	
	var itemsOwned = {
		common: 0,
		rare: 0,
		epic: 0,
		legendary: 0
	};
	
	var itemValue = {
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

	var items = {
		1: { rarity: "common",
		      duplicate: false
		},
		2: { rarity: "common",
		      duplicate: false
		},
		3: { rarity: "common",
		      duplicate: false
		},
		4: { rarity: "common",
		      duplicate: false
		}
	};
	/*********************************************************
	***************************INIT***************************
	*********************************************************/
	function initEventListeners() {
		// eventListener for item panels
		$(".item-panel ul").on("click", setItem);
			
		// eventListener for entering collection data
		$(".collection-panel :text").on("focusout", setItemsOwned);	

		// eventListener for clicking Keep Items button
		$("#buttonKeepItems").on("click", function() {
			$(this).tooltip('hide'); keepItems();});
		
	}
	
	function initDisplay() {
		// Pre-select item rarity for each item
		displaySelectedItems();
			
		// Display collection data
		displayCollection();
			
		// Calculate chest values and display result
		updateChestValue();
		updateAverageValue($("#chest-type").val());
		displayResult();

		// Activate tooltips
		$('[data-toggle="tooltip"]').tooltip({ delay: { show: 750, hide: 0 } });
	}
	/*********************************************************
	**********************CHEST FUNCTIONS*********************
	*********************************************************/
		updateAverageValue(rarity);
		resetItems();
		items[4].rarity = rarity;
		displaySelectedItems();
		updateChestValue();
		displayResult();
		$("#image-panel img").attr("src", "images/chest_" + rarity + ".png");
	}
	
	function updateChestValue() {
		var chestValue = 0;
		
		for (item in items)
			chestValue += items[item].duplicate ?
			    duplicateValue[items[item].rarity] : itemValue[items[item].rarity];
		
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
			averageValue = getCommonValue() * 3 + getLegendaryValue();
		
		$("#average-value").html((averageValue).toFixed(1));
	}
	
	function getCommonValue() {
		var value = 0;
		
		for (rarity in chanceOfGetting) {
		    value += chanceOfGetting[rarity] * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		          + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * itemValue[rarity]);
		}
		return value;
	}
	
	function getRareValue() {
		var value = 0;
		
		for (rarity in chanceOfGetting) {
			if (rarity == "common") continue;
			else if (rarity == "rare")
		        value += (1 - (chanceOfGetting.epic + chanceOfGetting.legendary)) * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		              + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * itemValue[rarity]);
			else value += chanceOfGetting[rarity] * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		               + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * itemValue[rarity]);
		}
		return value;
	}
		
	function getEpicValue() {
		var value = 0;
		
		for (rarity in chanceOfGetting) {
			if (rarity == "common" || rarity == "rare") continue;
			else if (rarity == "epic")
		        value += (1 - chanceOfGetting.legendary) * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		              + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * itemValue[rarity]);
			else value += chanceOfGetting[rarity] * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		               + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * itemValue[rarity]);
		}
		return value;
	}
	
	function getLegendaryValue() {
		var value = 0;
		value += 1 * ((itemsOwned.legendary / itemsTotal.legendary) * duplicateValue.legendary
		      + ((itemsTotal.legendary - itemsOwned.legendary) / itemsTotal.legendary) * itemValue.legendary);

		return value;
	}
	/*********************************************************
	**************************DISPLAY*************************
	*********************************************************/		
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
		for (item in items) {
			for (rarity in raritiesEnum)
			    $("#item" + item + " a." + rarity).removeClass("selected");
			
			$("#item" + item + " a.duplicate").removeClass("selected");
		}		
		// Select item rarity for each item
		for (item in items)
			$("#item" + item + " a." + items[item].rarity).addClass("selected");
	}
	/*********************************************************
	**********************ITEM FUNCTIONS**********************
	*********************************************************/		
	function setItem(evt) {
	  if ($(evt.target).html().length == 1) {
		  var itemBoxes = $(this).find("a");
		  for (var i = 0; i < 4; i++)
			  $(itemBoxes[i]).removeClass("selected");
		
	      items[$(this).attr("id").charAt(4)].rarity = 
		      $(evt.target).attr("class").split(" ")[0];
		  $(evt.target).toggleClass("selected");
	  }
	  else {
		  var duplicate = items[$(this).attr("id").charAt(4)].duplicate;
	      items[$(this).attr("id").charAt(4)].duplicate = !duplicate;
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
		for (item in items)
			if (!items[item].duplicate)
				itemsOwned[items[item].rarity]++;
		
		updateLocalStorage();
		displayCollection();
	}
	
	function resetItems() {
		for (item in items) {
			items[item].rarity = "common";
			items[item].duplicate = false;
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