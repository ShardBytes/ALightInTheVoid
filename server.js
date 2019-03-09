/* (c) ShardBytes 2018-<end of the world>
/* A Light In The Void => simple game made just using pixi in a small amount of time */

// Node.js gameserver by Plasmoxy

console.log('--- A Light In The Void SERVER by Plasmoxy ---')
console.log('LOADING...');

const SSL_ENABLED = false;
const HOST = "alightinthevoid.fr.openode.io"

var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var socketio = require('socket.io');

var app = express();

var server = SSL_ENABLED ? (
  https.createServer(
    {
      key: fs.readFileSync('ssl/private.key'),
      cert: fs.readFileSync('ssl/certificate.crt'),
      ca: fs.readFileSync('ssl/ca_bundle.crt')
    },
    app
  )
) : (
  http.createServer(app)
)

redirectApp = express();
var redirectServer = http.createServer(redirectApp);

// redirect all http requests to https or the other way round
redirectApp.get('*', function (req, res, next) {
  !req.secure ? res.redirect((SSL_ENABLED ? 'https://'+HOST : 'http://'+HOST) + req.url) : next();
})


var io = socketio.listen(server);

// CA
app.use('/.well-known', express.static(__dirname + '/.well-known', {dotfiles:'allow'}))

// game ->
app.use('/game', express.static(__dirname + '/game'))
app.use('/assets', express.static(__dirname + '/assets'))

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/game/game.html');
})

// page routing ->
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})
app.get('/index.js', function(req, res) {
  res.sendFile(__dirname + '/index.js')
})
app.get('/index.css', function(req, res) {
  res.sendFile(__dirname + '/index.css')
})


// --------- GAME ------------

let GAME_ACTIVE = true;
let team1Points = 0;
let team2Points = 0;
const MAX_POINTS = 5;

// --- PROTO ---

class ServerPlayer { // prototype for server player
  constructor(id, x, y, team) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dir = (team == '1') ? spawn1.spawnDirection : spawn2.spawnDirection; // direction
    this.team = team;
  }
}

// tween copied from js in client
class Tween {

  constructor(object, propertyname, changeRate, stopOnFinish) {
    this.pn = propertyname;
    this.o = object; // target object reference
    this.rate = changeRate; // rate of change [unit per second]

    // ! OPTIONAL parameter in constructor
    // this means that the tween will stop injecting values after reaching target
    // ( it will stop caring about the value )
    this.stopOnFinish = stopOnFinish;

    this.target = this.o[propertyname]; // target (unchanged on init)
    this.defaultValue = this.target; // save default value for this tween

    this.active = false; // off by default
  }

  start() { // start injecting value
    this.active = true;
  }

  stop() { // stop injecting value
    this.active = false;
  }

  // resets the property value too if you pass true to it
  reset(valueToo) {
    this.target = this.defaultValue;
    if(valueToo) this.o[this.pn] = this.defaultValue;
  }

  update(dt) {
    if (this.active) {
      let d = this.rate*(dt/60);

      // round property to target when there is minimal difference
      // this is important because the we're working with decimal numbers
      // and it could happen that we'd never reach the target precisely
      // ALSO : stop tween when on target if stopOnFinish
      if (this.o[this.pn] > this.target - d && this.o[this.pn] < this.target + d) {
        this.o[this.pn] = this.target;
        if (this.stopOnFinish) this.stop();
      }

      if (this.o[this.pn] < this.target) this.o[this.pn] += d;
      else if(this.o[this.pn] > this.target) this.o[this.pn] -= d;
    }
  }

}

// server Safarik, the client Safariks are just mannequins
class ServerSafarik {

  constructor() {
    this.x = 0;
    this.y = 0;
    this.followSpeed = 150; // px per sec

    this.xtw = new Tween(this, 'x', this.followSpeed);
    this.xtw.start();

    this.ytw = new Tween(this, 'y', this.followSpeed);
    this.ytw.start();

    // IDs of players which are targets
    this.targetQueue = [];
    this.target = undefined;
  }

  broadcastPosition() {
    io.emit('safarikPos', {x:this.x, y:this.y});
  }

