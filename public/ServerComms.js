
//Handles communication with the server.
function ServerComms(baseAddress, drawManager) {
	var ws = new WebSocket(baseAddress);

	ws.onopen = function(anevent) {
	};

	ws.onmessage = function(message, flags) {
		var data = message.data;
		var obj = JSON && JSON.parse(data) || $.parseJSON(json);
		switch (obj.m_type) {
			case 'init_paths':
				drawManager.initPaths(obj.paths);
				drawManager.redraw();
				break;
			case 'join':
				drawManager.newBrush(obj.id);
				break;
			case 'leave':
				drawManager.destroyBrush(obj.id);
				break;
			case 'start':
				drawManager.startDraw(obj.id, obj.pos);
				break;
			case 'stop':
				drawManager.endDraw(obj.id);
				break;
			case 'update':
				drawManager.updateDraw(obj.id, obj.pos);
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
