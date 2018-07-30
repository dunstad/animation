class Fire extends Animated {

  constructor(svgContainer, fillColor, borderColor) {

    // lets us pass two colors as an array to fill with a radial gradient
    if (Array.isArray(fillColor)) {
      fillColor = svgContainer.gradient(`r(0.5, 0.5, 0.25)${chroma(fillColor[0]).hex()}-${chroma(fillColor[1]).hex()}`);
    }

    super(svgContainer.path(Fire.makePath()).attr({fill: fillColor, stroke: borderColor}));

  }

  /**
   * Generates path strings used to draw fires
   */
  static makePath() {

    let startX = 0;
    let startY = 0;
    
    let twoPi = 2 * Math.PI;
    
    let pointX = startX + 50 * Math.sin(0);
    let pointY = startY - 50 * Math.cos(0);
    let pathString = `M ${pointX} ${pointY} `;

    for (let theta = (twoPi / 4); theta <= twoPi; theta += (twoPi / 4)) {
      
      pointX = startX + 50 * Math.sin(theta);
      pointY = startY - 50 * Math.cos(theta);

      pathString += `Q 0 0 ${pointX} ${pointY} `;

    }

    let pathString = `M 0, 0 Q`;

    return pathString;

  }

}