
class DirectionalEntity extends DynamicEntity {

  set direction(val) { this._direction = val; this.updateVelocity(); }
  set speed(val) { this._speed = val; this.updateVelocity(); }

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

}
