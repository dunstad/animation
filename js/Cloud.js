class Cloud extends Animated {

  constructor(svgContainer, numArcs, length, fillColor, borderColor) {
    
    // lets us pass two colors as an array to fill with a linear gradient
    if (Array.isArray(fillColor)) {
      fillColor = svgContainer.gradient(`l(0,0,0,1)${chroma(fillColor[0]).hex()}-${chroma(fillColor[1]).hex()}`);
    }
    
    super(svgContainer.path(Cloud.makePath(numArcs, length)).attr({fill: fillColor, stroke: borderColor}));
    
  }

  /**
   * Generates path strings used to draw clouds
   * @param {number} numArcs
   * @param {number} length 
   */
  static makePath(numArcs, length) {

    let pathString = `M ${length} 0 `;

    

    return pathString;

  }

}