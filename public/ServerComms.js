
//Handles communication with the server.
function ServerComms(drawManager) {
	var connected = false;
	var ws = null;
	var nullfunc = function() {};
	var self = this;

	var send = function(obj) {
		if(connected) {
			var data = JSON.stringify(obj);
			ws.send(data);
		}
	}

	this.setColor = this.toggleBrush =
		this.setSize = this.startDraw =
		this.endDraw = this.updateDraw =
		this.clearCanvas = nullfunc;


	this.isConnected = function () {
		return connected;
	}

	this.connect = function(address, user, callback) {
		ws = new WebSocket(address);

		ws.onopen = function(anevent) {
			connected = true;

			send({
				m_type: 'sync',
				user: user
			});

			self.joinRoom = function(room) {
				send({
					m_type: 'join_room',
					room_id: room
				});
			}

			self.setColor = function(color) {
				send({
					m_type: 'ch_color',
					color: color
				});
			};

			self.toggleBrush = function() {
				send({
					m_type: 'toggle_brush'
				});
			}

			self.setSize = function(size) {
				send({
					m_type: 'ch_size',
					size: size
				});
			}

			self.startDraw = function(pos) {
				send({
					m_type: 'start',
					pos: pos
				});
			};

			self.endDraw = function() {
				send({
					m_type: 'stop'
				});
			};

			self.updateDraw = function(pos) {
				send({
					m_type: 'update',
					pos: pos
				});
			};

			self.clearCanvas = function() {
				send({
					m_type: 'clear'
				});
			}
			
			self.leaveRoom = function() {
				send({
					m_type: 'leave_room'
				});
			}

			callback();
		};

		ws.onmessage = function(message, flags) {
			var data = message.data;
			var obj = JSON && JSON.parse(data) || $.parseJSON(json);
			switch (obj.m_type) {
				case 'init_paths':
					drawManager.initPaths(obj.paths);
					drawManager.redraw();
					break;
				case 'clear':
					drawManager.clearCanvas();
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
					if(obj.isBrush != undefined) drawManager.setBrush(obj.id, obj.isBrush);
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
	}
}
