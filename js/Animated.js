class Animated {

  /**
   * Makes SVG objects easier to manipulate.
   * @param {object} element 
   */
  constructor(element) {
    
    this.element = element;
    this.animationQueue = new AnimationQueue();
    try {this.element.vivus = new Vivus(this.element.node);}
    catch {;}
    
    this.sentinels = {
      spin: false,
      pulse: false,
    };

    for (let func of [this.move, this.moveX, this.moveY, this.rotate, this.scale, this.wait]) {
      this[func.name] = this.makeAnimationHelper(func);
    }

  }

  /**
   * Performs transformations waiting in the queue.
   */
  process() {
    let transformation = this.animationQueue.next();
    if (transformation) {
      
      if (transformation.milliseconds) {
        this.element.animate(
          this.getStateString(transformation),
          transformation.milliseconds,
          ()=>{
            // processing before callbacks so they can tell when we're animating
            this.process();
            if (transformation.callback) {
              transformation.callback();
            }
          },
        );
        let animation = Object.values(this.element.anims).sort((a,b)=>{return b.b-a.b})[0];
        animation.originalCallback = transformation.callback;
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
   * @return {Animated}
   */
  sendToQueue(transformation) {
    let animating = Object.keys(this.element.anims).length;
    if (transformation.waitForFinish || !animating) {
      this.animationQueue.add(transformation);
      if (!animating) {this.process();}
    }
    else {
      this.mergeAnimation(transformation);
    }
    return this;
  }

  /**
   * Used to help us repeat code a bit less in our animation helper functions.
   * @param {object} transformationObject 
   */
  addTransformation(transformationObject) {
    transformationObject.easing = [
      transformationObject.easingX || mina.linear,
      transformationObject.easingY || mina.linear,
      transformationObject.easingRotate || mina.linear,
      transformationObject.easingScale || mina.linear,
    ];
    transformationObject.waitForFinish == undefined && (transformationObject.waitForFinish = true);
    return this.sendToQueue(new Transformation(transformationObject));
  }

  /**
   * Helps us repeat less code while writing animation helper functions.
   * Returned functions additionally accept an optional easing parameter
   * and a config object parameter.
   * @param {function} func 
   */
  makeAnimationHelper(func) {
    return function() { // not an arrow function so we have access to arguments
      let [milliseconds, config] = Array.prototype.slice.call(arguments, func.length);
      if (typeof milliseconds == 'object' && !config) {
        config = milliseconds;
        milliseconds = undefined;
      }
      return this.addTransformation({
        ...func(...arguments),
        milliseconds: milliseconds,
        ...config,
      });
    }
  }

  /**
   * Moves this to the absolute coordinates provided.
   * @param {number} x 
   * @param {number} y 
   */
  move(x, y) {
    return {location: {x: x, y: y}};
  }
  
  /**
   * Moves this to the absolute x coordinate provided.
   * @param {number} x 
   */
  moveX(x) {
    return {location: {x: x}};
  }
  
  /**
   * Moves this to the absolute y coordinate provided.
   * @param {number} y 
   */
  moveY(y) {
    return {location: {y: y}};
  }
  
  /**
   * Rotates this to the absolute degree provided.
   * @param {number} degrees 
   */
  rotate(degrees) {
    return {rotation: degrees};
  }

  /**
   * Scales this to the absolute ratio provided.
   * @param {number} ratio 
   */
  scale(ratio) {
    return {scalar: ratio};
  }

  /**
   * Used to time animations without using setTimeout
   */
  wait() {
    return {};
  }

  /**
   * Used to start and stop a spinning animation.
   * @param {number} degrees 
   * @param {number} milliseconds 
   * @return {Animated}
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
   * @return {Animated}
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

    let currentAnimation = Object.values(this.element.anims).sort((a,b)=>{return b.b-a.b})[0];
    currentAnimation.stop();
    
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
      callback: currentAnimation.originalCallback,
    });

    return currentTransformation;

  }

  /**
   * Used to allow different animations to run at the same time by combining them.
   * @param {Transformation} otherTransformation 
   * @return {Transformation[]}
   */
  merge(transformation, otherTransformation) {

    if (transformation.canMergeWith(otherTransformation)) {

      let [shortTransformation, longTransformation] = [transformation, otherTransformation].sort((a, b)=>{
        return a.milliseconds - b.milliseconds;
      });

      let mergeEasingMaps = (easingMap1, easingMap2)=>{
        easingMap1 = easingMap1 || [mina.linear, mina.linear, mina.linear, mina.linear];
        easingMap2 = easingMap2 || [mina.linear, mina.linear, mina.linear, mina.linear];
        return easingMap1.map((e, i)=>{return e != mina.linear ? e : easingMap2[i];});
      };

      let mergedEasingMap = mergeEasingMaps(shortTransformation.easing, longTransformation.easing);

      let firstTransformation = new Transformation({
        milliseconds: shortTransformation.milliseconds,
        easing: mergedEasingMap,
        animate: true,
        waitForFinish: true,
        callback: shortTransformation.callback,
      });
      let secondTransformation = new Transformation({
        milliseconds: longTransformation.milliseconds - shortTransformation.milliseconds,
        easing: mergedEasingMap,
        animate: true,
        waitForFinish: true,
        callback: longTransformation.callback,
      });

      let durationRatio = shortTransformation.milliseconds / longTransformation.milliseconds;

      let splitNumberValue = (property) => {
        return ((longTransformation[property] - this[property]) * durationRatio) + this[property];
      };

      for (let property of ['rotation', 'scalar']) {
        
        if (longTransformation[property] != undefined) {
          
          firstTransformation[property] = splitNumberValue(property);
          secondTransformation[property] = longTransformation[property];
          
        }
        
        else if (shortTransformation[property] != undefined) {
          
          firstTransformation[property] = shortTransformation[property];
          
        }
        
      }
      
      let splitLocationValue = (property) => {
        return ((longTransformation.location[property] - this.location[property]) * durationRatio) + this.location[property];
      };

      firstTransformation.location = {};
      secondTransformation.location = {};

      for (let property of ['x', 'y']) {
        
        if (longTransformation.location != undefined && longTransformation.location[property] != undefined) {
          
          firstTransformation.location[property] = splitLocationValue(property);
          secondTransformation.location[property] = longTransformation.location[property];
          
        }
        
        else if (shortTransformation.location != undefined && shortTransformation.location[property] != undefined) {
          
          firstTransformation.location[property] = shortTransformation.location[property];

        }

      }

      let result = [firstTransformation];
      if (secondTransformation.milliseconds > 0) {
        result.push(secondTransformation);
      }
      else {
        let firstCallback = firstTransformation.callback;
        firstTransformation.callback = ()=>{
          firstCallback && firstCallback();
          secondTransformation.callback && secondTransformation.callback();
        };
      }

      return result;
      
    }

    else {
      console.error(transformation, otherTransformation);
      throw new Error('incompatible transformations');
    }

  }

  /**
   * Used to combine a new animation with the existing queue.
   * @param {Transformation} newTransformation 
   */
  mergeAnimation(newTransformation) {

    this.animationQueue.queue.unshift(newTransformation);

    /**
     * Recursively merges an animation with all overlapping animations in a queue.
     * @param {Transformation} transformation 
     * @param {AnimationQueue} queue 
     */
    let mergeWithQueue = (transformation, queue)=>{

      if (!queue.length) {queue.push(transformation);}

      else {

        let firstQueued = queue.shift();
        let mergeResult = this.merge(transformation, firstQueued);
        
        if (mergeResult[1]) {
          
          mergeWithQueue(mergeResult[1], queue);
          
        }
        
        queue.unshift(mergeResult[0]);

      }

    }

    mergeWithQueue(this.currentAnimationToTransformation(), this.animationQueue.queue);

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
  }

}