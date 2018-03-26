
class BigInfo extends Text {

  constructor() {
    super('', {
      fontFamily : 'Consolas, Arial',
      fontSize: 40,
      fill : 0xff004c,
      fontWeight: 'bold',
      align : 'center'
    });
    this.anchor.set(0.5, 0.5);
    this.align();
  }

  align() {
    this.position.x = app.renderer.width/2;
    this.position.y = app.renderer.height/2;
  }

}
