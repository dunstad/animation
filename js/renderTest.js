function newGIF(width, height) {
  let gif = new GIF({
    workers: 2,
    quality: 1,
    width: width,
    height: height,
    workerScript: '/lib/gif.worker.js',
    background: '#fff',
    debug: true,
  });
  
  gif.on('finished', (blob)=>{
    window.open(URL.createObjectURL(blob));
  });

  return gif;
}

function svgToFrame(svg, gif) {
  
  let canvasElement = document.createElement('canvas');
  canvasElement.width = gif.options.width;
  canvasElement.height = gif.options.height;
  
  let fabricCanvas = new fabric.Canvas(canvasElement);
  fabricCanvas.setWidth(gif.options.width);
  fabricCanvas.setHeight(gif.options.height);
  
  fabric.loadSVGFromString(`${new XMLSerializer().serializeToString(svg)}`, (objects, options)=>{
    var obj = fabric.util.groupSVGElements(objects, options);
    fabricCanvas.add(obj).renderAll();
  })

  gif.addFrame(canvasElement, {delay: 1000 / 60});

}

mail.move(10, 10)

gif = newGIF(170, 170);

sky = new Sky(170, 170);

frameCapture = setInterval(()=>{
  sky.time += .1;
  svgToFrame(svgContainer.node, gif);
}, 1000 / 60);

// mail.rotate(360, 2000);

setTimeout(()=>{
  clearInterval(frameCapture);
  gif.render()
}, 10 * 1000);