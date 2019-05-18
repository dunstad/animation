class HexMoveQueue extends Animated {

  /**
   * Used to display the queued movements of a ControlledHexMover.
   * @param {Object} svgContainer 
   */
  constructor(svgContainer) {

    super(svgContainer.magicContainer());
    
    this.triangleGroup = new Animated(svgContainer.magicContainer());
    this.element.add(this.triangleGroup.element);
    
    this.moveQueue = [];
    
    this.indicator = svgContainer.defs().group();
    let circle = svgContainer.circle(20);
    this.indicator.add(circle);
    let triangle = svgContainer.polygon([0, 10, 20, 10, 10, 0]).attr({fill: 'white'});
    this.indicator.add(triangle);

  }

  /**
   * Used to add a move to the queue and a triangle to show it. 
   * @param {String} direction 
   */
  push(direction, duration) {

    duration = duration || 500;

    let directionToRotationMap = {
      'moveUp': 0,
      'moveUpRight': 60,
      'moveDownRight': 120,
      'moveDown': 180,
      'moveDownLeft': 240,
      'moveUpLeft':300,
    }

    let indicator = new Animated(svgContainer.use(this.indicator));
    indicator.rotation = directionToRotationMap[direction];
    indicator.direction = direction;
    
    this.triangleGroup.element.add(indicator.element);

    this.moveQueue.push(indicator);
    
    let quotient = Math.floor(this.triangleGroup.x / 40);
    indicator.x = -(quotient * 40) + (40 * this.moveQueue.length);
    indicator.scalar = 1;
    // TODO: figure out why processing here causes the tab to freeze
    // indicator.scalar = .025;
    // indicator.scale(1, duration).processOnce();

  }

  shift(duration) {

    let result = false;

    if (this.moveQueue.length) {

      duration = duration || 500;
  
      this.triangleGroup.moveX(this.triangleGroup.x - 40, duration).processOnce();
  
      let firstIndicator = this.moveQueue[0];
      firstIndicator.scale(.025, duration, {callback: ()=>{
        firstIndicator.element.remove();
      }}).processOnce();
  
      result = this.moveQueue.shift();

    }

    return result;

  }

}