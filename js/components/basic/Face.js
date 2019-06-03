class Face extends Animated {

  constructor(svgContainer, options) {

    super(svgContainer.magicContainer());

    this.leftEye = new Eye(svgContainer, options.eyeOptions);
    this.element.add(this.leftEye.element);
    this.rightEye = new Eye(svgContainer, options.eyeOptions);
    this.element.add(this.rightEye.element);
    console.log(this.rightEye.radius)
    this.rightEye.x = this.rightEye.radius * 2.5;

  }

  /**
   * Animate looking in a direction.
   * @param {Number} angle 0-360
   * @param {Number} magnitude 0-100
   */
  look() {
    for (let eye of [this.leftEye, this.rightEye]) {
      eye.look(...arguments);
    }
  }

}