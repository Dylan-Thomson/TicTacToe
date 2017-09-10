var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var turnX = true;
var human;
var ai;
var xScore = 0;
var oScore = 0;
var mode;
var boardActive = false;
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
		if(boardActive) {
			move($(this));
		}
	});
	$(".reset").on("click", function() {
		resetBoard();
		if(ai === "x") {
			aiMove();
		}
	});
	$(".board .main-menu").on("click", function() {
		fadeScreen(".board", ".select-game-mode", function() {
			resetBoard();
			resetScore();
			boardActive = false;
		});
	});
	$(".two-player").on("click", function() {
		mode = "twoPlayer";
		fadeScreen(".select-game-mode", ".board", function() {
			boardActive = true;
		});
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
		fadeScreen(".select-xo", ".board", function() {
			boardActive = true;
		});
	});
	$(".select-o").on("click", function() {
		human = "o";
		ai = "x";
		fadeScreen(".select-xo", ".board", function() {
			aiMove();
		});
	});
	$(".play-again").on("click", function() {
		fadeScreen(".game-over", ".board");
		if(ai === "x") {
			aiMove();
		}
	});
	$(".game-over .main-menu").on("click", function() {
		fadeScreen(".game-over", ".select-game-mode", function() {
			resetScore();
			boardActive = false;
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
		updateTurn();
		console.log(board);

		if(winner(board, player)) {
			updateScore(player);
			$(".game-over-msg").text(player + " has won!");
			fadeScreen(".board", ".game-over", resetBoard);
		}
		else if(draw(board)) {
			$(".game-over-msg").text("Draw...");
			fadeScreen(".board", ".game-over", resetBoard);
		}
		else if((human === "x" && !turnX) || (human === "o" && turnX)) {
			aiMove();
		}
	}
}

function resetBoard() {
	$("td").removeAttr("class");
	$("td").text("");
	turnX = true;
	$(".current-turn").text("X");
	board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

function resetScore() {
	xScore = 0;
	$(".xScore").text(xScore);
	oScore = 0;
	$(".oScore").text(oScore);
}

function updateScore(player) {
	if(player === "x") {
		xScore++;
		$(".xScore").text(xScore);
	}
	else if(player === "o") {
		oScore++;
		$(".oScore").text(oScore);
	}
}

function updateTurn() {
	turnX = !turnX;
	if(turnX) {
		$(".current-turn").text("X");
	}
	else {
		$(".current-turn").text("O");
	}
}

function winner(board, player) {
	for(var i = 0; i < winConditions.length; i++) {
		if(board[winConditions[i][0]] == player && board[winConditions[i][1]] == player && board[winConditions[i][2]] == player) {
			return winConditions[i];
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
	boardActive = false;
	console.log("easy ai moving");
	var emptySquares = getEmptySquares(board);
	var randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
	window.setTimeout(function() {
		move($("td:eq(" + randomEmptySquare + ")"));
		boardActive = true;
	}, 500);
}

function aiHardMove() {
	console.log("hard ai moving");
}

function getEmptySquares(board) {
	return board.filter(function(square) {
		return !isNaN(square);
	});
}