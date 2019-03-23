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
      strokeWidth: 2,
    }).transform(`t${x},${y}`);

    super(hexagon);

    hex.hexgrid.element.append(this.element);

    this.hex = hex;
    this.hex.occupied = true;

    let moves = {
      moveUpLeft: {q: -1, r: 0},
      moveUp: {q: 0, r: -1},
      moveUpRight: {q: 1, r: -1},
      moveDownLeft: {q: -1, r: 1},
      moveDown: {q: 0, r: 1},
      moveDownRight: {q: 1, r: 0},
    }

    for (let [move, offsets] of Object.entries(moves)) {
      this[move] = (milliseconds, config)=>{

        let currentAxial = this.hex.cube();
        let newAxial = {
          q: currentAxial.q + offsets.q,
          r: currentAxial.r + offsets.r,
        };
        
        let targetHex = hex.hexgrid.axialHex(newAxial.q, newAxial.r);
        let hexInGrid = this.hex.hexgrid.grid.includes(targetHex);
        let hexOccupied = hexInGrid && this.hex.hexgrid.grid.get(targetHex).occupied;
        if (!hexInGrid || hexOccupied) {

          // getting coordinates of spots outside the grid to fake-move to
          const { x, y } = targetHex.toPoint();
  
          let easingMap = {x: HexMover.failEasing, y: HexMover.failEasing};
          
          // need to clone config here because the same object is used
          // every time a key is pressed
          config = Object.assign({}, config);
          config.easingMap = Object.assign({}, easingMap);

        }

        else {
          this.hex.occupied = false;
          this.hex = this.hex.hexgrid.grid.get(targetHex);
          this.hex.occupied = true;
        }

        // i feel like modifying the animationhelper on the fly like this is
        // a bit messy, but it works for now i guess
        return (this.makeAnimationHelper(
          this.makeMoveDirection(targetHex)
        )).bind(this)(milliseconds, config);

      };
    }

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

  makeMoveDirection(targetHex) {
    return ()=>{
      
      const { x, y } = targetHex.toPoint();
      let result = {propertyValueMap: {x: x, y: y}};
      return result;

    };
  }

}