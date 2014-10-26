
//Manages different painters (brushes).
function BrushManager(canvas) {
	var brushes = {};
	var paths = [];

	this.setSize = function(id, size) { brushes[id].setSize(size); };
	this.setColor = function(id, color) { brushes[id].setColor(color); };

	this.initPaths = function(init_paths) {
		paths = init_paths;
	};

	this.redraw = function() {
		for(var i = 0; i < paths.length; i++) {
			var path = paths[i].path;
			var context = canvas[0].getContext('2d');

			context.strokeStyle = paths[i].color;
			context.lineJoin = 'round';
			context.lineCap = 'round';
			context.lineWidth = paths[i].size;

			context.beginPath();
			context.moveTo(path[0].x, path[0].y);
			for(var j = 1; j < path.length; j++) {
				context.lineTo(path[j].x, path[j].y);
			}
			context.stroke();
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
