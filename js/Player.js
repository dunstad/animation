class Player {

  constructor(svgElement) {
    this.svgElement = svgElement;
  }

  svgToImageBlob() {
    let img = new Image();
    let serialized = new XMLSerializer().serializeToString(this.svgElement);
    let svgBlob = new Blob([serialized], {type: "image/svg+xml"});
    let url = URL.createObjectURL(svgBlob);
    img.src = url;
    return img;
  };

  svgToGIFFrame() {
    let img = svgToImageBlob(this.svgElement);
    img.onload = ()=>{this.gif.addFrame(img, {delay: 1000 / 60});};
    this.requestId = requestAnimationFrame(this.svgToGIFFrame);
  };

  loadScene(scene) {
    this.scene = scene;
  }
  
  play() {
    this.scene.play();
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

    this.requestId = requestAnimationFrame(svgToGIFFrame);

    this.scene.runWhenFinished(()=>{
      this.gif.render();
      cancelAnimationFrame(this.requestId);
    });

  }

  recordPNG() {

  }

}