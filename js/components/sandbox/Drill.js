class Drill extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.polygon([20, 0, 0, 40, 40, 40]));
    this.element.attr(options);

    this.grid = grid;
    
    let pattern = svgContainer.pattern(80, 10, (add)=>{
      let color = chroma('#9E9E9E');
      let style = {stroke: chroma(color).darken(), 'stroke-width': 2, fill: 'transparent'};
      add.rect(80, 10).attr({fill: color});
      add.path('M 20 0 C 30 10 50 10 60 0').attr(style);
    });
    this.element.attr({fill: pattern});

    this.facingCrystal = false;
    this.crystals = 0;

  }

  faceCrystal() {

    let facingToRotation = {
      'up': 0,
      'right': 90,
      'down': 180,
      'left': 270,
    };

    let directionToOffset = {
      'up': [0, -1],
      'right': [1, 0],
      'down': [0, 1],
      'left': [-1, 0],
    };

    for (let [direction, coords] of Object.entries(directionToOffset)) {
      let tile = this.grid.tile(this.tile.gridX + coords[0], this.tile.gridY + coords[1]);
      if (tile && tile.occupied && tile.occupied.constructor.name == 'Crystal') {
        this.rotation = facingToRotation[direction];
        this.facingCrystal = tile.occupied;
      }
    }

  }

  tick() {

    this.facingCrystal = false;
    this.faceCrystal();
    if (this.facingCrystal) {
      this.crystals += 1;
      this.facingCrystal.scalar -= .1;
    }

  }

}