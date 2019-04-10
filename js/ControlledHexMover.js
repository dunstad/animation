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

    for (let [key, moveName] of Object.entries(keys)) {
      
      Mousetrap.bind(key, ()=>{
        
        this[moveName](this.duration, this.config);
        if (!Object.keys(this.anims).length) {
          this.process();
        }

      });

    }

    let hammer = new Hammer(svgContainer.node);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    let swipeDirections = {
      upLeft: [-180, -120],
      up: [-120, -60],
      upRight: [-60, 0],
      downRight: [0, 60],
      down: [60, 120],
      downLeft: [120, 180],
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
      for (let [directionName, range] of Object.entries(swipeDirections)) {
        if (angleInRange(event.angle, range)) {
          console.log(directionName);
          break; // any swipe should only fall into exactly one of these ranges
        }
      }
    });

    this.clickHandlerHexes = [];
    this.assignClickHandlers();

  }

  /**
   * TODO: remove this, clicking hexes to move works poorly
   * going to implement swipe to move instead
   */
  assignClickHandlers() {

    for (let data of this.clickHandlerHexes) {
      data.node.removeEventListener('click', data.handler);
    }
    this.clickHandlerHexes = [];
    
    let moves = {
      moveUpLeft: {q: -1, r: 0},
      moveUp: {q: 0, r: -1},
      moveUpRight: {q: 1, r: -1},
      moveDownLeft: {q: -1, r: 1},
      moveDown: {q: 0, r: 1},
      moveDownRight: {q: 1, r: 0},
    };

    for (let [moveName, offsets] of Object.entries(moves)) {
      // todo: this code is also in HexMover, should probably refactor it
      let currentAxial = this.hex.cube();
      let newAxial = {
        q: currentAxial.q + offsets.q,
        r: currentAxial.r + offsets.r,
      };
      let offsetHex = this.hex.hexgrid.axialGet(newAxial.q, newAxial.r);

      let handler = ()=>{
        // this is copied from above too...
        this[moveName](this.duration, this.config);
        if (!Object.keys(this.anims).length) {
          this.process();
        }
        this.assignClickHandlers();
      };
      
      offsetHex.hexagon.node.addEventListener('click', handler);

      this.clickHandlerHexes.push({
        node: offsetHex.hexagon.node,
        handler: handler,
      });
    }

  }

}