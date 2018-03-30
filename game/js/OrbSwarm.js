// specific orb swarm by Plasmoxy

class OrbSwarm extends EntitySwarm {

  constructor() {
    super();

    this.orbs = [
      /* SPAWNS */
      new Orb(1, spawn2.x + 500, spawn2.y - 200),
      new Orb(1, spawn2.x - 450, spawn2.y - 300),
      new Orb(1, spawn2.x - 20, spawn2.y + 500),

      new Orb(1, spawn1.x - 500, spawn1.y + 200),
      new Orb(1, spawn1.x + 450, spawn1.y + 300),
      new Orb(1, spawn1.x + 20, spawn1.y - 500),

      /* MID */
      new Orb(0, 0, -800),
      new Orb(0, 0, 800),
      new Orb(0, -800, 0),
      new Orb(0, 800, 0 ),

      /* BLUE ALTERNATIVE */
      new Orb(1, -2000, -1000),
      new Orb(0, -1800, -800),

      /* ORANGE ALTERNATIVE */
      new Orb(1, 2000, 1000),
      new Orb(0, 1800, 800)
    ]

    this.orbs.forEach( (a,i)=>{this.addChild(a);} );
  }

}
