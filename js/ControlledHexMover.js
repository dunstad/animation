class ControlledHexMover extends MusicalHexMover {
  
  constructor(svgContainer, hex, color) {

    super(svgContainer, hex, color);

    let duration = 250;
    let easing = mina.easeout;
    let config = {easingMap: {x: easing, y: easing}};

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
        
        this[moveName](duration, config);
        if (!Object.keys(this.anims).length) {
          this.process();
        }

      });

    }


  }

}