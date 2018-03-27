
class BigInfo extends Text {

  constructor() {
    super('', {
      fontFamily : 'Consolas, Arial',
      fontSize: 30,
      fill : 0x1fee46,
      fontWeight: 'bold',
      align : 'center'
    });
    this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.anchor.set(0.5, 0.5);
    this.align();
  }

  align() {
    this.position.x = app.renderer.width*0.5;
    this.position.y = app.renderer.height*0.7;
  }

}
