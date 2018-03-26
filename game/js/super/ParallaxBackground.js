// parallax background by Plasmoxy

class ParallaxBackground extends Container {

  constructor(parallax) {
    super();
    this.parallax = parallax ? parallax : 1;

    this.defaultScale = 1;
    this.scale.set(this.defaultScale, this.defaultScale);

    this.rendCenter();
  }

  centerTo(c) {
    /* this centers the background pivot to the container */
    this.pivot.x = this.parallax * c.pivot.x;
    this.pivot.y = this.parallax * c.pivot.y;
  }

  rendCenter() {
    /* this puts the background in the center of screen */
    // should be updated on resize
    this.position.x = app.renderer.width/2;
    this.position.y = app.renderer.height/2;
  }

  rotateTo(c) {
    /* rotate with world */
    this.rotation = c.rotation;
  }

}
