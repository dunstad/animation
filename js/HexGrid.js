class HexGrid extends Animated {
  
  constructor(svgContainer, width, height) {

    let gridGroup = svgContainer.group();
    
    super(gridGroup);

    this.Hex = Honeycomb.extendHex({
      size: 20,
      orientation: 'flat',
    });
    const Grid = Honeycomb.defineGrid(this.Hex);
    // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
    
    const corners = this.Hex().corners();

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

  /**
   * Gets a hex using axial coordinates, which are much
   * easier to work with for hex grids than cartesian ones.
   * Not sure why this isn't implemented in honeycomb, but oh well.
   * 
   * This is how axial coordinates work in honeycomb:
   *        -r
   *  0,0  /
   * -q --/--- +q
   *     /
   *    +r
   * 
   * @param {Number} q 
   * @param {Number} r 
   */
  axialGet(q, r) {
    return this.grid.get(this.Hex().toCartesian({q: q, r: r}));
  }

}