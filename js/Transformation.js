class Transformation {

  constructor(transformationObject) {
    transformationObject = transformationObject || {};

    // {x: number, y: number}, can leave out either x or y
    this.location = transformationObject.location;

    // number
    this.rotation = transformationObject.rotation;

    // number
    this.scalar = transformationObject.scalar;

    // number
    this.milliseconds = transformationObject.milliseconds;

    // boolean
    this.animate = transformationObject.animate;

    // an array of four functions
    this.easing = transformationObject.easing;

    // function
    this.callback = transformationObject.callback;

    // boolean
    this.waitForFinish = transformationObject.waitForFinish;

    // number (0.0-1.0)
    this.status = transformationObject.status;
  }

  /**
   * Used to see if animations can be merged without interfering with each other.
   * @param {Transformation} otherTransformation 
   */
  canMergeWith(otherTransformation) {

    let canMergeEasingMaps = (easingMap1, easingMap2)=>{
      easingMap1 = easingMap1 || [mina.linear, mina.linear, mina.linear, mina.linear];
      easingMap2 = easingMap2 || [mina.linear, mina.linear, mina.linear, mina.linear];
      let result = easingMap1.map((e, i)=>{
        return e == mina.linear || easingMap2[i] == mina.linear || e == easingMap2[i];
      }).reduce((a, b)=>{return a && b});
      return result;
    };
    
    let animationsCompatible = true;

    if (this.location != undefined && otherTransformation.location != undefined) {
      if (this.location.x != undefined && otherTransformation.location.x != undefined) {
        animationsCompatible = false;
      }
      if (this.location.y != undefined && otherTransformation.location.y != undefined) {
        animationsCompatible = false;
      }
    }

    if (this.rotation != undefined && otherTransformation.rotation != undefined) {
      animationsCompatible = false;
    }

    if (this.scalar != undefined && otherTransformation.scalar != undefined) {
      animationsCompatible = false;
    }
    
    if (!canMergeEasingMaps(this.easing, otherTransformation.easing)) {
      animationsCompatible = false;
    }

    return animationsCompatible;

  }

  /**
   * Used to allow different animations to run at the same time by combining them.
   * Status tells us how far in the first animation was before merging. (0.0-1.0)
   * @param {Transformation} otherTransformation 
   */
  merge(otherTransformation) {

    if (this.canMergeWith(otherTransformation)) {

      let status = this.status || 0;

      let [shortTransformation, longTransformation] = [this, otherTransformation].sort((a, b)=>{
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
      });
      let secondTransformation = new Transformation({
        milliseconds: longTransformation.milliseconds - shortTransformation.milliseconds,
        easing: mergedEasingMap,
        animate: true,
        waitForFinish: true,
      });

      let durationRatio = shortTransformation.milliseconds / longTransformation.milliseconds;

      let splitNumberValue = (property) => {
        let currentValue = longTransformation[property] * status;
        return ((longTransformation[property] - currentValue) * durationRatio) + currentValue;
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
        let currentValue = longTransformation.location[property] * status;
        return ((longTransformation.location[property] - currentValue) * durationRatio) + currentValue;
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

      return result;
      
    }

    else {
      throw new Error('incompatible transformations');
    }

  }

}