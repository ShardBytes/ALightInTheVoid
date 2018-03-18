// Tween (value animator) class by Plasmoxy
// this is just sooo amazing. it can animate any value. wow.
// i'll leave it to linear for now

// -> it uses Javascript's amazing reflection abilities to access object's property by name
// this had to be done because js is pass by value so we need references not values
// therefore, you need to pass a reference of object to which the property belongs to

class Tween {

  constructor(object, propertyname, speed) {
    this.pn = propertyname;
    this.o = object; // target object reference
    this.s = speed; // speed of change [unit per second]

    this.target = this.o[propertyname]; // target (unchanged on init)
    this.active = false;
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  update(dt) {
    if (this.active) {
      let d = this.s*(dt/60);

      // round property to target when there is minimal difference
      // this is important because the we're working with decimal numbers
      // and it could happen that we'd never reach the target precisely
      //if (this.p > this.target - d && this.p < this.target + d) this.p = this.target;

      if (this.o[this.pn] < this.target) {
        this.o[this.pn] += d;
        console.log('INCREASING!!!');
      }
      else if(this.o[this.pn] > this.target) this.o[this.pn] -= d;
    }
  }

}
