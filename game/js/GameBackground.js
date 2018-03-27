/* SPECIFIC background by Plasmoxy */

class GameBackground extends Container {

  constructor() {
    super();

    /* STARS  */

    this.starsbg = new ParallaxBackground(0.5);
    this.addChild(this.starsbg);

    this.starsSprite = new TilingSprite(resources.starBg.texture, 10000, 10000);
    this.starsSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.starsSprite.scale.set(7, 7);
    this.starsSprite.anchor.set(0.5, 0.5);
    this.starsbg.addChild(this.starsSprite);

    /* BIG PLANET */

    this.bigplanetbg = new ParallaxBackground(0.53);
    this.addChild(this.bigplanetbg);

    this.bigplanetSprite = new Sprite(resources.bigplanet.texture);
    this.bigplanetSprite.anchor.set(0.5, 0.5);
    this.bigplanetSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.bigplanetSprite.scale.set(10, 10);
    this.bigplanetbg.addChild(this.bigplanetSprite);

    /* small planet */

    this.smallplanet1bg = new ParallaxBackground(0.56);
    this.addChild(this.smallplanet1bg);

    this.smallplanet1Sprite = new Sprite(resources.smallplanet1.texture);
    this.smallplanet1Sprite.anchor.set(0.5, 0.5);
    this.smallplanet1Sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.smallplanet1Sprite.scale.set(7, 7);
    this.smallplanet1Sprite.position.set(300, 300);
    this.smallplanet1bg.addChild(this.smallplanet1Sprite);

    /* behind planets */
    this.behindplanetsbg = new ParallaxBackground(0.6);
    this.addChild(this.behindplanetsbg);

    // TODO

  }

  center() {
    this.starsbg.centerTo(world);
    this.bigplanetbg.centerTo(world);
    this.smallplanet1bg.centerTo(world);
  }

}
