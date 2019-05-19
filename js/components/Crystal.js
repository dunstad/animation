class Crystal extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.polygon([20, 0, 0, 40, 40, 40]));
    this.element.attr(options);

  }

}