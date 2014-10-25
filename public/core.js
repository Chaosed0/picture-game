
$(document).ready(function() {
	var canvas = $('#thecanvas');
	canvas[0].width = window.innerWidth;
	canvas[0].height = window.innerHeight;

	draw_man = new draw_manager(canvas);
	draw = new canvas_draw(canvas);
	comm = new server_comm('ws://127.0.0.1:8080/', draw_man);
	local = new local_draw(comm, draw);
});
