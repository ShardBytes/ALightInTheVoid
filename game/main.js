/* pixibase by Plasmoxy */
/* uses my pixialiases.js snippet for shorter names */

console.log('--- The amazing Plasmoxy\'s game engine for Pixi, written in less than 20 days lmao ---');

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

/* define game variables */
let bg, world, gui, camera, mkeys; // basic

let a,b;
let dcontroller;

class Roket extends DirectionalEntity {
  constructor() {
    super('XD', resources.rk.texture);
    this.collider = new BoxCollider(this, this.width + 20, this.height + 20);
    this.position.set(-1000, -1000);
    this.scale.set(0.5, 0.5);
    this.collider.updateSize();
    this.rotation = 0;
    this.sprite.rotation = PI;
  }
}

/* PIXI loader */

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

  /* hide loading and show app */
  document.getElementById('loading').style.display = 'none';
  app.view.style.display = "block";

  /* INIT CONTAINERS - order is important ! */
  world = new World(); app.stage.addChild(world);
  gui = new Gui(); app.stage.addChild(gui);

  // link camera to world
  camera = new Camera(world);

  /* define control */
  mkeys = {
    up: new KeyboardKey(38),
    down: new KeyboardKey(40),
    left: new KeyboardKey(37),
    right: new KeyboardKey(39)
  };


  /* -- INIT GAME --- */

  let dbg = true;

  b = new Entity('b', resources.saf.texture);
  b.collider = new BoxCollider(b, 600, 600);
  b.scale.set(1, 1);
  b.collider.updateSize();
  b.collider.debug(dbg);
  world.addChild(b);

  a = new Roket();
  a.collider.addToDetectionPool(b);
  a.collider.debug(dbg);
  a.colliding = (dt, t, dx, dy, ang) => {
    dcontroller.ms = 500;
  };
  world.addChild(a);

  dcontroller = new SimpleDirectionalEntityController(mkeys, a, 300);

  /* --- end INIT GAME ---*/

  /* setup ticker */
  app.ticker.add(tick);
  /* start rendering */
  update();
}

function update() {
  requestAnimationFrame(update);
  if ( fmeter ) fmeter.tick()
}

function tick(dt) {
  dcontroller.update(dt);
  a.rotateToDirection();
  a.move(dt);
  a.update(dt);
  camera.follow(a);
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
