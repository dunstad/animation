class ControlledHexMover extends HexMover {
  
  constructor(svgContainer, hex, color) {

    super(svgContainer, hex, color);

    let duration = 250;
    let easing = mina.easeout;
    let easingMap = {easingMap: {x: easing, y: easing}};

    let keys = {
      'q': 'moveUpLeft',
      'w': 'moveUp',
      'e': 'moveUpRight',
      'a': 'moveDownLeft',
      's': 'moveDown',
      'd': 'moveDownRight',
    };

    for (let [key, moveFuncName] of Object.entries(keys)) {
      
      Mousetrap.bind(key, ()=>{
        this[moveFuncName](duration, easingMap);
        if (!Object.keys(this.anims).length) {
          this.process();
        }
      });

    }


  }

}