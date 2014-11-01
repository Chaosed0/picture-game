
//Paints lines, stores brush attributes.
function Brush(canvas) {
	var context = canvas[0].getContext('2d');
	var color = { r: 0, g: 0, b: 0 };
	var size = 5;
	var isBrush = true;
	var join = 'round';
	var cap = 'round';

	var painting = false;
	var lastPos = {x: 0, y: 0};

	var curPath = null;

	var colorAsStroke = function() {
		return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + 1.0 + ')';
	};

	this.startDraw = function(pos) {
		curPath = [ pos ];

		lastPos = pos;
		painting = true;
	}

	this.updateDraw = function(pos) {
		if(painting) {
			curPath.push(pos);

			context.globalCompositeOperation = (isBrush ? 'source-over' : 'destination-out');
			context.strokeStyle = colorAsStroke();
			context.lineJoin = join;
			context.lineCap = cap;
			context.lineWidth = size;

			context.beginPath();
			context.moveTo(lastPos.x, lastPos.y);
			context.lineTo(pos.x, pos.y);
			context.closePath();
			context.stroke();

			lastPos = pos;
		}
	};

	this.toggleBrush = function() {
		isBrush = !isBrush;
	};

	this.setBrush = function(in_isBrush) {
		isBrush = in_isBrush;
	};

	this.isBrush = function() {
		return isBrush;
	}

	this.setColor = function(in_color) {
		console.log(in_color);
		color = in_color;
	};

	this.getColor = function() {
		return color;
	}

	this.setSize = function(in_size) {
		size = in_size;
	};

	this.getSize = function() {
		return size;
	}

	this.endDraw = function() {
		painting = false;
		var obj = {
			path: simplify(curPath, 1.0),
			color: color,
			size: size,
			isBrush: isBrush
		}
		return obj;
	};
}
