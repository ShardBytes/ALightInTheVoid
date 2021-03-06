// Player class by Plasmoxy,
// this is an ultra specific class definining player.
// uses -> bullets as swarm of bullets and a lot more

// player will shoot fake bullets (so we can see them), and be hurt from bullets from other players

class Player extends DirectionalEntity {

  constructor(container, controller, id, spawnX, spawnY, team) {
    super(id, team == '1' ? resources.cyanplayer.texture : resources.orangeplayer.texture);
    this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // pixel mode

    // --- basic stuff ---
    this.superContainer = container;
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.spawnDirection = (team == '1') ? PI/2 : -PI/2;
    this.team = team;
    this.cont = controller;
    this.sprite.scale.set(2, 2);

    // --- specific player stuff ---
    this.alive = true;
    this.respawnTime = 5000; // ms

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.energyRegen = 15; // p p s

    this.inSpawn = false; // if the player is in spawn

    // individual energy drains ->
    this.energyDrain = {
      boost: 0
    };

    this.shooting = false;
    this.deltaShoot = 0; // in seconds
    this.fireRate = 7; // bullets per second
    this.cannonsWidth = 8; // for animations
    this.cannonsOffset = 10;

    // --- ABILITIES ---
    this.boostActive = false;

    // --- movement stuff ---
    this.defaultMaxSpeed = 400; // points per sec
    this.maxSpeed = this.defaultMaxSpeed;
    this.rotationSpeed = 2.5; // rads per sec

    // this tween updates speed to target speed constantly
    this.speedtw = new Tween(this, 'speed', 200); // rate = acceleration
    this.speedtw.start();

    // --- define controls ---
    this.controlsActive = true;

    this.cont.up.pressed = (() => {
      if(this.controlsActive) {
        this.speedtw.target = this.maxSpeed;
        // play jet sound
        resources.jet.sound.play();
        // show fire
        this.fireApparition.visible = true;
        socket.emit('apparitionChange', { app: 'fireApparition', visible: true });
      }
    }).bind(this);

    this.cont.down.pressed = (() => {
      if(this.controlsActive) {
        this.speedtw.target = -this.maxSpeed/2; // half the speed when reverse
        resources.jet.sound.play();
      }
    }).bind(this);

    // if shoot pressed, turn on fake shooting here and send shooting event
    this.cont.shoot.pressed = (() => {
      if(this.controlsActive) {
        this.shooting = true;
      }
    }).bind(this);

    this.cont.shoot.released = (() => {
      if (this.controlsActive) {
        this.shooting = false;
      }
    }).bind(this);

    this.cont.boost.pressed = (() => { if (this.controlsActive && !this.boostActive) this.boost(true); }).bind(this);
    this.cont.boost.released = (() => { if (this.controlsActive && this.boostActive) this.boost(false); }).bind(this);

    this.cont.flash.pressed = ( () => {if (this.controlsActive) this.flash(); } );

    this.cont.bomb.pressed = ( () => { if (this.controlsActive) this.bomb(); });

    // --- setup collider ---
    this.collider = new CircleCollider(this, 5);
    this.collider.r = 15;
    this.collider.debug(COLLIDER_DEBUG); // DEBUG
    // add spawns to detection pool
    this.collider.addToDetectionPool(spawn1);
    this.collider.addToDetectionPool(spawn2);
    this.collider.collided = (t, dx, dy, ang) => {
      if (t instanceof Spawn) {
        if (t.id != 'spawn' + this.team) this.respawn(); // commit sudoku if in other team's spawn
      }
    };
    this.collider.colliding = (dt, t, dx, dy, ang) => {
      this.inSpawn = t instanceof Spawn; // inSpawn true if colliding with spawn
    };
    this.collider.discollided = (t, dx, dy, ang) => {
      if (t instanceof Spawn) this.inSpawn = false; // false inSpawn on leave
    };

    // add fire Apparition
    this.fireApparition = new Apparition(this, 'fire_', '.png', 4, 3, -25, 0.08, 0.5, true);
    this.fireApparition.visible = false;

    // add boost Apparition
    this.boostApparition = new Apparition(this, 'boostparticles ', '.aseprite', 20, 0, 0, 2, 0.5, true, true);
    this.boostApparition.rotation = Math.PI;
    this.boostApparition.visible = false;


  } // end constructor

