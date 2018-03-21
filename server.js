/* (c) ShardBytes 2018-<end of the world>
/* A Light In The Void => simple game made just using pixi in a small amount of time */

// Node.js gameserver by Plasmoxy

console.log('--- A Light In The Void SERVER by Plasmoxy ---')
console.log('LOADING...');

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

// !!! teams -> 1(blue) or 2(orange)

const PI = Math.PI;
let spawn1Pos = new Point(-100,-300); // team 1 spawn
let spawn2Pos = new Point(100, -300); // team 2 spawn
let spawnDirection = PI;

let players = []; // players on server, needs to be updated by updatePlayers()

class ServerPlayer { // prototype for server player
  constructor(id, x, y, team) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dir = spawnDirection; // direction
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
  console.log(' ****** CLIENT CONNECTED : ' + socket.handshake.address + ' ******');


  // obj -> {id, team}
  socket.on('requestPlayer', function(request) { // get ServerPlayer object from client

    console.log('\n >>> incoming requestPlayer, trying to create player')
    // check for existing player
    for (let i=0; i<players.length;i++) {
      if (players[i] && players[i].id == request.id) {
        console.log('? ERROR - player with such name is already in game : ' + request.id);
        socket.emit('serverError', 'SERVER ERROR : player with such name is already in game : ' + request.id)
        return; // this breaks out of both for and socket.on the function
      }
    }

    // create serverplayer bound to socket
    socket.player = new ServerPlayer(
      request.id,
      (request.team == '1' ? spawn1Pos.x : spawn2Pos.x),
      (request.team =='1' ? spawn1Pos.y : spawn2Pos.y),
      request.team
    );
    updatePlayers(); // now a new players has been added so update the players

    // deploy the player to client, x and y will be parsed as spawnX and spawnY
    console.log('? new player accepted : ' + socket.player.id);
    socket.emit('deployPlayer', socket.player);

    // return all players list to socket
    socket.emit('allPlayers', players)
    console.log(players);

    // send the new ServerPlayer to other clients, parse them as spawns too
    socket.broadcast.emit('playerConnected', socket.player)

    console.log('\n >>> #ALL PLAYERS <ServerPlayer> :: '); console.log(players);
  });


  socket.on('disconnect', function() {
    console.log('\n****** CLIENT DISCONNECTED : ' + socket.handshake.address + (socket.player ? ' -> player : ' + socket.player.id : '') + ' ******');

    if(socket.player) {
      io.emit('playerDisconnected', socket.player.id); // tell other clients that a player has disconnected
      updatePlayers();
    }
  });

  // on player position change
  // data -> x,y object
  socket.on('playerPos', function(data) {
    if (socket.player) {
      socket.player.x = data.x;
      socket.player.y = data.y;
      socket.broadcast.emit('playerPos', {
        id: socket.player.id,
        x: data.x,
        y: data.y
      });
    }
  });

  // on player direction change
  // data -> angle value
  socket.on('playerDir', function(data) {
    if (socket.player) {
      socket.player.dir = data;
      socket.broadcast.emit('playerDir', {
        id: socket.player.id,
        dir: data
      });
    }
  });

  // on player action
  socket.on('playerShooting', function(shooting) {
    if (socket.player) {
      socket.broadcast.emit('playerShooting', {
        id: socket.player.id,
        shooting: shooting
      });
    }
  });

  socket.on('playerSpawn', function(spawned) {
    if (socket.player) {
      if (spawned) {
        socket.broadcast.emit('playerSpawned', socket.player.id);
        console.log('PLAYER SPAWNED -> ' + socket.player.id);
      } else {
        socket.broadcast.emit('playerDespawned', socket.player.id);
        console.log('PLAYER DESPAWNED -> ' + socket.player.id);
      }
    }
  });

});

console.log('[ SERVER LOADED ]');

// ---------      ------------



redirectServer.listen(80, function() {
  console.log('* redirect http server listening on port 80')
})
server.listen(443, function() {
  console.log('[DONE] -> Https server listening on port 443')
})
