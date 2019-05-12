class Metronome extends Animated {

  /**
   * Used to show tempo and trigger things that repeat periodically.
   * @param {*} svgContainer 
   * @param {Number} beatsPerMinute 
   */
  constructor(svgContainer, beatsPerMinute) {

    super(svgContainer.circle(20).x(-10).y(-10));

    
    for (let func of [this.beat]) {
      this[func.name] = this.makeAnimationHelper(func);
    }
    
    this.beatsPerMinute = beatsPerMinute;
    
  }

  /**
   * Used to animate a beat.
   * 
   * This animation seems similar to the failed movement animation in hexmover,
   * but the implementation seems significantly different... I'm a bit worried
   * @param {Number} scalar 
   */
  beat(scalar) {
    return {
      propertyValueMap: {scalar: scalar},
      easingMap: {scalar: Metronome.beatEasing},
      callfront: (transformation)=>{
        transformation.milliseconds = this.millisecondsPerBeat;
        let beatEvent = new CustomEvent('beat');
        this.element.node.dispatchEvent(beatEvent);
      },
    };
  }

  get bpm() {
    return this.beatsPerMinute;
  }

  set bpm(beatsPerMinute) {
    this.beatsPerMinute = beatsPerMinute;
  }

  /**
   * Used for convenience, because otherwise I'll be calculating it separately everywhere
   */
  get millisecondsPerBeat() {
    let oneMinute = 1000 * 60;
    return oneMinute / this.bpm;
  }

  /**
   * Used to do things when the beat happens. The callback needs
   * to accept a time parameter, used for example by triggerAttackRelease
   * in Tone.js .
   * @param {Function} callback 
   */
  onBeat(callback) {
    this.element.node.addEventListener('beat', callback);
  }

  static beatEasing (n) {
    return 1 - mina.linear(n);
  };

}