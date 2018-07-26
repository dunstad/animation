class Cloud extends Animated {

  constructor(svgContainer, numBumps, length, fillColor, borderColor) {
    
    // lets us pass two colors as an array to fill with a linear gradient
    if (Array.isArray(fillColor)) {
      fillColor = svgContainer.gradient(`l(0,0,0,1)${chroma(fillColor[0]).hex()}-${chroma(fillColor[1]).hex()}`);
    }
    
    super(svgContainer.path(Cloud.makePath(numBumps, length)).attr({fill: fillColor, stroke: borderColor}));

    this.numBumps = numBumps;

    this.length = length;
    this.toBumps = this.makeAnimationHelper(this.toBumps);

    this.forms = [];

    this.forms[numBumps] = this.element.node.getAttribute('d');
    
  }

  /**
   * Generates path strings used to draw clouds, and animate the number of bumps
   * @param {number} numBumps
   * @param {number} length 
   */
  static makePath(numBumps, length) {

    let pathString = `M 0 0 `;

    let xPoints = [];

    let arcLength = length / numBumps;
    for (let i = 0; i < numBumps; i++) {
      xPoints.push(arcLength * (i + 1));
    }

    for (let i = 0; i < xPoints.length; i++) {
      let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      xPoints[i] += (Math.random() * (length * .075) * plusOrMinus);
    }

    xPoints.push(length);
    xPoints.sort((a, b) => a - b);

    for (let i = 0; i <= numBumps; i++) {
      pathString += `A ${length / (numBumps * 2)} ${length / (numBumps * 2)} 0 0 1 ${xPoints[i]} 0 `;
    }
    
    pathString += `C ${length + (length * 2.5 / numBumps)} ${length * 2 / numBumps} ${-length * 2.5 / numBumps} ${length * 2 / numBumps} 0 0`;

    return pathString;

  }

  get bumps() {
    return this.numBumps;
  }

  set bumps(numBumps) {
    let remainder = numBumps % 1;
    if (!this.forms[Math.floor(numBumps)]) {
      this.forms[Math.floor(numBumps)] = Cloud.makePath(Math.floor(numBumps), this.length);
    }
    if (!this.forms[Math.floor(numBumps + 1)]) {
      this.forms[Math.floor(numBumps) + 1] = Cloud.makePath(Math.floor(numBumps), this.length);
    }
    let newPathString = flubber.interpolate(this.forms[Math.floor(numBumps)], this.forms[Math.floor(numBumps) + 1])(remainder);
    this.element.node.setAttribute('d', newPathString);
    this.numBumps = numBumps;
  }

  toBumps(numBumps) {
    return {propertyValueMap: {bumps: numBumps}};
  }


}