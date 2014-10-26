
$(document).ready(function() {
	var canvas = $('#thecanvas');
	var offline = true;

	function sizeCanvas() {
		canvas[0].width = canvas.parent().width();
		//XXX: Hacking around weird scrollbar issue, probably won't hold up
		canvas[0].height = canvas.parent().height() - 5;
	}
	canvas.ready(sizeCanvas);
	$(window).resize(sizeCanvas);

	var brush = new Brush(canvas);
	brush.drawLine({x:0,y:0},{x:100,y:100});

	var brushManager = new BrushManager(canvas);
	var comms;
	if(offline) {
		comms = new NullComms();
	} else {
		comms = new ServerComms('ws://127.0.0.1:8080/', brushManager);
	}
	var localBrush = new LocalBrush(comms, canvas);
});
