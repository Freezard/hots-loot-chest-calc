/*  main.js
    HotS Loot Chest Calc
*/
var HotSLootChestCalc = (function() {
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
		averageValue += chanceOfGetting[rarity] * ((itemsOwned[rarity] / itemsTotal[rarity]) * duplicateValue[rarity]
		            + ((itemsTotal[rarity] - itemsOwned[rarity]) / itemsTotal[rarity]) * itemValue[rarity]);
		}
		
		$("#average-value").html((averageValue * 4).toFixed(1));
		
		var chestValue = 0;
		for (item in items)
			chestValue += items[item].duplicate ?
			    duplicateValue[items[item].quality] : itemValue[items[item].quality];
		
		$("#chest-value").html((chestValue));
		
		if (parseFloat($("#chest-value").html()) > parseFloat($("#average-value").html())) {
			$("#result-average").css("background-color", "#FFFFFF");
		    $("#result-chest").css("background-color", "#98FF21");
		}
		else {
			$("#result-average").css("background-color", "#98FF21");
			$("#result-chest").css("background-color", "#FFFFFF");
		}
	}
	
	function setItem(evt) {
	  if ($(evt.target).html().length == 1) {
		  var itemBoxes = $(this).find("a");
		  for (var i = 0; i < 4; i++)
			  $(itemBoxes[i]).removeClass("selected");
		
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
	
	function setItemsOwned(evt) {
		var rarity = $(this).parent().attr("class").split(" ").pop();
		itemsOwned[rarity] = $(this).val();
		
		updateLocalStorage();
		showResult();
	}
	
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
			if (typeof(Storage) !== "undefined") {
				loadLocalStorage();
			}
			
			$(".item-panel ul").on("click", setItem);
			
			for (item in items)
				$("#item" + item + " a." + items[item].quality).toggleClass("selected");
			
			for (rarity in raritiesEnum) {
			    $(".collection-panel." + rarity + " :text").val(itemsOwned[rarity]);
				$(".collection-panel." + rarity + " .items-total").html(itemsTotal[rarity]);
			}
			
			$(".collection-panel :text").on("focusout", setItemsOwned);
			
			showResult();
			
			$('[data-toggle="tooltip"]').tooltip({ delay: { show: 500, hide: 0 } });
		}
	};
})();
window.onload = HotSLootChestCalc.init();