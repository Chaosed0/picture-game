
function server_comm(base_address, draw_manager) {
	var ws = new WebSocket(base_address);

	var state = {};

	ws.onopen = function() {
		//Something?
	};

	ws.onmessage = function(data, flags) {
	};

	this.startDraw = function() { };
	this.endDraw = function() { };
	this.updateDraw = function() { };
}
