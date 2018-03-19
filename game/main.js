/* Game engine by Plasmoxy based on PIXI.js */
/* uses my pixialiases.js snippet for shorter names */

console.log('--- The amazing Plasmoxy\'s game engine based on PIXI.js, written in less than 20 days lmao ---');

let fmeter = new FPSMeter();

/* constants/aliases */
const pi = Math.PI;

/* setup pixi */
let app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  transparent: false,
  resolution: 1
});

app.view.style.display = "none";
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x111111;

function loadProgressHandler(ldr, res) { // loader, resource
  console.log('LOADING [ '+Math.round(ldr.progress)+'% ] : ' + res.name + ' -> ' + res.url);
}

/* -------- define game variables --------- */

let background, world, gui, camera, mkeys; // basic

let player, safarik; // objects
let dcontroller; // debug controller
let dbg = true; // debug for colliders
let bullets; // swarm of bullets

/* PIXI loader */

let resDef = [
  ['rk', 'sprites/aquaroket.png'],
  ['saf', 'sprites/safarik.png'],
  ['XD', 'sprites/XD.json']
];

resDef.forEach(t => {
  loader.add(t[0], t[1]);
});

loader
  .on('progress', loadProgressHandler)
  .load(setup)
;

function setup() {

  /* hide loading and show app */
  document.getElementById('loading').style.display = 'none';
  app.view.style.display = "block";

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


  /* -- INIT GAME --- */

  safarik = new Entity('safarik', resources.saf.texture);
  safarik.collider = new BoxCollider(safarik);
  safarik.scale.set(1, 1);
  safarik.collider.updateSize();
  safarik.collider.debug(dbg);
  world.addChild(safarik);

  player = new Player(mkeys, 'ja');
  world.addChild(player);

  bullets = new EntitySwarm();
  world.addChild(bullets);

  /* --- end INIT GAME ---*/

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
  player.update(dt);
  player.collider.update(dt);
  bullets.update(dt);
  camera.follow(player);
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
