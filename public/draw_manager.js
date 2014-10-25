
function draw_manager(canvas) {
	var state = {};

	this.drawPaths = function(paths) {
		console.log(paths);
		for(var i = 0; i < paths.length; i++) {
			var path = paths[i].path;
			var context = canvas[0].getContext('2d');
			console.log(path);

			context.strokeStyle = '#000000';
			context.lineJoin = "round";
			context.lineWidth = 5;

			context.beginPath();
			context.moveTo(path[0].x, path[0].y);
			for(var j = 1; j < path.length; j++) {
				context.lineTo(path[j].x, path[j].y);
			}
			context.stroke();
		}
	}

	this.newManager = function(id) {
		state[id] = {
			draw: new canvas_draw(canvas),
			lastPos: { x: 0, y: 0 },
			painting: false
		};
	};

	this.destroyManager = function(id) {
		delete state[id];
	};

	this.startDraw = function(id, pos) {
		if (id in state) {
			state[id].lastPos = pos;
			state[id].painting = true;
		}
	};

	this.stopDraw = function(id, pos) {
		if (id in state) {
			state[id].painting = false;
		}
	};

	this.updateDraw = function(id, pos) {
		if (id in state && state[id].painting) {
			state[id].draw.drawLine(state[id].lastPos, pos);
			state[id].lastPos = pos;
		}
	};
}
