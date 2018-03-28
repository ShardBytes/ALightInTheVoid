// specific orb swarm by Plasmoxy

class OrbSwarm extends EntitySwarm {

  constructor() {
    super();

    this.orbs = [
      new Orb(1, 300, 100),
      new Orb(1, 500, 200)
    ];

    this.orbs.forEach( (a,i)=>{this.addChild(a);} );
  }

  addPlayerDetection(plr) {
    this.orbs.forEach( (a,i)=>{a.collider.addToDetectionPool(plr);} );
  }

  removePlayerDetection(plr) {
    this.orbs.forEach( (a,i)=>{a.collider.removeFromDetectionPool(plr);} );
  }

}
