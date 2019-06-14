if (module) {
  var GridModel = require('../models/GridModel');
  var TileModel = require('../models/TileModel');
  var AdventurerModel = require('../models/AdventurerModel');
}

class Controller {

  constructor() {

    let grid = new GridModel();

    for (let x of [0, 1, 2, 3, 4, 5, 6]) {
      for (let y of [0, 1, 2, 3]) {
        grid.tile(x, y, new TileModel(grid));
      }
    }

    this.grid = grid;

  }

  addPlayer() {

    let adventurer = new AdventurerModel(this.grid);
    this.grid.occupy(1, 1, adventurer);

  }

}

if (module) {module.exports = Controller;}
