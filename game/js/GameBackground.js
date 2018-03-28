/* SPECIFIC background by Plasmoxy */

class GameBackground extends Container {

  constructor() {
    super();

    this.SmallPlanet2 = class extends Sprite {
      constructor(x, y) {
        super(resources.smallplanet2.texture);
        this.anchor.set(0.5, 0.5);
        this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.scale.set(3, 3);
        this.position.set(x, y);
      }
    };

    this.SmallPlanet1 = class extends Sprite {
      constructor(x, y) {
        super(resources.smallplanet1.texture);
        this.anchor.set(0.5, 0.5);
        this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.scale.set(3, 3);
        this.position.set(x, y);
      }
    };

    /* STARS 1  */

    this.starsbg = new ParallaxBackground(0.05);
    this.addChild(this.starsbg);

    this.starsSprite = new TilingSprite(resources.starBg.texture, 10000, 10000);
    this.starsSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.starsSprite.scale.set(3, 3);
    this.starsSprite.anchor.set(0.5, 0.5);
    this.starsbg.addChild(this.starsSprite);

    /* STARS 2  */

    this.starsbgBeta = new ParallaxBackground(0.1);
    this.addChild(this.starsbgBeta);

    this.starsSpriteBeta = new TilingSprite(resources.starBg.texture, 10000, 10000);
    this.starsSpriteBeta.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.starsSpriteBeta.scale.set(6, 6);
    this.starsSpriteBeta.anchor.set(0.5, 0.5);
    this.starsbgBeta.addChild(this.starsSpriteBeta);

    /* behind planets */
    this.behindplanetsbg = new ParallaxBackground(0.3);
    this.addChild(this.behindplanetsbg);

    this.midsm2 = new this.SmallPlanet2(-300, -100);
    this.behindplanetsbg.addChild(this.midsm2);

    this.spawnsm2 = new this.SmallPlanet1(-500, 300);
    this.behindplanetsbg.addChild(this.spawnsm2);

    this.spawn2sm2 = new this.SmallPlanet2(800, -100);
    this.behindplanetsbg.addChild(this.spawn2sm2);

    /* BIG PLANET */

    this.bigplanetbg = new ParallaxBackground(0.40);
    this.addChild(this.bigplanetbg);

    this.bigplanetSprite = new Sprite(resources.bigplanet.texture);
    this.bigplanetSprite.anchor.set(0.5, 0.5);
    this.bigplanetSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.bigplanetSprite.scale.set(10, 10);
    this.bigplanetbg.addChild(this.bigplanetSprite);

    /* small planet */

    this.smallplanet1bg = new ParallaxBackground(0.5);
    this.addChild(this.smallplanet1bg);

    this.smallplanet1Sprite = new Sprite(resources.smallplanet1.texture);
    this.smallplanet1Sprite.anchor.set(0.5, 0.5);
    this.smallplanet1Sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.smallplanet1Sprite.scale.set(7, 7);
    this.smallplanet1Sprite.position.set(300, 300);
    this.smallplanet1bg.addChild(this.smallplanet1Sprite);

  }

  center() {
    this.starsbg.centerTo(world);
    this.starsbgBeta.centerTo(world);
    this.bigplanetbg.centerTo(world);
    this.smallplanet1bg.centerTo(world);
    this.behindplanetsbg.centerTo(world);
  }

  rendCenter() {
    this.starsbg.rendCenter();
    this.starsbgBeta.rendCenter();
    this.bigplanetbg.rendCenter();
    this.smallplanet1bg.rendCenter();
    this.behindplanetsbg.rendCenter();
  }

}
