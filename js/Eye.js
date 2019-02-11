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

  }
  
}