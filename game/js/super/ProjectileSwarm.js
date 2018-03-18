

class ProjectileSwarm extends Container {

  constructor() {
    super();
  }

  quickAdd(texture, x, y, direction, speed) {
    this.addChild(new Projectile(this, '@proj', texture, x, y, direction, speed));
  }

  // can use removeChildren() to get rid of all

  update(dt) {
    this.children.forEach((c,i) => {
      if (c instanceof Projectile) c.update(dt);
    });
  }

}
