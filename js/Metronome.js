class Metronome extends Animated {

  /**
   * Used to show tempo and trigger things that repeat periodically.
   * @param {*} svgContainer 
   * @param {Number} beatsPerMinute 
   */
  constructor(svgContainer, beatsPerMinute) {

    super(svgContainer.circle(0, 0, 10));

    this.beatsPerMinute = beatsPerMinute;

    for (let func of [this.beat]) {
      this[func.name] = this.makeAnimationHelper(func);
    }

  }

  /**
   * Used to animate a beat.
   * 
   * This animation seems similar to the failed movement animation in hexmover,
   * but the implementation seems significantly different... I'm a bit worried
   * @param {Number} scalar 
   */
  beat(scalar) {
    let oneMinute = 1000 * 60;
    return {
      propertyValueMap: {scalar: scalar},
      easingMap: {scalar: Metronome.beatEasing},
      callfront: (transformation)=>{
        transformation.milliseconds = oneMinute / this.beatsPerMinute;
      },
    };
  }

  // start() {
    // let milliseconds = this.beatsPerMinute 
    // this.interval = setInterval(()=>{}, );
  // }

  get bpm() {
    return this.beatsPerMinute;
  }

  set bpm(beatsPerMinute) {
    this.beatsPerMinute = beatsPerMinute;
  }

  onBeat(callback) {
    this.element.node.addEventListener('beat', callback);
  }

  static beatEasing (n) {
    return 1 - mina.linear(n);
  };

}