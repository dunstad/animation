class SquareGrid extends Animated {

  constructor(svgContainer, tileSize, options) {

    super(svgContainer.magicContainer());

    this.grid = {};

    this.tileSize = tileSize;

    // used to simplify finding all the things to simulate
    this.entities = [];

  }

  tile(x, y, tile) {
    let result;
    if (!tile) {
      if (this.grid[x]) {
        result = this.grid[x][y];
      }
    }
    else {
      tile.grid = this;
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

    // separate function for putting them on the grid the first time?
    if (!this.entities.find(e=>e==entity)) {this.entities.push(entity);}
    
    let tile = this.tile(x, y);
    if (tile.occupied) {
      tile.occupied.element.remove();
      this.entities.splice(this.entities.indexOf(tile.occupied), 1);
    }
    tile.occupied = entity;
    
    if (entity) {
      if (entity.tile) {entity.tile.occupied = false;}
      entity.tile = tile;
      
      entity.x = tile.x + this.tileSize / 4;
      entity.y = tile.y + this.tileSize / 4;
    }
  }

  tick() {

    for (let entity of this.entities) {
      entity.tick();
    }

  }

}