class Animated {

  /**
   * Makes SVG objects easier to manipulate.
   * @param {object} element 
   */
  constructor(element) {
    this.element = element;
    this.queue = new AnimationQueue();
    this.animateQueue = false;
    this.element.vivus = new Vivus(this.element.node);
    this.scalar = 1;
    let bBox = this.element.getBBox();
    this.location = {x: 0, y: 0};
    this.rotation = 0;
    this.centerOffsetFromOrigin = {x: bBox.cx, y: bBox.cy};
    this.spinQueue = new AnimationQueue();
    this.pulseQueue = new AnimationQueue();
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
   * @param {AnimationQueue} queue
   */
  process(queue) {
    let transformation = queue.next();
    if (transformation) {

      if ('location' in transformation) {
        this.location = transformation.location;
      }

      if ('rotation' in transformation) {
        this.rotation =  transformation.rotation;
      }

      if ('scalar' in transformation) {
        this.scalar = transformation.scalar;
      }
      
      if (transformation.animate) {
        console.log(this.getStateString())
        this.element.animate(
          this.getStateString(),
          transformation.milliseconds || 1000,
          transformation.easing || mina.linear,
          ()=>{
            if (transformation.callback) {
              transformation.callback();
            }
            queue.animationComplete();
            this.process(queue);
          },
        );
      }
      else {
        console.log(this.getStateString())
        this.element.attr(this.getStateString());
        queue.animationComplete();
      }
    }
  }

  /**
   * Represents the current transformation state of this as a transformation string.
   * The transform parameter allows the resulting string to be a transformation
   * from the current state.
   * @param {object} transformation
   */
  getStateString(transformation) {
    transformation = transformation || {};
    
    let parsedTransform = Snap.parseTransformString(this.element.transform().string) || [];

    if ('location' in transformation) {
      let location = parsedTransform.find(e=>e[0]=='t');
      if (!location) {
        location = ['t', 0, 0];
        parsedTransform.push(location);
      }
      
      location[1] = transformation.location.x;
      location[2] = transformation.location.y;
    }
    
    if ('rotation' in transformation) {
      let rotation = parsedTransform.find(e=>e[0]=='r');
      rotation[1] = transformation.rotation[1];
    }
    
    if ('scalar' in transformation) {
      let scalar = parsedTransform.find(e=>e[0]=='s');
      scalar[1] = transformation.scalar[1];
    }

    return {transform: parsedTransform ? parsedTransform.toString() : ''};
  }

  /**
   * Sends a transformation to a queue to be processed in order.
   * Important so that transformations which will not be animated
   * still wait on animated transformations to finish.
   * @param {object} stateChange 
   * @param {AnimationQueue} queue 
   */
  sendToQueue(stateChange, queue) {
    if (!stateChange.animate) {stateChange.animate = this.animateQueue;}
    queue.add(stateChange);
    if (!queue.isAnimating()) {this.process(queue);}
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
    this.queue.start();
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
    this.queue.start();
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
    this.queue.start();
    return this.sendToQueue(transformation, this.queue);
  }

  /**
   * Used to start and stop a spinning animation.
   * @param {number} degrees 
   * @param {number} milliseconds 
   */
  toggleSpin(degrees, milliseconds) {
    if (this.spinQueue.shouldContinue()) {
      this.spinQueue.stop();
    }
    else {
      this.spinQueue.start();
      let transformation = {
        rotation: this.rotation + degrees,
        animate: true,
        milliseconds: milliseconds,
      };
      transformation.callback = ()=>{
        if (this.spinQueue.shouldContinue()) {
          transformation.rotation = this.rotation + degrees;
          this.sendToQueue(transformation, this.spinQueue);
        }
      };
      this.sendToQueue(transformation, this.spinQueue);
    }
    return this;
  }

  /**
   * Used to start and stop a pulsing animation.
   * @param {number} scalar 
   * @param {number} milliseconds 
   * @param {function} easing
   */
  togglePulse(scalar, milliseconds, easing) {
    
    if (this.pulseQueue.shouldContinue()) {
      this.pulseQueue.stop();
    }
    else {
      this.pulseQueue.start();

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
        if (this.pulseQueue.shouldContinue()) {
          this.sendToQueue(scaleDown, this.pulseQueue);
        }
      };

      scaleDown.callback = ()=>{
        if (this.pulseQueue.shouldContinue()) {
          this.sendToQueue(scaleUp, this.pulseQueue);
        }
      };

      this.sendToQueue(scaleUp, this.pulseQueue);
    }
    return this;
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
    // let parsedTransform = Snap.parseTransformString(this.element.transform().string)
    // let rotation = parsedTransform ? parsedTransform.find(e=>e[0]=='r')[1] : 0;
    return `r${this.rotation},${this.centerOffsetFromOrigin.x},${this.centerOffsetFromOrigin.y}`;
  }

  /**
   * Represents the current scale of this as an SVG translation string.
   */
  scalarToString() {
    return `s${this.scalar}`;
  }

}