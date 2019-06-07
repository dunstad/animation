class Player {

  constructor(svgElement) {
    this.svgElement = svgElement;
    
    // these are used to make sure we process frames in order
    this.frameCount = 0;
    this.frames = [];

  }
  
  svgToFrame() {

    let img = new Image();
    let serialized = new XMLSerializer().serializeToString(this.svgElement.node);
    let svgBlob = new Blob([serialized], {type: "image/svg+xml"});
    let url = URL.createObjectURL(svgBlob);
    
    // onload needs to be added before src it seems
    // "As soon as you assign the src a value, the image will load.
    // If it loads before the onload is reached, your onload will not fire."
    this.frames[this.frameCount] = new Promise((resolve, reject)=>{
      img.onload = ()=>{resolve(img);};
    });
    this.frameCount++;

    img.src = url;

  }
  
  /**
   * Used to ready a scene to be played.
   * @param {Function} setupFunc 
   */
  loadScene(setupFunc) {

    // get rid of stuff from the old scene
    if (this.scene) {
      for (let actor of this.scene.actors) {
        actor.stop();
      }
    }
    this.svgElement.clear();

    let scene = new Scene(this);
    scene.prepareActors(setupFunc);

    this.scene = scene;
    for (let actor of scene.actors) {
      let actorClassName = actor.constructor.name.toLowerCase();
      if (!window[actorClassName]) {
        window[actorClassName] = actor;
      }
      else {
        let num = 2;
        while (window[actorClassName + num]) {
          num++;
        }
        window[actorClassName + num] = actor;
      }
    }

  }
  
  async play() {
    let result;
    if (this.scene.paused) {
      this.scene.resume();
      // this should look the same as the value returned by play
      result = await new Promise((resolve, reject)=>{resolve([]);});
    }
    else {
      result = await this.scene.play();
    }
    return result;
  }

  togglePause() {
    if (!this.scene.paused) {
      this.scene.pause();
    }
    else {
      this.scene.resume();
    }
  }

  async fullScreen() {
    return await this.svgElement.node.requestFullscreen();
  }

  restart() {
    this.svgElement.clear();
    this.scene.prepareActors(this.scene.setupFunc).then(()=>{console.log(this);this.play();});
  }

  recordGIF() {

    this.frameCount = 0;

    this.recordingStart = Date.now();

    this.gif = new GIF({
      workers: 2,
      quality: 10,
      width: 640,
      height: 360,
      workerScript: '/lib/gif.worker.js',
      background: '#fff',
      debug: true,
    });

    this.gif.on('finished', (blob)=>{
      window.open(URL.createObjectURL(blob));
    });

    let timeSource = ()=>{return this.recordingStart;};

    for (let actor of this.scene.actors) {
      let timeline = actor.element.timeline();
      timeline._originalTimeSource = timeline._timeSource;
      timeline._timeSource = timeSource;
    }

    let timeline = new SVG.Timeline(()=>{
      let result = timeSource();
      this.recordingStart += 16;
      return result;
    });
    let runner = new SVG.Runner(this.scene.duration);
    runner.ease('-');

    runner.during((pos)=>{
      this.svgToFrame();
    });

    timeline.schedule(runner);
    timeline.play();

    this.play();

    runner.after(()=>{

      Promise.all(this.frames).then((images)=>{
        for (let img of images) {
          this.gif.addFrame(img, {delay: 1000 / 60});
        }
        this.gif.render();
        this.frameCount = 0;
      }).catch(console.error);

      // put actor time sources back to normal
      for (let actor of this.scene.actors) {
        let timeline = actor.element.timeline();
        timeline._timeSource = timeline._originalTimeSource;
      }

    });

  }
  
  recordPNG() {
    
    this.frameCount = 0;
    this.zip = new JSZip();

    this.recordingStart = Date.now();
    mina.time = ()=>{return this.recordingStart;}
    
    mina.setFrameFunction((timestamp)=>{
      mina.frame(timestamp);
      this.recordingStart += 16;
      this.svgToFrame();
    });

    this.play().then(()=>{
      mina.setFrameFunction(mina.frame);
      mina.time = Date.now;
      Promise.all(this.frames).then((images)=>{

        let blobs = [];

        for (let [index, svgImage] of images.entries()) {

          let canvasElement = document.createElement('canvas');
          canvasElement.width = 640;
          canvasElement.height = 360;
        
          let context = canvasElement.getContext('2d');

          context.drawImage(svgImage, 0, 0);
          blobs.push(new Promise((resolve, reject)=>{
            canvasElement.toBlob(resolve, 'image/png');
          }));
          
        }
        
        Promise.all(blobs).then((blobs)=>{

          for (let [index, blob] of blobs.entries()) {
            this.zip.file(`png_${index}.png`, blob);
          }
          this.zip.generateAsync({type: 'blob'}).then(blob=>saveAs(blob, 'scene.zip'));
          this.frameCount = 0;

        }).catch(console.error);

      }).catch(console.error);
    });

  }

}