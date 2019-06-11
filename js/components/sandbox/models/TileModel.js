class TileModel extends Model {

  constructor(grid) {
    
    super();

    this.state.grid = grid;
    this.state.occupied = false;

  }

}