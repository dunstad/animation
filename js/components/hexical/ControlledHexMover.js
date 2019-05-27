class ControlledHexMover extends MusicalHexMover {
  
  constructor(svgContainer, hex, color) {

    super(svgContainer, hex, color);

    this.duration = 250;
    let easing = SVG.easing['>'];
    this.config = {easingMap: {x: easing, y: easing}};

    let keys = {
      q: 'controlUpLeft',
      w: 'controlUp',
      e: 'controlUpRight',
      a: 'controlDownLeft',
      s: 'controlDown',
      d: 'controlDownRight',
    };

    for (let [key, eventName] of Object.entries(keys)) {
      Mousetrap.bind(key, ()=>{
        let controlEvent = new CustomEvent(eventName);
        this.element.node.dispatchEvent(controlEvent);
      });
    }

    let hammer = new Hammer(svgContainer.node);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    let swipeDirections = {
      controlUpLeft: [-180, -120],
      controlUp: [-120, -60],
      controlUpRight: [-60, 0],
      controlDownRight: [0, 60],
      controlDown: [60, 120],
      controlDownLeft: [120, 180],
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
      for (let [eventName, range] of Object.entries(swipeDirections)) {
        if (angleInRange(event.angle, range)) {
          let controlEvent = new CustomEvent(eventName);
          this.element.node.dispatchEvent(controlEvent);
          break; // any swipe should only fall into exactly one of these ranges
        }
      }
    });

    this.clickHandlerHexes = [];

  }

}