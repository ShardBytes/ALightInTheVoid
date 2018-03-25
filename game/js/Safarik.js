
class Safarik extends SegmentedTargetEntity {

  constructor() {
    super('safarik', resources.safarik.texture, 0, 0);

    this.collider = new BoxCollider(this, 200, 200);
    this.scale.set(0.5, 0.5);
    this.collider.updateSize();
    this.collider.debug(true);

    this.collider.collided = (t, dx, dy, ang) => {
      //resources.nani.sound.play(); actually, don't, leave server to do it
      if (t instanceof Player) this.addTarget(t.id);
    };

    this.collider.discollided = (t, dx, dy, ang) => {
      if (t instanceof Player) this.removeTarget(t.id);
    }
  }

  update(dt) {
    super.update(dt);
    this.move(dt, INTERP_RATIO);
  }

  addTarget(id) {
    socket.emit('addSafarikTarget', id);
  }

  removeTarget(id) {
    socket.emit('removeSafarikTarget', id)
  }

}
