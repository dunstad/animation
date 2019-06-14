let GridModel = require('./js/components/sandbox/models/GridModel');
let TileModel = require('./js/components/sandbox/models/TileModel');
let AdventurerModel = require('./js/components/sandbox/models/AdventurerModel');

let grid = new GridModel();

for (let x of [0, 1, 2, 3, 4, 5, 6]) {
  for (let y of [0, 1, 2, 3]) {
    grid.tile(x, y, new TileModel(grid));
  }
}

let adventurer = new AdventurerModel(grid);

grid.occupy(1, 1, adventurer);