  collidingWithRect(x, y, w, h) {
    return (
      ( Math.abs(this.x - x)*2 < (w) ) &&
      ( Math.abs(this.y - y)*2 < (h) )
    );
  }

  update() {
    if (GAME_ACTIVE && this.target) {
      this.xtw.target = this.target.x;
      this.ytw.target = this.target.y;
    }
    this.xtw.update(1); // pass raw dt as we're not measuring
    this.ytw.update(1);
    this.broadcastPosition();

    if (this.collidingWithRect(spawn1.x, spawn1.y, spawn1.w, spawn1.h)) {
      if (GAME_ACTIVE) endGame('1');
    }
    if (this.collidingWithRect(spawn2.x, spawn2.y, spawn2.w, spawn2.h)) {
      if (GAME_ACTIVE) endGame('2');
    }
  }

  printCurrentTarget() {
    console.log('>> SAFARIK TARGET QUEUE : ');
    console.log(safarik.targetQueue);
  }

  // add ServerPlayer as target
  addTarget(id) {
    if (!this.targetQueue.includes(id)) {
      this.targetQueue.push(id);
    }
    this.target = getPlayerById(this.targetQueue[0]);
    this.printCurrentTarget();
  }

  removeTarget(id) {
    if (this.targetQueue.includes(id))
      this.targetQueue.splice(this.targetQueue.indexOf(id), 1);
    this.target = getPlayerById(this.targetQueue[0]);
    this.printCurrentTarget();
  }

}

class ServerSpawn {
  constructor(team) {
    if (team == '1') {
      this.x = -3250;
      this.y = 800;
      this.spawnDirection = Math.PI/2;
    } else if (team == '2') {
      this.x = 3250;
      this.y = -800;
      this.spawnDirection = -Math.PI/2;
    } else {
      throw new Error('WRONG TEAM');
    }
    this.w = 640;
    this.h = 640;
  }
}

// !!! teams -> 1(cyan) or 2(orange)
let spawn1 = new ServerSpawn('1');
let spawn2 = new ServerSpawn('2');

let players = []; // players on server, needs to be updated by updatePlayers()
let safarik = new ServerSafarik(); // only one server safarik

let serverTicker;

function updatePlayers(){ // scan connected sockets and push the connected players to players[]
    players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
}

function getPlayerById(id) {
  for (let i = 0; i<players.length; i++) {
    if (players[i].id == id) return players[i];
  }
}

function endGame(team) {
  GAME_ACTIVE = false;

  if (team == '1') {
    team1Points++;
    safarik.xtw.target = spawn1.x;
    safarik.ytw.target = spawn1.y;
  } else {
    team2Points++;
    safarik.xtw.target = spawn2.x;
    safarik.ytw.target =  spawn2.y;
  }

  let matchend = false;

  if (team1Points >= MAX_POINTS || team2Points >= MAX_POINTS) {
    matchend = true;
    team1Points = 0;
    team2Points = 0;
  }

  io.emit('gameEnded', {
    team: team,
    matchend: matchend
  });

  // update scoreboards
  io.emit('updateScore', [team1Points, team2Points]);

  console.log('\n--- [ GAME ENDED ]---');
  console.log('WINNER : TEAM ' + team);
  console.log('POINTS : ' + team1Points + ' : ' + team2Points);
  console.log();

  setTimeout(() => {
    resetGame();
  }, matchend ? 15000 : 10000);
}

// chain from endGame
function resetGame() {
  console.log('\n--- [ RESETTING GAME ]---');
  safarik = new ServerSafarik();
  GAME_ACTIVE = true;
  io.emit('gameReset');
}

