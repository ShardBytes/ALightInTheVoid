
/* (c) ShardBytes 2018-<end of the world>
/* A Light In The Void => simple mutiplayer game made just using pixi in less than 20 days */

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
let cameraTarget;

let player, safarik; // objects

let otherplayers = [];
let bullets; // swarm of bullets

// background
let stars;

// gui
let playerBars, bigInfo;

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

function scaleCameraToScreenSize() {
  camera.scale = 0.5 * ( app.renderer.width/1080 );
}

/* ------------------ PIXI loader --------------------- */

let resDef = [
  ['cyanplayer', 'sprites/cyanplayer.png'],
  ['orangeplayer', 'sprites/orangeplayer.png'],
  ['bootlegstars', 'sprites/bootlegstars.png'],
  ['bluelaser', 'sprites/bluelaser.png'],
  ['safarik', 'sprites/safarik.png']
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

  clientlog('### INITIALIZING GAME ###');

  /* INIT CONTAINERS - order is important ! */
  background = new Background(0.5); app.stage.addChild(background);
  world = new World(); app.stage.addChild(world);
  gui = new Gui(); app.stage.addChild(gui);

  // link camera to world
  camera = new FollowerCamera(world, 1/8);
  scaleCameraToScreenSize();

  /* define control */
  mkeys = {
    up: new KeyboardKey(38),
    down: new KeyboardKey(40),
    left: new KeyboardKey(37),
    right: new KeyboardKey(39),
    shoot: new KeyboardKey(82), // R
    boost: new KeyboardKey(81) // Q
  };

  // setup GUI
  playerBars = new PlayerBars();
  gui.addChild(playerBars);

  bigInfo = new BigInfo();
  gui.addChild(bigInfo);

  /* ------------------------- INIT GAME ----------------------- */


  stars = new TilingSprite(resources.bootlegstars.texture, 10000, 10000);
  stars.position.set(-5000, -5000);
  background.addChild(stars);

  safarik = new Safarik();
  world.addChild(safarik);

  bullets = new EntitySwarm();
  world.addChild(bullets);

  // ze word is now complet
  /* ------------------ BEGIN GAME -------------------*/

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

    bigInfo.text = 'Welcome, ' + plr.id;
    setTimeout(() => {
      bigInfo.text = '';
    }, 1000);
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
        newplr.rotation = -plr.dir; // fix rotations as playerDir hasn't been trigerred yet
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

  socket.on('safarikPos', function(data) {
    safarik.tx = data.x;
    safarik.ty = data.y;
  });

  //--- end events ----

  // request a player
  clientlog('SENDING PLAYER REQUEST');
  socket.emit('requestPlayer', {
    id: NAME,
    team: TEAM
  });

  /* setup tickers */

  app.ticker.add(tick); // main tick function
  /* start rendering */
  clientlog('### STARTING RENDERING ###');
  update();
}

// update fpsmeter and render
function update() {
  requestAnimationFrame(update);

  background.centerTo(world);
  background.rotateTo(world);
  playerBars.redraw(player);

  if ( fmeter ) fmeter.tick()
}

// ----- THE MAIN TICK FUNCTION -----
// ( all internal object ticking is chained to this )
function tick(dt) {

  if (player){
    player.update(dt);
    player.collider.update(dt);
  }

  otherplayers.forEach(function(plr, i) {
    plr.interpolate(dt);
    plr.update(dt);
  });

  if (cameraTarget) {
    camera.follow(dt, cameraTarget);
    //camera.followDirection(player);
  }

  bullets.update(dt);
  safarik.update(dt);

}

// add resizelistener to window
window.addEventListener('resize', function() {
  w = window.innerWidth;
  h = window.innerHeight;

  app.renderer.view.style.width = w + "px";
  app.renderer.view.style.height = h + "px";
  app.renderer.resize(w,h);
  scaleCameraToScreenSize();
  if (camera) camera.centerToRenderer();
  if (playerBars) playerBars.align();
});
