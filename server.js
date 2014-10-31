
var ws = require('ws');
var express = require('express');
var morgan = require('morgan');
var RoomManager = require('./user_modules/RoomManager');

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
	lobbyUsers[id] = null;

	ws.on('message', function(message) {
		var obj = JSON.parse(message);
		if(id in lobbyUsers) {
			switch(obj.m_type) {
				case 'join_room':
					var name = lobbyUsers[id];
					if(name == null) {
						//Need to set a username
					} else {
						roomManager.newUser(id, name, obj.room_id, ws);
						delete lobbyUsers[id];
					}
					break;
				case 'name':
					lobbyUsers[id] = obj.name;
					break;
				default:
					break;
			}
		} else {
			roomManager.handleMessage(id, obj);
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

