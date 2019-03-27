class ControlledHexMover extends HexMover {
  
  constructor(svgContainer, hex, color) {

    super(svgContainer, hex, color);

    let duration = 250;
    let easing = mina.easeout;
    let config = {easingMap: {x: easing, y: easing}};

    this.synth = new Tone.Synth().toMaster();

    // let notes = ['Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5'];

    let keys = {
      'q': {
        move: 'moveUpLeft',
        note: 'D5',
      },
      'w': {
        move: 'moveUp',
        note: 'E5',
      },
      'e': {
        move: 'moveUpRight',
        note: 'G5',
      },
      'a': {
        move: 'moveDownLeft',
        note: 'C5',
      },
      's': {
        move: 'moveDown',
        note: 'B4',
      },
      'd': {
        move: 'moveDownRight',
        note: 'A4',
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