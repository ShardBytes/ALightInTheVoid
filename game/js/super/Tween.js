// Tween (value animator) class by Plasmoxy
// this is just sooo amazing. it can animate any value. wow.
// i'll leave it to linear for now

// -> it uses Javascript's amazing reflection abilities to access object's property by name using array notation
// this had to be done because js is pass by value so we need references not values
// therefore, you need to pass a reference of object to which the property belongs to

class Tween {

  constructor(object, propertyname, changeRate, stopOnFinish) {
    this.pn = propertyname;
    this.o = object; // target object reference
    this.rate = changeRate; // rate of change [unit per second]

    // ! OPTIONAL parameter in constructor
    // this means that the tween will stop injecting values after reaching target
    // ( it will stop caring about the value )
    this.stopOnFinish = stopOnFinish;

    this.target = this.o[propertyname]; // target (unchanged on init)
    this.defaultValue = this.target; // save default value for this tween

    this.active = false; // off by default
  }

  start() { // start injecting value
    this.active = true;
  }

  stop() { // stop injecting value
    this.active = false;
  }

  // resets the property value too if you pass true to it
  reset(valueToo) {
    this.target = this.defaultValue;
    if(valueToo) this.o[this.pn] = this.defaultValue;
  }

  update(dt) {
    if (this.active) {
      let d = this.rate*(dt/60);

      // round property to target when there is minimal difference
      // this is important because the we're working with decimal numbers
      // and it could happen that we'd never reach the target precisely
      // ALSO : stop tween when on target if stopOnFinish
      if (this.o[this.pn] > this.target - d && this.o[this.pn] < this.target + d) {
        this.o[this.pn] = this.target;
        if (this.stopOnFinish) this.stop();
      }

      if (this.o[this.pn] < this.target) this.o[this.pn] += d;
      else if(this.o[this.pn] > this.target) this.o[this.pn] -= d;
    }
  }

}
