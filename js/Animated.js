class Animated {

  /**
   * Makes SVG objects easier to manipulate.
   * @param {object} element 
   */
  constructor(element) {
    this.element = element;
    this.queue = new AnimationQueue();
    this.element.vivus = new Vivus(this.element.node);
    this.spinQueue = new AnimationQueue();
    this.pulseQueue = new AnimationQueue();
  }

  /**
   * Signals that transformations after this should be animated.
   */
  animate() {
    this.queue.start();
    return this;
  }
  
  /**
   * Signals that transformations after this should not be animated.
   */
  unanimate() {
    this.queue.stop();
    return this;
  }

  /**
   * Performs transformations waiting in the queue.
   * @param {AnimationQueue} queue
   */
  process(queue) {
    let transformation = queue.next();
    if (transformation) {
      
      if (transformation.animate) {
        console.log(this.getStateString(transformation))
        this.element.animate(
          this.getStateString(transformation),
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
        console.log(this.getStateString(transformation))
        this.element.attr(this.getStateString(transformation));
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
    transformation = transformation || new Transformation();
    
    let parsedTransform = Snap.parseTransformString(this.element.transform().string || 't0,0r0s1');

    if (transformation.location !== undefined) {
      let location = parsedTransform.find(e=>e[0]=='t');
      if (!location) {
        location = ['t', 0, 0];
        parsedTransform.push(location);
      }
      
      location[1] = transformation.location.x;
      location[2] = transformation.location.y;
    }
    
    if (transformation.rotation !== undefined) {
      let rotation = parsedTransform.find(e=>e[0]=='r');
      if (!rotation) {
        rotation = ['r', 0];
        parsedTransform.push(rotation);
      }
      rotation[1] = transformation.rotation;
    }
    
    if (transformation.scalar !== undefined) {
      let scalar = parsedTransform.find(e=>e[0]=='s');
      if (!scalar) {
        scalar = ['s', 1];
        parsedTransform.push(scalar);
      }
      scalar[1] = transformation.scalar;
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
    if (!stateChange.animate) {stateChange.animate = queue.shouldContinue();}
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
    let transformation = new Transformation({
      location: {x: x, y: y},
      milliseconds: milliseconds,
    });
    return this.sendToQueue(transformation, this.queue);
  }

  /**
   * Rotates this to the absolute degree provided.
   * @param {number} degrees 
   * @param {number} milliseconds
   */
  rotate(degrees, milliseconds) {
    let transformation = new Transformation({
      rotation: degrees,
      milliseconds: milliseconds,
    });
    return this.sendToQueue(transformation, this.queue);
  }

  /**
   * Scales this to the absolute ratio provided.
   * @param {number} ratio 
   * @param {number} milliseconds
   */
  scale(ratio, milliseconds) {
    let transformation = new Transformation({
      scalar: ratio,
      milliseconds: milliseconds,
    });
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
      let transformation = new Transformation({
        rotation: this.getRotation() + degrees,
        animate: true,
        milliseconds: milliseconds,
        callback: ()=>{
          if (this.spinQueue.shouldContinue()) {
            transformation.rotation = this.getRotation() + degrees;
            this.sendToQueue(transformation, this.spinQueue);
          }
        },
      });
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

      let scaleUp = new Transformation({
        scalar: scalar,
        animate: true,
        milliseconds: milliseconds,
        easing: easing,
        callback: ()=>{
          if (this.pulseQueue.shouldContinue()) {
            this.sendToQueue(scaleDown, this.pulseQueue);
          }
        },
      });

      let scaleDown = new Transformation({
        scalar: this.getScalar(),
        animate: true,
        milliseconds: milliseconds,
        easing: easing,
        callback: ()=>{
          if (this.pulseQueue.shouldContinue()) {
            this.sendToQueue(scaleUp, this.pulseQueue);
          }
        },
      });

      this.sendToQueue(scaleUp, this.pulseQueue);
    }
    return this;
  }

  getRotation() {
    return Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="r")[1];
  }
  
  getScalar() {
    return Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="s")[1];
  }
  
  getLocation() {
    let locationInfo = Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="t");
    return {x: locationInfo[1], y: locationInfo[2]};
  }

  mergeAnimation(newTransformation) {

    let currentAnimation = Objects.values(this.element.anims)[0];
    let locationNotAnimating = currentAnimation.start[0] == currentAnimation.end[0] &&
                               currentAnimation.start[1] == currentAnimation.end[1];
    let rotationNotAnimating = currentAnimation.start[2] == currentAnimation.end[2];
    let scalarNotAnimating = currentAnimation.start[3] == currentAnimation.end[3];

    let animationsCompatible = true;

    if ('location' in newTransformation && !locationNotAnimating ||
        'rotation' in newTransformation && !rotationNotAnimating ||
        'scalar' in newTransformation && !scalarNotAnimating) {
      animationsCompatible = false;
    }

    if (animationsCompatible) {

      currentAnimation.pause();

      let currentTransformation = new Transformation({
        location: {x: currentAnimation.end[0], y: currentAnimation.end[1]},
        rotation: currentAnimation.end[2],
        scalar: currentAnimation.end[3],
        milliseconds: (1 - currentAnimation.status()) * currentAnimation.duration(),
        animate: true,
      });

      let shortTransformation, longTransformation = [currentTransformation, newTransformation].sort((a, b)=>{
        return a.milliseconds - b.milliseconds;
      });

      // queue new animations
      // callback
      // stop

    }
    else {
      throw new Error('incompatible animations');
    }

  }

}