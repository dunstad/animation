class Animated {

  /**
   * Makes SVG objects easier to manipulate.
   * @param {object} element 
   */
  constructor(element) {
    
    this.element = element;
    this.animationQueue = new AnimationQueue();
    if (!(this instanceof External)) {
      try {
        this._vivus = new Vivus(this.element.node, {start: 'manual'});
        this._vivus.finish();
      }
      catch {console.log(`no vivus for ${this.constructor.name}`);}
    }
    
    this.sentinels = {
      spin: false,
      pulse: false,
    };

    for (let func of [this.move, this.moveX, this.moveY, this.rotate, this.scale, this.draw, this.wait, this.toggleSpin, this.togglePulse]) {
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
  process(resolve) {
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
            if (transformation.callback) {
              transformation.callback();
            }
            // processing after callbacks so it doesn't stop recursing before
            // repeating animations stick their next transform in the queue
            this.process(resolve);
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
        this.process(resolve);
        if (transformation.callback) {
          transformation.callback();
        }
      }
    }
    else {if (resolve) {resolve();}}
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
  // merge being 1 is the same as adding onto the end of the queue normally
  // there's really no reason it should be used, but might as well allow it
  if (transformation.merge === undefined || transformation.merge === 1) {
      this.animationQueue.add(transformation);
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
    let result = Object.assign({}, transformationObject);
    if (result.after) {
      let callbackTransform = Object.assign({}, transformationObject);
      callbackTransform.merge = 'start';
      let after = callbackTransform.after;
      delete callbackTransform.after;
      result = {
        propertyValueMap: {},
        milliseconds: after,
        merge: transformationObject.merge,
        callback: ()=>{
          this.addTransformation(callbackTransform);
        },
      };
    }
    return this.sendToQueue(new Transformation(result));
  }

  /**
   * Helps us repeat less code while writing animation helper functions.
   * Returned functions additionally accept an optional milliseconds parameter
   * and a config object parameter.
   * The config parameter is mostly options for the Transformation object,
   * but also has an after option which, when given a millisecond number,
   * will wait that long to merge the transformation into the queue. 
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
   * Uses Vivus to draw paths to the completion provided.
   * @param {number} ratio 
   */
  draw(ratio) {
    return {propertyValueMap: {vivus: ratio}};
  }

  /**
   * Used to time animations without using setTimeout
   */
  wait() {
    return {propertyValueMap: {}};
  }

  /**
   * Used to start and stop a spinning animation.
   * @param {number} degrees 
   */
  toggleSpin(degrees) {
    let transformation;
    if (this.sentinels.spin) {
      transformation = {
        propertyValueMap: {},
        merge: 'start',
        callback: ()=>{
          this.sentinels.spin = false;
        },
      };
    }
    else {
      this.sentinels.spin = true;
      transformation = {
        propertyValueMap: {rotation: this.rotation + degrees},
        milliseconds: arguments[1],
        merge: 'start',
        callback: ()=>{
          if (this.sentinels.spin) {
            transformation.propertyValueMap.rotation = this.rotation + degrees;
            this.addTransformation(transformation);
          }
        },
      };
    }
    return transformation;
  }

  /**
   * Used to start and stop a pulsing animation.
   * @param {number} scalar 
   */
  togglePulse(scalar) {
    let transformation;
    if (this.sentinels.pulse) {
      transformation = {
        propertyValueMap: {},
        merge: 'start',
        callback: ()=>{
          this.sentinels.pulse = false;
        },
      };
    }
    else {
      this.sentinels.pulse = true;
      let scaleUp = {
        propertyValueMap: {scalar: scalar},
        milliseconds: arguments[1],
        merge: 'start',
        callback: ()=>{
          this.addTransformation(scaleDown);
        },
      };
      
      let scaleDown = {
        propertyValueMap: {scalar: this.scalar},
        milliseconds: arguments[1],
        merge: 'start',
        callback: ()=>{
          if (this.sentinels.pulse) {
            this.addTransformation(scaleUp);
          }
        },
      };
      transformation = scaleUp;
    }
    return transformation;
  }

  get rotation() {
    return Snap.parseTransformString(this.getStateString().transform).find(e=>e[0]=="r")[1];
  }

  set rotation(degree) {
    if (typeof degree != 'number') {throw new Error('rotation must be a number');}
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

  get vivus() {
    return this._vivus.currentFrame / this._vivus.frameLength;
  }

  set vivus(ratio) {
    this._vivus.setFrameProgress(ratio);
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
   * @param {Transformation} transformation 
   * @param {Transformation} otherTransformation 
   * @return {Transformation[]}
   */
  merge(transformation, otherTransformation) {

    console.log('merging!');
    console.log(transformation);
    console.log(otherTransformation);

    let result;

    if (transformation.milliseconds && otherTransformation.milliseconds) {

      if (transformation.canMergeWith(otherTransformation)) {

        let [shortTransformation, longTransformation] = [transformation, otherTransformation].sort((a, b)=>{
          return a.milliseconds - b.milliseconds;
        });

        let mergeEasingMaps = (easingMap1, easingMap2)=>{
          return Object.assign(easingMap1, easingMap2);
        };

        let mergedEasingMap = mergeEasingMaps(shortTransformation.easingMap, longTransformation.easingMap);

        let firstTransformation, secondTransformation;

        if (shortTransformation.merge === 'start' || shortTransformation.merge === 0) {

          firstTransformation = new Transformation({
            milliseconds: shortTransformation.milliseconds,
            easingMap: mergedEasingMap,
            animate: true,
            callback: shortTransformation.callback,
          });
          secondTransformation = new Transformation({
            milliseconds: longTransformation.milliseconds - shortTransformation.milliseconds,
            easingMap: longTransformation.easingMap,
            animate: true,
            callback: longTransformation.callback,
          });

        }

        else if (shortTransformation.merge === 'end') {

          firstTransformation = new Transformation({
            milliseconds: longTransformation.milliseconds - shortTransformation.milliseconds,
            easingMap: longTransformation.easingMap,
            animate: true,
            callback: longTransformation.callback,
          });
          secondTransformation = new Transformation({
            milliseconds: shortTransformation.milliseconds,
            easingMap: mergedEasingMap,
            animate: true,
            callback: shortTransformation.callback,
          });

        }

        // in this case, merge should be a number greater than 0 and less than 1
        // 0 is handled above, and 1 is handled in sendToQueue
        else {
          


        }


        let durationRatio = shortTransformation.milliseconds / longTransformation.milliseconds;

        /**
         * Find what the property value will be when the merged animation starts,
         * then split the animation between that value and the final one.
         * @param {String} propertyName 
         */
        let splitNumberValue = (propertyName) => {
          let valueAfterQueue = this.animationQueue.finalState()[propertyName];
          if (valueAfterQueue === undefined) {
            valueAfterQueue = this[propertyName];
          }
          return ((longTransformation.propertyValueMap[propertyName] - this[propertyName]) * durationRatio) + this[propertyName];
        };

        // order matters here because of easing functions
        // if an animation using easein gets split in two,
        // it looks different depending on where the split happens.


        // this should help get rid of the need to specify every property:

        function orderProperties(propertyNames) {
          let order = ['rotation', 'scalar', 'x', 'y'];
          
          let inOrder = propertyNames.filter(name=>order.indexOf(name) !== -1);
          inOrder.sort((a, b)=>order.indexOf(a) - order.indexOf(b));
        
          let outOfOrder = propertyNames.filter(name=>order.indexOf(name) === -1);
          outOfOrder.sort();
        
          return inOrder.concat(outOfOrder);
        }

        let propertyNames = new Set(
          orderProperties(
            Object.keys(longTransformation.propertyValueMap).concat(Object.keys(shortTransformation.propertyValueMap))
          )
        );

        for (let propertyName of propertyNames) {
          
          if (longTransformation.propertyValueMap[propertyName] != undefined) {
            
            firstTransformation.propertyValueMap[propertyName] = splitNumberValue(propertyName);
            secondTransformation.propertyValueMap[propertyName] = longTransformation.propertyValueMap[propertyName];
            
          }
          
          else if (shortTransformation.propertyValueMap[propertyName] != undefined) {
            
            firstTransformation.propertyValueMap[propertyName] = shortTransformation.propertyValueMap[propertyName];
            
          }
          
        }
        
        result = [firstTransformation];
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

      }
    
      else {
        console.error(transformation, otherTransformation);
        throw new Error('incompatible transformations');
      }

    }

    else {

      // instantaneous transformations should happen first
      result = [otherTransformation, transformation].sort((a,b)=>{return a.milliseconds ? 1 : -1});

    }

    console.log('merge result!');
    console.log(result);

    return result;

  }

  /**
   * Used to combine a new animation with the existing queue.
   * @param {Transformation} newTransformation 
   */
  mergeAnimation(newTransformation) {

    /**
     * Merges an animation onto the end of a queue.
     * @param {Transformation} transformation 
     * @param {AnimationQueue} queue 
     */
    let mergeWithQueue = (transformation, queue)=>{

      if (!queue.length) {queue.add(transformation);}

      else {

        let lastQueued = queue.last();
        let mergeResult = this.merge(transformation, lastQueued);

        queue.add(...mergeResult);

      }

    }

    // Now that we're merging onto the back of the queue, whether an
    // animation is in progress only matters if the queue is empty.
    // Otherwise, we just merge with the end of the queue.
    if (Object.keys(this.anims).length && !this.animationQueue.length) {

      console.log('merging with animation in progress!')
      
      this.animationQueue.add(newTransformation);
  
      let currentAnimation = this.currentAnimationToTransformation();
      mergeWithQueue(currentAnimation, this.animationQueue);
  
      this.process();

    }

    else {

      console.log('merging with end of queue!')

      mergeWithQueue(newTransformation, this.animationQueue);

    }


  }

  /**
   * Used to pause all running animations.
   */
  pause() {
    Object.values(this.anims).map(anim=>anim.pause());
  }

  /**
   * Used to resume all paused animations.
   */
  resume() {
    Object.values(this.anims).map(anim=>anim.resume());
  }

  /**
   * Used to stop all running animations.
   */
  stop() {
    Object.values(this.anims).map(anim=>anim.stop());
  }

}