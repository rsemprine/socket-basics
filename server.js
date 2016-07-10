var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket){
	console.log('User connected via socket.io');

	//Junta o usuário à uma sala	
	socket.on('joinRoom', function(req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment.valueOf()
		});
	});

	socket.on('message', function(message){
		console.log('Message received: ' + message.text);

		message.timestamp = moment().valueOf();
		//socket.broadcast.emit('message', message); //manda a menssagem para todos os outros browsers menos ele mesmo
		io.to(clientInfo[socket.id].room).emit('message', message); //somente para os usuários da mesma sala
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!', //manda uma menssagem para o cliente
		timestamp: moment().valueOf()
	})
}); //Listen for events

http.listen(PORT, function() {
	console.log('Server started!');
});