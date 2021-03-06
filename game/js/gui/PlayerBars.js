// player health bar gui class by Plasmoxy

class PlayerBars extends Container {

  constructor() {
    super();

    this.gr = new PIXI.Graphics;
    this.addChild(this.gr);

    this.playerNameText = new Text(NAME, {
      fontFamily : 'Consolas, Arial',
      fontSize: 20,
      fill : 0xff0063,
      fontWeight: 'bold',
      align : 'center',
      dropShadow : true,
      dropShadowBlur: 4,
      dropShadowColor : '#000000',
      dropShadowDistance : 0
    });
    this.playerNameText.anchor.set(0.5, 0.5);
    this.playerNameText.position.y = -20;
    this.addChild(this.playerNameText);

    this.healthColor = 0xd7125f;
    this.energyColor = 0x00ffff;

    this.align();
  }

  redraw(player) {
    if (player) {
      let g = this.gr;
      let w = app.renderer.width;
      if (player.alive) {
        g.clear();
        g.beginFill(this.healthColor);
        g.drawRect( (-player.maxHealth/2)*w/300, 10, player.health*w/300, 5);
        g.endFill();
        g.beginFill(this.energyColor);
        g.drawRect( (-player.maxEnergy/2)*w/300, 25, player.energy*w/300, 5);
      } else {
        g.clear();
      }
    }
  }

  align() {
    this.position.x = app.renderer.width/2;
    this.position.y = app.renderer.height - 50;
  }

}
