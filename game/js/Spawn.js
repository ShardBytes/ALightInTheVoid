
class Spawn extends Entity {
  constructor(team) {
    if (team == '1') {
      super('spawn1');
      this.sprite = new Apparition(this, 'blueportal_particles ', '.ase', 35, 0, 0, 10, 1, true, true);
      this.x = -3000;
      this.y = 0;
    } else {
      super('spawn2');
      this.sprite = new Apparition(this, 'orangeportal ', '.ase', 35, 0, 0, 10, 1, true, true);
      this.x = 3000;
      this.y = 0;
    }
  }
}
