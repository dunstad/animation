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
    this.location = {x: 0, y: 0};
    this.rotation = 0;
    this.centerOffsetFromOrigin = {x: bBox.cx, y: bBox.cy};
    this.spin = false;
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
   * Performs transformations waiting in the queue.
   */
  process() {
    if (this.queue.length) {
      let attributes = this.queue.shift();

      if ('location' in attributes) {
        this.location = attributes.location;
      }

      if ('rotation' in attributes) {
        this.rotation =  attributes.rotation;
      }

      if ('scalar' in attributes) {
        this.scalar = attributes.scalar;
      }
      
      if (attributes.animate) {
        console.log(this.getStateString())
        this.element.animate(this.getStateString(), attributes.milliseconds || 1000, ()=>{
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
   * @param {number} milliseconds
   */
  move(x, y, milliseconds) {
    let transformation = {location: {x: x, y: y}};
    transformation.milliseconds = milliseconds;
    return this.sendToQueue(transformation);
  }

  /**
   * Rotates this to the absolute degree provided.
   * @param {number} degrees 
   * @param {number} milliseconds
   */
  rotate(degrees, milliseconds) {
    let transformation = {rotation: degrees};
    transformation.milliseconds = milliseconds;
    return this.sendToQueue(transformation);
  }

  /**
   * Scales this to the absolute ratio provided.
   * @param {number} ratio 
   * @param {number} milliseconds
   */
  scale(ratio, milliseconds) {
    let transformation = {scalar: ratio};
    transformation.milliseconds = milliseconds;
    return this.sendToQueue(transformation);
  }

  /**
   * Used to start and stop a spinning animation.
   * This should really be done using the animation callback and not setInterval
   * @param {number} degrees 
   * @param {number} milliseconds 
   */
  toggleSpin(degrees, milliseconds) {
    if (this.spin) {
      clearInterval(this.spin);
    }
    else {
      this.spin = setInterval(()=>{this.animate().rotate(this.rotation + degrees, milliseconds).unanimate()}, milliseconds);
    }
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