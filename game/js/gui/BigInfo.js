
class BigInfo extends Text {

  constructor() {
    super('', {
      fontFamily : 'Consolas, Arial',
      fontSize: 40,
      fill : '#1cff00',
      fontWeight: 'bold',
      align : 'center',
      dropShadow : true,
      dropShadowBlur: 4,
      dropShadowColor : '#000000',
      dropShadowDistance : 0
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
