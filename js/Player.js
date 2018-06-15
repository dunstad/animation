class Player {

  constructor(svgElement) {
    this.svgElement = svgElement;
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
    img.onload = ()=>{this.gif.addFrame(img, {delay: 1000 / 60});};
    this.requestId = requestAnimationFrame(this.svgToGIFFrame.bind(this));
  }

  loadScene(scene) {
    this.scene = scene;
  }
  
  async play() {
    return await this.scene.play();
  }

  recordGIF() {
    
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

    this.play().then(()=>{
      this.gif.render();
      cancelAnimationFrame(this.requestId);
    });
    
    this.requestId = requestAnimationFrame(this.svgToGIFFrame.bind(this));

  }

  recordPNG() {

  }

}