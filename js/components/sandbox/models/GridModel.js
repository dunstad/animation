if (module) {var Model = require('./Model');}

class GridModel extends Model {

  constructor() {
    
    super();
    
    this.state.grid = {};

    // used to simplify finding all the things to simulate
    this.entities = [];

  }

  tile(x, y, tile) {
    let result;
    if (!tile) {
      if (this.state.grid[x]) {
        result = this.state.grid[x][y];
      }
    }
    else {
      tile.grid = this;
      if (!this.state.grid[x]) {
        this.state.grid[x] = {};
      }
      this.state.grid[x][y] = tile;
      tile.x = x;
      tile.y = y;
      result = tile;
    }
    return result;
  }

  occupy(x, y, entity) {
    
    let tile = this.tile(x, y);
    if (tile.state.occupied) {
      this.entities.splice(this.entities.indexOf(tile.state.occupied), 1);
    }
    tile.state.occupied = entity;

    if (entity) {

      // separate function for putting them on the grid the first time?
      if (!this.entities.find(e=>e==entity)) {this.entities.push(entity);}

      if (entity.tile) {entity.tile.state.occupied = false;}
      entity.tile = tile;
      
      entity.x = tile.x;
      entity.y = tile.y;

    }
  }

  tick() {
    for (let entity of this.entities) {
      entity.tick();
    }
  }

  /**
   * Used to represent the grid as a string that can be sent over the network.
   */
  serialize() {
    let gridState = {};

    for (let [x, yObject] of Object.entries(this.state.grid)) {
      gridState[x] = {};
      for (let [y, tile] of Object.entries(yObject)) {
        try {
          gridState[x][y] = tile.state;
          if (tile.state.occupied) {
            tile.state.occupied = tile.state.occupied.state;
          }
        }
        catch {
          console.log(x, y, tile)
        }
      }
    }

    return JSON.stringify(gridState);
  }

}

if (module) {module.exports = GridModel;}