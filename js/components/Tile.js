class Tile extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.rect(grid.tileSize, grid.tileSize));

    this.grid = grid;

    this.element.attr(options);

    this.occupied = false;

    this.element.node.addEventListener('click', ()=>{
      let player = this.grid.game.player;
      let button = this.grid.game.GUI.selectedButton;
      if (button && button.label == 'Crystal') {
        player.placeCrystal(this.gridX, this.gridY);
      }
      else if (button && button.label == 'Drill') {
        player.placeDrill(this.gridX, this.gridY);
      }
      else if (button && button.label == 'cross') {
        player.pickUp(this.gridX, this.gridY);
      }
      else {
        player.destination = {x: this.gridX, y: this.gridY};
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