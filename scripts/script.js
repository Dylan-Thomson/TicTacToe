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
		$("td").removeClass("x");
		$("td").removeClass("o");
		$("td").text("");
	});
}

function checkForWinner() {
	console.log($("tr:nth-of-type(2) td"));
}

