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
    if (e.collider)
      this.children.forEach( (a,i)=>{if (a.collider) a.collider.addToDetectionPool(e);} );
  }

  removeEntityDetection(e) {
    if (e.collider)
      this.children.forEach( (a,i)=>{if( a.collider) a.collider.removeFromDetectionPool(e);} );
  }

}
