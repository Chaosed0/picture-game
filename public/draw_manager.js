
function draw_manager(canvas) {
	var state = {};

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
