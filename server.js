var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//Sends current users to provided socket
function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return; //para a execução
	}

	//Copia todos os atributos do objeto passado
	Object.keys(clientInfo).forEach(function(socketId){
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name); //Adiciona o usuário à lista;
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment.valueOf()
	});
};

io.on('connection', function(socket){
	console.log('User connected via socket.io');

	//Desconecta da sala
	socket.on('disconnect', function(){
		var userData = clientInfo[socket.id];

		if (typeof userData !== 'undefined') {
			socket.leave(userData.room); //Desconecta
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment.valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

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

		//Comando para mostrar os usuários do chat "@currentUsers"
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			//socket.broadcast.emit('message', message); //manda a menssagem para todos os outros browsers menos ele mesmo
			io.to(clientInfo[socket.id].room).emit('message', message); //somente para os usuários da mesma sala	
		};
		
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