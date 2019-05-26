class Adventurer extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.magicContainer());

    this.grid = grid;

    let faceGroup = svgContainer.group();
    this.element.add(faceGroup);

    let face = svgContainer.circle(40, 40);
    face.attr(options);
    faceGroup.add(face);

    let eyeGroup = svgContainer.magicContainer();
    eyeGroup.x(10).y(20);
    faceGroup.add(eyeGroup);

    let leftEye = new Eye(svgContainer);
    leftEye.scalar = .125;
    eyeGroup.add(leftEye.element);
    
    let rightEye = new Eye(svgContainer);
    rightEye.scalar = .125;
    rightEye.x = 20;
    eyeGroup.add(rightEye.element);

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

    this.buildTargets = false;

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
    let xDirection = Math.sign(this.tile.gridX - x);
    let yDirection = Math.sign(this.tile.gridY - y);
    this.destination = {x: x - xDirection, y: y - yDirection};
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
        let drill = new Drill(svgContainer, this.grid, {fill: 'gray'});
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
        this.direction = false;
      }
      else if (!this.grid.tile(this.tile.gridX + xDirection, this.tile.gridY).occupied) {
        this.moveRelative(xDirection, 0);
      }
      else {
        this.moveRelative(0, yDirection);
      }

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