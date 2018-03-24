// by Plasmoxy
// this is ze Apparition class (yes, Harry Potter) :D
// it works like a simple animation object which can appear in game
// I'm ultra happy with this, just call new object, pass everything in constructor,
// don't care more, profit ...

class Apparition extends AnimatedSprite {

  constructor(container, textureChainPrefix, frameCount, x, y, scale, speed, loop) {

    let frames = [];
    for (let i = 0; i < frameCount; i++) {
      frames.push(PIXI.Texture.fromFrame(textureChainPrefix + '_' + i + '.png'));
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
