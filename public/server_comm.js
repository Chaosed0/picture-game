
function server_comm(base_address, draw_manager) {
	var ws = new WebSocket(base_address);

	ws.onopen = function(anevent) {
	};

	ws.onmessage = function(message, flags) {
		var data = message.data;
		var obj = JSON && JSON.parse(data) || $.parseJSON(json);
		switch (obj.m_type) {
			case 'join':
				draw_manager.newManager(obj.id);
				break;
			case 'leave':
				draw_manager.destroyManager(obj.id);
				break;
			case 'start':
				draw_manager.startDraw(obj.id, obj.pos);
				break;
			case 'stop':
				draw_manager.stopDraw(obj.id);
				break;
			case 'update':
				draw_manager.updateDraw(obj.id, obj.pos);
				break;
			default:
				console.log('warning: unknown message from server');
				console.log(data);
				break;
		}
	};

	this.startDraw = function(pos) {
		var obj = {
			m_type: 'start',
			pos: pos
		};

		var data = JSON.stringify(obj);
		ws.send(data);
	};

	this.endDraw = function() {
		var obj = {
			m_type: 'stop'
		};

		var data = JSON.stringify(obj);
		ws.send(data);
	};

	this.updateDraw = function(pos) {
		var obj = {
			m_type: 'update',
			pos: pos
		};

		var data = JSON.stringify(obj);
		ws.send(data);
	};
}
