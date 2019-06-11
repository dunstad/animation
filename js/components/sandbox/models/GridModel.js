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
      this.element.add(tile.element);
      tile.x = x;
      tile.y = y;
      result = tile;
    }
    return result;
  }

  occupy(x, y, entity) {
    
    this.element.add(entity.element);

    let tile = this.tile(x, y);
    if (tile.occupied) {
      tile.occupied.element.remove();
      this.entities.splice(this.entities.indexOf(tile.occupied), 1);
    }
    tile.occupied = entity;

    if (entity) {

      // separate function for putting them on the grid the first time?
      if (!this.entities.find(e=>e==entity)) {this.entities.push(entity);}

      if (entity.tile) {entity.tile.occupied = false;}
      entity.tile = tile;
      
      entity.x = tile.x;
      entity.y = tile.y;

      // make sure clicking the entities is the same as clicking the tile they stand on
      entity.element.node.addEventListener('click', ()=>{
        entity.tile.element.node.dispatchEvent(new Event('click'));
      });

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
        gridState[x][y] = tile.serialize();
      }
    }

    console.log(gridState)
    return JSON.stringify(gridState);
  }

}