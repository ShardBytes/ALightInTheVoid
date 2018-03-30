
/* (c) ShardBytes 2018-<end of the world>
/* by Plasmoxy */
/* [ A Light In The Void ] => simple mutiplayer game made just using pixi */
/* Game engine by Plasmoxy based on PIXI.js, made in hurry*/
/* uses my pixialiases.js snippet for shorter names */
/* This game was made for a programming competition IHRA by UPJŠ Košice */

/* ALSO WORKS ON MOBILE NOW YAYY YESS FINALLY ( I spend half a day on that ) */

/* ---- CONCLUSION ----
/* Anyway making this game was a definitelly amazing thing to do as
 * I've just become ultra overpowered with JS thanks to this. After
 * manually implementing colliders, directions, physics, I now feel
 * ultra happy that I used my math knowledge somewhere practically.
 * GG
 * ( also thanks for reading this, here's the code :)
 * ( also RIP javascript parser which had to read these unimportant lines of comments )
 */

const DEVELOPMENT_MODE = true;
const DEVMODE_MOBILE = false;
const VERSION = '1.6.6 Nicole';
const BUILDNAME = '300318/0118';
const urlParams = new URLSearchParams(window.location.search);
const GAME_SITE = DEVELOPMENT_MODE ? (DEVMODE_MOBILE ? '192.168.0.106' : 'https://localhost') : '/'; // change to '/' when on server, change to 'https://localhost' when developing ( need ssl certifs )
const MOBILE = window.mobileAndTabletCheck();
const COLLIDER_DEBUG = urlParams.has('cdebug') || false;
let NAME, TEAM;
let INTERP_RATIO = 0.25;
let CAMERA_SCALE_RATIO = MOBILE ? 1.1 : 0.7;
let CAMERA_FOLLOW_RATIO = 0.2;
let socket;

// parse login from url
if (urlParams.has('name') && urlParams.has('team')) {
  NAME = urlParams.get('name');
  TEAM = urlParams.get('team');
  if (TEAM != '1' && TEAM != '2') {
    $('#info').html('BAD TEAM NAME');
    throw new Error('BAD TEAM NAME');
  }
} else {
  $('#info').html('YO FAG NAME OR TEAM NOT SPECIFED xDDD');
  throw new Error('ERROR M8: NO NAME URL PARAM SPECIFIED FAGGIT'); // note: the mild vulgarity is important as the message is adressed to the developer, who didn't fix this bug = me
}

// just some console utility
function clientlog(obj) {
  console.log('[ '+ obj + ' ]');
}

console.log('--- ShardBytes: A Light In The Void ---')
console.log('--- Based on the amazing Plasmoxy\'s game engine based on PIXI.js, written in 3 weeks lmao ---');
if (MOBILE) console.log('MOBILE DEVICE DETECTED !  GOD SAVE YOU, DEAR FRAMES PER SECOND ;)');

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
app.renderer.backgroundColor = 0x0C0C0C;

// progress function
function loadProgressHandler(ldr, res) { // loader, resource
  let progr = 'LOADING < '+Math.round(ldr.progress)+'% >';
  console.log(progr  + ' : ' + res.name + ' -> ' + res.url);
  $('#info').html(progr);
}
loader.on('progress', loadProgressHandler)

/* -------- define game variables and functions --------- */

let background, world, gui, camera, controller; // basic
let cameraTarget;
let miniMap;

let player, safarik; // objects

let otherplayers = [];
let bullets, bombs; // swarms

// gui ( let them stay global for now )
let playerBars, bigInfo, bottomTextLeft, bottomTextMid, bottomTextRight, scoreboard;

// local spawn objects
let spawn1, spawn2;

let orbswarm;

// add other player but don't spawn it, that may be handled through playerSpawned...
function addOtherPlayer(op) {
  otherplayers.push(op);
  orbswarm.addEntityDetection(op);
}

// same
function removeOtherPlayer(op) {
  orbswarm.removeEntityDetection(op);
  otherplayers.splice(otherplayers.indexOf(op), 1);
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
  if (camera) camera.scale = CAMERA_SCALE_RATIO * ( (app.renderer.width+app.renderer.height)/(1080+720) );
}

/* ------------------ PIXI loader --------------------- */

