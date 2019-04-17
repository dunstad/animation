class HexMoveQueue extends Animated {

  /**
   * Used to display the queued movements of a ControlledHexMover.
   * @param {Object} svgContainer 
   */
  constructor(svgContainer) {

    super(svgContainer.group());

    this.triangleGroup = svgContainer.group();
    this.element.append(this.triangleGroup);

    this.moveQueue = [];

  }

  /**
   * Used to add a move to the queue and a triangle to show it. 
   * @param {String} direction 
   */
  push(direction, duration) {

    duration = duration || 500;

    let directionToRotationMap = {
      'moveDown': 0,
      'moveDownLeft': 60,
      'moveUpLeft': 120,
      'moveUp': 180,
      'moveUpRight': 240,
      'moveDownRight':300,
    }

    let indicator = new Animated(svgContainer.group());
    indicator.rotation = directionToRotationMap[direction];
    indicator.direction = direction;
    
    let circle = svgContainer.circle(0, 0, 10);
    indicator.element.append(circle);

    let triangle = svgContainer.polygon(-10, 0, 0, 10, 10, 0).attr({fill: 'white'});
    indicator.element.append(triangle);

    this.triangleGroup.append(indicator.element);

    this.moveQueue.push(indicator);
    
    indicator.x = 40 * this.moveQueue.length;
    indicator.scalar = 0;
    indicator.scale(1, duration).process();

  }

  shift(duration) {

    let result = false;

    if (this.moveQueue.length) {

      duration = duration || 500;
  
      for (let indicator of this.moveQueue.slice(1)) {
        indicator.moveX(indicator.x - 40, duration).process();
      }
  
      let firstIndicator = this.moveQueue[0];
      firstIndicator.moveX(firstIndicator.x - 40, duration, {callback: ()=>{
        firstIndicator.element.remove();
      }}).scale(0, duration, {merge: 'start'}).process();
  
      result = this.moveQueue.shift();

    }

    return result;

  }

}