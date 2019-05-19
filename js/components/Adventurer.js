class Adventurer extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.magicContainer());

    this.grid = grid;

    let faceGroup = svgContainer.group();
    this.element.add(faceGroup);

    let face = svgContainer.circle(40, 40);
    face.attr({fill: 'tan'});
    faceGroup.add(face);

    let eyeGroup = svgContainer.magicContainer();
    eyeGroup.x(10).y(20);
    faceGroup.add(eyeGroup);

    let leftEye = new Eye(svgContainer);
    leftEye.scalar = .125;
    eyeGroup.add(leftEye.element);
    
    let rightEye = new Eye(svgContainer);
    rightEye.scalar = .125;
    rightEye.x = 20;
    eyeGroup.add(rightEye.element);
    
  }

  move(x, y) {
    if (!this.grid.tile(x, y).occupied) {
      this.grid.occupy(x, y, this);
    }
  }

}