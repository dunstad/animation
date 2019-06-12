class AdventurerModel extends Model {

  constructor(grid) {

    super();

    this.state.grid = grid;
    this.state.destination = false;
    this.state.buildTarget = false;
    this.state.inventory = {
      Crystal: 0,
      Drill: 0,
    }

  }

  move(x, y) {
    if (!this.state.grid.tile(x, y).occupied) {
      this.state.grid.occupy(x, y, this);
    }
  }

  moveRelative(x, y) {
    this.move(this.tile.gridX + x, this.tile.gridY + y);
  }

  moveNextTo(x, y) {

    if (this.distanceTo(x, y) == 1) {
      this.state.destination = false;
    }
    else {

      let xDirection = Math.sign(this.tile.gridX - x);
      let yDirection = Math.sign(this.tile.gridY - y);
  
      let xDistance = this.distanceTo(x + xDirection, y);
      let yDistance = this.distanceTo(x, y + yDirection);
  
      let xTileOccupied = this.state.grid.tile(x + xDirection, y).occupied;
      let yTileOccupied = this.state.grid.tile(x, y + yDirection).occupied;

      if (!xTileOccupied && xDirection) {
        this.state.destination = {x: x + xDirection, y: y};
      }
      else {
        this.state.destination = {x: x, y: y + yDirection};
      }

    }

  }

  build(name, x, y) {
    this.moveNextTo(x, y);
    this.state.buildTarget = {
      x: x,
      y: y,
      name: name,
    };
  }

  distanceTo(x, y) {
    return Math.abs(this.tile.gridX - x) + Math.abs(this.tile.gridY - y);
  }

  placeCrystal(x, y) {
    if (this.distanceTo(x, y) == 1) {
      if (this.state.inventory.Crystal) {
        let crystal = new Crystal(svgContainer, this.state.grid, {
          fill: '#00FFF5',
          stroke: 'black',
          'stroke-width': 3,
        });
        this.state.grid.occupy(x, y, crystal);
        this.state.inventory.Crystal -= 1;
      }
      else {
        console.log('not enough crystals!');
      }
    }
    else {
      console.log('too far!');
    }
  }
  
  /**
   * TODO: make this and placeCrystal the same
   * @param {Number} x 
   * @param {Number} y 
   */
  placeDrill(x, y) {
    if (this.distanceTo(x, y) == 1) {
      if (this.state.inventory.Drill) {
        let drill = new Drill(svgContainer, this.state.grid, {
          fill: 'gray',
          stroke: 'black',
          'stroke-width': 3,
        });
        this.state.grid.occupy(x, y, drill);
        this.state.inventory.Drill -= 1;
      }
      else {
        console.log('not enough drills!');
      }
    }
    else {
      console.log('too far!');
    }
  }

  pickUp(x, y) {
    if (this.distanceTo(x, y) == 1) {
      let canPickUp = ['Crystal', 'Drill'];
      let entity = this.state.grid.tile(x, y).occupied;
      if (entity) {
        let entityName = entity.constructor.name;
        if (canPickUp.indexOf(entityName) != -1) {
          this.state.inventory[entityName] += 1;
          this.state.grid.occupy(x, y, false);
        }
      }
    }
  }

  tick() {

    // move towards destination
    if (this.state.destination) {
      
      let xDirection = Math.sign(this.state.destination.x - this.tile.gridX);
      let yDirection = Math.sign(this.state.destination.y - this.tile.gridY);
      
      if (xDirection == 0 && yDirection == 0) {
        this.state.destination = false;
      }
      else if (!this.state.grid.tile(this.tile.gridX + xDirection, this.tile.gridY).occupied) {
        this.moveRelative(xDirection, 0);
      }
      else {
        this.moveRelative(0, yDirection);
      }

    }

    if (this.state.buildTarget && !this.state.destination) {

      if (this.state.buildTarget.name == 'Crystal') {
        this.placeCrystal(this.state.buildTarget.x, this.state.buildTarget.y);
      }
      else if (this.state.buildTarget.name == 'Drill') {
        this.placeDrill(this.state.buildTarget.x, this.state.buildTarget.y);
      }
      else if (this.state.buildTarget.name == 'pickUp') {
        this.pickUp(this.state.buildTarget.x, this.state.buildTarget.y);
      }

      this.state.buildTarget = false;

    }

    // TODO: put this somewhere lots of entities can use it
    let directionToOffset = {
      'up': [0, -1],
      'right': [1, 0],
      'down': [0, 1],
      'left': [-1, 0],
    };

    // pick up crystals from nearby drills
    for (let [direction, coords] of Object.entries(directionToOffset)) {
      let tile = this.state.grid.tile(this.tile.gridX + coords[0], this.tile.gridY + coords[1]);
      if (tile && tile.occupied && tile.occupied.constructor.name == 'Drill') {
        this.state.inventory.Crystal += tile.occupied.crystals;
        tile.occupied.crystals = 0;
      }
    }

  }

}