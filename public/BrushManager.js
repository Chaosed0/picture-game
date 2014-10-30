
//Manages different painters (brushes).
function BrushManager(canvas) {
	var brushes = {};
	var paths = [];

	this.setSize = function(id, size) { brushes[id].setSize(size); };
	this.setColor = function(id, color) { brushes[id].setColor(color); };
	this.toggleBrush = function(id) { brushes[id].toggleBrush(); };
	this.setBrush = function(id, isBrush) { brushes[id].setBrush(isBrush); };
	this.isBrush = function(id) { return brushes[id].isBrush(); };

	this.clearCanvas = function() {
		var context = canvas[0].getContext('2d');
		context.clearRect(0, 0, canvas.width(), canvas.height());
		paths = [];
	}

	this.initPaths = function(init_paths) {
		paths = init_paths;
	};

	this.redraw = function() {
		var brush = new Brush(canvas);
		for(var i = 0; i < paths.length; i++) {
			var path = paths[i].path;
			brush.setColor(paths[i].color);
			brush.setSize(paths[i].size);
			brush.setBrush(paths[i].isBrush);
			brush.startDraw(paths[0]);

			for(var j = 1; j < path.length; j++) {
				brush.updateDraw(path[j]);
			}
			brush.endDraw();
		}
	};

	this.newBrush = function(id) {
		brushes[id] = new Brush(canvas);
	};

	this.destroyBrush = function(id) {
		delete brushes[id];
	};

	this.startDraw = function(id, pos) {
		if (id in brushes) {
			brushes[id].startDraw(pos);
		}
	};

	this.endDraw = function(id, pos) {
		if (id in brushes) {
			paths.push(brushes[id].endDraw());
		}
	};

	this.updateDraw = function(id, pos) {
		if (id in brushes) {
			brushes[id].updateDraw(pos);
		}
	};
}
