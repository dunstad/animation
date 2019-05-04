class HexMoveQueue extends Animated {

  /**
   * Used to display the queued movements of a ControlledHexMover.
   * @param {Object} svgContainer 
   */
  constructor(svgContainer) {

    super(svgContainer.nested());
    this.element.attr({overflow: 'visible'});
    
    this.triangleGroup = new Animated(svgContainer.nested());
    this.triangleGroup.element.attr({overflow: 'visible'});
    this.element.add(this.triangleGroup.element);
    
    this.moveQueue = [];
    
    this.indicator = svgContainer.defs().nested();
    this.indicator.attr({overflow: 'visible'});
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
      'moveDown': 0,
      'moveDownLeft': 60,
      'moveUpLeft': 120,
      'moveUp': 180,
      'moveUpRight': 240,
      'moveDownRight':300,
    }

    let indicator = new Animated(svgContainer.use(this.indicator));
    indicator.rotation = directionToRotationMap[direction];
    indicator.direction = direction;
    
    this.triangleGroup.element.add(indicator.element);

    this.moveQueue.push(indicator);
    
    let quotient = Math.floor(this.triangleGroup.x / 40);
    indicator.x = -(quotient * 40) + (40 * this.moveQueue.length);
    indicator.scalar = 0;
    indicator.scale(1, duration).process();

  }

  shift(duration) {

    let result = false;

    if (this.moveQueue.length) {

      duration = duration || 500;
  
      // for (let indicator of this.moveQueue.slice(1)) {
      //   indicator.moveX(indicator.x - 40, duration).process();
      // }
  
      // let firstIndicator = this.moveQueue[0];
      // firstIndicator.moveX(firstIndicator.x - 40, duration, {callback: ()=>{
      //   firstIndicator.element.remove();
      // }}).scale(0, duration, {merge: 'start'}).process();
      
      this.triangleGroup.moveX(this.triangleGroup.x - 40, duration).process();
  
      let firstIndicator = this.moveQueue[0];
      firstIndicator.scale(1e-6, duration, {callback: ()=>{
        firstIndicator.element.remove();
      }}).process();
  
      result = this.moveQueue.shift();

    }

    return result;

  }

}