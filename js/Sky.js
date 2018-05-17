function animateStopColor(stop, color, time) {

  let startColor = stop.attr()['stop-color'];
  
  Snap.animate([0,0,0], color, function( val ) {
      let rgb = `rgb(${val})`;
      stop.attr('stop-color', rgb);
  }, time);

}