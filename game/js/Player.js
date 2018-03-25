// Player class by Plasmoxy,
// this is an ultra specific class definining player.
// uses -> bullets as swarm of bullets and a lot more

// player will shoot fake bullets (so we can see them), and be hurt from bullets from other players

class Player extends DirectionalEntity {

  constructor(container, controls, id, spawnX, spawnY, team) {
    super(id, team == '1' ? resources.cyanplayer.texture : resources.orangeplayer.texture);

    // --- basic stuff ---
    this.superContainer = container;
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.spawnDirection = (team == '1') ? PI/2 : -PI/2;
    this.team = team;
    this.cont = controls;
    this.sprite.scale.set(0.5, 0.5); // ONLY SPRITE SCALE !!!

    // --- specific player stuff ---
    this.alive = true;
    this.respawnTime = 7000; // ms

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.energyRegen = 15; // p p s

    // individual energy drains ->
    this.energyDrain = {
      boost: 0
    };

    this.shooting = false;
    this.deltaShoot = 0; // in seconds
    this.fireRate = 10; // bullets per second

    // --- ABILITIES ---
    this.boostActive = false;

    // --- movement stuff ---
    this.defaultMaxSpeed = 400; // points per sec
    this.maxSpeed = this.defaultMaxSpeed;
    this.rotationSpeed = 2; // rads per sec

    // this tween updates speed to target speed constantly
    this.speedtw = new Tween(this, 'speed', 200); // rate = acceleration
    this.speedtw.start();

    // --- define event controls ---
    this.controlsActive = true;

    this.cont.up.pressed = () => {
      if(this.controlsActive) {
        this.speedtw.target = this.maxSpeed;
        // play jet sound
        resources.jet.sound.play();
        // show fire
        this.fireApparition.visible = true;
      }
    };
    this.cont.down.pressed = () => {
      if(this.controlsActive) {
        this.speedtw.target = -this.maxSpeed/2; // half the speed when reverse
        resources.jet.sound.play();
        this.fireApparition.visible = true;
      }
    };

    // if shoot pressed, turn on fake shooting here and send shooting event
    this.cont.shoot.pressed = () => {
      if(this.controlsActive) {
        this.shooting = true;
        this.emitShooting();
      }
    };

    this.cont.shoot.released = () => {
      if (this.controlsActive) {
        this.shooting = false;
        this.emitShooting();
      }
    };

    this.cont.boost.pressed = () => { if (this.controlsActive) this.boost(true); };
    this.cont.boost.released = () => { if (this.controlsActive) this.boost(false); };


    // --- setup collider ---
    this.collider = new BoxCollider(this);
    this.collider.updateSize();
    this.collider.debug(false);
    this.collider.addToDetectionPool(safarik);

    // add fire Apparition
    this.fireApparition = new Apparition(this, 'fire_', '.png', 4, this.x, this.y, 0.08, 0.5, true);
    this.fireApparition.y = -25;
    this.fireApparition.x = 2;
    this.fireApparition.visible = false;

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
    // stop jet sound if playing
    resources.jet.sound.stop();
    // play despawn sound
    resources.explosionsound.sound.play();

    // target camera to safarik
    setTimeout(() => {
      cameraTarget = safarik;
    }, 1000);
  }

  respawn() {
    this.despawn();
    bigInfo.text = 'RESPAWNING (7s)';
    setTimeout(() => {
      bigInfo.text = '';
      this.spawn();
    }, this.respawnTime);
  }

  // after this player is hit
  hit(damage) {
    this.health -= damage; // dmg from bullet
  }

  boost(active) {
    this.boostActive = active;
    if (active && this.energy >= 20) {
      this.energy -= 20; // eat 20 energy
      this.energyDrain.boost = 30; // 30 more for each aditional second wasted in boost
      this.speedtw.target = 1000;
      this.speed = 1000;
      // play boost sound
      resources.boostsound.sound.play();
    } else {
      this.energyDrain.boost = 0;
      this.speedtw.target = this.maxSpeed;
      this.speed = this.maxSpeed;
    }
  }

  // controls which need to be updated with ticks
  control(dt) {

    let dr = this.rotationSpeed*(dt/60); // rotation difference
    // if up and down are down, set target speed to 0
    if (!this.cont.up.down && !this.cont.down.down && !this.boostActive) {
      this.speedtw.target = 0;
      resources.jet.sound.stop();
      this.fireApparition.visible = false;
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


      if (this.controlsActive) {
        this.control(dt);
      }

      this.speedtw.update(dt);
      this.move(dt);
      this.rotateToDirection();

      // SHOOT fake bullets if shooting
      if (this.deltaShoot > 1.0/this.fireRate) {
        this.deltaShoot = 0;
        // if we have sufficient energy
        if (this.shooting && this.energy >= 5) {
          this.energy -= 4; // drain energy for each shot
          // some wild trigonometry to we can shoot 2 bullets, duh
          bullets.addChild(new Bullet(bullets, this, this.x + 10*Math.cos(this.direction), this.y - 10*Math.sin(this.direction), this.direction, true));
          bullets.addChild(new Bullet(bullets, this, this.x - 10*Math.cos(this.direction), this.y + 10*Math.sin(this.direction), this.direction, true));
          // play shoot sound ( i dont want to play it on both bullets)
          resources.shoot.sound.play();
        }
      }
      this.deltaShoot += (dt/60);

      // send position data to server
      this.emitPositionChange();

    }
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

  emitShooting() {
    socket.emit('playerShooting', this.shooting);
  }

  emitSpawned() {
    socket.emit('playerSpawn', true);
  }

  emitDespawned() {
    socket.emit('playerSpawn', false);
  }

}
