var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var socketio = require('socket.io');

var ssl_options = {
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt'),
  ca: fs.readFileSync('ssl/ca_bundle.crt')
};

app = express();
redirectApp = express();

// redirect from http
var redirectServer = http.createServer(redirectApp);
var server = https.createServer(ssl_options, app);
var io = socketio.listen(server);

// redirect all http requests to https
redirectApp.get('*', function (req, res, next) {
  !req.secure ? res.redirect('https://alightinthevoid.fr.openode.io' + req.url) : next();
})

// manual routing

// ssl ->
app.use('/.well-known', express.static(__dirname + '/.well-known', {dotfiles:'allow'}))

// game ->
app.use('/game', express.static(__dirname + '/game'))
app.use('/assets', express.static(__dirname + '/assets'))

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/game/game.html');
})

// page ->
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})


// --------- GAME ------------
class Point { constructor(x,y) {this.x = x ? x : 0; this.y = y ? y : 0;}}

// !!! teams -> 1 or 2

let spawn1Pos = new Point(0,0); // team 1
let spawn2Pos = new Point(100, 0); // team 2

let players = [];

class ServerPlayer { // prototype for server player
  constructor(id, x, y, team) {
    this.id = obj.id;
    this.x = obj.x;
    this.y = obj.y;
    this.team = team;
  }
}

function updatePlayers(){ // scan connected sockets and push the connected players to players[]
    players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
}

io.sockets.on('connection', function(socket) {
  console.log();
  console.log('? CLIENT CONNECTED : ' + socket.handshake.address);


  // obj -> {id, team}
  socket.on('requestPlayer', function(request) { // get ServerPlayer object from client

    // check for existing player
    for (i=0; i<players.length;i++) {
      if (players[i] && players[i].id == request.id) {
        console.log('? ERROR - player with such name is already in game : ' + plr.id);
        socket.emit('serverError', 'SERVER ERROR : player with such name is already in game : ' + plr.id)
        return; // this breaks out of both for and socket.on the function
      }
    }

    // create serverplayer bound to socket
    socket.player = new ServerPlayer(
      request.id,
      request.team == 1 ? spawn1Pos.x : spawn2Pos.x,
      request.team == 1 ? spawn1Pos.y : spawn2Pos.y,
      request.team
    );
    updatePlayers(); // now a new players has been added so update the players

    console.log('? new player accepted : ' + socket.player.id);
    socket.emit('deployPlayer', socket.player);

    socket.broadcast.emit('playerconnected', socket.player) // send the new ServerPlayer to other clients
    socket.emit('allPlayers', players) // return all players list to socket

    console.log('#ALL PLAYERS <ServerPlayer> :: '); console.log(players);
  });


  socket.on('disconnect', function() {
    console.log('\n? CLIENT DISCONNECTED : ' + socket.handshake.address + (socket.player ? ' -> player : ' + socket.player.id : ''));

    if(socket.player) {
      io.emit('playerDisconnected', socket.player.id); //
      updatePlayers();
    }
  });

  socket.on('playerMove', function(data) {



  });
});

// ---------      ------------



server.listen(443, function() {
  console.log('https server listening on port 443')
})
redirectServer.listen(80, function() {
  console.log('redirect http server listening on port 80')
})
