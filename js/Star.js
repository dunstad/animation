class Star extends Animated{

  constructor(svgContainer, numPoints, radius, fillColor, borderColor) {

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

    if (Array.isArray(fillColor)) {
      fillColor = svgContainer.gradient(`r(0.5, 0.5, 0.25)${chroma(fillColor[0]).hex()}-${chroma(fillColor[1]).hex()}`);
    }

    super(svgContainer.path(pathString).attr({fill: fillColor, stroke: borderColor, 'fill-rule': 'evenodd'}));

  }

}