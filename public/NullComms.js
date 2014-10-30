
//Null, for when we just want a local canvas.
function NullComms() {
	var nullFunc = function() { };

	this.setColor = nullFunc;
	this.toggleBrush = nullFunc;
	this.setSize = nullFunc;
	this.startDraw = nullFunc;
	this.endDraw = nullFunc;
	this.updateDraw = nullFunc;
	this.clearCanvas = nullFunc;
}
