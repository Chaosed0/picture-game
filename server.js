
var ws = require('ws')
var express = require('express');
var morgan = require('morgan');
var simplify = require('simplify-js');

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
var paths = [];

var broadcast = function(data, except) {
	for(var i in conns) {
		if(i != except) {
			conns[i].conn.send(data);
		}
	}
};

wss.on('connection', function(ws) {
	//New id
	var id = nextId++;
	var curPath = -1;

	//Broadcast the join
	var conn_obj = {
		id: id,
		m_type: 'join',
		draw_style: {}
	};
	broadcast(JSON.stringify(conn_obj));

	//Tell joiner about the people already connected
	for(var i in conns) {
		if(i != id) {
			conn_obj.id = i;
			ws.send(JSON.stringify(conn_obj));
		}
	}

	//Add the new connection
	conns[id] = {
		lastPos: { x: 0, y:0 },
		painting: false,
		conn: ws
	};

	//Send all the paths
	ws.send(JSON.stringify({ m_type: 'init_paths', paths: paths }));

	ws.on('message', function(message) {
		var obj = JSON.parse(message);
		switch(obj.m_type) {
			case 'start':
				broadcast(JSON.stringify({id: id, m_type: 'start', pos: obj.pos}), id);
				conns[id].lastPos = obj.pos;
				conns[id].painting = true;

				if(curPath >= 0) {
					console.log("warning: adding path that already exists");
				}
				curPath = paths.length;
				paths.push({ path: [obj.pos], width: 5, color: '#000000'});
				break;
			case 'update':
				broadcast(JSON.stringify({id: id, m_type: 'update', pos: obj.pos}), id);
				conns[id].lastPos = obj.pos;

				paths[curPath].path.push(obj.pos);
				break;
			case 'stop':
				broadcast(JSON.stringify({id: id, m_type: 'stop'}), id);
				conns[id].painting = false;

				paths[curPath].path = simplify(paths[curPath].path, 2.0);
				curPath = -1;
				break;
		}
	});

	ws.on('close', function(event) {
		broadcast(JSON.stringify({id: id, m_type: 'leave'}), id);
		delete conns[id];
	});
});

