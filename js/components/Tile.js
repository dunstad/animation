class Tile extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.rect(grid.tileSize, grid.tileSize));

    this.grid = grid;

    this.element.attr(options);

    this.occupied = false;

  }

  occupy(entity) {
    this.occupied = entity;
    if (entity.tile) {entity.tile.occupied = false;}
    entity.tile = this;
  }

}