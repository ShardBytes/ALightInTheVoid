
class MiniMap extends PIXI.Graphics {

  constructor() {
    super();
    this.w = 300;
    this.h = (world.h/world.w)*this.w;
    this.DOTSIZE = 4;
    this.blendMode = PIXI.BLEND_MODES.SCREEN; // so its a bit transparent
    this.align();
  }

  drawBg() {
    this.lineStyle(0, 0, 0);
    this.beginFill(0x222222, 1);
    this.drawRect(-this.w/2, -this.h/2, this.w, this.h);
    this.endFill();
  }

  drawObjectRect(plr, color, size, noFill) {
    if (!noFill) this.lineStyle(0, 0, 0);
    else this.lineStyle(1.5, color, 1);
    if (!noFill) this.beginFill(color, 1);
    this.drawRect(
      (plr.x/world.w)*this.w - size/2,
      (plr.y/world.h)*this.h - size/2,
      size,
      size
    );
    if (!noFill) this.endFill();
  }

  drawOtherPlayers() {
    otherplayers.forEach((plr, i) => {
      if (plr.alive) this.drawObjectRect(plr, plr.team == '1' ? 0x00ffff : 0xffaa00, this.DOTSIZE);
    });
  }

  drawPlayer() {
    if (player.alive) this.drawObjectRect(player, 0xff12f6, this.DOTSIZE);
  }

  drawSafarik() {
    if (safarik) this.drawObjectRect(safarik, 0x00ff29, 7);
  }

  drawSpawn(spawn) {
    if (spawn) {
      this.drawObjectRect(spawn, spawn.id == 'spawn1' ? 0x00c9ff : 0xff6300, 30, true);
    }
  }

  redraw() {
    this.clear();
    this.drawBg();
    this.drawSpawn(spawn1);
    this.drawSpawn(spawn2);
    this.drawOtherPlayers();
    if (player) this.drawPlayer();
    this.drawSafarik();
  }

  align() {
    this.position.x = app.renderer.width - this.w/2 - 10;
    this.position.y = this.h/2 + 10;
  }

}
