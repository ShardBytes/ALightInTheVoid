var express = require('express');
var http = require('http');
var fs = require('fs');

app = express();

var server = http.createServer(app);

// routing
app.use('/.well-known', express.static(__dirname + '/.well-known', {dotfiles:'allow'}))

app.use('/game', express.static(__dirname + '/game'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/game/game.html')
})

server.listen(80, function() {
  console.log('http server listening on port 80')
})
