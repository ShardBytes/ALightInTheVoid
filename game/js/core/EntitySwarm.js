// EntitySwarm class by Plasmoxy
// it'just a container with update chain for every entity in it

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

  addEntityDetection(e) {
    this.orbs.forEach( (a,i)=>{a.collider.addToDetectionPool(e);} );
  }

  removeEntityDetection(e) {
    this.orbs.forEach( (a,i)=>{a.collider.removeFromDetectionPool(e);} );
  }

}
