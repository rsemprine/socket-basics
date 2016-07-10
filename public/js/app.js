var socket = io();

socket.on('connect', function(){
	console.log('Connected to socket.io server!');
});

socket.on('message', function(message){ //Lê a messagem emitida pelo servidor
	var timestampMoment = moment.utc(message.timestamp);

	console.log('New message:');
	console.log(message.text);

	//usamos . para buscar pelo NAME
	jQuery('.messages').append('<p><strong>' + timestampMoment.local().format('h:mm a') + '</strong>' + ' - ' + message.text + '</p>'); 
});

//Handles submitting of new message
var $form = jQuery('#message-form'); //usamos # para buscar pelo ID

$form.on('submit', function(event){
	event.preventDefault(); //para não atualizar a página toda

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		text: $message.val()
	});

	//Limpa o input
	$message.val('');
});