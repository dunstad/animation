class Fire extends Animated {

  constructor(svgContainer, fillColor, borderColor) {

    // lets us pass two colors as an array to fill with a radial gradient
    if (Array.isArray(fillColor)) {
      fillColor = svgContainer.gradient(`r(0.5, 0.5, 0.25)${chroma(fillColor[0]).hex()}-${chroma(fillColor[1]).hex()}`);
    }

    let currentPath = Fire.makePath();

    super(svgContainer.path(currentPath).attr({fill: fillColor, stroke: borderColor}));

    this.currentPath = currentPath;
    this.nextPath = Fire.makePath();
    this.interpolator = flubber.interpolate(this.currentPath, this.nextPath, {maxSegmentLength: 2});
    this.ratio = 0;

    this.toStatus = this.makeAnimationHelper(this.toStatus);

  }

  /**
   * Generates path strings used to draw fires
   */
  static makePath() {

    let flipFactor = 1;

    let topX = 0 * flipFactor;
    let topY = -50;
    
    let leftControlX = (-15 - 35 * Math.random()) * flipFactor;
    let leftControlY = topY * .25 + (topY * .5) * Math.random();

    let rightControlCenterX = 0 * flipFactor;
    let rightControlCenterY = leftControlY;

    let rightControlTopX = leftControlX / 2;
    let rightControlTopY = (topY + rightControlCenterY) / 2;
    console.log(topY, rightControlCenterY);
    
    let pathString = `M 0 0 Q ${leftControlX} ${leftControlY} ${topX} ${topY} `;
    pathString += `Q ${rightControlTopX} ${rightControlTopY} ${rightControlCenterX} ${rightControlCenterY} `;
    pathString += `T ${0} ${0}`;

    console.log(pathString);
    return pathString;

  }

  newPath() {
    this.currentPath = this.nextPath;
    this.nextPath = Fire.makePath();
    this.interpolator = flubber.interpolate(this.currentPath, this.nextPath, {maxSegmentLength: 2});
    this.status = 0;
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