class Drill extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.polygon([20, 0, 0, 40, 40, 40]));
    this.element.attr(options);
    
    let pattern = svgContainer.pattern(80, 10, (add)=>{
      let color = chroma('gray');
      let style = {stroke: chroma(color).darken(), 'stroke-width': 2, fill: 'transparent'};
      add.rect(80, 10).attr({fill: color});
      add.path('M 20 0 C 30 10 50 10 60 0').attr(style);
    });
    this.element.attr({fill: pattern})

    this.facingToRotation = {
      'up': 0,
      'right': 90,
      'down': 180,
      'left': 270,
    };

  }

  faceCrystal() {

  }

}