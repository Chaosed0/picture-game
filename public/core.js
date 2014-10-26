
$(document).ready(function() {
	var canvas = $('#thecanvas');
	var offline = false;

	var brushManager = new BrushManager(canvas);
	var comms;
	if(offline) {
		comms = new NullComms();
	} else {
		comms = new ServerComms('ws://127.0.0.1:8080/', brushManager);
	}
	var localBrush = new LocalBrush(comms, canvas, brushManager);

	function sizeCanvas() {
		canvas[0].width = canvas.parent().width();
		//XXX: Hacking around weird scrollbar issue, probably won't hold up
		canvas[0].height = canvas.parent().height() - 5;
		brushManager.redraw();
	}
	canvas.ready(sizeCanvas);
	$(window).resize(sizeCanvas);
});
