class Tile extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.rect(grid.tileSize, grid.tileSize));

    this.grid = grid;

    this.element.attr(options);

    this.occupied = false;

    this.element.node.addEventListener('click', ()=>{
      console.log(this.gridX, this.gridY);
    });

  }

  get gridX() {
    return this.x / this.grid.tileSize;
  }
  
  get gridY() {
    return this.y / this.grid.tileSize;
  }

}