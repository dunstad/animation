if (module) {var Model = require('./Model');}

class TileModel extends Model {

  constructor(grid) {
    
    super();

    this.grid = grid;
    this.state.occupied = false;

  }

}

if (module) {module.exports = TileModel;}