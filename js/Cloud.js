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

    let pathString = `M 0 0 `;

    let xPoints = [];

    let arcLength = length / numArcs;
    for (let i = 0; i < numArcs; i++) {
      xPoints.push(arcLength * (i + 1));
    }

    for (let i = 0; i < xPoints.length; i++) {
      let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      xPoints[i] += (Math.random() * (length * .075) * plusOrMinus);
    }

    xPoints.sort((a, b) => a - b);
    console.log(xPoints)

    for (let i = 0; i <= numArcs; i++) {
      pathString += `A ${length / (numArcs * 2)} ${length / (numArcs * 2)} 0 0 1 ${xPoints[i]} 0 `;
    }
    
    pathString += `C ${length + (length * 1.5 / numArcs)} ${length * 2 / numArcs} ${-length * 1.5 / numArcs} ${length * 2 / numArcs} 0 0`;

    return pathString;

  }

}