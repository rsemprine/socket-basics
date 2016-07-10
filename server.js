var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	console.log('User connected via socket.io');

	socket.on('message', function(message){
		console.log('Message received: ' + message.text);

		message.timestamp = moment().valueOf();
		//socket.broadcast.emit('message', message); //manda a menssagem para todos os outros browsers menos ele mesmo
		io.emit('message', message);
	});

	socket.emit('message', {
		text: 'Welcome to the chat application!', //manda uma menssagem para o cliente
		timestamp: moment().valueOf()
	})
}); //Listen for events

http.listen(PORT, function() {
	console.log('Server started!');
});