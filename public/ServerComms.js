
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
			case 'toggle_brush':
				drawManager.toggleBrush(obj.id);
				break;
			case 'ch_color':
				drawManager.setColor(obj.id, obj.color);
				break;
			case 'ch_size':
				drawManager.setSize(obj.id, obj.size);
				break;
			case 'join':
				drawManager.newBrush(obj.id);
				if(obj.size != undefined) drawManager.setSize(obj.id, obj.size);
				if(obj.color != undefined) drawManager.setColor(obj.id, obj.color);
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

	var send = function(obj) {
		var data = JSON.stringify(obj);
		ws.send(data);
	}

	this.setColor = function(color) {
		send({
			m_type: 'ch_color',
			color: color
		});
	};

	this.toggleBrush = function() {
		send({
			m_type: 'toggle_brush'
		});
	}

	this.setSize = function(size) {
		send({
			m_type: 'ch_size',
			size: size
		});
	}

	this.startDraw = function(pos) {
		send({
			m_type: 'start',
			pos: pos
		});
	};

	this.endDraw = function() {
		send({
			m_type: 'stop'
		});
	};

	this.updateDraw = function(pos) {
		send({
			m_type: 'update',
			pos: pos
		});
	};
}
