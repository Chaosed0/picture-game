
//Listens for events and paints on the canvas.
function LocalBrush(comms, canvas) {
	var brush = new Brush(canvas);
	var lastMouse = { x: 0, y: 0 };
	var painting = false;

	canvas.mousedown(function(e) {
		var bounds = this.getBoundingClientRect();
		painting = true;
		lastMouse.x = e.pageX - bounds.left;
		lastMouse.y = e.pageY - bounds.top;
		comms.startDraw(lastMouse);
	});

	canvas.mousemove(function(e) {
		if(painting) {
			var bounds = this.getBoundingClientRect();
			var nowMouse = { x: e.pageX - bounds.left,
				y: e.pageY - bounds.top };

			brush.drawLine(lastMouse, nowMouse);
			comms.updateDraw(nowMouse);

			lastMouse = nowMouse;
		}
	});

	canvas.mouseup(function(e) {
		comms.endDraw();
		painting = false;
	});
}
