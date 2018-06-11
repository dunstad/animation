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

    for (let func of [this.move, this.moveX, this.moveY, this.rotate, this.scale, this.wait, this.after, this.toggleSpin, this.togglePulse]) {
      this[func.name] = this.makeAnimationHelper(func);
    }

    // animations currently in progress
    this.anims = {};
    this.nextAnimationId = 0;

  }

  newAnimationId() {
    return this.nextAnimationId++;
  }

  /**
   * Performs transformations waiting in the queue.
   */
  process() {
    let transformation = this.animationQueue.next();
    if (transformation) {
      
      if (transformation.milliseconds) {
        let propertyNames = Object.keys(transformation.propertyValueMap);
        let startValues = propertyNames.map(name=>this[name]);
        let endValues = propertyNames.map(name=>transformation.propertyValueMap[name]);
        let nextAnimationId = this.newAnimationId();
        let animation = Snap.animate(startValues, endValues, (values)=>{
            Object.assign(this, propertyNames.reduce((obj, k, i)=>({...obj, [k]: values[i] }), {}));
          },
          transformation.milliseconds,
          ()=>{
            delete this.anims[nextAnimationId];
            // processing before callbacks so they can tell when we're animating
            this.process();
            if (transformation.callback) {
              transformation.callback();
            }
          }
        );
        this.anims[nextAnimationId] = animation;
        animation.propertyNames = propertyNames; // used to convert back to transformation
        animation.originalCallback = transformation.callback;
        animation.easing = propertyNames.map(name=>transformation.easingMap[name] || mina.linear);

        animation.update = function() {
          var a = this, res = [];
          for (var j = 0, jj = a.start.length; j < jj; j++) {
            res[j] = +a.start[j] + (a.end[j] - a.start[j]) * a.easing[j](a.s);
          }
          a.set(res);
        };
      }
      else {
        Object.assign(this, transformation.propertyValueMap);
        this.process();
      }
    }
  }

  /**
   * Represents the current transformation state of this as a transformation string.
   * The transform parameter allows the resulting string to be a transformation
   * from the current state.
   * @param {Transformation} transformation
   */
  getStateString(transformation) {
    transformation = transformation || new Transformation();
    
    let parsedTransform = Snap.parseTransformString(this.element.transform().string || 't0,0r0s1');

    if (transformation.propertyValueMap.x != undefined || transformation.propertyValueMap.y != undefined) {
      let location = parsedTransform.find(e=>e[0]=='t');
      if (!location) {
        location = ['t', 0, 0];
        parsedTransform.push(location);
      }
      
      location[1] = transformation.propertyValueMap.x != undefined ? transformation.propertyValueMap.x : location[1];
      location[2] = transformation.propertyValueMap.y != undefined ? transformation.propertyValueMap.y : location[2];
    }
    
    if (transformation.propertyValueMap.rotation !== undefined) {
      let rotation = parsedTransform.find(e=>e[0]=='r');
      if (!rotation) {
        rotation = ['r', 0];
        parsedTransform.push(rotation);
      }
      rotation[1] = transformation.propertyValueMap.rotation;
    }
    
    if (transformation.propertyValueMap.scalar !== undefined) {
      let scalar = parsedTransform.find(e=>e[0]=='s');
      if (!scalar) {
        scalar = ['s', 1];
        parsedTransform.push(scalar);
      }
      scalar[1] = transformation.propertyValueMap.scalar;
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
    let animating = Object.keys(this.anims).length;
  if (transformation.waitForFinish/* || !animating*/) {
      this.animationQueue.add(transformation);
      // if (!animating) {this.process();}
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
    transformationObject.waitForFinish == undefined && (transformationObject.waitForFinish = true);
    return this.sendToQueue(new Transformation(transformationObject));
  }

  /**
   * Helps us repeat less code while writing animation helper functions.
   * Returned functions additionally accept an optional milliseconds parameter
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
        ...func.bind(this)(...arguments),
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
    return {propertyValueMap: {x: x, y: y}};
  }
  
  /**
   * Moves this to the absolute x coordinate provided.
   * @param {number} x 
   */
  moveX(x) {
    return {propertyValueMap: {x: x}};
  }
  
  /**
   * Moves this to the absolute y coordinate provided.
   * @param {number} y 
   */
  moveY(y) {
    return {propertyValueMap: {y: y}};
  }
  
  /**
   * Rotates this to the absolute degree provided.
   * @param {number} degrees 
   */
  rotate(degrees) {
    return {propertyValueMap: {rotation: degrees}};
  }

  /**
   * Scales this to the absolute ratio provided.
   * @param {number} ratio 
   */
  scale(ratio) {
    return {propertyValueMap: {scalar: ratio}};
  }

  /**
   * Used to time animations without using setTimeout
   */
  wait() {
    return {propertyValueMap: {}};
  }

  /**
   * Used to specify ahead of time that we want to merge in an animation
   * later. Essentially a better alternative to setTimeout.
   * @param {object} transformationObject 
   */
  after(transformationObject) {
    transformationObject.waitForFinish = false;
    return {
      propertyValueMap: {},
      waitForFinish: false,
      callback: ()=>{
        this.addTransformation(transformationObject);
      },
    }
  }

  /**
   * Used to start and stop a spinning animation.
   * @param {number} degrees 
   */
  toggleSpin(degrees) {
    if (this.sentinels.spin) {
      this.sentinels.spin = false;
    }
    else {
      this.sentinels.spin = true;
      let transformation = {
        propertyValueMap: {rotation: this.rotation + degrees},
        milliseconds: arguments[1],
        waitForFinish: false,
        callback: ()=>{
          if (this.sentinels.spin) {
            transformation.propertyValueMap.rotation = this.rotation + degrees;
            this.addTransformation(transformation);
            this.process();
          }
        },
      };
      return transformation;
    }
  }

  /**
   * Used to start and stop a pulsing animation.
   * @param {number} scalar 
   */
  togglePulse(scalar) {
    if (this.sentinels.pulse) {
      this.sentinels.pulse = false;
    }
    else {
      this.sentinels.pulse = true;
      let scaleUp = {
        propertyValueMap: {scalar: scalar},
        milliseconds: arguments[1],
        waitForFinish: false,
        callback: ()=>{
          this.addTransformation(scaleDown);
          this.process();
        },
      };
      
      let scaleDown = {
        propertyValueMap: {scalar: this.scalar},
        milliseconds: arguments[1],
        waitForFinish: false,
        callback: ()=>{
          if (this.sentinels.pulse) {
            this.addTransformation(scaleUp);
            this.process();
          }
        },
      };
      return scaleUp;
    }
  }

  get rotation() {
    return Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="r")[1];
  }

  set rotation(degree) {
    this.element.attr(this.getStateString(new Transformation({propertyValueMap: {rotation: degree}})));
  }
  
  get scalar() {
    return Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="s")[1];
  }

  set scalar(scalar) {
    this.element.attr(this.getStateString(new Transformation({propertyValueMap: {scalar: scalar}})));
  }
  
  get location() {
    let locationInfo = Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="t");
    return {x: locationInfo[1], y: locationInfo[2]};
  }

  set location(coordinates) {
    this.element.attr(this.getStateString(new Transformation({propertyValueMap: coordinates})));
  }

  get x() {
    return this.location.x;
  }
  
  set x(coordinate) {
    this.location = {x: coordinate};
  }

  get y() {
    return this.location.y;
  }

  set y(coordinate) {
    this.location = {y: coordinate};
  }

  /**
   * Turns the current animation into a transformation to make it easier to
   * merge with other transformations.
   */
  currentAnimationToTransformation() {

    let [id, currentAnimation] = Object.entries(this.anims).sort((a,b)=>{return b[1].b-a[1].b})[0];
    currentAnimation.stop();
    delete this.anims[id];
    
    let currentTransformation = new Transformation({
      propertyValueMap: currentAnimation.propertyNames.reduce((obj, k, i)=>({...obj, [k]: currentAnimation.end[i]}), {}),
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
        return Object.assign(easingMap1, easingMap2);
      };

      let mergedEasingMap = mergeEasingMaps(shortTransformation.easingMap, longTransformation.easingMap);

      let firstTransformation = new Transformation({
        milliseconds: shortTransformation.milliseconds,
        easingMap: mergedEasingMap,
        animate: true,
        waitForFinish: true,
        callback: shortTransformation.callback,
      });
      let secondTransformation = new Transformation({
        milliseconds: longTransformation.milliseconds - shortTransformation.milliseconds,
        easingMap: mergedEasingMap,
        animate: true,
        waitForFinish: true,
        callback: longTransformation.callback,
      });

      let durationRatio = shortTransformation.milliseconds / longTransformation.milliseconds;

      let splitNumberValue = (propertyName) => {
        return ((longTransformation.propertyValueMap[propertyName] - this[propertyName]) * durationRatio) + this[propertyName];
      };

      for (let propertyName of ['rotation', 'scalar', 'x', 'y']) {
        
        if (longTransformation.propertyValueMap[propertyName] != undefined) {
          
          firstTransformation.propertyValueMap[propertyName] = splitNumberValue(propertyName);
          secondTransformation.propertyValueMap[propertyName] = longTransformation.propertyValueMap[propertyName];
          
        }
        
        else if (shortTransformation.propertyValueMap[propertyName] != undefined) {
          
          firstTransformation.propertyValueMap[propertyName] = shortTransformation.propertyValueMap[propertyName];
          
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

    if (Object.keys(this.anims).length) {
      
      this.animationQueue.queue.unshift(newTransformation);
  
      mergeWithQueue(this.currentAnimationToTransformation(), this.animationQueue.queue);
  
      this.process();

    }

    else {

      mergeWithQueue(newTransformation, this.animationQueue.queue);

    }


  }

  /**
   * Used to pause all running animations.
   */
  pause() {
    Object.values(this.anims).map(anim=>anim.pause());
  }

  /**
   * Used to stop all running animations.
   */
  stop() {
    Object.values(this.anims).map(anim=>anim.stop());
  }

}