  // by spawning the player, I mean reseting all of its states, placing it on spawn pos and adding it to the world
  // and also broadcasting the event to server so the others will know ;)
  spawn() {
    this.emitSpawned();
    // reset player stuff on spawn
    console.log('<Player> PLAYER SPAWNED');
    // reset stuff
    this.direction = this.spawnDirection; // spawn direction
    this.speed = 0;
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.health = this.maxHealth;
    this.energy = this.maxEnergy;
    this.boostActive = false;
    this.energyDrain.boost = 0;
    this.speedtw.target = 0;
    this.shooting = false;
    // add player child to supercont
    if (!this.superContainer.children.includes(this)) this.superContainer.addChild(this);
    this.alive = true;
    this.controlsActive = true;
    cameraTarget = this;

    // play spawn sound
    resources.helloworld.sound.play();
  }

  // by despawning it i mean removing it from the world
  despawn() {
    this.controlsActive = false;
    this.emitDespawned();
    console.log('<Player> PLAYER DESPAWNED');
    this.alive = false;
    // at the end, remove child
    // (but not dereference if we have one spare reference from outside)
    // (you should have that.)
    if (this.superContainer.children.includes(this)) this.superContainer.removeChild(this);
    // show despawn animation
    new Apparition(world, 'expl_', '.png', 6, this.x, this.y, 1, 0.2);
    // stop sounds if playing
    resources.jet.sound.stop();
    resources.humming.sound.stop();

    // stop unwanted apparitions
    this.fireApparition.visible = false;
    socket.emit('apparitionChange', { app: 'fireApparition', visible: false});
    this.boostApparition.visible = false;
    socket.emit('apparitionChange', { app: 'boostApparition', visible: false });

    // play despawn sound
    resources.explosionsound.sound.play();

    // target camera to safarik
    setTimeout(() => {
      cameraTarget = safarik;
    }, 1000);
  }

  respawn() {
    this.despawn();
    setTimeout(() => {
      this.spawn();
    }, this.respawnTime);
  }

  // after this player is hit
  hit(damage) {
    this.health -= damage; // dmg from bullet
  }

  // ABILITY : BOOST
  boost(active) {
    this.boostActive = active;
    if (active && this.energy >= 15) {
      this.energy -= 15; // eat 15 energy
      this.energyDrain.boost = 40; // 40 more for each aditional second wasted in boost
      this.speedtw.target = 1000;
      this.speed = 1000;
      // play boost sound
      resources.boostsound.sound.play();
      resources.humming.sound.play();
      this.boostApparition.visible = true;
      socket.emit('apparitionChange', { app: 'boostApparition', visible: true });
    } else {
      resources.humming.sound.stop();
      this.boostApparition.visible = false;
      this.energyDrain.boost = 0;
      this.speedtw.target = this.maxSpeed;
      this.speed = this.maxSpeed;
      socket.emit('apparitionChange', { app: 'boostApparition', visible: false });
    }
  }

  // ABILITY: FLASH ( TIME WARP )
  flash() {
    let d = 500; // difference to flash
    this.health -= 19; // 3hp left after all flashes used
    new Apparition(world, 'explblue_', '.png', 6, this.x, this.y, 1, 0.2);

    // play flash sound
    resources.timewarp.sound.play();

    this.x -= d*Math.sin(this.direction);
    this.y -= d*Math.cos(this.direction);
    // quickly flash camera too
    camera.x = this.x;
    camera.y = this.y;

    socket.emit('playerFlash', {
      x: this.x,
      y: this.y
    });

    new Apparition(world, 'explblue_', '.png', 6, this.x, this.y, 1, 0.2);
  }

