if (module) {var Model = require('./Model');}

class GridModel extends Model {

  constructor() {
    
    super();

    // used to simplify finding all the things to simulate
    this.entities = [];

  }

  tile(x, y, tile) {
    let result;
    if (!tile) {
      if (this.state[x]) {
        result = this.state[x][y];
      }
    }
    else {
      tile.grid = this;
      if (!this.state[x]) {
        this.state[x] = {};
      }
      this.state[x][y] = tile;
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

    for (let [x, yObject] of Object.entries(this.state)) {
      gridState[x] = {};
      for (let [y, tile] of Object.entries(yObject)) {
        console.log(tile)
        gridState[x][y] = tile.serialize();
      }
    }

    console.log(gridState)
    return JSON.stringify(gridState);
  }

}

if (module) {module.exports = GridModel;}