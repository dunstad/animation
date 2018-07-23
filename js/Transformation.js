class Transformation {

  constructor(transformationObject) {
    transformationObject = transformationObject || {};

    // {string: number, ...}
    this.propertyValueMap = transformationObject.propertyValueMap || {};

    // number
    this.milliseconds = transformationObject.milliseconds;

    // a map of properties to easing functions
    this.easingMap = transformationObject.easingMap || {};

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
      let result = !Object.keys(easingMap1).some((k)=>{
        return Object.keys(easingMap2).includes(k);
      });
      return result;
    };
    
    if (!canMergeEasingMaps(this.easingMap, otherTransformation.easingMap)) {
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