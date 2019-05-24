class Adventurer extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.magicContainer());

    this.grid = grid;

    let faceGroup = svgContainer.group();
    this.element.add(faceGroup);

    let face = svgContainer.circle(40, 40);
    face.attr({fill: options.fill});
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
      this.nextAction = 'moveUp';
    });
    this.element.node.addEventListener('controlDown', ()=>{
      this.nextAction = 'moveDown';
    });
    this.element.node.addEventListener('controlLeft', ()=>{
      this.nextAction = 'moveLeft';
    });
    this.element.node.addEventListener('controlRight', ()=>{
      this.nextAction = 'moveRight';
    });

    // used to tell the board what the adventurer does on the next tick
    this.nextAction = '';

    this.actions = {
      '': ()=>{},
      'moveUp': ()=>{this.move(this.tile.gridX, this.tile.gridY - 1)},
      'moveDown': ()=>{this.move(this.tile.gridX, this.tile.gridY + 1)},
      'moveLeft': ()=>{this.move(this.tile.gridX - 1, this.tile.gridY)},
      'moveRight': ()=>{this.move(this.tile.gridX + 1, this.tile.gridY)},
    };

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

  distanceTo(x, y) {
    return Math.abs(this.tile.gridX - x) + Math.abs(this.tile.gridY - y);
  }

  placeCrystal(x, y) {
    if (this.distanceTo(x, y) == 1) {
      if (this.inventory.Crystal) {
        let crystal = new Crystal(svgContainer, this.grid, {fill: '#14ECE3'});
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

  tick() {
    this.actions[this.nextAction]();
    this.nextAction = '';

    // TODO: put this somewhere lots of entities can use it
    let directionToOffset = {
      'up': [0, -1],
      'right': [1, 0],
      'down': [0, 1],
      'left': [-1, 0],
    };

    for (let [direction, coords] of Object.entries(directionToOffset)) {
      let tile = this.grid.tile(this.tile.gridX + coords[0], this.tile.gridY + coords[1]);
      if (tile.occupied && tile.occupied.constructor.name == 'Drill') {
        this.inventory.Crystal += tile.occupied.crystals;
        tile.occupied.crystals = 0;
      }
    }

  }

}