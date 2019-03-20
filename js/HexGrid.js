class HexGrid extends Animated {
  
  constructor(svgContainer, width, height) {

    let gridGroup = svgContainer.group();
    
    super(gridGroup);

    const Hex = Honeycomb.extendHex({
      size: 20,
      orientation: 'flat',
    });
    const Grid = Honeycomb.defineGrid(Hex);
    // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
    const corners = Hex().corners();

    // render some hexes
    this.grid = Grid.rectangle({width: width, height: height});
    this.grid.forEach(hex => {
      
      const { x, y } = hex.toPoint();
      let hexagonCoords = corners.reduce((accumulator, current)=>{
        accumulator.push(current.x, current.y);
        return accumulator;
      }, []);
      
      let hexagon = svgContainer.polygon(hexagonCoords);
      hexagon.attr({
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
      }).transform(`t${x},${y}`);
      
      this.element.append(hexagon);
      
      hex.hexagon = hexagon;
      
    });

  }

}