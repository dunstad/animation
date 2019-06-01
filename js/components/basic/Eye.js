class Eye extends Animated {

  /**
   * Used to set the appearance of the eye.
   * @param {*} svgContainer 
   * @param {Object} options
   * @param {Number} options.whiteRadius
   * @param {Number} options.irisRadius
   * @param {Number} options.pupilRadius
   * @param {String} options.whiteColor
   * @param {String} options.irisColor
   * @param {String} options.pupilColor
   */
  constructor(svgContainer, options) {
    // whiteRadius, irisRadius, pupilRadius, whiteColor, irisColor, pupilColor
    options = options || {};
  
    super(svgContainer.magicContainer());
    
    let eyeGroup = svgContainer.group();
    this.element.add(eyeGroup);

    let whiteRadius = (options.whiteRadius === undefined) ? 50 : options.whiteRadius;
    let white = svgContainer.circle(whiteRadius * 2).x(-whiteRadius).y(-whiteRadius);
    white.attr({
      fill: options.whiteColor || 'white',
    });
    eyeGroup.add(white);

    let irisGroup = svgContainer.group();
    eyeGroup.add(irisGroup);
    
    let irisRadius = (options.irisRadius === undefined) ? 20 : options.irisRadius;
    let iris = svgContainer.circle(irisRadius * 2).x(-irisRadius).y(-irisRadius);
    iris.attr({
      fill: options.irisColor || 'saddlebrown',
    });
    irisGroup.add(iris);
    
    let pupilRadius = (options.pupilRadius === undefined) ? 10 : options.pupilRadius;
    let pupil = svgContainer.circle(pupilRadius * 2).x(-pupilRadius).y(-pupilRadius);
    pupil.attr({
      fill: options.pupilColor || 'black',
    });
    irisGroup.add(pupil);
    
    let maxRadius = Math.max(whiteRadius, irisRadius, pupilRadius);

    let clipGroup = svgContainer.clip();

    let topEyelid, bottomEyelid;
    if (options.shape == 'circular') {

      topEyelid = svgContainer.path(`M ${-maxRadius} 0 A ${maxRadius} ${maxRadius} 0 0 1 ${maxRadius} 0`);
      bottomEyelid = svgContainer.path(`M ${-maxRadius} 0 A ${maxRadius} ${maxRadius} 0 0 1 ${maxRadius} 0`);
      
    }
    
    else {
      
      let topControlPointY = -maxRadius / 2;
      topEyelid = svgContainer.path(`M ${-maxRadius} 0 C ${-maxRadius / 2} ${topControlPointY}, ${maxRadius / 2} ${topControlPointY}, ${maxRadius} 0`);
      
      let bottomControlPointY = maxRadius / 2;
      bottomEyelid = svgContainer.path(`M ${-maxRadius} 0 C ${-maxRadius / 2} ${bottomControlPointY}, ${maxRadius / 2} ${bottomControlPointY}, ${maxRadius} 0`);
      
    }
    
    topEyelid.attr({fill: 'white'});
    clipGroup.add(topEyelid);

    bottomEyelid.attr({fill: 'white'});
    clipGroup.add(bottomEyelid);

    this.element.clipWith(clipGroup);

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
    this.eyeGroup.transform({rotate: this.angle});
  }

  get lookMagnitude() {
    return this.magnitude;
  }

  set lookMagnitude(magnitude) {
    this.magnitude = magnitude;
    // translateX works relative to parent, .x() seems to be absolute
    this.irisGroup.transform({translateX: (this.radius / 100.0) * this.magnitude});
  }

  /**
   * Animate looking in a direction.
   * @param {Number} angle 0-360
   * @param {Number} magnitude 0-100
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
    this.topEyelid.plot(this.newPath(ratio, true));
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
    this.bottomEyelid.plot(this.newPath(ratio, false));
  }

  /**
   * Animate moving the bottom eyelid.
   * @param {Number} ratio 
   */
  openBottom(ratio) {
    return {propertyValueMap: {bottomEyelidOpen: ratio}};
  }

}