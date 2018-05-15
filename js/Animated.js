class Animated {

  /**
   * Makes SVG objects easier to manipulate.
   * @param {object} element 
   */
  constructor(element) {
    this.element = element;
    this.animationQueue = new AnimationQueue();
    this.element.vivus = new Vivus(this.element.node);
    this.sentinels = {
      spin: false,
      pulse: false,
    };
  }

  /**
   * Performs transformations waiting in the queue.
   */
  process() {
    let transformation = this.animationQueue.next();
    if (transformation) {
      
      if (transformation.animate) {
        this.element.animate(
          this.getStateString(transformation),
          transformation.milliseconds,
          ()=>{
            this.animationQueue.animationComplete();
            if (transformation.callback) {
              transformation.callback();
            }
            this.process();
          },
        );
        let animation = Object.values(this.element.anims).sort((a,b)=>{return b.b-a.b})[0];
        animation.easingMap = transformation.easing || [mina.linear, mina.linear, mina.linear, mina.linear];

        animation.update = function() {
          var a = this,
              res;
          if (Array.isArray(a.start)) {
              res = [];
              for (var j = 0, jj = a.start.length; j < jj; j++) {
                  res[j] = +a.start[j] +
                      (a.end[j] - a.start[j]) * a.easingMap[j](a.s);
              }
          } else {
              throw new Error("i don't think this branch ever runs");
              res = +a.start + (a.end - a.start) * a.easingMap[0](a.s);
          }
          a.set(res);
        };
      }
      else {
        this.element.attr(this.getStateString(transformation));
        this.animationQueue.animationComplete();
        this.process();
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
   * @param {Transformation} transformation 
   */
  sendToQueue(transformation) {
    if (transformation.waitForFinish || !this.animationQueue.isAnimating()) {
      this.animationQueue.add(transformation);
      if (!this.animationQueue.isAnimating()) {this.process();}
    }
    else {
      this.mergeAnimation(transformation);
    }
    return this;
  }

  /**
   * Moves this to the absolute coordinates provided.
   * @param {number} x 
   * @param {number} y 
   * @param {number} milliseconds
   * @param {function} easing
   * @param {boolean} waitForFinish
   */
  move(x, y, milliseconds, easing, waitForFinish) {
    easing = easing || mina.linear;
    waitForFinish = waitForFinish != undefined ? waitForFinish : true;
    let transformation = new Transformation({
      location: {x: x, y: y},
      milliseconds: milliseconds,
      animate: Boolean(milliseconds),
      easing: [easing, easing, mina.linear, mina.linear],
      waitForFinish: waitForFinish,
    });
    return this.sendToQueue(transformation);
  }

  /**
   * Moves this to the absolute x coordinate provided.
   * @param {number} x 
   * @param {number} milliseconds
   * @param {function} easing
   * @param {boolean} waitForFinish
   */
  moveX(x, milliseconds, easing, waitForFinish) {
    easing = easing || mina.linear;
    waitForFinish = waitForFinish != undefined ? waitForFinish : true;
    let transformation = new Transformation({
      location: {x: x},
      milliseconds: milliseconds,
      animate: Boolean(milliseconds),
      easing: [easing, mina.linear, mina.linear, mina.linear],
      waitForFinish: waitForFinish,
    });
    return this.sendToQueue(transformation);
  }

  /**
   * Moves this to the absolute y coordinate provided.
   * @param {number} y 
   * @param {number} milliseconds
   * @param {function} easing
   * @param {boolean} waitForFinish
   */
  moveY(y, milliseconds, easing, waitForFinish) {
    easing = easing || mina.linear;
    waitForFinish = waitForFinish != undefined ? waitForFinish : true;
    let transformation = new Transformation({
      location: {y: y},
      milliseconds: milliseconds,
      animate: Boolean(milliseconds),
      easing: [mina.linear, easing, mina.linear, mina.linear],
      waitForFinish: waitForFinish,
    });
    return this.sendToQueue(transformation);
  }

  /**
   * Rotates this to the absolute degree provided.
   * @param {number} degrees 
   * @param {number} milliseconds
   * @param {function} easing
   * @param {boolean} waitForFinish
   */
  rotate(degrees, milliseconds, easing, waitForFinish) {
    easing = easing || mina.linear;
    waitForFinish = waitForFinish != undefined ? waitForFinish : true;
    let transformation = new Transformation({
      rotation: degrees,
      milliseconds: milliseconds,
      animate: Boolean(milliseconds),
      easing: [mina.linear, mina.linear, easing, mina.linear],
      waitForFinish: waitForFinish,
    });
    return this.sendToQueue(transformation);
  }

  /**
   * Scales this to the absolute ratio provided.
   * @param {number} ratio 
   * @param {number} milliseconds
   * @param {function} easing
   * @param {boolean} waitForFinish
   */
  scale(ratio, milliseconds, easing, waitForFinish) {
    easing = easing || mina.linear;
    waitForFinish = waitForFinish != undefined ? waitForFinish : true;
    let transformation = new Transformation({
      scalar: ratio,
      milliseconds: milliseconds,
      animate: Boolean(milliseconds),
      easing: [mina.linear, mina.linear, mina.linear, easing],
      waitForFinish: waitForFinish,
    });
    return this.sendToQueue(transformation);
  }

  /**
   * Used to start and stop a spinning animation.
   * @param {number} degrees 
   * @param {number} milliseconds 
   */
  toggleSpin(degrees, milliseconds) {
    if (this.sentinels.spin) {
      this.sentinels.spin = false;
    }
    else {
      this.sentinels.spin = true;
      let transformation = new Transformation({
        rotation: this.rotation + degrees,
        animate: true,
        milliseconds: milliseconds,
        waitForFinish: false,
        callback: ()=>{
          if (this.sentinels.spin) {
            transformation.rotation = this.rotation + degrees;
            this.sendToQueue(transformation);
          }
        },
      });
      this.sendToQueue(transformation);
    }
    return this;
  }

  /**
   * Used to start and stop a pulsing animation.
   * @param {number} scalar 
   * @param {number} milliseconds 
   * @param {function} easingOut
   * @param {function} easingIn
   */
  togglePulse(scalar, milliseconds, easingOut, easingIn) {

    easingIn = easingIn || easingOut || mina.linear;
    easingOut = easingOut || mina.linear;
    
    if (this.sentinels.pulse) {
      this.sentinels.pulse = false;
    }
    else {
      this.sentinels.pulse = true;
      let scaleUp = new Transformation({
        scalar: scalar,
        animate: true,
        milliseconds: milliseconds,
        easing: [mina.linear, mina.linear, mina.linear, easingOut],
        waitForFinish: false,
        callback: ()=>{
          this.sendToQueue(scaleDown);
        },
      });

      let scaleDown = new Transformation({
        scalar: this.scalar,
        animate: true,
        milliseconds: milliseconds,
        easing: [mina.linear, mina.linear, mina.linear, easingIn],
        waitForFinish: false,
        callback: ()=>{
          if (this.sentinels.pulse) {
            this.sendToQueue(scaleUp);
          }
        },
      });

      this.sendToQueue(scaleUp);
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
   * Turns the current animation into a transformation to make it easier to
   * merge with other animations.
   */
  currentAnimationToTransformation() {

    let currentAnimation = Object.values(this.element.anims)[0];
    currentAnimation.stop();
    this.animationQueue.animationComplete();
    
    let xNotAnimating = currentAnimation.start[0] == currentAnimation.end[0];
    let yNotAnimating = currentAnimation.start[1] == currentAnimation.end[1];
    let rotationNotAnimating = currentAnimation.start[2] == currentAnimation.end[2];
    let scalarNotAnimating = currentAnimation.start[3] == currentAnimation.end[3];

    let currentTransformation = new Transformation({
      location: {
        x: !xNotAnimating ? currentAnimation.end[0] : undefined,
        y: !yNotAnimating ? currentAnimation.end[1] : undefined,
      },
      rotation: !rotationNotAnimating ? currentAnimation.end[2] : undefined,
      scalar: !scalarNotAnimating ? currentAnimation.end[3] : undefined,
      milliseconds: (1 - currentAnimation.status()) * currentAnimation.duration(),
      animate: true,
      status: currentAnimation.status(),
      // this probably causes the wrapping callback in process to get called twice
      // doesn't seem to be causing issues right now though
      callback: currentAnimation._callback,
    });

    return currentTransformation;

  }

  /**
   * Used to combine a new animation with the existing queue.
   * @param {Transformation} newTransformation 
   */
  mergeAnimation(newTransformation) {

    this.animationQueue.queue.unshift(this.currentAnimationToTransformation());

    /**
     * Recursively merges an animation with all overlapping animations in a queue.
     * @param {Transformation} transformation 
     * @param {AnimationQueue} queue 
     */
    let mergeWithQueue = (transformation, queue)=>{

      if (!queue.length) {queue.push(transformation);}

      else {

        let firstQueued = queue.shift();
        let mergeResult = transformation.merge(firstQueued);
        
        if (mergeResult[1]) {
          
          mergeWithQueue(mergeResult[1], queue);
          
        }
        
        queue.unshift(mergeResult[0]);

      }

    }

    mergeWithQueue(newTransformation, this.animationQueue.queue);

    this.process();

  }

  /**
   * Used to pause all running animations.
   */
  pause() {
    Object.values(this.element.anims).map(anim=>anim.pause());
  }

  /**
   * Used to stop all running animations.
   */
  stop() {
    Object.values(this.element.anims).map(anim=>anim.stop());
    this.animationQueue.animationComplete();
  }

}