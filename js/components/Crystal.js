class Crystal extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.polygon([20, 0, 0, 40, 40, 40]));
    this.element.attr(options);
    this.grid = grid;

  }

  tick() {
    if (this.scalar <= .2) {
      this.grid.occupy(this.tile.gridX, this.tile.gridY, false);
    }
    else {
      this.scalar = Math.min(1.9, this.scalar + .05);
    }
  }

}