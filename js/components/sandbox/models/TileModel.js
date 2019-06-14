if (module) {var Model = require('./Model');}

class TileModel extends Model {

  constructor(grid) {
    
    super();

    this.grid = grid;
    this.state.occupied = false;

  }

  serialize() {
    let tileState = Object.assign({}, this.state);
    if (tileState.occupied) {
      tileState.occupied = tileState.occupied.state;
    }
    return JSON.stringify(tileState);
  }

}

if (module) {module.exports = TileModel;}