
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

wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		console.log('received: %s', message);
		ws.send(message);
	});
	console.log(ws);
	ws.send('connected');
});

