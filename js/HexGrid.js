class HexGrid extends Animated {
  
  constructor(svgContainer, width, height) {

    let gridGroup = svgContainer.group();
    
    super(gridGroup);

    const Hex = Honeycomb.extendHex({size: 20});
    const Grid = Honeycomb.defineGrid(Hex);
    // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
    const corners = Hex().corners();

    // const hexSymbol = draw.symbol()
      // // map the corners' positions to a string and create a polygon
      // .polygon(corners.map(({ x, y }) => `${x},${y}`))
      // .fill('none')
      // .stroke({ width: 1, color: '#999' })

    // render 10,000 hexes
    Grid.rectangle({width: width, height: height}).forEach(hex => {
      const { x, y } = hex.toPoint();
      // draw some hexagons
      // draw.use(hexSymbol).translate(x, y)
    });

  }

}