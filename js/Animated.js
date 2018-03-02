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
    this.spinQueue = [];
    this.pulse = false;
    this.pulseQueue = [];
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
   * @param {object[]} queue
   */
  process(queue) {
    if (queue.length) {
      let attributes = queue.shift();

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
        this.element.animate(
          this.getStateString(),
          attributes.milliseconds || 1000,
          attributes.easing || mina.linear,
          ()=>{
            if (attributes.callback) {
              attributes.callback();
            }
            this.process(queue);
          },
        );
      }
      else {
        console.log(this.getStateString())
        this.element.attr(this.getStateString());
      }
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
   * @param {object[]} queue 
   */
  sendToQueue(stateChange, queue) {
    if (!stateChange.animate) {stateChange.animate = this.animateQueue;}
    queue.push(stateChange);
    if (!this.element.inAnim().length) {this.process(queue);}
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
    return this.sendToQueue(transformation, this.queue);
  }

  /**
   * Rotates this to the absolute degree provided.
   * @param {number} degrees 
   * @param {number} milliseconds
   */
  rotate(degrees, milliseconds) {
    let transformation = {rotation: degrees};
    transformation.milliseconds = milliseconds;
    return this.sendToQueue(transformation, this.queue);
  }

  /**
   * Scales this to the absolute ratio provided.
   * @param {number} ratio 
   * @param {number} milliseconds
   */
  scale(ratio, milliseconds) {
    let transformation = {scalar: ratio};
    transformation.milliseconds = milliseconds;
    return this.sendToQueue(transformation, this.queue);
  }

  /**
   * Used to start and stop a spinning animation.
   * @param {number} degrees 
   * @param {number} milliseconds 
   */
  toggleSpin(degrees, milliseconds) {
    if (this.spin) {
      this.spin = false;
    }
    else {
      this.spin = true;
      let transformation = {
        rotation: this.rotation + degrees,
        animate: true,
        milliseconds: milliseconds,
      };
      transformation.callback = ()=>{
        if (this.spin) {
          transformation.rotation = this.rotation + degrees;
          this.sendToQueue(transformation, this.spinQueue);
        }
      };
      return this.sendToQueue(transformation, this.spinQueue);
    }
  }

  /**
   * Used to start and stop a pulsing animation.
   * @param {number} scalar 
   * @param {number} milliseconds 
   * @param {function} easing
   */
  togglePulse(scalar, milliseconds, easing) {
    
    if (this.pulse) {
      this.pulse = false;
    }
    else {
      this.pulse = true;

      let scaleUp = {
        scalar: scalar,
        animate: true,
        milliseconds: milliseconds,
        easing: easing,
      };

      let scaleDown = {
        scalar: this.scalar,
        animate: true,
        milliseconds: milliseconds,
        easing: easing,
      };

      scaleUp.callback = ()=>{
        if (this.pulse) {
          this.sendToQueue(scaleDown, this.pulseQueue);
        }
      };

      scaleDown.callback = ()=>{
        if (this.pulse) {
          this.sendToQueue(scaleUp, this.pulseQueue);
        }
      };

      return this.sendToQueue(scaleUp, this.pulseQueue);
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