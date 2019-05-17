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
      
      if (transformation.callfront) {
        // callfronts used to modify the transformation before it happens
        // useful when we don't know how to animate ahead of time due to state
        transformation.callfront(transformation);
      }

      if (transformation.milliseconds) {
        let propertyNames = Object.keys(transformation.propertyValueMap);
        let startValues = propertyNames.map(name=>this[name]);
        let endValues = propertyNames.map(name=>transformation.propertyValueMap[name]);
        let nextAnimationId = this.newAnimationId();

        let timeline = this.element.timeline();
        let runner = new SVG.Runner(transformation.milliseconds);
        runner.ease('-'); // we'll do the easing inside the during callback

        runner.during((pos)=>{

          for (let i = 0; i < startValues.length; i++) {
            let propertyName = propertyNames[i];
            let startValue = startValues[i];
            let endValue = endValues[i];
            let easedPos = pos;
            if (transformation.easingMap[propertyName]) {
              easedPos = transformation.easingMap[propertyName](pos);
            }
            this[propertyName] = startValue + ((endValue - startValue) * easedPos);
          }

        });

        runner.after(()=>{

          delete this.anims[nextAnimationId];
          if (transformation.callback) {
            transformation.callback();
          }

          // processing after callbacks so it doesn't stop recursing before
          // repeating animations stick their next transform in the queue
          this.process(resolve);

        });

        timeline.schedule(runner);
        timeline.play();

        let animation = {timeline: timeline, runner: runner};

        this.anims[nextAnimationId] = animation;
        animation.propertyNames = propertyNames; // used to convert back to transformation
        animation.originalCallback = transformation.callback;
        
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
    return this.element.transform().rotate;
  }

  set rotation(degree) {
    if (typeof degree != 'number') {throw new Error('rotation must be a number');}
    let transformObject = {
      scale: this.element.transform().scaleX,
      rotate: degree,
    };
    this.element.transform(transformObject);
    if (this.element.clipper()) {
      this.element.clipper().transform(transformObject);
    }
    if (this.element.masker()) {
      this.element.masker().transform(transformObject);
    }
  }
  
  get scalar() {
    return this.element.transform().scaleX;
  }

  set scalar(scalar) {
    // element.transform() contains scaleX/Y, and a-f, which overwrite them
    let transformObject = {
      scale: scalar,
      rotate: this.element.transform().rotate,
    };
    this.element.transform(transformObject);
    if (this.element.clipper()) {
      this.element.clipper().transform(transformObject);
    }
    if (this.element.masker()) {
      this.element.masker().transform(transformObject);
    }
  }
  
  get location() {
    return {x: this.element.x(), y: this.element.y()};
  }

  set location(coordinates) {
    this.element.x(coordinates.x).y(coordinates.y);
  }

  get x() {
    return this.element.x();
  }
  
  set x(coordinate) {
    this.element.x(coordinate);
  }

  get y() {
    return this.element.y();
  }

  set y(coordinate) {
    this.element.y(coordinate);
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
    currentAnimation.timeline.stop();
    delete this.anims[id];
    
    let currentTransformation = new Transformation({
      propertyValueMap: currentAnimation.propertyNames.reduce((obj, k, i)=>({...obj, [k]: currentAnimation.end[i]}), {}),
      milliseconds: (1 - currentAnimation.runner.progress()) * currentAnimation.runner.duration(),
      animate: true,
      callback: currentAnimation.originalCallback,
    });

    return currentTransformation;

  }

  /**
   * Used to allow different animations to run at the same time by combining them.
   * Order here determines at what point in the baseTransformation
   * the mergeTransformation will start.
   * @param {Transformation} baseTransformation 
   * @param {Transformation} mergeTransformation 
   * @return {Transformation[]}
   */
  merge(baseTransformation, mergeTransformation) {

    let result;

    if (baseTransformation.milliseconds && mergeTransformation.milliseconds) {

      if (baseTransformation.canMergeWith(mergeTransformation)) {

        let [shortTransformation, longTransformation] = [baseTransformation, mergeTransformation].sort((a, b)=>{
          return a.milliseconds - b.milliseconds;
        });

        let mergeEasingMaps = (easingMap1, easingMap2)=>{
          return Object.assign(easingMap1, easingMap2);
        };

        let mergedEasingMap = mergeEasingMaps(shortTransformation.easingMap, longTransformation.easingMap);

        // don't let animations try merging back beyond the current base,
        // otherwise this could happen when merging long animations into short ones
        let mergeRatio = Math.min(1, mergeTransformation.milliseconds / baseTransformation.milliseconds);
        
        if (mergeTransformation.merge === 'start') {mergeTransformation.merge = 0;}
        if (mergeTransformation.merge === 'end') {
          mergeTransformation.merge = 1 - mergeRatio;
        }

        if ((mergeTransformation.merge < 0) || (mergeTransformation.merge > 1)) {
          throw new Error('The merge property of transformations should be between 0 and 1.');
        }

        let firstTransformation = new Transformation({
          callfront: longTransformation.callfront,
          milliseconds: longTransformation.milliseconds * mergeTransformation.merge,
          easingMap: longTransformation.easingMap,
          animate: true,
        });
        let secondTransformation = new Transformation({
          callfront: shortTransformation.callfront,
          milliseconds: shortTransformation.milliseconds,
          easingMap: mergedEasingMap,
          animate: true,
          callback: shortTransformation.callback,
        });
        let thirdTransformation = new Transformation({
          milliseconds: longTransformation.milliseconds - (firstTransformation.milliseconds + secondTransformation.milliseconds),
          easingMap: longTransformation.easingMap,
          animate: true,
          callback: longTransformation.callback,
        });

        /**
         * Order matters here because of easing functions.
         * If an animation using easein gets split in two,
         * it looks different depending on where the split happens.
         * @param {String[]} propertyNames 
         */
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

          if (longTransformation.propertyValueMap[propertyName] !== undefined) {

            let valueAfterQueue = this.animationQueue.finalState()[propertyName];
            if (valueAfterQueue === undefined) {
              valueAfterQueue = this[propertyName];
            }

            let durationRatio = shortTransformation.milliseconds / longTransformation.milliseconds;
            let longProp = longTransformation.propertyValueMap[propertyName];
            let firstThird = valueAfterQueue + ((longProp - valueAfterQueue) * mergeTransformation.merge);
            let secondThird = firstThird + ((longProp - valueAfterQueue) * durationRatio);

            firstTransformation.propertyValueMap[propertyName] = firstThird;
            secondTransformation.propertyValueMap[propertyName] = secondThird;
            thirdTransformation.propertyValueMap[propertyName] = longProp;
            
          }
          
          else if (shortTransformation.propertyValueMap[propertyName] !== undefined) {

            secondTransformation.propertyValueMap[propertyName] = shortTransformation.propertyValueMap[propertyName];
            
          }
          
        }
        
        result = [firstTransformation, secondTransformation, thirdTransformation].filter(t=>t.milliseconds>0);

        if (thirdTransformation.milliseconds <= 0) {
          let secondCallback = secondTransformation.callback;
          secondTransformation.callback = ()=>{
            secondCallback && secondCallback();
            thirdTransformation.callback && thirdTransformation.callback();
          };
        }
        
        if (firstTransformation.milliseconds <= 0) {
          let secondCallfront = secondTransformation.callfront;
          secondTransformation.callfront = ()=>{
            firstTransformation.callfront && firstTransformation.callfront();
            secondCallfront && secondCallfront();
          };
        }

      }
    
      else {
        console.error(baseTransformation, mergeTransformation);
        throw new Error('incompatible transformations');
      }

    }

    else {

      // instantaneous transformations should happen first
      result = [mergeTransformation, baseTransformation].sort((a,b)=>{return a.milliseconds ? 1 : -1});

    }

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
        let mergeResult = this.merge(lastQueued, transformation);

        queue.add(...mergeResult);

      }

    }

    // Now that we're merging onto the back of the queue, whether an
    // animation is in progress only matters if the queue is empty.
    // Otherwise, we just merge with the end of the queue.
    if (Object.keys(this.anims).length && !this.animationQueue.length) {

      this.animationQueue.add(currentAnimation);
  
      let currentAnimation = this.currentAnimationToTransformation();
      mergeWithQueue(newTransformation, this.animationQueue);
  
      this.process();

    }

    else {

      mergeWithQueue(newTransformation, this.animationQueue);

    }

  }

  /**
   * Used to pause all running animations.
   */
  pause() {
    this.element.timeline().pause();
  }

  /**
   * Used to resume all paused animations.
   * Not sure how necessary this is anymore since timeline pause is a toggle
   */
  resume() {
    this.element.timeline()._continue();
  }

  /**
   * Used to stop all running animations.
   */
  stop() {
    this.element.timeline().stop();
  }

}