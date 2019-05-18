class MusicalHexMover extends HexMover {
  
  constructor(svgContainer, hex, color) {

    super(svgContainer, hex, color);

    this.errorSynth = new Tone.NoiseSynth('brown').toMaster();
    this.synth = new Tone.Synth().toMaster();

    // let notes = ['Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5'];

    this.notes = {
      moveUpLeft: 'D5',
      moveUp: 'E5',
      moveUpRight: 'G5',
      moveDownLeft: 'C5',
      moveDown: 'B4',
      moveDownRight: 'A4',
    };

    for (let [moveName, note] of Object.entries(this.notes)) {

      this.on(moveName, (event)=>{
        let moveSuccess = event.detail.moveSuccess;
        // in case the user didn't interact with the page before
        // Tone.js got loaded
        if (Tone.context.state !== 'running') {Tone.context.resume();}
        if (moveSuccess) {
          this.synth.triggerAttackRelease(note, '16n');
        }
        else {
          this.errorSynth.triggerAttackRelease('32n');
        }
      });

    }


  }

}