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

    this.transport = Tone.Transport;
    this.transport.bpm.value = beatsPerMinute;
    
    // this makes it so the metronome will start as soon as the scene is played
    this.wait(0, {callback: ()=>{this.transport.start();}})

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
      },
    };
  }

  get bpm() {
    return this.transport.bpm.value;
  }

  set bpm(beatsPerMinute) {
    this.transport.bpm.value = beatsPerMinute;
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
    this.transport.scheduleRepeat((time)=>{
      callback(time);
    }, '4n');
  }

  static beatEasing (n) {
    return 1 - mina.linear(n);
  };

}