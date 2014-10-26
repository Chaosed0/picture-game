
//Listens for events and paints on the canvas.
function LocalBrush(comms, canvas, brushManager) {
	//negative IDs should not be assigned from server
	var id = -1;
	var painting = false;

	brushManager.newBrush(id);

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

	canvas.mouseup(function(e) {
		brushManager.endDraw(id);
		comms.endDraw();
		painting = false;
	});
}
