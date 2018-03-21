
/* (c) ShardBytes 2018-<end of the world>
/* A Light In The Void => simple game made just using pixi in a small amount of time */

/* Game engine by Plasmoxy based on PIXI.js, made in less than 20 days*/
/* uses my pixialiases.js snippet for shorter names */

let urlParams = new URLSearchParams(window.location.search);
let NAME, TEAM;
let GAME_SITE = 'https://localhost'; // change to '/' when on server, change to 'https://localhost' when developing ( need ssl certifs )
let INTERP_RATIO = 1/4;
let socket;

if (urlParams.has('name') && urlParams.has('team')) {
  NAME = urlParams.get('name');
  TEAM = urlParams.get('team');
  if (TEAM != '1' && TEAM != '2') {
    $('#info').html('BAD TEAM NAME');
    throw new Error('BAD TEAM NAME');
  }
} else {
  $('#info').html('YO FAG NAME OR TEAM NOT SPECIFED xDDD');
  throw new Error('ERROR M8: NO NAME URL PARAM SPECIFIED FAGGIT'); // I'm so good
}

// just some console utility
function clientlog(obj) {
  console.log('[ '+ obj + ' ]');
}

console.log('--- ShardBytes: A Light In The Void ---')
console.log('--- Based on the amazing Plasmoxy\'s game engine based on PIXI.js, written in less than 20 days lmao ---');

let fmeter = new FPSMeter(); // comment this out to turn off fpsmeter

/* setup pixi */
let app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  transparent: false,
  resolution: 1
});

// add pixi to pixi container, !! which is hidden by default
document.getElementById('pixi').appendChild(app.view);

// some nice background for renderer
app.renderer.backgroundColor = 0x111111;

function loadProgressHandler(ldr, res) { // loader, resource
  let progr = 'LOADING [ '+Math.round(ldr.progress)+'% ] : ' + res.name + ' -> ' + res.url;
  console.log(progr);
  $('#info').html(progr);
}

/* -------- define game variables and functions --------- */

let background, world, gui, camera, mkeys; // basic

let player, safarik; // objects
let dbg = true; // debug for colliders

let otherplayers = [];
let bullets; // swarm of bullets


// add other player but don't spawn it, that may be handled through playerSpawned...
function addOtherPlayer(op) {
  otherplayers.push(op);
}

// same
function removeOtherPlayer(op) {
  otherplayers.slice(otherplayers.indexOf(op), 1);
}

// better to use for as it can break when it finds what it looks for
function getOtherPlayerById(id) {
  for (let i = 0; i<otherplayers.length; i++) {
    if (otherplayers[i].id == id) {
      return otherplayers[i];
    }
  }
}

/* ------------------ PIXI loader --------------------- */

let resDef = [
  ['rk', 'sprites/aquaroket.png'],
  ['saf', 'sprites/safarik.png'],
  ['bootlegstars', 'sprites/bootlegstars.png']
];

let animationsDef = [
  'sprites/anim/expl.json'
];

resDef.forEach(t => {
  loader.add(t[0], t[1]);
});

animationsDef.forEach(t => {
  loader.add(t);
});

loader
  .on('progress', loadProgressHandler)
  .load(setup)
;

