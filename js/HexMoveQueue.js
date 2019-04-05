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

    // triangles are equilateral now... can't tell which way they're pointing
    let triangle = new Animated(svgContainer.polygon(20, 0, 10, Math.sqrt(3) * 10, 0, 0));
    triangle.rotation = directionToRotationMap[direction];
    triangle.direction = direction;

    this.triangleGroup.append(triangle.element);

    this.moveQueue.push(triangle);

    for (let triangle of this.moveQueue) {
      triangle.moveX(triangle.x + 40, 500).process();
    }

  }

}