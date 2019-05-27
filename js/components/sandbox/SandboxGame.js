class SandboxGame {
  constructor(options) {
    
    this.grid = new SquareGrid(options.svgContainer, 80);
    this.grid.game = this;
    
    this.GUI = new SandboxGUI();
    this.GUI.game = this;

  }
}