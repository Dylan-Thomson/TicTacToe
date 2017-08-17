// Document Ready
$(function() {
	addMove();
});

var turnX = true;
var tds = $("td");
var x = "x", o = "o";

function addMove() {
	$("td").on("click", function() {
		if(!$(this).hasClass(x) && !$(this).hasClass(o)) {
			if(turnX) {
				$(this).addClass(x);
				$(this).text(x);				
			}
			else {
				$(this).addClass(o);
				$(this).text(o);
			}
			turnX = !turnX;
			checkForWinner();
		}
	});
}

function checkForWinner() {
}

