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

    let white = svgContainer.circle(0, 0, whiteRadius || 50);
    white.attr({
      fill: whiteColor || 'white',
    });
    this.element.append(white);
    
    let iris = svgContainer.circle(0, 0, irisRadius || 20);
    iris.attr({
      fill: irisColor || 'saddlebrown',
    });
    this.element.append(iris);
    
    let pupil = svgContainer.circle(0, 0, pupilRadius || 10);
    pupil.attr({
      fill: pupilColor || 'black',
    });
    this.element.append(pupil);

    let maxRadius = Math.max(whiteRadius, irisRadius, pupilRadius);

    let eyeClip = svgContainer.circle(0, 0, maxRadius);
    eyeClip.attr({fill: 'white'});
    this.element.append(eyeClip);

    this.element.attr({mask: eyeClip});

    let darkMoon = svgContainer.circle(0, 0, maxRadius);
    darkMoon.attr({fill: 'black', opacity: 1});
    this.element.append(darkMoon);

    this.phaseRatio = 0;
    this.darkMoon = darkMoon;
    this.darkMoon.transform(`t${maxRadius * 2},0`);

    this.radius = maxRadius;

    this.toPhase = this.makeAnimationHelper(this.toPhase);

  }

  get phase() {
    return this.phaseRatio;
  }

  set phase(ratio) {
    ratio = ratio % 1;
    this.darkMoon.transform(`t0,${this.radius * 4 * ratio - this.radius * 2}`);
    this.phaseRatio = ratio;
  }

  toPhase(ratio) {
    return {propertyValueMap: {phase: ratio}};
  }
  
}