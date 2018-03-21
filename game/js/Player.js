
// uses -> bullets

class Player extends DirectionalEntity {

  constructor(container, controls, id, spawnX, spawnY, team) {
    super(id, resources.rk.texture);
    this.superContainer = container;
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.team = team;
    this.cont = controls;

    this.alive = true;

    // this updates speed to target speed constantly
    this.speedtw = new Tween(this, 'speed', 300); // rate = acceleration
    this.speedtw.start();

    this.maxSpeed = 500; // points per sec
    this.rotationSpeed = 1.8; // rads per sec

    // define event controls
    this.controlsActive = true;
    this.cont.up.pressed = () => { if(this.controlsActive) this.speedtw.target = this.maxSpeed; };
    this.cont.down.pressed = () => { if(this.controlsActive) this.speedtw.target = -this.maxSpeed/2; };
    this.cont.shoot.pressed = () => { this.shooting = true; this.emitShooting(); }
    this.cont.shoot.released = () => { this.shooting = false; this.emitShooting(); }

    this.collider = new BoxCollider(this);
    this.scale.set(0.5, 0.5);
    this.collider.updateSize();
    this.sprite.rotation = PI;
    this.collider.debug(false);
    this.collider.addToDetectionPool(safarik);

    // collision handler
    this.collider.collided = (t, dx, dy, ang) => {
      if (t == safarik) {
        this.despawn();
        setTimeout(() => { // always use lambdas my friend, they keep the identity of object
          this.spawn();
        }, 2000);
      }
    };

    this.shooting = false;
    this.deltaShoot = 0; // in seconds
    this.fireRate = 10; // 3 per second
  }

  // by spawning the player, I mean reseting all of its states, placing it on spawn pos and adding it to the world
  // and also broadcasting the event to server so the others will know ;)
  spawn() {
    this.emitSpawned();
    // reset player stuff on spawn
    console.log('<Player> PLAYER SPAWNED');
    this.direction = 0;
    this.speed = 0;
    this.x = this.spawnX;
    this.y = this.spawnY;
    // add player child to supercont
    if (!this.superContainer.children.includes(this)) this.superContainer.addChild(this);
    this.alive = true;
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
      super.update(dt);
      if (this.controlsActive) this.control(dt);
      this.speedtw.update(dt);
      this.move(dt);
      this.rotateToDirection();

      // shoot if shooting
      if (this.deltaShoot > 1.0/this.fireRate) {
        this.deltaShoot = 0;
        if (this.shooting) bullets.addChild(
          new Bullet(bullets, this, this.x, this.y, this.direction, false)
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
