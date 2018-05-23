function newGIF(width, height) {
  let gif = new GIF({
    workers: 2,
    quality: 10,
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

  gif.addFrame(canvasElement);

}

gif = newGIF(400, 200);

frameCapture = setInterval(()=>{
  svgToFrame(svgContainer.node, gif);
}, 100);

mail.moveX(100, 1000);

setTimeout(()=>{
  clearInterval(frameCapture);
  gif.render()
}, 1000);