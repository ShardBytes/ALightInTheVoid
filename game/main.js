
/* (c) ShardBytes 2018-<end of the world>
/* A Light In The Void => simple game made just using pixi in a small amount of time */

/* Game engine by Plasmoxy based on PIXI.js, made in less than 20 days*/
/* uses my pixialiases.js snippet for shorter names */

let urlParams = new URLSearchParams(window.location.search);
let NAME, TEAM;
let GAME_SITE = 'https://localhost';
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

function clientlog(obj) {
  console.log('< '+ obj + ' >');
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

/* -------- define game variables --------- */

let background, world, gui, camera, mkeys; // basic

let player, safarik; // objects
let dbg = true; // debug for colliders

let otherplayers = [];
let bullets; // swarm of bullets

/* ------------------ PIXI loader --------------------- */

let resDef = [
  ['rk', 'sprites/aquaroket.png'],
  ['saf', 'sprites/safarik.png']
];

resDef.forEach(t => {
  loader.add(t[0], t[1]);
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
    shoot: new KeyboardKey(32)
  };

  /* ------------------------- INIT GAME ----------------------- */

  safarik = new Entity('safarik', resources.saf.texture);
  safarik.collider = new BoxCollider(safarik);
  safarik.scale.set(1, 1);
  safarik.collider.updateSize();
  safarik.collider.debug(dbg);
  world.addChild(safarik);

  bullets = new EntitySwarm();
  world.addChild(bullets);

  // ze word is now complet
  // hide loading and show pixi
  $('#info').css('display', 'none');
  $('#pixi').css('display', 'block');

  // connect to game server
  clientlog('CONNECTING TO SERVER : ' + GAME_SITE);
  socket = io.connect(GAME_SITE, { transports: ['websocket']});

  // --- EVENTS ----

  // when player is deployed from server
  // plr -> ServerPlayer
  socket.on('deployPlayer', function(plr) {
    clientlog('PLAYER DEPLOYED, SPAWNING');
    player = new Player(world, mkeys, plr.id, plr.x, plr.y, plr.team);
    player.spawn();
    clientlog('PLAYER SPAWNED');
  });

  socket.on('serverError', function(err) {
    $('#pixi').css('display', 'none');
    $('#info').html(err);
    $('#info').css('display', 'block');
    throw new Error(err);
  });

  socket.on('allPlayers', function(serverPlayers) {
    clientlog('-> received allplayers list, creating otherplayers');
    otherplayers = [];
    serverPlayers.forEach(function(plr, i) {
      if (plr.id != player.id) otherplayers.push(
        new OtherPlayer(plr.id, plr.x, plr.y, plr.team)
      );
    });
  });

  //--- ent events ----

  // request a player
  socket.emit('requestPlayer', {
    id: NAME,
    team: TEAM
  });



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

  bullets.update(dt);


  if (player) camera.follow(player);
  background.centerTo(world);
  background.rotateTo(world);
}

// add some other listeners in the end

window.addEventListener('resize', function() {
  w = window.innerWidth;
  h = window.innerHeight;

  app.renderer.view.style.width = w + "px";
  app.renderer.view.style.height = h + "px";
  app.renderer.resize(w,h);
  camera.centerToRenderer();
});
