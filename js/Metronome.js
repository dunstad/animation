class Metronome extends Animated {

  /**
   * Used to show tempo and trigger things that repeat periodically.
   * @param {*} svgContainer 
   * @param {Number} beatsPerMinute 
   */
  constructor(svgContainer, beatsPerMinute) {

    super(svgContainer.circle(0, 0, 10));

    for (let func of [this.beat]) {
      this[func.name] = this.makeAnimationHelper(func);
    }

    this.transport = Tone.Transport;
    this.transport.bpm.value = beatsPerMinute;

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
    return this.transport.bpm.value;
  }

  set bpm(beatsPerMinute) {
    this.transport.bpm.value = beatsPerMinute;
  }

  onBeat(callback) {
    this.transport.scheduleRepeat((time)=>{
      callback(time);
    }, '4n');
  }

  static beatEasing (n) {
    return 1 - mina.linear(n);
  };

}