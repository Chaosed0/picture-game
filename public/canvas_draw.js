
function canvas_draw(canvas) {
	var context = canvas[0].getContext('2d');
	var strokeStyle = '#000000';
	var lineJoin = 'round';
	var lineWidth = 5;

	this.drawLine = function(from, to) {
		context.strokeStyle = strokeStyle;
		context.lineJoin = "round";
		context.lineWidth = lineWidth;

		context.beginPath();
		context.moveTo(from.x, from.y);
		context.lineTo(to.x, to.y);
		context.closePath();
		context.stroke();
	};

	this.setColor = function(color) {
		strokeStyle = color;
	};

	this.setSize = function(size) {
		lineWidth = size;
	};

	this.mousedown = function(cb) { canvas.mousedown(cb); };
	this.mousemove = function(cb) { canvas.mousemove(cb); };
	this.mouseup = function(cb) { canvas.mouseup(cb); };
}
