// Spawn by Plasmoxy
// uses looping Apparition as sprite

class Spawn extends Entity {
  constructor(team) {
    if (team == '1') {
      super('spawn1');
      this.sprite = new Apparition(this, 'blueportal_particles ', '.ase', 35, 0, 0, 10, 0.5, true, true);
      this.x = -3250;
      this.y = 800;
    } else {
      super('spawn2');
      this.sprite = new Apparition(this, 'orangeportal_rotating ', '.ase', 35, 0, 0, 10, 0.5, true, true);
      this.x = 3250;
      this.y = -800;
    }
    this.collider = new CircleCollider(this);
    this.collider.debug(COLLIDER_DEBUG);
  }
}
