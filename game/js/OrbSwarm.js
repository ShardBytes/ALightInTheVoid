// specific orb swarm by Plasmoxy

class OrbSwarm extends EntitySwarm {

  constructor() {
    super();

    this.orbs = [
      new Orb(1, 300, 100),
      new Orb(0, 500, 200),
      new Orb(0, 400, 100),
      new Orb(0, 400, 200)
    ];

    this.orbs.forEach( (a,i)=>{this.addChild(a);} );
  }

}
