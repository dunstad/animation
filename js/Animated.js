class Animated {

  /**
   * Makes SVG objects easier to manipulate.
   * @param {object} element 
   */
  constructor(element) {
    this.element = element;
    this.queue = [];
    this.animateQueue = false;
    this.element.vivus = new Vivus(this.element.node);
    this.scalar = 1;
    let bBox = this.element.getBBox();
    this.location = {x: bBox.x, y: bBox.y};
    this.rotation = 0;
    this.centerOffsetFromOrigin = {x: bBox.cx, y: bBox.cy};
  }

  /**
   * Signals that transformations after this should be animated.
   */
  animate() {
    this.animateQueue = true;
    return this;
  }

  /**
   * Signals that transformations after this should not be animated.
   */
  unanimate() {
    this.animateQueue = false;
    return this;
  }

  /**
   * Performs rotations waiting in the queue.
   */
  process() {
    if (this.queue.length) {
      let attributes = this.queue.shift();

      if (attributes.location) {
        this.location = attributes.location;
      }

      if (attributes.rotation) {
        this.rotation =  attributes.rotation;
      }

      if (attributes.scalar) {
        this.scalar = attributes.scalar;
      }
      
      if (attributes.animate) {
        console.log(this.getStateString())
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
   * Represents the current transformation state of this as a transformation string.
   */
  getStateString() {
    let bBox = this.element.getBBox();
    return {transform: `${this.locationToString()}${this.rotationToString()}${this.scalarToString()}`};
  }

  /**
   * Sends a transformation to the queue to be processed in order.
   * Important so that transformations which will not be animated
   * still wait on animated transformations to finish.
   * @param {object} stateChange 
   */
  sendToQueue(stateChange) {
    stateChange.animate = this.animateQueue;
    this.queue.push(stateChange);
    if (!this.element.inAnim().length) {this.process();}
    else {console.log('transformation queued');}
    return this;
  }

  /**
   * Moves this to the absolute coordinates provided.
   * @param {number} x 
   * @param {number} y 
   */
  move(x, y) {
    return this.sendToQueue({location: {x: x, y: y}});
  }

  /**
   * Rotates this to the absolute degree provided.
   * @param {number} deg 
   */
  rotate(deg) {
    return this.sendToQueue({rotation: deg});
  }

  /**
   * Scales this to the absolute ratio provided.
   * @param {number} ratio 
   */
  scale(ratio) {
    return this.sendToQueue({scalar: ratio});
  }

  /**
   * Represents the current location of this as an SVG translation string.
   */
  locationToString() {
    return `t${this.location.x},${this.location.y}`;
  }

  /**
   * Represents the current rotation of this as an SVG translation string.
   */
  rotationToString() {
    return `r${this.rotation},${this.centerOffsetFromOrigin.x},${this.centerOffsetFromOrigin.y}`;
  }

  /**
   * Represents the current scale of this as an SVG translation string.
   */
  scalarToString() {
    return `s${this.scalar}`;
  }

}