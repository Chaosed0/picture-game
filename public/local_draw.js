
function local_draw(comms, draws) {
	var lastMouse = { x: 0, y: 0 };
	var painting = false;

	draws.mousedown(function(e) {
		painting = true;
		lastMouse.x = e.pageX - this.offsetLeft;
		lastMouse.y = e.pageY - this.offsetTop;
		comms.startDraw(lastMouse);
	});

	draws.mousemove(function(e) {
		if(painting) {
			var nowMouse = { x: e.pageX - this.offsetLeft,
				y: e.pageY - this.offsetTop };

			draws.drawLine(lastMouse, nowMouse);
			comms.updateDraw(nowMouse);

			lastMouse = nowMouse;
		}
	});

	draws.mouseup(function(e) {
		comms.endDraw();
		painting = false;
	});
}
