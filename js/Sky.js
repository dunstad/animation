class Sky {
  
  constructor(time) {
    this.timeValue = time;
    this.rect = svgContainer.rect(10, 10, 100, 100);
    this.gradient;
    this.skyColors = {
      5: '#FF5733',
      6: '#FFC300',
      7: '#FFE633',
      12: '#7ec0ee',
      17: this.skyColors[7],
      18: this.skyColors[6],
      19: this.skyColors[5],
      20: '#3D5FF9',
      24: '#2300C5',
    };
  }

  get time() {
    return this.timeValue;
  }

  set time(time) {
    this.timeValue = time;
  }

}

function animateStopColor(stop, color, time) {

  let startColor = chroma(stop.attr()['stop-color']).rgb();
  
  Snap.animate(startColor, chroma(color).rgb(), function( val ) {
      let rgb = `rgb(${val})`;
      stop.attr('stop-color', rgb);
  }, time);

}