class Flame extends Animated {

  constructor(svgContainer, fillColor, borderColor) {

    // lets us pass two colors as an array to fill with a radial gradient
    if (Array.isArray(fillColor)) {
      fillColor = svgContainer.gradient('linear', (gradient)=>{
        gradient.stop(.75, chroma(fillColor[1]).hex());
        gradient.stop(1, chroma(fillColor[0]).hex());
      }).from(0, 0).to(0, 1);
    }

    let currentPath = Flame.makePath();

    super(svgContainer.magicContainer());
    this.path = svgContainer.path(currentPath).attr({fill: fillColor, stroke: borderColor});
    this.element.add(this.path);

    this.currentPath = currentPath;
    this.nextPath = Flame.makePath();
    this.interpolator = flubber.interpolate(this.currentPath, this.nextPath, {maxSegmentLength: 2});
    this.ratio = 0;

    this.toStatus = this.makeAnimationHelper(this.toStatus);

  }

  /**
   * Generates path strings used to draw fires
   */
  static makePath() {

    let flipFactor = Math.random() > .5 ? 1 : -1;

    let topX =  -15 * Math.random() * flipFactor;
    let topY = -50;

    let width = 50;
    
    let leftControlX = (-width * .15 - width * .7 * Math.random()) * flipFactor;
    let leftControlY = topY * .25 + (topY * .5) * Math.random();

    let rightControlCenterX = 0 * flipFactor;
    let rightControlCenterY = leftControlY;

    let rightControlTopX = leftControlX / 2;
    let rightControlTopY = (topY + rightControlCenterY) / 2;
    
    let pathString = `M 0 0 Q ${leftControlX} ${leftControlY} ${topX} ${topY} `;
    pathString += `Q ${rightControlTopX} ${rightControlTopY} ${rightControlCenterX} ${rightControlCenterY} `;
    pathString += `T ${0} ${0}`;

    return pathString;

  }

  newPath() {
    this.currentPath = this.nextPath;
    this.nextPath = Flame.makePath();
    this.interpolator = flubber.interpolate(this.currentPath, this.nextPath, {maxSegmentLength: 2});
    this.status = 0;
  }

  get status() {
    return this.ratio;
  }

  set status(ratio) {
    this.path.plot(this.interpolator(ratio));
    this.ratio = ratio;
  }

  toStatus(ratio) {
    return {propertyValueMap: {status: ratio}};
  }

}