let resDef = [
  /* SOUNDS : */
  ['music', 'sounds/music.mp3'],
  ['gameend', 'sounds/gameend.mp3'],
  ['jet', 'sounds/jet.mp3'],
  ['hit', 'sounds/hit.wav'],
  ['shoot', 'sounds/shoot.wav'],
  ['safarikcontested', 'sounds/safarikcontested.mp3'],
  ['boostsound', 'sounds/boostsound.wav'],
  ['explosionsound', 'sounds/explosionsound.wav'],
  ['healthorb', 'sounds/healthorb.mp3'],
  ['energyorb', 'sounds/energyorb.mp3'],
  ['humming', 'sounds/humming.mp3'],
  ['helloworld', 'sounds/helloworld.mp3'],
  ['bombplace', 'sounds/bombplace.mp3'],
  ['timewarp', 'sounds/timewarp.mp3'],

  /* TEXTURES : */
  ['cyanplayer', 'sprites/players/aquamarineplayer.png'],
  ['orangeplayer', 'sprites/players/amberplayer.png'],
  ['bluelaser', 'sprites/bluelaser.png'],
  ['safarik', 'sprites/safarik.png'],
  ['bigplanet', 'sprites/Planett1.png'],
  ['smallplanet1', 'sprites/Planett2.png'],
  ['smallplanet2', 'sprites/Planett3.png'],
  ['healthpowerup', 'sprites/powerups/ruzovagulickapriesvitna.png'],
  ['energypowerup', 'sprites/powerups/modragulickapriesvitna.png'],
  ['bomb', 'sprites/bomb.png'],
  ['touchpad', 'sprites/touchpad.png'],
  ['touchbuttons', 'sprites/touchButtons.png']

];

/* ANIMATIONS */
let animationsDef = [
  'sprites/anim/expl.json',
  'sprites/anim/explblue.json',
  'sprites/anim/fire.json',
  'sprites/anim/blueportal_particles.json',
  'sprites/anim/orangeportal_rotating.json',
  'sprites/anim/boostparticles.json'
];

// load animations
animationsDef.forEach(t => {
  loader.add(t);
});

// load resources
resDef.forEach(t => {
  loader.add(t[0], t[1]);
});

// _e_a_s_t_E_r_ _e_g_g_ -> the stars will turn violet when playing game between 20:00 and 6:00 CEST
(function() {
  let hrs = (new Date).getHours();
  if (hrs > 18 || hrs < 4) loader.add('starBg', 'sprites/starBgGanjaEdition.png');
  else loader.add('starBg', 'sprites/starBgPmxyEdition.png');
})();


loader.load(setup)

