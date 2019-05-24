class Tile extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.rect(grid.tileSize, grid.tileSize));

    this.grid = grid;

    this.element.attr(options);

    this.occupied = false;

    this.element.node.addEventListener('click', ()=>{
      console.log(this.grid.game.GUI.selectedButton);
      if(this.grid.game.GUI.selectedButton) {
        // TODO: differentiate the buttons
        this.grid.game.player.placeCrystal(this.gridX, this.gridY);
      }
      else {
        this.grid.game.player.destination = {x: this.gridX, y: this.gridY};
      }
    });

  }

  get gridX() {
    return this.x / this.grid.tileSize;
  }
  
  get gridY() {
    return this.y / this.grid.tileSize;
  }

}