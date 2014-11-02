
var simplify = require('simplify-js');
var User = require('./User');

function Room(name) {
	var users = {};
	var pathMap = {};
	var paths = [];

	var broadcast = function(data, except) {
		for(var id in users) {
			if(id != except) {
				users[id].send(data);
			}
		}
	};

	this.userInRoom = function(id) {
		return id in users;
	}

	this.leaveUser = function(id) {
		var user = users[id];
		broadcast(JSON.stringify({id: id, m_type: 'leave'}), id);
		delete users[id];
		return user;
	};

	this.newUser = function(id, user)  {
		//Tell people connected about the joiner
		for(var oid in users) {
			var obj = user.getState();
			obj.name = user.getName();
			obj.m_type = 'join';
			obj.id = id;
			users[oid].send(JSON.stringify(obj));
		}

		//Tell joiner about the people already connected
		for(var oid in users) {
			var obj = users[oid].getState();
			obj.name = users[oid].getName();
			obj.m_type = 'join';
			obj.id = oid;
			user.send(JSON.stringify(obj));
		}

		//Send welcome message
		user.send(JSON.stringify({ m_type: 'welcome', id: id, room: name, paths: paths }));
		
		users[id] = user;
	};

	this.handleMessage = function(id, obj) {
		var doBroadcast = true;
		var except = true;
		switch(obj.m_type) {
			case 'ch_size':
				users[id].setSize(obj.size);
				break;
			case 'ch_color':
				users[id].setColor(obj.color);
				break;
			case 'toggle_brush':
				users[id].toggleBrush();
				break;
			case 'clear':
				var newpaths = [];

				//Re-start paths that were in-progress at time of clear
				for(var uid in pathMap) {
					var state = users[uid].getState();
					var path = paths[pathMap[uid]].path;
					state.path = [ path[path.length-1] ];
					pathMap[uid] = newpaths.length;
					newpaths.push(state);
				}

				paths = newpaths;
				
				break;
			case 'leave':
				return 
				break;
			case 'start':
				if(id in pathMap) {
					console.log("warning: adding path that already exists");
				}

				pathMap[id] = paths.length;

				var state = users[id].getState();
				state.path = [ obj.pos ];
				paths.push(state);
				break;
			case 'update':
				if(id in pathMap) {
					paths[pathMap[id]].path.push(obj.pos);
				} else {
					doBroadcast = false;
					console.log('warning: \'update\' received before \'start\'');
				}
				break;
			case 'stop':
				if(id in pathMap) {
					var pathId = pathMap[id];
					paths[pathId].path = simplify(paths[pathId].path, 1.0);
					delete pathMap[id];
					break;
				} else {
					doBroadcast = false;
					console.log('warning: \'stop\' received before \'start\'');
				}
				break;
			case 'message':
				//Just broadcast to everyone
				except = false;
				break;
			default:
				doBroadcast = false;
				console.log('warning: got unknown message');
				console.log(obj);
				break;
		}

		if(doBroadcast) {
			obj.id = id;
			if(except) {
				broadcast(JSON.stringify(obj), id);
			} else {
				broadcast(JSON.stringify(obj));
			}
		}
	};
}

module.exports = Room;
