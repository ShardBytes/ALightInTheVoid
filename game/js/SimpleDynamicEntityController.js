/* Simple entity debug controller by Plasmoxy */

class SimpleDynamicEntityController {

  constructor(mkeys, targetentity, movespeed) {
    let k = mkeys, t = targetentity, ms = targetentity.speed;

    k.up.pressed = () => { t.v.y -= ms; };
    k.up.released = () => { t.v.y = 0; };

    k.down.pressed = () => { t.v.y += ms; };
    k.down.released = () => { t.v.y = 0; };

    k.left.pressed = () => { t.v.x -= ms; };
    k.left.released = () => { t.v.x = 0; };

    k.right.pressed = () => { t.v.x += ms; };
    k.right.released = () => { t.v.x = 0; };

  }
}
