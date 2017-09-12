var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var turnX = true;
var human;
var ai;
var xScore = 0;
var oScore = 0;
var mode;
var boardActive = false;
var fading = false;
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
		if(!fading) {
			resetBoard();
			if(ai === "x") {
				aiMove();
			}
		}
	});
	$(".board .main-menu").on("click", function() {
		if(!fading) {
			fadeScreen(".board", ".select-game-mode", function() {
				resetBoard();
				resetScore();
				boardActive = false;
			});
		}
	});
	$(".two-player").on("click", function() {
		if(!fading) {
			mode = "twoPlayer";
			fadeScreen(".select-game-mode", ".board", function() {
				boardActive = true;
			});
		}
	});
	$(".ai-easy").on("click", function() {
		if(!fading) {
			mode = "aiEasy";
			fadeScreen(".select-game-mode", ".select-xo");
		}
	});
	$(".ai-hard").on("click", function() {
		if(!fading) {
			mode = "aiHard";
			fadeScreen(".select-game-mode", ".select-xo");
		}
	});
	$(".select-x").on("click", function() {
		if(!fading) {
			human = "x";
			ai = "o";
			fadeScreen(".select-xo", ".board", function() {
				boardActive = true;
			});
		}
	});
	$(".select-o").on("click", function() {
		if(!fading) {
			human = "o";
			ai = "x";
			fadeScreen(".select-xo", ".board", function() {
				aiMove();
			});
		}
	});
	$(".play-again").on("click", function() {
		if(!fading) {
			fadeScreen(".game-over", ".board");
			boardActive = true;
			if(ai === "x") {
				aiMove();
			}
		}
	});
	$(".game-over .main-menu").on("click", function() {
		if(!fading) {
			fadeScreen(".game-over", ".select-game-mode", function() {
				resetScore();
				boardActive = false;
			});
		}
	});
}

// Fade out previous class, fade in next class, optionally call func when done
function fadeScreen(prev, next, func) {
	fading = true;
	$(prev).fadeOut("slow", function() {
		$(next).fadeIn("slow", function() {
			if(func) {
				func();
			}
			fading = false;
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

		// Check for winner or draw, then take AI turn
		var winningSquares = winner(board, player);
		if(winningSquares) {
			boardActive = false;
			winningSquares.forEach(function(square) {
				$("td:eq(" + square + ")").addClass("winning-square");
			});
			setTimeout(function() {
				updateScore(player);
				$(".game-over-msg").text(player + " has won!");
				fadeScreen(".board", ".game-over", resetBoard);
			}, 500);
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

// Picks a random empty square
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

// Uses minimax to pick the best empty square
function aiHardMove() {
	boardActive = false;
	console.log("hard ai moving");
	window.setTimeout(function() {
		move($("td:eq(" + minimax(board, ai).index + ")"));
		boardActive = true;
	}, 500);
}

function minimax(newBoard, player) {
	var emptySquares = getEmptySquares(newBoard);
	if(winner(newBoard, human)) {
		return {score: -10};
	}
	else if(winner(newBoard, ai)) {
		return {score: 10};
	}
	else if(emptySquares.length === 0) {
		return {score: 0};
	}

	var moves = [];

	for(var i = 0; i < emptySquares.length; i++) {
		var move = {};
		move.index = newBoard[emptySquares[i]]

		newBoard[emptySquares[i]] = player;

		if(player === ai) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		}
		else{
			var result = minimax(newBoard, ai);
			move.score = result.score;
		}

		newBoard[emptySquares[i]] = move.index;

		moves.push(move);
	}	

	var bestMove;
	if(player === ai) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if(moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if(moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}

function getEmptySquares(board) {
	return board.filter(function(square) {
		return !isNaN(square);
	});
}