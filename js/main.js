/*  main.js
    HotS Loot Chest Calc
*/
var HotSLootChestCalc = (function() {
	/*********************************************************
	***************************DATA***************************
	*********************************************************/
	var totalItems = {
		common: 50,
		rare: 20,
		epic: 10,
		legendary: 5
	};
	
	var ownedItems = {
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
	
	var chanceOfGetting = {
		common: 0.7176,
		rare: 0.1913,
		epic: 0.0706,
		legendary: 0.0205
	};

	var items = {
		1: { quality: "common",
		      duplicate: false
		},
		2: { quality: "common",
		      duplicate: false
		},
		3: { quality: "common",
		      duplicate: false
		},
		4: { quality: "common",
		      duplicate: false
		}
	};
	/*********************************************************
	**********************CHEST FUNCTIONS*********************
	*********************************************************/
	function showResult() {
		var averageValue = 0;
		for (rarity in chanceOfGetting) {
		averageValue += chanceOfGetting[rarity] * ((ownedItems[rarity] / totalItems[rarity]) * duplicateValue[rarity]
		            + ((totalItems[rarity] - ownedItems[rarity]) / totalItems[rarity]) * itemValue[rarity]);
		}
		
		$("#average-value").html((averageValue * 4).toFixed(1));
		
		var chestValue = 0;
		for (item in items)
			chestValue += items[item].duplicate ?
			    duplicateValue[items[item].quality] : itemValue[items[item].quality];
		
		$("#chest-value").html((chestValue));
		
		if ($("#chest-value").html() > $("#chest-average").html())
		    $("#result-chest").css("background-color", "green");
		else $("#result-average").css("background-color", "#98FF21");
	}
	
	function setItem(evt) {
	  if ($(evt.target).html().length == 1) {
	    items[$(this).attr("id").charAt(4)].quality = 
		    $(evt.target).attr("class").split(" ")[0];
		$(evt.target).toggleClass("selected");
	  }
	  else {
		var duplicate = items[$(this).attr("id").charAt(4)].duplicate;
	    items[$(this).attr("id").charAt(4)].duplicate = !duplicate;
		$(evt.target).toggleClass("selected");
	  }
	  
	  showResult();
	}
	/*********************************************************
	***********************MAIN FUNCTION**********************
	*********************************************************/
	return {
		init: function() {
			$(".item-panel ul").on('click', setItem);
						
			showResult();
		}
	};
})();
window.onload = HotSLootChestCalc.init();