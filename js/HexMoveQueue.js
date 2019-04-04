class HexMoveQueue extends Animated {

  /**
   * Used to display the queued movements of a ControlledHexMover.
   * @param {Object} svgContainer 
   */
  constructor(svgContainer) {

    super(svgContainer.group());

  }

}