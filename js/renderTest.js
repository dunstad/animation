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

function svgToVideoFrame(svg, capturer) {

  let svgImage = svgToImageBlob(svg);
  
  let canvasElement = document.createElement('canvas');
  canvasElement.width = gif.options.width;
  canvasElement.height = gif.options.height;

  let context = canvasElement.getContext('2d');

  svgImage.onload = ()=>{
    context.drawImage(svgImage, 0, 0);
    capturer.capture(canvasElement);
  };

}

mail.move(10, 10)

gif = newGIF(170, 170);
capturer = new CCapture({
  format: 'png',
  framerate: 60,
  verbose: true,
});

// make this do nothing
Snap.prefixURL = a=>a;

sky = new Sky(170, 170);

frameCapture = setInterval(()=>{
  sky.time += .1;
  // svgToGIFFrame(svgContainer.node, gif);
  svgToVideoFrame(svgContainer.node, capturer);
}, 1000 / 60);

// let frameFunc = ()=>{
//   sky.time += .1;
//   svgToVideoFrame(svgContainer.node, capturer);
//   requestAnimationFrame(frameFunc);
// };

// requestAnimationFrame(frameFunc);

mail.rotate(360, 2000);

capturer.start();

setTimeout(()=>{
  // gif.render();
  capturer.stop();
  capturer.save()
  clearInterval(frameCapture);
}, 2 * 1000);

// cancelAnimationFrame(); // needs a parameter?
// capturer.stop();
// capturer.save()