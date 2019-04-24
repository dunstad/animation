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
    this.element.add(eyeGroup);

    whiteRadius = whiteRadius || 50;
    let white = svgContainer.circle(whiteRadius * 2).x(-whiteRadius).y(-whiteRadius);
    white.attr({
      fill: whiteColor || 'white',
    });
    eyeGroup.append(white);

    let irisGroup = svgContainer.group();
    eyeGroup.append(irisGroup);
    
    irisRadius = irisRadius || 20;
    let iris = svgContainer.circle(irisRadius * 2).x(-irisRadius).y(-irisRadius);
    iris.attr({
      fill: irisColor || 'saddlebrown',
    });
    irisGroup.append(iris);
    
    pupilRadius = pupilRadius || 10;
    let pupil = svgContainer.circle(pupilRadius * 2).x(-pupilRadius).y(-pupilRadius);
    pupil.attr({
      fill: pupilColor || 'black',
    });
    irisGroup.append(pupil);

    let maxRadius = Math.max(whiteRadius, irisRadius, pupilRadius);

    let maskGroup = svgContainer.group();
    this.element.add(maskGroup);

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
    this.openTop = this.makeAnimationHelper(this.openTop);
    this.openBottom = this.makeAnimationHelper(this.openBottom);

    this.angle = 0;
    this.magnitude = 0;
    this.irisGroup = irisGroup;
    this.eyeGroup = eyeGroup;

    this.topOpen = .5;
    this.bottomOpen = .5;
    this.topEyelid = topEyelid;
    this.bottomEyelid = bottomEyelid;

  }

  get lookAngle() {
    return this.angle;
  }

  set lookAngle(angle) {
    this.angle = angle % 360;
    this.eyeGroup.rotate(this.angle);
  }

  get lookMagnitude() {
    return this.magnitude;
  }

  set lookMagnitude(magnitude) {
    this.magnitude = magnitude;
    this.irisGroup.x((this.radius / 100.0) * this.magnitude);
  }

  /**
   * Animate looking in a direction.
   * @param {Number} angle 
   * @param {Number} magnitude 
   */
  look(angle, magnitude) {
    return {propertyValueMap: {lookAngle: angle, lookMagnitude: magnitude}};
  }

  /**
   * Generate a new pathstring for the eyelids.
   * @param {Number} ratio 
   * @param {Boolean}} isTop 
   */
  newPath(ratio, isTop) {
    let modifier = isTop ? -1 : 1;
    let controlPoint = modifier * this.radius * ratio;
    let pathString = `M ${-this.radius} 0 C ${-this.radius / 2} ${controlPoint}, ${this.radius / 2} ${controlPoint}, ${this.radius} 0`;
    return pathString;
  }

  get topEyelidOpen() {
    return this.topOpen;
  }

  set topEyelidOpen(ratio) {
    this.topOpen = ratio;
    this.topEyelid.attr({d: this.newPath(ratio, true)});
  }

  /**
   * Animate moving the top eyelid.
   * @param {Number} ratio 
   */
  openTop(ratio) {
    return {propertyValueMap: {topEyelidOpen: ratio}};
  }

  get bottomEyelidOpen() {
    return this.bottomOpen;
  }

  set bottomEyelidOpen(ratio) {
    this.bottomOpen = ratio;
    this.bottomEyelid.attr({d: this.newPath(ratio, false)});
  }

  /**
   * Animate moving the bottom eyelid.
   * @param {Number} ratio 
   */
  openBottom(ratio) {
    return {propertyValueMap: {bottomEyelidOpen: ratio}};
  }

}