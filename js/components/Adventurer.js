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

    let swipeDirections = {
      controlUp: [-135, -45],
      controlDown: [45, 135],
      // controlLeft: [135, -135], // TODO: fix this deadzone
      controlLeft: [135, 180],
      controlRight: [-45, 45],
    };

    /**
     * Used to tell what direction a swipe was.
     * Range should be 2 numbers from -180 to 180, smallest first.
     * @param {Number} angle 
     * @param {Number[]} range 
     */
    function angleInRange(angle, range) {
      return ((angle >= range[0]) && (angle < range[1]));
    }

    hammer.on('swipe', (event)=>{
      for (let [eventName, range] of Object.entries(swipeDirections)) {
        if (angleInRange(event.angle, range)) {
          let controlEvent = new CustomEvent(eventName);
          this.element.node.dispatchEvent(controlEvent);
          break; // any swipe should only fall into exactly one of these ranges
        }
      }
    });

    this.element.node.addEventListener('controlUp', ()=>{
      this.move(this.tile.gridX, this.tile.gridY - 1);
    });
    this.element.node.addEventListener('controlDown', ()=>{
      this.move(this.tile.gridX, this.tile.gridY + 1);
    });
    this.element.node.addEventListener('controlLeft', ()=>{
      this.move(this.tile.gridX - 1, this.tile.gridY);
    });
    this.element.node.addEventListener('controlRight', ()=>{
      this.move(this.tile.gridX + 1, this.tile.gridY);
    });
    
  }

  move(x, y) {
    if (!this.grid.tile(x, y).occupied) {
      this.grid.occupy(x, y, this);
    }
  }

}