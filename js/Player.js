class Player {

  constructor(svgElement) {
    this.svgElement = svgElement;
    
    // these are used to make sure we process frames in order
    this.frameCount = 0;
    this.frames = [];

    // make this do nothing
    Snap.prefixURL = a=>a;
  }

  svgToImageBlob() {
    let img = new Image();
    let serialized = new XMLSerializer().serializeToString(this.svgElement.node);
    let svgBlob = new Blob([serialized], {type: "image/svg+xml"});
    let url = URL.createObjectURL(svgBlob);
    img.src = url;
    return img;
  }
  
  svgToGIFFrame() {
    let img = this.svgToImageBlob();
    this.frames[this.frameCount] = new Promise((resolve, reject)=>{
      img.onload = resolve;
    });
    this.frameCount++;
  }
   
  svgToVideoFrame() {

    let svgImage = this.svgToImageBlob();
  
    this.frames[this.frameCount] = new Promise((resolve, reject)=>{
      svgImage.onload = ()=>{resolve(svgImage);};
    });

    this.frameCount++;
  
  }

  loadScene(scene) {
    this.scene = scene;
  }
  
  async play() {
    return await this.scene.play();
  }

  recordGIF() {

    this.frameCount = 0;
    
    this.gif = new GIF({
      workers: 2,
      quality: 100,
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
      this.svgToGIFFrame();
      console.log('!')
    });
    
    this.play().then(()=>{
      mina.setFrameFunction(mina.frame);
      Promise.all(this.frames).then((images)=>{
        for (let img of images) {
          this.gif.addFrame(img, {delay: 1000 / 60});
          console.log('?')
        }
        this.gif.render();
        this.frameCount = 0;
      }).catch(console.error);
    });
    
  }
  
  recordPNG() {
    
    this.frameCount = 0;
    this.zip = new JSZip();
    
    mina.setFrameFunction((timestamp)=>{
      mina.frame(timestamp);
      this.svgToVideoFrame();
    });

    this.play().then(()=>{
      mina.setFrameFunction(mina.frame);
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