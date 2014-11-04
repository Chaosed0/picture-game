
//Handles communication with the server.
function ServerComms() {
	var connected = false;
	var ws = null;
	var nameMap = {};
	var self = this;
	var nullfunc = function() {};
	var callbacks = {};

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

	this.on = function(event, func) {
		callbacks[event] = func;
		return self;
	}

	this.isConnected = function () {
		return connected;
	}

	this.onChatMessage = function(func) {
		chatMessageCallback = func;
	}

	this.getName = function(id) {
		return nameMap[id];
	}

	this.connect = function(address, user, openCallback) {
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

			self.sendMessage = function(message) {
				send({
					m_type: 'message',
					message: message
				});
			}

			openCallback();
		};

		ws.onmessage = function(message, flags) {
			var data = message.data;
			var obj = JSON && JSON.parse(data) || $.parseJSON(json);
			if(obj.m_type in callbacks) {
				callbacks[obj.m_type](obj);
			}
		};

		ws.onclose = function(closeEvent) {
			connected = false;
			if('close' in callbacks) {
				callbacks['close'](closeEvent);
			}
		};
	}
}
