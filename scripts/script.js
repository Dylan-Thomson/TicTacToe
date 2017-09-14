var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var gameMode;
var human;
var ai;
var xScore = 0;
var oScore = 0;
var isTurnX = true;
var isBoardActive = false;
var isFading = false;
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
		if(isBoardActive) {
			move($(this));
		}
	});
	$(".reset").on("click", function() {
		if(!isFading) {
			resetBoard();
			if(ai === "x") {
				aiMove();
			}
		}
	});
	$(".board .main-menu").on("click", function() {
		if(!isFading) {
			fadeScreen(".board", ".select-game-mode", function() {
				resetBoard();
				resetScore();
				isBoardActive = false;
			});
		}
	});
	$(".two-player").on("click", function() {
		if(!isFading) {
			gameMode = "twoPlayer";
			fadeScreen(".select-game-mode", ".board", function() {
				isBoardActive = true;
			});
		}
	});
	$(".ai-easy").on("click", function() {
		if(!isFading) {
			gameMode = "aiEasy";
			fadeScreen(".select-game-mode", ".select-xo");
		}
	});
	$(".ai-hard").on("click", function() {
		if(!isFading) {
			gameMode = "aiHard";
			fadeScreen(".select-game-mode", ".select-xo");
		}
	});
	$(".select-x").on("click", function() {
		if(!isFading) {
			human = "x";
			ai = "o";
			fadeScreen(".select-xo", ".board", function() {
				isBoardActive = true;
			});
		}
	});
	$(".select-o").on("click", function() {
		if(!isFading) {
			human = "o";
			ai = "x";
			fadeScreen(".select-xo", ".board", function() {
				aiMove();
			});
		}
	});
	$(".play-again").on("click", function() {
		if(!isFading) {
			fadeScreen(".game-over", ".board");
			isBoardActive = true;
			if(ai === "x") {
				setTimeout(function() {
					aiMove();
				}, 500);
			}
		}
	});
	$(".game-over .main-menu").on("click", function() {
		if(!isFading) {
			fadeScreen(".game-over", ".select-game-mode", function() {
				resetScore();
				isBoardActive = false;
			});
		}
	});
}

// Fade out previous class, fade in next class, optionally call func when done
function fadeScreen(prev, next, func) {
	isFading = true;
	$(prev).fadeOut("slow", function() {
		$(next).fadeIn("slow", function() {
			if(func) {
				func();
			}
			isFading = false;
		});
	});
}

function move(square) {
	if(!square.hasClass("x") && !square.hasClass("o")) {
		var player;
		if(isTurnX) {
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

		// Check for winner or draw. Take AI turn if player has just moved
		var winningSquares = winner(board, player);
		if(winningSquares) {
			isBoardActive = false;
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
		else if((human === "x" && !isTurnX) || (human === "o" && isTurnX)) {
			aiMove();
		}
	}
}

function resetBoard() {
	$("td").removeAttr("class");
	$("td").text("");
	isTurnX = true;
	$(".current-turn-label").text("X");
	board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

function resetScore() {
	xScore = 0;
	$(".x-score-label").text(xScore);
	oScore = 0;
	$(".o-score-label").text(oScore);
}

function updateScore(player) {
	if(player === "x") {
		xScore++;
		$(".x-score-label").text(xScore);
	}
	else if(player === "o") {
		oScore++;
		$(".o-score-label").text(oScore);
	}
}

function updateTurn() {
	isTurnX = !isTurnX;
	if(isTurnX) {
		$(".current-turn-label").text("X");
	}
	else {
		$(".current-turn-label").text("O");
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
	if(gameMode === "aiEasy") {
		aiEasyMove();
	}
	else if(gameMode === "aiHard") {
		aiHardMove();
	}
}

// Picks a random empty square
function aiEasyMove() {
	isBoardActive = false;
	console.log("easy ai moving");
	var emptySquares = getEmptySquares(board);
	var randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
	window.setTimeout(function() {
		move($("td:eq(" + randomEmptySquare + ")"));
		isBoardActive = true;
	}, 500);
}

// Uses minimax to pick the best empty square
function aiHardMove() {
	isBoardActive = false;
	console.log("hard ai moving");
	window.setTimeout(function() {
		move($("td:eq(" + minimax(board, ai).index + ")"));
		isBoardActive = true;
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