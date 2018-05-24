function newGIF(width, height) {
  let gif = new GIF({
    workers: 2,
    quality: 100,
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

/**
 * Used to get SVG onto canvas or into a GIF.
 * @param {SVGElement} svg 
 */
function svgToImageBlob(svg) {
  let img = new Image();
  let serialized = new XMLSerializer().serializeToString(svg);
  let svgBlob = new Blob([serialized], {type: "image/svg+xml"});
  let url = URL.createObjectURL(svgBlob);
  img.src = url;
  return img;
}

function svgToGIFFrame(svg, gif) {
  let img = svgToImageBlob(svg);
  img.onload = ()=>{gif.addFrame(img, {delay: 1000 / 60});};
}

function svgToVideoFrame(svg) {

  let svgImage = svgToImageBlob(svg);
  
  let canvasElement = document.createElement('canvas');
  canvasElement.width = gif.options.width;
  canvasElement.height = gif.options.height;
  
  let context = canvas.getContext('2d');

  svgImage.onload = ()=>{
    context.drawImage(svgImage, 0, 0);
    gif.addFrame(canvasElement, {delay: 1000 / 60}); // temporary
  };

}

mail.move(10, 10)

gif = newGIF(170, 170);

// make this do nothing
Snap.prefixURL = a=>a;

sky = new Sky(170, 170);

frameCapture = setInterval(()=>{
  sky.time += .1;
  svgToGIFFrame(svgContainer.node, gif);
}, 1000 / 60);

mail.rotate(360, 2000);

setTimeout(()=>{
  clearInterval(frameCapture);
  gif.render()
}, 2 * 1000);