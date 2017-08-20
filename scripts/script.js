var turnX = true;
var tds = $("td");
var winConditions = [];

// Document Ready
$(function() {
	initPlayerMoveListeners();
	initResetListener();
	initWinConditions();
});


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
			gameOver($(this));
		}
	});
}

function initResetListener() {
	$(".reset").on("click", function() {
		$("td").removeAttr("class");
		$("td").text("");
		turnX = true;
	});
}

function initWinConditions() {
	winConditions.push($("tr:nth-of-type(1) td")); // row 1
	winConditions.push($("tr:nth-of-type(2) td")); // row 2
	winConditions.push($("tr:nth-of-type(3) td")); // row 3
	winConditions.push($("td:nth-of-type(1)")); // col 1
	winConditions.push($("td:nth-of-type(2)")); // col 2
	winConditions.push($("td:nth-of-type(3)")); // col 3
	winConditions.push($("tr:nth-of-type(1) td:nth-of-type(1), tr:nth-of-type(2) td:nth-of-type(2), tr:nth-of-type(3) td:nth-of-type(3)")); // diag L->R
	winConditions.push($("tr:nth-of-type(1) td:nth-of-type(3), tr:nth-of-type(2) td:nth-of-type(2), tr:nth-of-type(3) td:nth-of-type(1)")); // diag R->L
}

// check if last move ends game
function gameOver(lastMove) {
	if(checkForWinner()) {
		alert(lastMove.attr("class") + " has won!");
		$(".reset").trigger("click");
		return;
	}
	if(checkForDraw()) {
		alert("Draw...");
		$(".reset").trigger("click");
	}
}

// check each win condition to see if met
function checkForWinner() {
	for(var i = 0; i < winConditions.length; i++) {
		if(checkWinCondition(winConditions[i])) {
			return true;
		}
	}
	return false;
}

// check a win condition to see if met
function checkWinCondition(arr) {
	for(var i = 0; i < arr.length; i++) {
		// current square is empty
		if(!arr[i].attributes.class) { 
			return false;
		}
		// current square has a different symbol than first square
		if(i > 0 && arr[0].attributes.class.nodeValue !== arr[i].attributes.class.nodeValue) {
			return false;
		}
	}
	return true;
}

// check for empty squares
function checkForDraw() {
	for(var i = 0; i < tds.length; i++) {
		if(!tds[i].attributes.class) {
			return false;
		}
	}
	return true;
}