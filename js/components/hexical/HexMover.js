class HexMover extends Animated {
  
  constructor(svgContainer, hex, color) {

    let hexagonCoords = hex.corners().reduce((accumulator, current)=>{
      accumulator.push(current.x, current.y);
      return accumulator;
    }, []);

    const { x, y } = hex.toPoint();
    let hexagon = svgContainer.polygon(hexagonCoords);
    hexagon.attr({
      fill: color || 'pink',
      stroke: 'black',
      'stroke-width': 2,
    }).x(x).y(y);

    super(hexagon);

    hex.hexgrid.element.add(this.element);

    this.hex = hex;
    this.hex.occupied = this;

    let moves = {
      moveUpLeft: {q: -1, r: 0},
      moveUp: {q: 0, r: -1},
      moveUpRight: {q: 1, r: -1},
      moveDownLeft: {q: -1, r: 1},
      moveDown: {q: 0, r: 1},
      moveDownRight: {q: 1, r: 0},
    };

    for (let [move, offsets] of Object.entries(moves)) {
      this[move] = (milliseconds, config)=>{

        // need to clone config here because the same object is used
        // every time a key is pressed
        config = Object.assign({}, config);

        // need to run this as a callfront for when queueing animations
        let originalCallfront = config.callfront;
        config.callfront = (transformation)=>{

          originalCallfront && originalCallfront();

          let currentAxial = this.hex.cube();
          let newAxial = {
            q: currentAxial.q + offsets.q,
            r: currentAxial.r + offsets.r,
          };
          
          let targetHex = hex.hexgrid.axialHex(newAxial.q, newAxial.r);

          // reassign the propertyValueMap now that we know where the hexmover is
          const { x, y } = targetHex.toPoint();
          let newPropertyValueMap = {x: x, y: y};
          transformation.propertyValueMap = Object.assign(transformation.propertyValueMap, newPropertyValueMap);

          // change the animation and grid state based on
          // whether the move failed or not
          let hexInGrid = this.hex.hexgrid.grid.includes(targetHex);
          let hexOccupied = hexInGrid && this.hex.hexgrid.grid.get(targetHex).occupied;
          let moveFailed = !hexInGrid || hexOccupied;
          if (moveFailed) {

            // getting coordinates of spots outside the grid to fake-move to
            const { x, y } = targetHex.toPoint();
    
            let easingMap = {x: HexMover.failEasing, y: HexMover.failEasing};
            
            // need to clone easingMap here because the same object is used
            // every time a key is pressed
            transformation.easingMap = Object.assign({}, transformation.easingMap);
            // this way should avoid easings of other attributes getting overwritten
            transformation.easingMap = Object.assign(transformation.easingMap, easingMap);

          }

          else {

            this.hex.occupied = false;
            this.hex = this.hex.hexgrid.grid.get(targetHex);
            this.hex.occupied = true;
              
          }

          let moveEvent = new CustomEvent(move, {detail: {
            moveSuccess: !moveFailed,
          }});
          this.element.node.dispatchEvent(moveEvent);
          
        };
        
        // this propertyValueMap is filled in later by the callfront
        // this is necessary because we don't know where the hexmover
        // will be until the queue runs
        return this.wait(milliseconds, config);

      };
    }

  }

  /**
   * Used to allow various behaviours on move, including playing different notes
   * on failed and successful moves.
   * 
   * Currently supported events are moveUpLeft, moveUp, moveUpRight,
   * moveDownLeft, moveDown, and moveDownRight.
   * 
   * The callback has one event parameter that looks like this:
   * {detail: {moveSuccess: true}}
   * @param {String} eventName 
   * @param {Function} callback 
   */
  on(eventName, callback) {
    this.element.node.addEventListener(eventName, callback);
  }

  static failEasing (n) {
    let result;
    if (n < .5) {
      result = n / 4;
    }
    else {
      result = .25 - (n / 4);
    }
    return result;
  };

}