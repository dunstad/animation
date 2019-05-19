class SquareGrid extends Animated {

  constructor(svgContainer, options) {

    super(svgContainer.magicContainer());

    this.grid = {};

    this.tileSize = 80;

  }

  tile(x, y, tile) {
    let result;
    if (!tile) {
      if (this.grid[x]) {
        result = this.grid[x][y];
      }
    }
    else {
      tile.grid = this.grid;
      if (!this.grid[x]) {
        this.grid[x] = {};
      }
      this.grid[x][y] = tile;
      this.element.add(tile.element);
      tile.x = x * this.tileSize;
      tile.y = y * this.tileSize;
      result = tile;
    }
    return result;
  }

  occupy(x, y, entity) {
    this.element.add(entity.element);
    let tile = this.tile(x, y);
    tile.occupy(entity);
    entity.x = tile.x + this.tileSize / 4;
    entity.y = tile.y + this.tileSize / 4;
  }

}