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

}