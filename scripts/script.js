// Document Ready
$(function() {
	initPlayerMoveListeners();
	initResetListener();
});

var turnX = true;
var tds = $("td");

function initPlayerMoveListeners() {
	$("td").on("click", function() {
		if(!$(this).hasClass("x") && !$(this).hasClass("o")) {
			if(turnX) {
				$(this).addClass("x");
				$(this).text("x");				
			}
			else {
				$(this).addClass("o");
				$(this).text("o");
			}
			turnX = !turnX;
			checkForWinner();
		}
	});
}

function initResetListener() {
	$("#reset").on("click", function() {
		$("td").removeAttr("class");
		$("td").text("");
		turnX = true;
	});
}

function checkForWinner() {
	var winConditions = [];
	winConditions.push($("tr:nth-of-type(1) td")); // row 1
	winConditions.push($("tr:nth-of-type(2) td")); // row 2
	winConditions.push($("tr:nth-of-type(3) td")); // row 3
	winConditions.push($("td:nth-of-type(1)")); // col 1
	winConditions.push($("td:nth-of-type(2)")); // col 2
	winConditions.push($("td:nth-of-type(3)")); // col 3
	winConditions.push($("tr:nth-of-type(1) td:nth-of-type(1), tr:nth-of-type(2) td:nth-of-type(2), tr:nth-of-type(3) td:nth-of-type(3)")); // diag L->R
	winConditions.push($("tr:nth-of-type(1) td:nth-of-type(3), tr:nth-of-type(2) td:nth-of-type(2), tr:nth-of-type(3) td:nth-of-type(1)")); // diag R->L
	for(var i = 0; i < winConditions.length; i++) {
		if(checkWinCondition(winConditions[i])) {
			alert(winConditions[i][0].attributes.class.nodeValue + " has won!");
			$("#reset").trigger("click");
			break;
		}
	}
}

function checkWinCondition(arr) {
	if(!arr[0].attributes.class) {
		return false;
	}
	for(var i = 1; i < arr.length; i++) {
		// check if square is empty
		if(!arr[i].attributes.class) { 
			return false;
		}
		// check if current square has a different symbol than first square
		if(arr[0].attributes.class.nodeValue !== arr[i].attributes.class.nodeValue) {
			return false;
		}
	}
	return true;
}