function setup() {

  /* ------------------------- INIT GAME ----------------------- */

  clientlog('### INITIALIZING GAME ###');

  /* setup sounds (like looping, volume and stuff) */
  resources.jet.sound.loop = true;
  resources.jet.sound.volume = 0.6;

  resources.music.sound.loop = true;
  resources.music.sound.volume = 0.9;

  resources.safarikcontested.sound.volume = 0.5;
  resources.shoot.sound.volume = 0.2;

  resources.humming.sound.loop = true;

  resources.helloworld.sound.volume = 0.5;
  resources.bombplace.sound.volume = 0.3;
  resources.timewarp.sound.volume = 0.5;
  resources.healthorb.sound.volume = 0.5;
  resources.energyorb.sound.volume = 0.5;

  /* INIT CONTAINERS - order is important ! */
  background = new GameBackground(); app.stage.addChild(background);
  world = new World(8000, 3000); world.drawBorder(); app.stage.addChild(world);
  gui = new Gui(); app.stage.addChild(gui);

  // link camera to world
  camera = new FollowerCamera(world, CAMERA_FOLLOW_RATIO);
  scaleCameraToScreenSize();

  // setup spawns
  spawn1 = new Spawn('1'); world.addChild(spawn1);
  spawn2 = new Spawn('2'); world.addChild(spawn2);

  // setup orbs
  orbswarm = new OrbSwarm();
  world.addChild(orbswarm);

  /* DEFINE CONTROLLER -> create virtual gamepad = mobilecontroller if on mobile device */
  controller = MOBILE ? new MobileController() : new KeyboardController();
  if (MOBILE) gui.addChild(controller); // add virutal gamepad to gui if present

  // setup GUI
  playerBars = new PlayerBars();
  gui.addChild(playerBars);

  miniMap = new MiniMap();
  gui.addChild(miniMap);

  bigInfo = new BigInfo();
  gui.addChild(bigInfo);

  bottomTextLeft = new BottomText(1, 'A Light in The Void\nv'+VERSION+' - '+(MOBILE?'MOBILE':'PC')+'\nBuild '+BUILDNAME+'\n(c) ShardBytes');
  gui.addChild(bottomTextLeft);

  scoreboard = new Scoreboard();
  gui.addChild(scoreboard);

  /*
  bottomTextMid = new BottomText(2, NAME);
  gui.addChild(bottomTextMid);
  */

  bottomTextRight = new BottomText(3, 'LASERS-[R]  ION BOOST-[Q]\nTIME WARP-[W] PLASMABOMB-[E]');
  gui.addChild(bottomTextRight);

  safarik = new Safarik();
  world.addChild(safarik);

  bullets = new EntitySwarm();
  world.addChild(bullets);

  bombs = new EntitySwarm();
  world.addChild(bombs);

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
    player = new Player(world, controller, plr.id, plr.x, plr.y, plr.team);
    player.spawn(); // spawn the player ( server will chain the spawn to others)
    safarik.collider.addToDetectionPool(player); // safarik detects player
    orbswarm.addEntityDetection(player);

    // !!! -> hide loading and show pixi after the player is spawned
    $('#info').css('display', 'none');
    $('#pixi').css('display', 'block');
    $('#loadingCircle').css('display', 'none');

    bigInfo.text = 'Welcome, ' + plr.id + '\nBring Šafárik to your base !';
    setTimeout(() => {
      bigInfo.text = '';
    }, 3000);

    if (!urlParams.has('nomusic')) resources.music.sound.play(); // play music if not in devmode

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

  socket.on('playerShoot', function(id) {
    let plr = getOtherPlayerById(id);
    if (plr) plr.shoot();
  });

  socket.on('playerFlash', function(npos) {
    let plr = getOtherPlayerById(npos.id);
    if (plr) plr.flash(npos.x, npos.y);
  });

  socket.on('playerBomb', function(bpos) {
    let plr = getOtherPlayerById(bpos.id);
    if (plr) plr.bomb(bpos.x, bpos.y);
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

  socket.on('safarikContested', function() {
    resources.safarikcontested.sound.play();
  });

  socket.on('gameEnded', function(data) {
    console.log(' --- GAME ENDED --- : ' + data.team);
    safarik.collider.active = false;

    // hide safarik after some time, with STYLE !
    setTimeout(() => {

      safarik.collider.active = false;
      safarik.visible = false;
      new Apparition(world, 'explblue_', '.png', 6, safarik.x, safarik.y, 7, 0.2);
      resources.gameend.sound.play();

      if (data.matchend) {
        bigInfo.text = "MATCH ENDED\n" + (data.team=='1'?'BLUE':'ORANGE') + ' TEAM WON !' + '\n(restarting soon ...)';
      } else {
        bigInfo.text = 'Round ended' + '\n(starting new round ...)';
      }


    }, 3500);

    player.despawn();
  });

  socket.on('gameReset', function() {
    console.log('--- GAME RESET ---');
    bigInfo.text = 'GAME RESET';

    // show safarik after some time ( so it doesnt lag around)
    setTimeout(() => {
      safarik.collider.active = true;
      safarik.visible = true;
    }, 1000);

    player.spawn();
    setTimeout(() => {
      bigInfo.text = '';
    }, 1000);
  });

  socket.on('updateScore', function(data) {
    if (data && data.length == 2) {
      scoreboard.team1Points.text = '' + data[0];
      scoreboard.team2Points.text = '' + data[1];
    }
  });

  socket.on('apparitionChange', function(data) {
    if (data) {
      let plr = getOtherPlayerById(data.id);
      if (plr) {
        switch(data.app) {
          case 'fireApparition':
            plr.fireApparition.visible = data.visible;
            break;
          case 'boostApparition':
            plr.boostApparition.visible = data.visible;
            break;
        }
      }
    }
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
  if ( fmeter ) fmeter.tick()

  // update graphics stuff
  background.center();

  if (cameraTarget) {
    camera.follow(cameraTarget);
  }
}

// ----- THE MAIN TICK FUNCTION -----
// ( all internal object ticking is chained to this )
function tick(dt) {

  if (player){
    player.update(dt);
  }

  otherplayers.forEach(function(plr, i) {
    plr.interpolate(dt);
    plr.update(dt);
  });

  // update other
  bullets.update(dt);
  safarik.update(dt);
  orbswarm.update(dt);
  bombs.update(dt);

  playerBars.redraw(player);
  miniMap.redraw();
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
  if (background) background.rendCenter();
  if (playerBars) playerBars.align();
  if (bigInfo) bigInfo.align();
  if (miniMap) miniMap.align();
  if (bottomTextLeft) bottomTextLeft.align();
  if (bottomTextMid) bottomTextMid.align();
  if (bottomTextRight) bottomTextRight.align();
  if (scoreboard) scoreboard.align();
  if (controller && controller.align) controller.align();
});
