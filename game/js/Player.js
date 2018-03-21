// Player class by Plasmoxy,
// this is an ultra specific class definining player.
// uses -> bullets as swarm of bullets and a lot more

// player will shoot fake bullets (so we can see them), and be hurt from bullets from other players

class Player extends DirectionalEntity {

  constructor(container, controls, id, spawnX, spawnY, team) {
    super(id, resources.rk.texture);

    // --- basic stuff ---
    this.superContainer = container;
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.team = team;
    this.cont = controls;
    this.scale.set(0.5, 0.5);
    this.sprite.rotation = PI;

    // --- specific player stuff ---
    this.alive = true;
    this.respawnTime = 5000; // ms

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;

    this.shooting = false;
    this.deltaShoot = 0; // in seconds
    this.fireRate = 10; // bullets per second

    // --- movement stuff ---
    this.maxSpeed = 500; // points per sec
    this.rotationSpeed = 1.8; // rads per sec

    // this tween updates speed to target speed constantly
    this.speedtw = new Tween(this, 'speed', 300); // rate = acceleration
    this.speedtw.start();

    // define event controls
    this.controlsActive = true;
    this.cont.up.pressed = () => { if(this.controlsActive) this.speedtw.target = this.maxSpeed; };
    this.cont.down.pressed = () => { if(this.controlsActive) this.speedtw.target = -this.maxSpeed/2; };
    this.cont.shoot.pressed = () => { this.shooting = true; this.emitShooting(); }
    this.cont.shoot.released = () => { this.shooting = false; this.emitShooting(); }

    // --- setup collider ---
    this.collider = new BoxCollider(this);
    this.collider.updateSize();
    this.collider.debug(false);
    this.collider.addToDetectionPool(safarik);

    // collision handler
    this.collider.collided = (t, dx, dy, ang) => {
      if (t == safarik) {
        this.despawn();
        setTimeout(() => { // always use lambdas my friend, they keep the identity of object
          this.spawn();
        }, 5000);
      }
    };

  } // end constructor

  // by spawning the player, I mean reseting all of its states, placing it on spawn pos and adding it to the world
  // and also broadcasting the event to server so the others will know ;)
  spawn() {
    this.emitSpawned();
    // reset player stuff on spawn
    console.log('<Player> PLAYER SPAWNED');
    this.direction = PI;
    this.speed = 0;
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.health = this.maxHealth;
    // add player child to supercont
    if (!this.superContainer.children.includes(this)) this.superContainer.addChild(this);
    this.alive = true;
    cameraTarget = this;
  }

  // by despawning it i mean removing it from the world
  despawn() {
    this.emitDespawned();
    console.log('<Player> PLAYER DESPAWNED');
    this.alive = false;
    // at the end, remove child
    // (but not dereference if we have one spare reference from outside)
    // (you should have that.)
    if (this.superContainer.children.includes(this)) this.superContainer.removeChild(this);
    // show despawn animation
    new Apparition(world, 'expl', 5, this.x, this.y, 0.8, 0.2);

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
    this.health -= damage; // 20 dmg
  }

  // controls which need to be updated with ticks
  control(dt) {

    let dr = this.rotationSpeed*(dt/60); // rotation difference
    // if up and down are down, set target speed to 0
    if (!this.cont.up.down && !this.cont.down.down) this.speedtw.target = 0;

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

      // check if ded
      if (this.health <= 0) {
        this.respawn();
      }

      super.update(dt);
      if (this.controlsActive) this.control(dt);
      this.speedtw.update(dt);
      this.move(dt);
      this.rotateToDirection();

      // shoot fake bullets if shooting
      if (this.deltaShoot > 1.0/this.fireRate) {
        this.deltaShoot = 0;
        if (this.shooting) bullets.addChild(
          new Bullet(bullets, this, this.x, this.y, this.direction, true)
        );
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
