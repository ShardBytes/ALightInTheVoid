/*
 * Centered camera class by Plasmoxy
 * -> This can set the container (world) rotation and pivot relative
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

  set xoffset(val) {this._xoffset = val; this.centerToRenderer(); }
  set yoffset(val) {this._yoffset = val; this.centerToRenderer(); }

  constructor(c) { // c = container to influence = world or something
    this.c = c;
    this.scale = 1 // default scale

    this._xoffset = 0;
    this._yoffset = 0;

    this.centerToRenderer();
  }

  centerToRenderer() {
    /* position the camera to center of the renderer
     * -> call this on RESIZE !!
     * -> the camera position is centered relative to stage, right my dude ? yes*/
    this.c.position.x = app.renderer.width/2  + this._xoffset;
    this.c.position.y = app.renderer.height/2 + this._yoffset;
  }

  follow(target) {
    /* set container origin to target position
     * IMPORTANT : this doesn't affect the internal container coordinate system,
     * it just changes container's origin(pivot) relative to parent.
     */
    this.c.pivot.x = target.position.x;
    this.c.pivot.y = target.position.y;

  }


  followDirection(rcont, offset) { // rcont = rotation container, offset = rotation offset [radians]
    if (!offset) offset = Math.PI; // front on directional entity = up on camera
    this.c.rotation = rcont.direction + offset;
  }

}
