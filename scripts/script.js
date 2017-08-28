var turnX = true;
var tds = $("td");
var winConditions = [];
var playerX;
var easyAI = false;
var hardAI = false;

// Document Ready
$(function() {
	initWinConditions();
	initGameModeListeners();
	initMoveListeners();
	initResetListener();
	initSelectXOListeners();
});

function initGameModeListeners() {
	$(".two-player").on("click", function() {
		displayBoard();
	});
	$(".ai-easy").on("click", function() {
		displaySelectXO();
		easyAI = true;
		hardAI = false;
	});
}

// TODO: do not allow player to click while AI is moving
function initMoveListeners() {
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
			endTurn($(this).attr("class"));
		}
	});
}

function endTurn(lastMove) {
	turnX = !turnX;
	if(!gameOver(lastMove) && playerX !== turnX){
		if(easyAI) {
			easyAIMove();
		}
		else if(hardAI) {

		}
	}
}

// Reset board and turnX, display start screen
function initResetListener() {
	$(".reset, .new-game").on("click", function() {
		$("td").removeAttr("class");
		$("td").text("");
		turnX = true;
		displayStart();
	});
}

function initSelectXOListeners() {
	$(".select-x").on("click", function() {
		playerX = true;
		displayBoard();
	});
	$(".select-o").on("click", function() {
		playerX = false;
		displayBoard();
		if(easyAI) {
			easyAIMove();
		}
		else if(hardAI) {
			hardAIMove();
		}
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
		$(".game-over-msg").text(lastMove + " has won!");
		displayGameOver();
		return true;
	}
	if(checkForDraw()) {
		$(".game-over-msg").text("Draw...");
		displayGameOver();
		return true;
	}
	return false;
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

function easyAIMove() {
	console.log("EASY AI MOVING");
	//get empty squares
	var emptySquares = $("td").not(".x, .o");

	//pick a random empty square
	var randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];

	// make move
	window.setTimeout(function() {
		$("td:eq(" + tds.toArray().indexOf(randomEmptySquare) + ")").trigger("click");
	}, 500);
}

function hardAIMove() {
	//minimax
}

function displayBoard() {
	$(".board").removeClass("hidden");
	$(".select-game-mode").addClass("hidden");
	$(".game-over").addClass("hidden");
	$(".select-xo").addClass("hidden");
}

function displayStart() {
	$(".select-game-mode").removeClass("hidden");
	$(".board").addClass("hidden");
	$(".game-over").addClass("hidden");
	$(".select-xo").addClass("hidden");
}

function displayGameOver() {
	$(".game-over").removeClass("hidden");
	$(".select-game-mode").addClass("hidden");
	$(".board").addClass("hidden");
	$(".select-xo").addClass("hidden");
}

function displaySelectXO() {
	$(".select-xo").removeClass("hidden");
	$(".select-game-mode").addClass("hidden");
}