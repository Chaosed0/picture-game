
//Null, for when we just want a local canvas.
function NullComms() {
	this.startDraw = function(pos) { };

	this.endDraw = function() { };

	this.updateDraw = function(pos) { };
}
