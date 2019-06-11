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
        player.build('Crystal', this.gridX, this.gridY);
      }
      else if (button && button.label == 'Drill') {
        player.build('Drill', this.gridX, this.gridY);
      }
      else if (button && button.label == 'cross') {
        player.build('pickUp', this.gridX, this.gridY);
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

  /**
   * Used to represent the tile as a string that can be sent over the network.
   */
  serialize() {
    // might need gridX and gridY to not depend on the visual representation...
    let tileState = {
      x: this.gridX,
      y: this.gridY,
    }
    return JSON.stringify(tileState);
  }

}