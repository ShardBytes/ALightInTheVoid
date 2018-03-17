
class DirectionalEntity extends DynamicEntity {

  constructor(id, sprite_texture) {
    super(id, sprite_texture);

    this.direction = 0; // radians
    this.speed = 0; // points per second

    this.tDirection = 0; // target direction
    this.tSpeed = 0; // target speed
  }

  update(dt) {
    super.update(dt);
  }

  updateVelocity() {
    
  }

  animateMovement(dt) {

  }


}
