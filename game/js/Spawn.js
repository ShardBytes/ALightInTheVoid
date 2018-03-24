
class Spawn extends Entity {
  constructor(team) {
    if (team == '1') {
      super('spawn1', resources.blueportal.texture);
      this.x = -3000;
      this.y = 0;
    } else {
      super('spawn2', resources.blueportal.texture);
      this.x = 3000;
      this.y = 0;
    }
  }
}
