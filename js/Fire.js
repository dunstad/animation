class Fire extends Animated {

  constructor(svgContainer, fillColor, borderColor) {

    // lets us pass two colors as an array to fill with a radial gradient
    if (Array.isArray(fillColor)) {
      fillColor = svgContainer.gradient(`r(0.5, 0.5, 0.25)${chroma(fillColor[0]).hex()}-${chroma(fillColor[1]).hex()}`);
    }

    let currentPath = Fire.makePath();

    super(svgContainer.path(currentPath).attr({fill: fillColor, stroke: borderColor}));

    this.currentPath = currentPath;
    this.newPath = Fire.makePath();
    this.interpolator = flubber.interpolate(this.currentPath, this.newPath, {maxSegmentLength: 2});
    this.ratio = 0;

    this.toStatus = this.makeAnimationHelper(this.toStatus);

  }

  /**
   * Generates path strings used to draw fires
   */
  static makePath() {

    let topX = 0;
    let topY = -50;
    
    let leftControlX = -15 - 35 * Math.random();
    let leftControlY = topY * Math.random();

    let pathString = `M 0 0 Q ${leftControlX} ${leftControlY} ${topX} ${topY}`;

    return pathString;

  }

  newPath() {

  }

  get status() {
    return this.ratio;
  }

  set status(ratio) {
    this.element.node.setAttribute('d', this.interpolator(ratio));
    this.ratio = ratio;
  }

  toStatus(ratio) {
    return {propertyValueMap: {status: ratio}};
  }

}