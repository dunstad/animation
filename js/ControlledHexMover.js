class ControlledHexMover extends HexMover {
  
  constructor(svgContainer, hex, color) {

    super(svgContainer, hex, color);

    let duration = 250;
    let easing = mina.easeout;
    let config = {easingMap: {x: easing, y: easing}};

    this.synth = new Tone.Synth().toMaster();

    let keys = {
      'q': {
        move: 'moveUpLeft',
        note: 'F4',
      },
      'w': {
        move: 'moveUp',
        note: 'B4',
      },
      'e': {
        move: 'moveUpRight',
        note: 'A4',
      },
      'a': {
        move: 'moveDownLeft',
        note: 'D4',
      },
      's': {
        move: 'moveDown',
        note: 'C4',
      },
      'd': {
        move: 'moveDownRight',
        note: 'E4',
      },
    };

    for (let [key, data] of Object.entries(keys)) {

      
      Mousetrap.bind(key, ()=>{
        
        config = Object.assign({}, config);
        config.callfront = ()=>{

          // in case the user didn't interact with the page before
          // Tone.js got loaded
          if (Tone.context.state !== 'running') {Tone.context.resume();}
          this.synth.triggerAttackRelease(data.note, '16n');
        };

        this[data.move](duration, config);
        if (!Object.keys(this.anims).length) {
          this.process();
        }

      });

    }


  }

}