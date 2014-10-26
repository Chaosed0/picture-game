
//Paints lines, stores brush attributes.
function Brush(canvas) {
	var context = canvas[0].getContext('2d');
	var strokeStyle = '#000000';
	var lineJoin = 'round';
	var lineWidth = 5;

	var painting = false;
	var lastPos = {x: 0, y: 0};

	var curPath = null;

	this.startDraw = function(pos) {
		curPath = [ pos ];

		lastPos = pos;
		painting = true;
	}

	this.updateDraw = function(pos) {
		if(painting) {
			curPath.push(pos);

			context.strokeStyle = strokeStyle;
			context.lineJoin = 'round';
			context.lineWidth = lineWidth;

			context.beginPath();
			context.moveTo(lastPos.x, lastPos.y);
			context.lineTo(pos.x, pos.y);
			context.closePath();
			context.stroke();

			lastPos = pos;
		}
	};

	this.endDraw = function() {
		painting = false;
		var obj = {
			path: simplify(curPath, 1.0),
			color: strokeStyle,
			size: lineWidth
		}
		return obj;
	}

	this.setColor = function(color) {
		strokeStyle = color;
	};

	this.setSize = function(size) {
		lineWidth = size;
	};
}
