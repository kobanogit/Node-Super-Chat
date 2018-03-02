var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {
    // Quand un client se connecte, on lui envoie un message
    // socket.emit('message', 'Vous êtes bien connecté !');
    // On signale aux autres clients qu'il y a un nouveau venu
    // socket.broadcast.emit('message', 'Un autre client vient de se connecter ! ');
    // socket.broadcast.emit('chat', socket.pseudo + ' vient de se connecter !');

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('chat', '<i>' + socket.pseudo + ' a rejoint le chat !</i>');
        socket.emit('chat', '<i>' + socket.pseudo + ' a rejoint le chat !</i>');
    });

    // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
    socket.on('chat', function (message) {
        // On récupère le pseudo de celui qui a cliqué dans les variables de session

        var mess = '<span style="background-color:#333; color:#BBB;"">' + socket.pseudo + '</span> : ' + message;

        // Envoi du message aux autres
        socket.broadcast.emit('chat', mess);
        // Envoi du message sur sa propre page :
        socket.emit('chat', mess);
    });
});


server.listen(8080);
