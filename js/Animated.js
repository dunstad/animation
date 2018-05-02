class Animated {

  /**
   * Makes SVG objects easier to manipulate.
   * @param {object} element 
   */
  constructor(element) {
    this.element = element;
    this.queue = new AnimationQueue();
    this.element.vivus = new Vivus(this.element.node);
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

    if (transformation.location != undefined) {
      let location = parsedTransform.find(e=>e[0]=='t');
      if (!location) {
        location = ['t', 0, 0];
        parsedTransform.push(location);
      }
      
      location[1] = transformation.location.x != undefined ? transformation.location.x : location[1];
      location[2] = transformation.location.y != undefined ? transformation.location.y : location[2];
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
    if (this.queue.shouldContinue()) {
      this.queue.stop();
    }
    else {
      this.queue.start();
      let transformation = new Transformation({
        rotation: this.rotation + degrees,
        animate: true,
        milliseconds: milliseconds,
        callback: ()=>{
          if (this.queue.shouldContinue()) {
            transformation.rotation = this.rotation + degrees;
            this.sendToQueue(transformation, this.queue);
          }
        },
      });
      this.sendToQueue(transformation, this.queue);
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
    
    if (this.queue.shouldContinue()) {
      this.queue.stop();
    }
    else {
      this.queue.start();

      let scaleUp = new Transformation({
        scalar: scalar,
        animate: true,
        milliseconds: milliseconds,
        easing: easing,
        callback: ()=>{
          if (this.queue.shouldContinue()) {
            this.sendToQueue(scaleDown, this.queue);
          }
        },
      });

      let scaleDown = new Transformation({
        scalar: this.scalar,
        animate: true,
        milliseconds: milliseconds,
        easing: easing,
        callback: ()=>{
          if (this.queue.shouldContinue()) {
            this.sendToQueue(scaleUp, this.queue);
          }
        },
      });

      this.sendToQueue(scaleUp, this.queue);
    }
    return this;
  }

  get rotation() {
    return Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="r")[1];
  }
  
  get scalar() {
    return Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="s")[1];
  }
  
  get location() {
    let locationInfo = Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="t");
    return {x: locationInfo[1], y: locationInfo[2]};
  }

  /**
   * Used to combine a new animation with one already in progress.
   * @param {Transformation} newTransformation 
   */
  mergeAnimation(newTransformation) {

    let currentAnimation = Object.values(this.element.anims)[0];
    let xNotAnimating = currentAnimation.start[0] == currentAnimation.end[0];
    let yNotAnimating = currentAnimation.start[1] == currentAnimation.end[1];
    let rotationNotAnimating = currentAnimation.start[2] == currentAnimation.end[2];
    let scalarNotAnimating = currentAnimation.start[3] == currentAnimation.end[3];

    let animationsCompatible = true;

    if (newTransformation.location != undefined && 
        (newTransformation.location.x != undefined && !xNotAnimating ||
        newTransformation.location.y != undefined && !yNotAnimating) ||
        newTransformation.rotation != undefined && !rotationNotAnimating ||
        newTransformation.scalar != undefined && !scalarNotAnimating) {
      animationsCompatible = false;
    }

    if (animationsCompatible) {

      currentAnimation.pause();

      let locationIsAnimating = currentAnimation.start[0] != currentAnimation.end[0] ||
                                currentAnimation.start[1] != currentAnimation.end[1];
      let rotationIsAnimating = currentAnimation.start[2] != currentAnimation.end[2];
      let scalarIsAnimating = currentAnimation.start[3] != currentAnimation.end[3];

      console.log(locationIsAnimating, rotationIsAnimating, scalarIsAnimating)

      let currentTransformation = new Transformation({
        location: locationIsAnimating ? {x: currentAnimation.end[0], y: currentAnimation.end[1]} : undefined,
        rotation: rotationIsAnimating ? currentAnimation.end[2] : undefined,
        scalar: scalarIsAnimating ? currentAnimation.end[3] : undefined,
        milliseconds: (1 - currentAnimation.status()) * currentAnimation.duration(),
        animate: true,
      });

      let [shortTransformation, longTransformation] = [currentTransformation, newTransformation].sort((a, b)=>{
        return a.milliseconds - b.milliseconds;
      });


      // queue new animations
      let firstTransformation = new Transformation({
        milliseconds: shortTransformation.milliseconds,
        animate: true,
      });
      let secondTransformation = new Transformation({
        milliseconds: longTransformation.milliseconds - shortTransformation.milliseconds,
        animate: true,
      });

      let durationRatio = shortTransformation.milliseconds / longTransformation.milliseconds;

      let splitNumberValue = (property) => {
        return ((longTransformation[property] - this[property]) * durationRatio) + this[property];
      };

      let splitObjectValue = (property) => {
        return {
          x: ((longTransformation[property].x - this[property].x) * durationRatio) + this[property].x,
          y: ((longTransformation[property].y - this[property].y) * durationRatio) + this[property].y,
        };
      };
      
      for (let [property, splitFunction] of Object.entries({
        location: splitObjectValue,
        rotation: splitNumberValue,
        scalar: splitNumberValue,
      })) {
        
        if (longTransformation[property] != undefined) {
          
          firstTransformation[property] = splitFunction(property);
          secondTransformation[property] = longTransformation[property];

        }

        else if (shortTransformation[property] != undefined) {

          firstTransformation[property] = shortTransformation[property];

        }

      }

      console.log(firstTransformation, secondTransformation)

      this.sendToQueue(firstTransformation, this.queue);
      this.sendToQueue(secondTransformation, this.queue);

      // make sure the queue continues to process the newly queued animations
      currentAnimation._callback();
      currentAnimation.stop();

    }
    else {
      throw new Error('incompatible animations');
    }

  }

}