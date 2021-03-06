// by Plasmoxy
// this is ze Apparition class (yes, Harry Potter) :D
// it works like a simple animation object which can appear in game
// I'm ultra happy with this, just call new object, pass everything in constructor,
// don't care more, profit ...

// if you set pixelMode, you wont get blurred images on scaling, but they will be pixelated (useful for pixel art)

class Apparition extends AnimatedSprite {

  constructor(container, prefix, suffix, frameCount, x, y, scale, speed, loop, pixelMode) {

    let frames = [];
    for (let i = 0; i < frameCount; i++) {
      let texture = PIXI.Texture.fromFrame('' + prefix + i + suffix);
      if (pixelMode) texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      frames.push(texture);
    }

    super(frames);

    this.x = x;
    this.y = y;
    this.superContainer = container;
    this.anchor.set(0.5, 0.5);
    this.animationSpeed = speed;
    this.scale.set(scale, scale);
    this.loop = loop;

    this.onComplete = () => {
      this.destroy();
    }

    container.addChild(this);
    this.play();
  }

  destroy() {
    this.stop();
    if(this.superContainer.children.includes(this)) this.superContainer.removeChild(this);
  }

}
