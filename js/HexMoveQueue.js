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
  push(direction) {

    let directionToRotationMap = {
      'down': 0,
      'downLeft': 60,
      'upLeft': 120,
      'up': 180,
      'upRight': 240,
      'downRight':300,
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
    
    let duration = 500;
    indicator.x = 40 * this.moveQueue.length;
    indicator.scalar = 0;
    indicator.scale(1, duration).process();

  }

  shift() {

    let duration = 500;

    for (let indicator of this.moveQueue.slice(1)) {
      indicator.moveX(indicator.x - 40, duration).process();
    }

    let firstIndicator = this.moveQueue[0];
    firstIndicator.moveX(firstIndicator.x - 40, duration, {callback: ()=>{
      firstIndicator.remove();
    }}).scale(0, duration, {merge: 'start'}).process();

    return this.moveQueue.shift();

  }

}