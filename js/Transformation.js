class Transformation {

  constructor(transformationObject) {
    transformationObject = transformationObject || {};

    // {string: number, ...}
    this.propertyValueMap = transformationObject.propertyValueMap || {};

    // number
    this.milliseconds = transformationObject.milliseconds;

    // an array of four functions
    this.easing = transformationObject.easing;

    // function
    this.callback = transformationObject.callback;

    // boolean
    this.waitForFinish = transformationObject.waitForFinish;
  }

  /**
   * Used to see if animations can be merged without interfering with each other.
   * @param {Transformation} otherTransformation 
   */
  canMergeWith(otherTransformation) {

    let animationsCompatible = true;

    let canMergeEasingMaps = (easingMap1, easingMap2)=>{
      easingMap1 = easingMap1 || [mina.linear, mina.linear, mina.linear, mina.linear];
      easingMap2 = easingMap2 || [mina.linear, mina.linear, mina.linear, mina.linear];
      let result = easingMap1.map((e, i)=>{
        return e == mina.linear || easingMap2[i] == mina.linear || e == easingMap2[i];
      }).reduce((a, b)=>{return a && b});
      return result;
    };
    
    if (!canMergeEasingMaps(this.easing, otherTransformation.easing)) {
      animationsCompatible = false;
    }
    
    for (let propertyName of Object.keys(this.propertyValueMap)) {
      if (this.propertyValueMap[propertyName] != undefined &&
          otherTransformation.propertyValueMap[propertyName] != undefined) {
        animationsCompatible = false;
      }
    }

    return animationsCompatible;

  }

}