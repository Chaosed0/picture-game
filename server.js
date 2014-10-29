
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
	};
	broadcast(JSON.stringify(conn_obj));

	//Tell joiner about the people already connected
	for(var i in conns) {
		if(i != id) {
			conn_obj.id = i;
			conn_obj.color = conns[i].color;
			conn_obj.size = conns[i].size;
			ws.send(JSON.stringify(conn_obj));
		}
	}

	//Add the new connection
	conns[id] = {
		color: { r: 0, g: 0, b: 0 },
		size: 5,
		isBrush: true,
		lastPos: { x: 0, y:0 },
		painting: false,
		conn: ws
	};

	//Send all the paths
	if(paths.length > 0) {
		ws.send(JSON.stringify({ m_type: 'init_paths', paths: paths }));
	}

	ws.on('message', function(message) {
		var obj = JSON.parse(message);
		switch(obj.m_type) {
			case 'ch_size':
				conns[id].size = obj.size;
				obj.id = id;
				broadcast(JSON.stringify(obj), id);
				break;
			case 'ch_color':
				conns[id].color = obj.color;
				obj.id = id;
				broadcast(JSON.stringify(obj), id);
				break;
			case 'toggle_brush':
				conns[id].isBrush = !conns[id].isBrush;
				obj.id = id;
				broadcast(JSON.stringify(obj), id);
				break;
			case 'clear':
				paths = [];
				broadcast(JSON.stringify(obj), id);
				break;
			case 'start':
				var color = conns[id].color;
				var size = conns[id].size;
				broadcast(JSON.stringify({id: id, m_type: 'start', pos: obj.pos}), id);
				conns[id].lastPos = obj.pos;
				conns[id].painting = true;

				if(curPath >= 0) {
					console.log("warning: adding path that already exists");
				}
				curPath = paths.length;
				paths.push({ path: [obj.pos],
					size: conns[id].size,
					color: conns[id].color,
					isBrush: conns[id].isBrush
				});
				break;
			case 'update':
				if(curPath >= 0) {
					broadcast(JSON.stringify({id: id, m_type: 'update', pos: obj.pos}), id);
					conns[id].lastPos = obj.pos;

					paths[curPath].path.push(obj.pos);
				} else {
					console.log('warning: \'update\' received before \'start\'');
				}
				break;
			case 'stop':
				if(curPath >= 0 && paths[curPath].path.length > 1) {
					//Ignore paths of 1, just a click, screws something up
					broadcast(JSON.stringify({id: id, m_type: 'stop'}), id);
					conns[id].painting = false;

					if(conns[id].isBrush) {
						paths[curPath].path = simplify(paths[curPath].path, 1.0);
					} else {
						//Simplify eraser paths a bit more
						paths[curPath].path = simplify(paths[curPath].path, 3.0);
					}
					curPath = -1;
					break;
				} else if(curPath < 0) {
					console.log('warning: \'stop\' received before \'start\'');
				}
				break;
			default:
				console.log('warning: got unknown message');
				console.log(message);
				break;
		}
	});

	ws.on('close', function(event) {
		broadcast(JSON.stringify({id: id, m_type: 'leave'}), id);
		delete conns[id];
	});
});

