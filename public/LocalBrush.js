
//Listens for events and paints on the canvas.
function LocalBrush(comms, canvas, brushManager) {
	//negative IDs should not be assigned from server
	var id = -1;
	var painting = false;

	//init
	brushManager.newBrush(id);

	this.setSize = function(size) {
		brushManager.setSize(id, size);
		comms.setSize(size);
	};

	this.setColor = function(color) {
		brushManager.setColor(id, color);
		comms.setColor(color);
	};

	this.toggleBrush = function() {
		brushManager.toggleBrush(id);
		comms.toggleBrush();
	}

	this.clearCanvas = function() {
		brushManager.clearCanvas();
		comms.clearCanvas();
	};

	this.isBrush = function() {
		return brushManager.isBrush(id);
	}

	canvas.mousedown(function(e) {
		painting = true;
		var bounds = this.getBoundingClientRect();
		var pos = { x: e.pageX - bounds.left,
			y: e.pageY - bounds.top };
		brushManager.startDraw(id, pos);
		comms.startDraw(pos);
	});

	canvas.mousemove(function(e) {
		if(painting) {
			var bounds = this.getBoundingClientRect();
			var pos = { x: e.pageX - bounds.left,
				y: e.pageY - bounds.top };

			brushManager.updateDraw(id, pos);
			comms.updateDraw(pos);
		}
	});

	var endDraw = function(e) {
		if(painting) {
			brushManager.endDraw(id);
			comms.endDraw();
			painting = false;
		}
	}

	canvas.mouseup(endDraw);
	canvas.mouseout(endDraw);
}
