var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var turnX = true;
var human;
var ai;
var mode;
var winConditions = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8],
	[0, 3, 6], [1, 4, 7], [2, 5, 8],
	[0, 4, 8], [2, 4, 6]
];

// Document Ready
$(function() {
	initListeners();
});

function initListeners() {
	$("#0, #1, #2, #3, #4, #5, #6, #7, #8").on("click", function() {
		move($(this));
	});
	$(".reset").on("click", function() {
		fadeScreen(".board", ".select-game-mode", reset);
	});
	$(".two-player").on("click", function() {
		mode = "twoPlayer";
		fadeScreen(".select-game-mode", ".board");
	});
	$(".ai-easy").on("click", function() {
		mode = "aiEasy";
		fadeScreen(".select-game-mode", ".select-xo");
	});
	$(".ai-hard").on("click", function() {
		mode = "aiHard";
		fadeScreen(".select-game-mode", ".select-xo");
	});
	$(".select-x").on("click", function() {
		human = "x";
		ai = "o";
		fadeScreen(".select-xo", ".board");
	});
	$(".select-o").on("click", function() {
		human = "o";
		ai = "x";
		fadeScreen(".select-xo", ".board", function() {
		aiMove();
		});
	});
}

// Fade out previous class, fade in next class, optionally call func when done
function fadeScreen(prev, next, func) {
	$(prev).fadeOut("slow", function() {
		$(next).fadeIn("slow", function() {
			if(func) {
				func();
			}
		});
	});
}

function move(square) {
	if(!square.hasClass("x") && !square.hasClass("o")) {
		var player;
		if(turnX) {
			player = "x";
		}
		else {
			player = "o";
		}
		square.addClass(player);
		square.text(player);
		board[$("td").index(square)] = player;
		turnX = ! turnX;
		console.log(board);

		if(winner(board)) {
			alert(player + " has won!");
			reset();
			if(ai === "x") {
				aiMove();
			}
		}
		else if(draw(board)) {
			alert("Draw...");
			reset();			
			if(ai === "x") {
				aiMove();
			}
		}
		else if((human === "x" && !turnX) || (human === "o" && turnX)) {
			aiMove();
		}
	}
}

function reset() {
	$("td").removeAttr("class");
	$("td").text("");
	turnX = true;
	board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

function winner(board) {
	for(var i = 0; i < winConditions.length; i++) {
		if(board[winConditions[i][0]] == board[winConditions[i][1]] && board[winConditions[i][0]] == board[winConditions[i][2]]) {
			return true;
		}
	}
	return false;
}

function draw(board) {
	for(var i = 0; i < board.length; i++) {
		if(!isNaN(board[i])) {
			return false;
		}
	}
	return true;
}

function aiMove() {
	if(mode === "aiEasy") {
		aiEasyMove();
	}
	else if(mode === "aiHard") {
		aiHardMove();
	}
}

function aiEasyMove() {
	console.log("easy ai moving");
	var emptySquares = getEmptySquares();
	var randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
	move($("td:eq(" + randomEmptySquare + ")"));
}

function aiHardMove() {
	console.log("hard ai moving");
}

function getEmptySquares() {
	return board.filter(function(square) {
		return !isNaN(square);
	});
}