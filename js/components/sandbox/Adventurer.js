class Adventurer extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.magicContainer());

    this.grid = grid;

    let headGroup = svgContainer.group();
    this.element.add(headGroup);

    let head = svgContainer.circle(40, 40);
    head.attr(options);
    headGroup.add(head);

    let eyeOptions = {
      whiteRadius: 0,
      irisRadius: 0,
      pupilRadius: 40,
      shape: 'circular',
    };
    let face = new Face(svgContainer, {eyeOptions: eyeOptions});
    face.leftEye.bottomEyelidOpen = 1;
    face.rightEye.bottomEyelidOpen = 1;
    window.face = face;
    face.x = -30;
    face.y = 20;
    face.scalar = .13;
    headGroup.add(face.element);

    let keys = {
      w: 'controlUp',
      a: 'controlLeft',
      s: 'controlDown',
      d: 'controlRight',
    };

    for (let [key, eventName] of Object.entries(keys)) {
      Mousetrap.bind(key, ()=>{
        let controlEvent = new CustomEvent(eventName);
        this.element.node.dispatchEvent(controlEvent);
      });
    }

    let hammer = new Hammer(svgContainer.node);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    hammer.on('swipeup', (event)=>{
      this.element.node.dispatchEvent(new CustomEvent('controlUp'));
    });
    
    hammer.on('swipedown', (event)=>{
      this.element.node.dispatchEvent(new CustomEvent('controlDown'));
    });
    
    hammer.on('swipeleft', (event)=>{
      this.element.node.dispatchEvent(new CustomEvent('controlLeft'));
    });
    
    hammer.on('swiperight', (event)=>{
      this.element.node.dispatchEvent(new CustomEvent('controlRight'));
    });

    this.element.node.addEventListener('controlUp', ()=>{
      this.destination = {x: this.tile.gridX, y: this.tile.gridY - 1};
    });
    this.element.node.addEventListener('controlDown', ()=>{
      this.destination = {x: this.tile.gridX, y: this.tile.gridY + 1};
    });
    this.element.node.addEventListener('controlLeft', ()=>{
      this.destination = {x: this.tile.gridX - 1, y: this.tile.gridY};
    });
    this.element.node.addEventListener('controlRight', ()=>{
      this.destination = {x: this.tile.gridX + 1, y: this.tile.gridY};
    });

    this.destination = false;

    this.buildTarget = false;

    this.inventory = {
      Crystal: 0,
      Drill: 0,
    }
    
  }

  move(x, y) {
    if (!this.grid.tile(x, y).occupied) {
      this.grid.occupy(x, y, this);
    }
  }

  moveRelative(x, y) {
    this.move(this.tile.gridX + x, this.tile.gridY + y);
  }

  moveNextTo(x, y) {

    if (this.distanceTo(x, y) == 1) {
      this.destination = false;
    }
    else {

      let xDirection = Math.sign(this.tile.gridX - x);
      let yDirection = Math.sign(this.tile.gridY - y);
  
      let xDistance = this.distanceTo(x + xDirection, y);
      let yDistance = this.distanceTo(x, y + yDirection);
  
      let xTileOccupied = this.grid.tile(x + xDirection, y).occupied;
      let yTileOccupied = this.grid.tile(x, y + yDirection).occupied;

      if (!xTileOccupied && xDirection) {
        this.destination = {x: x + xDirection, y: y};
      }
      else {
        this.destination = {x: x, y: y + yDirection};
      }

    }

  }

  build(name, x, y) {
    this.moveNextTo(x, y);
    this.buildTarget = {
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
      if (this.inventory.Crystal) {
        let crystal = new Crystal(svgContainer, this.grid, {
          fill: '#00FFF5',
          stroke: 'black',
          'stroke-width': 3,
        });
        this.grid.occupy(x, y, crystal);
        this.inventory.Crystal -= 1;
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
      if (this.inventory.Drill) {
        let drill = new Drill(svgContainer, this.grid, {
          fill: 'gray',
          stroke: 'black',
          'stroke-width': 3,
        });
        this.grid.occupy(x, y, drill);
        this.inventory.Drill -= 1;
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
      let entity = this.grid.tile(x, y).occupied;
      if (entity) {
        let entityName = entity.constructor.name;
        if (canPickUp.indexOf(entityName) != -1) {
          this.inventory[entityName] += 1;
          this.grid.occupy(x, y, false);
        }
      }
    }
  }

  tick() {

    // move towards destination
    if (this.destination) {
      
      let xDirection = Math.sign(this.destination.x - this.tile.gridX);
      let yDirection = Math.sign(this.destination.y - this.tile.gridY);
      
      if (xDirection == 0 && yDirection == 0) {
        this.destination = false;
      }
      else if (!this.grid.tile(this.tile.gridX + xDirection, this.tile.gridY).occupied) {
        this.moveRelative(xDirection, 0);
      }
      else {
        this.moveRelative(0, yDirection);
      }

    }

    if (this.buildTarget && !this.destination) {

      if (this.buildTarget.name == 'Crystal') {
        this.placeCrystal(this.buildTarget.x, this.buildTarget.y);
      }
      else if (this.buildTarget.name == 'Drill') {
        this.placeDrill(this.buildTarget.x, this.buildTarget.y);
      }
      else if (this.buildTarget.name == 'pickUp') {
        this.pickUp(this.buildTarget.x, this.buildTarget.y);
      }

      this.buildTarget = false;

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
      let tile = this.grid.tile(this.tile.gridX + coords[0], this.tile.gridY + coords[1]);
      if (tile && tile.occupied && tile.occupied.constructor.name == 'Drill') {
        this.inventory.Crystal += tile.occupied.crystals;
        tile.occupied.crystals = 0;
      }
    }

  }

}