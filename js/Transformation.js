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

}