
// uses -> bullets

class Player extends DirectionalEntity {

  constructor(container, controls, id, x, y, team) {
    super(id, resources.rk.texture);
    this.superContainer = container;
    this.x = x;
    this.y = y;
    this.team = team;
    this.cont = controls;

    this.alive = true;

    // this updates speed to target speed constantly
    this.speedtw = new Tween(this, 'speed', 500); // rate = acceleration
    this.speedtw.start();

    this.maxSpeed = 300; // points per sec
    this.rotationSpeed = Math.PI; // rads per sec

    // define controls ( they control the speed tween )
    this.controlsActive = true;
    this.cont.up.pressed = () => { if(this.controlsActive) this.speedtw.target = this.maxSpeed; };
    this.cont.down.pressed = () => { if(this.controlsActive) this.speedtw.target = -this.maxSpeed/2; };

    this.collider = new BoxCollider(this);
    this.position.set(0, -300);
    this.scale.set(0.5, 0.5);
    this.collider.updateSize();
    this.sprite.rotation = PI;
    this.collider.debug(false);

    this.deltaShoot = 0; // in seconds
    this.fireRate = 10; // 3 per second
  }

  spawn() {
    if (!this.superContainer.children.includes(this)) this.superContainer.addChild(this);
    this.alive = true;
  }

  despawn() {
    this.alive = false;
    // at the end, remove child
    // (but not dereference if we have one spare reference from outside)
    // (you should have that.)
    if (this.superContainer.children.includes(this)) this.superContainer.removeChild(this);
  }

  control(dt) {
    if (this.deltaShoot > 1.0/this.fireRate) {
      this.deltaShoot = 0;
      if (this.cont.shoot.down) bullets.addChild(
        new Bullet(bullets, this.x, this.y, this.direction, 10)
      );
    }
    this.deltaShoot += (dt/60);

    let dr = this.rotationSpeed*(dt/60); // rotation difference
    // if up and down are down, set target speed to 0
    if (!this.cont.up.down && !this.cont.down.down) this.speedtw.target = 0;

    // move sideways ( change direction )
    if (this.cont.left.down) this.direction += dr;
    if (this.cont.right.down) this.direction -= dr;

  }

  update(dt) {
    if (this.alive) {
      super.update(dt);
      if (this.controlsActive) this.control(dt);
      this.speedtw.update(dt);
      this.move(dt);
      this.rotateToDirection();
    }
  }

}
