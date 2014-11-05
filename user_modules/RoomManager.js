
var Room = require('./Room');

function RoomManager() {
	var rooms = {};
	var idMap = {};

	this.roomExists = function(roomId) {
		return roomId in rooms;
	};

	this.userToRoom = function(id) {
		return idMap[id];
	};
	
	this.getRoomInfo = function() {
		var info = {};
		for(roomId in rooms) {
			info[roomId] = rooms[roomId].getRoomInfo(false);
		}
		return info;
	}

	this.newUser = function(id, user, roomId) {
		console.log('User ' + id + ' joined room ' + roomId);
		if(!this.roomExists(roomId)) {
			rooms[roomId] = new Room(roomId);
		}
		idMap[id] = roomId;
		rooms[roomId].newUser(id, user);
	};

	this.leaveUser = function(id) {
		var roomId = this.userToRoom(id);
		if(roomId != undefined) {
			console.log('User ' + id + ' left room ' + roomId);
			return rooms[roomId].leaveUser(id);
		} else {
			return null;
		}
	};

	this.handleMessage = function(id, obj) {
		var roomId = this.userToRoom(id);
		if(roomId != undefined) {
			rooms[roomId].handleMessage(id, obj);
		}
		//User's trying to draw in the lobby, just ignore it
	};
}

module.exports = RoomManager;
