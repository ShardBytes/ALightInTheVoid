// EntitySwarm class by Plasmoxy
// it'just a container with update chain

class EntitySwarm extends Container {

  constructor() {
    super();
  }

  // + can use removeChildren() to get rid of all

  update(dt) {
    this.children.forEach((c,i) => {
      if (c instanceof Entity) c.update(dt);
    });
  }

}
