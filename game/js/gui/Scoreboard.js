
class Scoreboard extends Container {

  constructor() {

    super();

    this.CText = class extends Text {
      constructor(text, color, align) {
        super(text, {
          fontFamily : 'Consolas, Arial',
          fontSize: 40,
          fill : color,
          align : align,
          dropShadow : true,
          dropShadowBlur: 4,
          dropShadowColor : '#000000',
          dropShadowDistance : 0
        });
      }
    }

    this.colon = new this.CText(':', '#ffffff', 'center');
    this.addChild(this.colon);

    this.team1Points = new this.CText('0', '#00e0ff', 'left');
    this.team1Points.position.x -= this.colon.width + 10;
    this.addChild(this.team1Points);

    this.team2Points = new this.CText('0', '#ffa100', 'right');
    this.team2Points.position.x += this.colon.width + 10;
    this.addChild(this.team2Points);

    this.align();

  }

  align() {
    this.position.x = app.renderer.width/2;

  }

}
