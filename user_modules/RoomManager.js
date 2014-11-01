
var Room = require('./Room');

function RoomManager() {
	var rooms = {};
	var idMap = {};

	var userToRoom = function(id) {
		return idMap[id];
	};
	
	var roomExists = function(roomId) {
		return roomId in rooms;
	};

	this.newUser = function(id, user, roomId) {
		console.log('User ' + id + ' joined room ' + roomId);
		if(!roomExists(roomId)) {
			rooms[roomId] = new Room();
		}
		idMap[id] = roomId;
		rooms[roomId].newUser(id, user);
	};

	this.leaveUser = function(id) {
		var roomId = userToRoom(id);
		console.log('User ' + id + ' left room ' + roomId);
		return rooms[roomId].leaveUser(id);
	};

	this.handleMessage = function(id, obj) {
		var roomId = userToRoom(id);
		rooms[roomId].handleMessage(id, obj);
	};
}

module.exports = RoomManager;
