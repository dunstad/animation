function animateStopColor(stop, color, time) {

  let startColor = chroma(stop.attr()['stop-color']).rgb();
  
  Snap.animate(startColor, chroma(color).rgb(), function( val ) {
      let rgb = `rgb(${val})`;
      stop.attr('stop-color', rgb);
  }, time);

}