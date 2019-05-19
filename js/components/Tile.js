class Tile extends Animated {

  constructor(svgContainer, options) {

    super(svgContainer.rect(80, 80));

    this.element.attr(options);

  }

}