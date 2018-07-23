class Star extends Animated{

  constructor(svgContainer, points, fillColor, borderColor) {
    
    super(svgContainer.polygon(50,0, 21,90, 98,35, 2,35, 79,90).attr({ fill: "green", stroke: "green" }));

  }

}