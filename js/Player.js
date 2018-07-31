class Player {

  constructor(svgElement) {
    this.svgElement = svgElement;
    
    // these are used to make sure we process frames in order
    this.frameCount = 0;
    this.frames = [];

    // make this do nothing
    Snap.prefixURL = a=>a;
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
  
  loadScene(scene) {
    this.scene = scene;
  }
  
  async play() {
    return await this.scene.play();
  }

  recordGIF() {

    this.frameCount = 0;

    this.recordingStart = Date.now();
    mina.time = ()=>{return this.recordingStart;}
    
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
    
    mina.setFrameFunction((timestamp)=>{
      mina.frame(timestamp);
      this.recordingStart += 16;
      this.svgToFrame();
    });
    
    this.play().then(()=>{
      mina.setFrameFunction(mina.frame);
      mina.time = Date.now;
      Promise.all(this.frames).then((images)=>{
        for (let img of images) {
          this.gif.addFrame(img, {delay: 1000 / 60});
        }
        this.gif.render();
        this.frameCount = 0;
      }).catch(console.error);
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