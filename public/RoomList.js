
function RoomList() {
	var rooms = {};

	this.getRooms = function() {
		return rooms;
	}

	this.init = function(initRooms) {
		rooms = initRooms;
	}

	this.addUser = function(roomId) {
		rooms[roomId].num_users++;
	}

	this.removeUser = function(roomId) {
		rooms[roomId].num_users--;
	}

	this.addRoom = function(roomId) {
		rooms[roomId] = {
			num_users: 0
		}
	}

	this.removeRoom = function(roomId) {
		delete rooms[roomId];
	}
}