function setup() {

  /* INIT CONTAINERS - order is important ! */
  background = new Background(0.5); app.stage.addChild(background);
  world = new World(); app.stage.addChild(world);
  gui = new Gui(); app.stage.addChild(gui);

  // link camera to world
  camera = new Camera(world);

  /* define control */
  mkeys = {
    up: new KeyboardKey(38),
    down: new KeyboardKey(40),
    left: new KeyboardKey(37),
    right: new KeyboardKey(39),
    shoot: new KeyboardKey(82) // R
  };

  /* ------------------------- INIT GAME ----------------------- */

  (function() {
    let bgs = new TilingSprite(resources.bootlegstars.texture, 10000, 10000);
    bgs.position.set(-5000, -5000);
    background.addChild(bgs);
  })()

  safarik = new Entity('safarik', resources.saf.texture);
  safarik.collider = new BoxCollider(safarik, 200, 200);
  safarik.scale.set(0.5, 0.5);
  safarik.collider.updateSize();
  safarik.collider.debug(dbg);
  world.addChild(safarik);

  bullets = new EntitySwarm();
  world.addChild(bullets);

  // ze word is now complet


  $('#info').html('Connecting ...');
  // connect to game server
  clientlog('CONNECTING TO SERVER : ' + GAME_SITE);
  socket = io.connect(GAME_SITE, { transports: ['websocket']});

  // --- EVENTS ----

  // when player is deployed from server
  // plr -> ServerPlayer
  socket.on('deployPlayer', function(plr) {
    clientlog('PLAYER DEPLOYED FROM SERVER, SPAWNING');
    // serverplayer x,y goes as player spawn x,y
    player = new Player(world, mkeys, plr.id, plr.x, plr.y, plr.team);
    player.spawn(); // spawn the player ( server will chain the spawn to others)

    // !!! -> hide loading and show pixi after the player is spawned
    $('#info').css('display', 'none');
    $('#pixi').css('display', 'block');
  });

  // show reported server errors on client
  socket.on('serverError', function(err) {
    $('#pixi').css('display', 'none');
    $('#info').html(err);
    $('#info').css('display', 'block');
    throw new Error(err);
  });

  // parse players array on connection and create otherplayers
  socket.on('allPlayers', function(serverPlayers) {
    clientlog('-> received allplayers list, creating otherplayers');
    otherplayers = [];
    serverPlayers.forEach(function(plr, i) {
      if (plr.id != player.id) {
        let newplr = new OtherPlayer(world, plr.id, plr.x, plr.y, plr.team);
        addOtherPlayer(newplr);
        newplr.spawn(); // we need to spawn others manualy when receiving allplayers as they have already emitted initial spawn before
      }
    });
    clientlog('-> other players created');
  });

  // when other player connects
  socket.on('playerConnected', function(plr) {
    clientlog('A player has connected. Welcome ! -> ' + plr.id);
    // add player to players list, but don't spawn yet
    addOtherPlayer(new OtherPlayer(world, plr.id, plr.x, plr.y, plr.team));
  });

  // when other player disconnects
  socket.on('playerDisconnected', function(plrId) {
    clientlog('A player has disconnected. Farewell, cruel world. -> ' + plrId);

    // remove otherplayer from list
    let plr = getOtherPlayerById(plrId);
    if (plr) {
      if (plr.alive) plr.despawn(); // force despawn
      removeOtherPlayer(plr);
    }
  });

  // handle incoming others movement >>>
  socket.on('playerPos', function(data) {
    let plr = getOtherPlayerById(data.id);
    if (plr) {
      plr.tx = data.x;
      plr.ty = data.y;
    }
  });

  socket.on('playerDir', function(data) {
    let plr = getOtherPlayerById(data.id);
    if (plr) {
      plr.rotation = -data.dir; // adapt to inverse rotation logic with minus
    }
  });

  socket.on('playerShooting', function(data) {
    let plr = getOtherPlayerById(data.id);
    if (plr) plr.shooting = data.shooting;
  });

  socket.on('playerSpawned', function(pid) {
    let plr = getOtherPlayerById(pid);
    if (plr) {
      plr.spawn();
      console.log('<'+pid+'> SPAWNED');
    }
  });

  socket.on('playerDespawned', function(pid) {
    let plr = getOtherPlayerById(pid);
    if (plr) {
      plr.despawn();
      console.log('<'+pid+'> DESPAWNED');
    }
  });



  //--- end events ----

  // request a player
  clientlog('SENDING PLAYER REQUEST');
  socket.emit('requestPlayer', {
    id: NAME,
    team: TEAM
  });


  setTimeout(() => {
    new Apparition(world, 'expl', 5, -200, -200, 0.5, 0.2);
  }, 3000);

  /* ----------------------- end INIT GAME ----------------------*/

  /* setup tickers */

  app.ticker.add(tick); // main tick function
  /* start rendering */
  update();
}

function update() {
  requestAnimationFrame(update);
  if ( fmeter ) fmeter.tick()
}

function tick(dt) {

  if (player){
    player.update(dt);
    player.collider.update(dt);
  }

  otherplayers.forEach(function(plr, i) {
    plr.interpolate(dt);
    plr.update(dt);
  });

  bullets.update(dt);

  if (player) {
    camera.follow(player);
    //camera.followDirection(player);
  }
  background.centerTo(world);
  background.rotateTo(world);

}

// add resizelistener to window
window.addEventListener('resize', function() {
  w = window.innerWidth;
  h = window.innerHeight;

  app.renderer.view.style.width = w + "px";
  app.renderer.view.style.height = h + "px";
  app.renderer.resize(w,h);
  if (camera) camera.centerToRenderer();
});
