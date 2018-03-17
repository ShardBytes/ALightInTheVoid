/*
 * Centered camera class by Plasmoxy
 * -> This sets the container rotation and pivot relative
 * to camera, causing it to be moved and follow target
 */

class Camera {

  // scale as property
  set scale(sc) { this.c.scale.set(sc, sc); }
  get scale() { return this.c.scale.x; }

  // xy as property
  set x(val) {this.c.pivot.x = val;}
  set y(val) {this.c.pivot.y = val;}
  get x() {return this.c.pivot.x;}
  get y() {return this.c.pivot.y;}

  constructor(c) { // c = container to influence
    this.c = c;
    this.centerToRenderer();
    this.scale = 0.7 // default scale
  }

  centerToRenderer() {
    /* position the camera to center of the renderer
     * -> call this on RESIZE !!
     * -> the camera x and y are relative to center, right my dude ? yes*/
    this.c.position.x = app.renderer.width/2;
    this.c.position.y = app.renderer.height/2;
  }

  follow(target) {
    /* set container origin to target position
     * IMPORTANT : this doesn't affect the internal container coordinate system,
     * it just changes the origin relative to parent.
     */
    this.c.pivot.x = target.position.x;
    this.c.pivot.y = target.position.y;

  }


  followRotation(cont) {
    this.c.rotation = cont.rotation;
  }

}
