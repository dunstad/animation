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

    let moves = {
      moveUpLeft: {q: -1, r: 0},
      moveUp: {q: 0, r: -1},
      moveUpRight: {q: 1, r: -1},
      moveDownLeft: {q: -1, r: 1},
      moveDown: {q: 0, r: 1},
      moveDownRight: {q: 1, r: 0},
    }

    for (let [move, offsets] of Object.entries(moves)) {
      this[move] = this.makeMoveDirection(offsets.q, offsets.r);
    }

  }

  makeMoveDirection(qDelta, rDelta) {
    return ()=>{
      
      let currentAxial = this.hex.cube();
      let newAxial = {
        q: currentAxial.q + qDelta,
        r: currentAxial.r + rDelta,
      };
      
      let newHex = this.hex.hexgrid.axialGet(newAxial.q, newAxial.r);
      let result;
      if (newHex) {
        const { x, y } = newHex.toPoint();
        this.x = x;
        this.y = y;
        this.hex = newHex;
        result = newHex;
      }
      else {
        result = false;
      }
      return result;
    };
  }

}