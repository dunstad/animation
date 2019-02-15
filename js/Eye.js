class Eye extends Animated {

  /**
   * Used to set the appearance of the eye.
   * @param {*} svgContainer 
   * @param {Number} whiteRadius 
   * @param {Number} irisRadius 
   * @param {Number} pupilRadius 
   * @param {String} whiteColor 
   * @param {String} irisColor 
   * @param {String} pupilColor 
   */
  constructor(svgContainer, whiteRadius, irisRadius, pupilRadius, whiteColor, irisColor, pupilColor) {
  
    super(svgContainer.group());

    let eyeGroup = svgContainer.group();
    this.element.append(eyeGroup);

    let white = svgContainer.circle(0, 0, whiteRadius || 50);
    white.attr({
      fill: whiteColor || 'white',
    });
    eyeGroup.append(white);

    let irisGroup = svgContainer.group();
    eyeGroup.append(irisGroup);
    
    let iris = svgContainer.circle(0, 0, irisRadius || 20);
    iris.attr({
      fill: irisColor || 'saddlebrown',
    });
    irisGroup.append(iris);
    
    let pupil = svgContainer.circle(0, 0, pupilRadius || 10);
    pupil.attr({
      fill: pupilColor || 'black',
    });
    irisGroup.append(pupil);

    let maxRadius = Math.max(whiteRadius, irisRadius, pupilRadius);

    let maskGroup = svgContainer.group();
    this.element.append(maskGroup);

    let topControlPointY = -maxRadius / 2;
    let topEyelid = svgContainer.path(`M ${-maxRadius} 0 C ${-maxRadius / 2} ${topControlPointY}, ${maxRadius / 2} ${topControlPointY}, ${maxRadius} 0`);
    topEyelid.attr({fill: 'white'});
    maskGroup.append(topEyelid);
    
    let bottomControlPointY = maxRadius / 2;
    let bottomEyelid = svgContainer.path(`M ${-maxRadius} 0 C ${-maxRadius / 2} ${bottomControlPointY}, ${maxRadius / 2} ${bottomControlPointY}, ${maxRadius} 0`);
    bottomEyelid.attr({fill: 'white'});
    maskGroup.append(bottomEyelid);

    this.element.attr({mask: maskGroup});

    this.radius = maxRadius;

    this.look = this.makeAnimationHelper(this.look);

    this.angle = 0;
    this.magnitude = 0;
    this.irisGroup = irisGroup;
    this.eyeGroup = eyeGroup;

  }

  get lookAngle() {
    return this.angle;
  }

  set lookAngle(angle) {
    this.angle = angle % 360;
    this.eyeGroup.transform(`r${this.angle}`);
  }

  get lookMagnitude() {
    return this.magnitude;
  }

  set lookMagnitude(magnitude) {
    this.magnitude = magnitude;
    this.irisGroup.transform(`t${(this.radius / 100.0) * this.magnitude},0`);
  }

  /**
   * Animate to look in a direction.
   * @param {Number} angle 
   * @param {Number} magnitude 
   */
  look(angle, magnitude) {
    return {propertyValueMap: {lookAngle: angle, lookMagnitude: magnitude}};
  }

}