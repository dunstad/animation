class Crystal extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.polygon([20, 0, 0, 40, 40, 40]));
    this.element.attr(options);

  }

  tick() {
    this.scalar = Math.min(1, this.scalar + .1);
  }

}