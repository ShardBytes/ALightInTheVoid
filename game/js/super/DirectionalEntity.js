
class DirectionalEntity extends DynamicEntity {

  set direction(val) { this._direction = (val+2*Math.PI)%(2*Math.PI); this.updateVelocity(); }
  set speed(val) { this._speed = val; this.updateVelocity(); }

  get direction() { return this._direction; }
  get speed() { return this._speed; }

  constructor(id, sprite_texture) {
    super(id, sprite_texture);

    this._direction = 0; // radians
    this._speed = 0; // points per second
  }

  update(dt) {
    super.update(dt);
  }

  updateVelocity() {
    this.v.x = this._speed * Math.sin(this._direction);
    this.v.y = this._speed * Math.cos(this._direction);
  }

  rotateToDirection() {
    this.rotation = -this.direction;
  }

}