// ------ SOCKET EVENTS -------
io.sockets.on('connection', function(socket) {
  console.log();
  console.log(' ****** CLIENT CONNECTED : ' + socket.handshake.address + ' ******');


  // obj -> {id, team}
  socket.on('requestPlayer', function(request) { // get ServerPlayer object from client

    console.log('\n >>> incoming requestPlayer, trying to create player')
    // check for existing player
    if (getPlayerById(request.id)) {
      console.log('? ERROR - player with such name is already in game : ' + request.id);
      socket.emit('serverError', 'SERVER ERROR : player with such name is already in game : ' + request.id)
      return; // this breaks out of both for and socket.on the function
    }
    // create serverplayer bound to socket, spawn it on a random position
    socket.player = new ServerPlayer(
      request.id,
      (request.team == '1' ? spawn1.x -200 + Math.random()*400 : spawn2.x -200 + Math.random()*400 ),
      (request.team =='1' ? spawn1.y -200 + Math.random()*400  : spawn2.y -200 + Math.random()*400 ),
      request.team
    );
    updatePlayers(); // now a new players has been added so update the players

    // deploy the player to client, x and y will be parsed as spawnX and spawnY
    console.log('? new player accepted : ' + socket.player.id);
    socket.emit('deployPlayer', socket.player);

    // return all players list to socket
    socket.emit('allPlayers', players)
    console.log(players);

    // return current score to socket
    socket.emit('updateScore', [team1Points, team2Points]);

    // send the new ServerPlayer to other clients, parse them as spawns too
    socket.broadcast.emit('playerConnected', socket.player)

    console.log('\n >>> #ALL PLAYERS <ServerPlayer> :: '); console.log(players);
  });


  socket.on('disconnect', function() {
    console.log('\n****** CLIENT DISCONNECTED : ' + socket.handshake.address + (socket.player ? ' -> player : ' + socket.player.id : '') + ' ******');

    if(socket.player) {
      safarik.removeTarget(socket.player.id); // remove from safarik targets if present
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
  socket.on('playerShoot', function() {
    if (socket.player) {
      socket.broadcast.emit('playerShoot', socket.player.id);
    }
  });

  socket.on('playerSpawn', function(spawned) {
    if (socket.player) {
      if (spawned) {
        socket.broadcast.emit('playerSpawned', socket.player.id);
        console.log('PLAYER SPAWNED -> ' + socket.player.id);
      } else {
        safarik.removeTarget(socket.player.id); // remove safarik target if present
        socket.broadcast.emit('playerDespawned', socket.player.id);
        console.log('PLAYER DESPAWNED -> ' + socket.player.id);
      }
    }
  });

  socket.on('playerFlash', function(npos) {
    npos.id = socket.player.id;
    socket.broadcast.emit('playerFlash', npos);
  });

  socket.on('playerBomb', function(bpos) {
    bpos.id = socket.player.id;
    socket.broadcast.emit('playerBomb', bpos);
  });

  // if client sets themselves as a target
  socket.on('addSafarikTarget', function(plrId) {
    safarik.addTarget(plrId);
    // if only one player controls safarik
    if (safarik.targetQueue.length == 1) io.emit('safarikContested');
  });

  // if unsets
  socket.on('removeSafarikTarget', function(plrId) {
    safarik.removeTarget(plrId);
  });

  // dev tool, not binded in game, just use console to reset the score
  socket.on('@rscore', function() {
    team1Points = 0;
    team2Points = 0;
    io.emit('updateScore', [team1Points, team2Points]);
  });

  // apparition change
  // data -> app: apparition name, active: apparition active (bool)
  socket.on('apparitionChange', function(data) {
    // assign add id to data and broadcast
    data.id = socket.player.id;
    socket.broadcast.emit('apparitionChange', data);
  });

  socket.on('@testServerError', function() {
    throw new Error('TEST SERVER ERROR [' + (new Date).toString() + ']');
  });

});

// internal server tick function
function serverTick() {
  safarik.update();
};

// start ticker (just with interval, I don't need acurate tickers on server, also, got no time for that)
console.log('starting server ticker ...');
serverTicker = setInterval(serverTick, 16.66); // appx 60hz tick = 16.66 ms delay

console.log('[ SERVER LOADED, starting listening ]');

if (SSL_ENABLED) {
  redirectServer.listen(80, function() {
    console.log('* redirect http server listening on port 80')
  })
  server.listen(443, function() {
    console.log('[DONE] -> Https server listening on port 443')
  })
} else {
  server.listen(80, function() {
    console.log('[DONE] -> Http-only server listening on port 80')
  })
  redirectServer.listen(443, function() {
    console.log('* redirect https back to http on port 443')
  })
}
