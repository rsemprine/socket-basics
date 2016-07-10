var name = getQueryVariable('name') || 'Anonymous'; //Vem do arquivo QueryParams.js
var room = getQueryVariable('room'); //Vem do arquivo QueryParams.js
var socket = io();

console.log(name + ' wants to join ' + room);

jQuery('.room-title').text(room);

socket.on('connect', function(){
	console.log('Connected to socket.io server!');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function(message){ //Lê a messagem emitida pelo servidor
	var timestampMoment = moment.utc(message.timestamp);
	var $message = jQuery('#messages');

	console.log('New message:');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + timestampMoment.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>'); 
	//$message.append('<br />');
});

//Handles submitting of new message
var $form = jQuery('#message-form'); //usamos # para buscar pelo ID

$form.on('submit', function(event){
	event.preventDefault(); //para não atualizar a página toda

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	//Limpa o input
	$message.val('');
});