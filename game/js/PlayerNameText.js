
// Player name text by Plasmoxy
// to be placed in world

class PlayerNameText extends Text {

  constructor(player) {
    super(player.id, {
      fontFamily : 'Consolas, Arial',
      fontSize: 25,
      fill : 0xffffff,
      align : 'center'
    });
    this.player = player;
    this.anchor.set(0.5, 0.5);
  }

  update() {
    this.position.x = this.player.x;
    this.position.y = this.player.y - 40;
  }

}
