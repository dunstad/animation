class Star extends Animated {

  constructor(svgContainer, numPoints, radius, fillColor, borderColor) {
    
    // lets us pass two colors as an array to fill with a radial gradient
    if (Array.isArray(fillColor)) {
      fillColor = svgContainer.gradient(`r(0.5, 0.5, 0.25)${chroma(fillColor[0]).hex()}-${chroma(fillColor[1]).hex()}`);
    }
    
    super(svgContainer.path(Star.makePath(numPoints, radius)).attr({fill: fillColor, stroke: borderColor}));
    
    this.numPoints = numPoints;
    
    this.radius = radius;
    this.toPoints = this.makeAnimationHelper(this.toPoints);

  }

  /**
   * Generates path strings used to draw stars, and to animate the number of points
   * @param {number} numPoints 
   * @param {number} radius 
   */
  static makePath(numPoints, radius) {

    let startX = 0;
    let startY = 0;
    
    let twoPi = 2 * Math.PI;
    
    let pointX = startX + radius * Math.sin(0);
    let pointY = startY - radius * Math.cos(0);
    let pathString = `M ${pointX} ${pointY} `;

    for (let theta = (twoPi / numPoints); theta <= twoPi; theta += (twoPi / numPoints)) {
      
      pointX = startX + radius * Math.sin(theta);
      pointY = startY - radius * Math.cos(theta);

      pathString += `Q 0 0 ${pointX} ${pointY} `;

    }

    return pathString;

  }

  get points() {
    return this.numPoints;
  }

  set points(numPoints) {
    let remainder = numPoints % 1;
    let newPathString = flubber.interpolate(Star.makePath(Math.floor(numPoints), this.radius), Star.makePath(Math.floor(numPoints) + 1, this.radius))(remainder);
    this.element.node.setAttribute('d', newPathString);
    this.numPoints = numPoints;
  }

  toPoints(numPoints) {
    return {propertyValueMap: {points: numPoints}};
  }

}