  // ABILITY : BOMB
  bomb() {
    if (!this.inSpawn && this.energy >= 55) {
      this.energy -= 55;
      // create bomb behind player
      let b = new Bomb(bombs, this, this.x, this.y, this.direction, -70);
      socket.emit('playerBomb', {
        x: b.x,
        y: b.y
      });
      // play place sound
      resources.bombplace.sound.play();
    }
  }

  // controls which need to be updated with ticks
  control(dt) {

    let dr = this.rotationSpeed*(dt/60); // rotation difference
    // if up and down are down, set target speed to 0
    if (!this.cont.up.down && !this.cont.down.down && !this.boostActive) {
      this.speedtw.target = 0;
      resources.jet.sound.stop();
      if (this.fireApparition.visible) {
        this.fireApparition.visible = false;
        socket.emit('apparitionChange', { app: 'fireApparition', visible: false });
      }
    }

    // move sideways ( change direction )
    // the direction additions are changed depending whether its moving forward or backward
    if (this.cont.left.down) {
      this.direction += dr;
      this.emitDirectionChange();
    }

    if (this.cont.right.down) {
      this.direction -= dr;
      this.emitDirectionChange();
    }

  }

  update(dt) {
    if (this.alive) { // update self if is alive, if not then nah

      super.update(dt); // update superclass

      // if outside of the world, kill and respawn
      if ( this.x >= world.w/2 || this.x <= -world.w/2 || this.y >= world.h/2 || this.y <= -world.h/2) {
        this.respawn();
        return;
      }

      // checc if ded, if yes, respawne
      if (this.health <= 0) {
        this.respawn();
      }

      // drain energy -> sum all drains
      if (this.energy > 0) {
        this.energy -= ( this.energyDrain.boost )*(dt/60);
      }

      // force stop all abilities if no energy
      if (this.energy <= 0) {
        this.boost(false);
      }

      // regenerate energy
      if (this.energy < this.maxEnergy) {
        this.energy += this.energyRegen*(dt/60);
      }

      this.checkOverStock();

      if (this.controlsActive) {
        this.control(dt);
      }

      this.speedtw.update(dt);
      this.move(dt);
      this.rotateToDirection();

      // SHOOT fake bullets if shooting
      if (this.deltaShoot > 1.0/this.fireRate) {
        this.deltaShoot = 0;
        // if we have sufficient energy and not in spawn
        if (this.shooting && !this.inSpawn && this.energy >= 6) {
          // emit shoot to other players
          this.emitShoot();
          this.energy -= 6; // drain energy for each shot
          // some wild trigonometry to we can shoot 2 bullets, duh
          new Bullet(bullets, this, this.x + this.cannonsWidth *Math.cos(this.direction), this.y - this.cannonsWidth *Math.sin(this.direction), this.direction, true, this.cannonsOffset);
          new Bullet(bullets, this, this.x - this.cannonsWidth *Math.cos(this.direction), this.y + this.cannonsWidth *Math.sin(this.direction), this.direction, true, this.cannonsOffset);
          // play shoot sound ( i dont want to play it on both bullets)
          resources.shoot.sound.play();
        }
      }
      this.deltaShoot += (dt/60);

      // send position data to server
      this.emitPositionChange();

    }
  }

  // check overenergy nad overhealth
  checkOverStock() {
    if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
    if (this.health > this.maxHealth) this.health = this.maxHealth;
  }

  // --- these methods send data to server ---

  emitPositionChange() {
    socket.emit('playerPos', {
      x: this.x,
      y: this.y
    });
  }

  emitDirectionChange() {
    socket.emit('playerDir', this.direction);
  }

  emitShoot() {
    socket.emit('playerShoot');
  }

  emitSpawned() {
    socket.emit('playerSpawn', true);
  }

  emitDespawned() {
    socket.emit('playerSpawn', false);
  }

}
