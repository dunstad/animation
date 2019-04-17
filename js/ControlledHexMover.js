class ControlledHexMover extends MusicalHexMover {
  
  constructor(svgContainer, hex, color) {

    super(svgContainer, hex, color);

    this.duration = 250;
    let easing = mina.easeout;
    this.config = {easingMap: {x: easing, y: easing}};

    let keys = {
      q: 'moveUpLeft',
      w: 'moveUp',
      e: 'moveUpRight',
      a: 'moveDownLeft',
      s: 'moveDown',
      d: 'moveDownRight',
    };

    /**
     * Move in a direction with less code repetition.
     * @param {String} moveName 
     */
    let performMove = (moveName, time)=>{
      this[moveName](time, this.duration, this.config);
      if (!Object.keys(this.anims).length) {
        this.process();
      }
    };

    for (let [key, moveName] of Object.entries(keys)) {
      // todo: make this a callback that can be registered elsewhere?
      Mousetrap.bind(key, ()=>{performMove(moveName);}); // , time)
    }

    let hammer = new Hammer(svgContainer.node);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    let swipeDirections = {
      moveUpLeft: [-180, -120],
      moveUp: [-120, -60],
      moveUpRight: [-60, 0],
      moveDownRight: [0, 60],
      moveDown: [60, 120],
      moveDownLeft: [120, 180],
    };

    /**
     * Used to tell what direction a swipe was.
     * Range should be 2 numbers from -180 to 180, smallest first.
     * @param {Number} angle 
     * @param {Number[]} range 
     */
    function angleInRange(angle, range) {
      return ((angle >= range[0]) && (angle < range[1]));
    }

    hammer.on('swipe', (event)=>{
      for (let [moveName, range] of Object.entries(swipeDirections)) {
        if (angleInRange(event.angle, range)) {
          // todo: make this a callback that can be registered elsewhere?
          performMove(moveName); // , time)
          break; // any swipe should only fall into exactly one of these ranges
        }
      }
    });

    this.clickHandlerHexes = [];

  }

}