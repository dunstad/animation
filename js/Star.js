class Star extends Animated{

  constructor(svgContainer, numPoints, radius, fillColor, borderColor) {

    super(svgContainer.group());

    let points = [];
    let startX = 0;
    let startY = 0;

    let twoPi = 2 * Math.PI;

    let prevPointX = startX + radius * Math.sin(0);
    let prevPointY = startY - radius * Math.cos(0);

    for (let theta = 0; theta <= twoPi; theta += (twoPi / numPoints)) {
      
      let pointX = startX + radius * Math.sin(theta);
      let pointY = startY - radius * Math.cos(theta);

      this.element.append(svgContainer.path(`M ${prevPointX} ${prevPointY} Q 0 0 ${pointX} ${pointY}`));

      prevPointX = pointX;
      prevPointY = pointY;

    }

  }

}