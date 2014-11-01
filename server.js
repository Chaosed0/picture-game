
var ws = require('ws');
var express = require('express');
var morgan = require('morgan');
var RoomManager = require('./user_modules/RoomManager');
var User = require('./user_modules/User');

//Express (webserver)
var app = express();
var expressPort = 8000;
app.use(express.static(__dirname + '/public'));	
app.use(morgan('dev'));
app.listen(expressPort);
console.log("Started express on port " + expressPort);

//Websockets
var wss = new ws.Server({port: 8080});
var nextId = 0;

var roomManager = new RoomManager();
var lobbyUsers = {};

wss.on('connection', function(ws) {
	//New id
	var id = nextId++;

	//join lobby
	lobbyUsers[id] = new User(ws);

	ws.on('message', function(message) {
		var obj = JSON.parse(message);
		switch(obj.m_type) {
			case 'sync':
				if(id in lobbyUsers) {
					var user = lobbyUsers[id];
					user.setName(obj.user.name);
					user.setSize(obj.user.size);
					user.setColor(obj.user.color);
					user.setBrush(obj.user.isBrush);
				}
				break;
			case 'join_room':
				if(id in lobbyUsers) {
					var user = lobbyUsers[id];
					roomManager.newUser(id, user, obj.room_id);
					delete lobbyUsers[id];
				}
				break;
			case 'leave_room':
				if(!(id in lobbyUsers)) {
					var user = roomManager.leaveUser(id);
					lobbyUsers[id] = user;
				}
				break;
			case 'close':
				if(id in lobbyUsers) {
					ws.close();
				}
				break;
			default:
				roomManager.handleMessage(id, obj);
				break;
		}
	});

	ws.on('close', function(event) {
		if(id in lobbyUsers) {
			delete lobbyUsers[id];
		} else {
			roomManager.leaveUser(id);
		}
	});
});

