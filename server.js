
var ws = require('ws')
var express = require('express');
var morgan = require('morgan');

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
var conns = {};

var broadcast = function(data, except) {
	for(var i in conns) {
		if(i != except) {
			conns[i].conn.send(data);
		}
	}
};

wss.on('connection', function(ws) {
	var id = nextId++;
	var conn_obj = {
		id: id,
		m_type: 'join'
	}
	broadcast(JSON.stringify(conn_obj));
	for(var i in conns) {
		if(i != id) {
			conn_obj.id = i;
			ws.send(JSON.stringify(conn_obj));
		}
	}

	conns[id] = {
		lastPos: { x: 0, y:0 },
		painting: false,
		conn: ws
	};

	ws.on('message', function(message) {
		var obj = JSON.parse(message);
		switch(obj.m_type) {
			case 'start':
				broadcast(JSON.stringify({id: id, m_type: 'start', pos: obj.pos}), id);
				conns[id].lastPos = obj.pos;
				conns[id].painting = true;
				break;
			case 'update':
				broadcast(JSON.stringify({id: id, m_type: 'update', pos: obj.pos}), id);
				conns[id].lastPos = obj.pos;
				break;
			case 'stop':
				broadcast(JSON.stringify({id: id, m_type: 'stop'}), id);
				conns[id].painting = false;
				break;
		}
	});

	ws.on('close', function(event) {
		broadcast(JSON.stringify({id: id, m_type: 'leave'}), id);
		delete conns[id];
	});
});

