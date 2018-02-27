class Animated {

  /**
   * 
   * @param {*} element 
   */
  constructor(element) {
    this.element = element;
    this.queue = [];
    this.animateQueue = false;
    this.element.vivus = new Vivus(this.element.node);
    this.scalar = 1;
    this.rotation = 0;
    let bBox = this.element.getBBox();
    this.location = {x: bBox.x, y: bBox.y};
  }

  /**
   * 
   */
  animate() {
    this.animateQueue = true;
    return this;
  }

  /**
   * 
   */
  process() {
    if (this.queue.length) {
      let attributes = this.queue.shift();
      // change this.rotation etc based on attributes property

      if (attributes.location) {
        this.location = attributes.location;
      }
      if (attributes.rotation) {
        this.rotation =  attributes.rotation;
      }
      if (attributes.scalar) {
        this.scalar = attributes.scalar;
      }
      
      if (this.animateQueue) {
        this.element.animate(this.getStateString(), 1000, ()=>{
          this.process();
        });
      }
      else {
        console.log(this.getStateString())
        this.element.attr(this.getStateString());
      }
    }
    else {
      this.animateQueue = false;
    }
  }

  /**
   * 
   */
  getStateString() {
    let bBox = this.element.getBBox();
    return {transform: `${this.locationToString()}${this.rotationToString()}${this.scalarToString()}`};
  }

  /**
   * 
   * @param {*} stateChange 
   */
  sendToQueue(stateChange) {
    let attributes = Object.assign({
      transform: `${this.location}${this.rotation}${this.scalar}`
    }, stateChange);
    this.queue.push(attributes);
    if (!this.element.inAnim().length) {this.process();}
    else {console.log('!');}
    return this;
  }

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   */
  move(x, y) {
    return this.sendToQueue({location: {x: x, y: y}});
  }

  /**
   * 
   */
  locationToString() {
    return `t${this.location.x},${this.location.y}`;
  }

  /**
   * 
   * @param {*} deg 
   */
  rotate(deg) {
    return this.sendToQueue({rotation: deg});
  }

  /**
   * 
   */
  rotationToString() {
    return `r${this.rotation}`;
  }

  /**
   * 
   * @param {*} ratio 
   */
  scale(ratio) {
    return this.sendToQueue({scalar: ratio});
  }

  /**
   * 
   */
  scalarToString() {
    return `s${this.scalar}`;
  }

}