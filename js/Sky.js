class Sky {
  
  constructor(time) {
    this.timeValue = time || 0;
    
    this.skyColors = {};
    this.skyColors[5] = chroma('#FF5733');
    this.skyColors[6] = chroma('#FFC300');
    this.skyColors[7] = chroma('#FFE633');
    this.skyColors[12] = chroma('#7ec0ee');
    this.skyColors[17] = this.skyColors[7];
    this.skyColors[18] = this.skyColors[6];
    this.skyColors[19] = this.skyColors[5];
    this.skyColors[20] = chroma('#3D5FF9');
    this.skyColors[24] = chroma('#2300C5');

    this.gradient = svgContainer.gradient('l(0,0,0,1)');
    this.rect = svgContainer.rect(10, 10, 100, 100);
    this.rect.attr({fill: this.gradient});
    this.setColorFromTime(time);
  }

  get time() {
    return this.timeValue;
  }

  set time(time) {
    this.timeValue = time;
  }

  setColorFromTime(time) {
    time = time || this.timeValue;
    let coloredHours = Object.keys(this.skyColors).map(n=>parseInt(n)).sort((a, b)=>a-b);

    let bottomHour = coloredHours.find(n=>n>time) || coloredHours[0];
    let topHour = coloredHours.find(n=>n<time) || coloredHours[coloredHours.length - 1];

    let bottomColor = this.skyColors[bottomHour].hex();
    let topColor = this.skyColors[topHour].hex();

    this.gradient.setStops(`${topColor}-${bottomColor}`);
  }

}

function animateStopColor(stop, color, time) {

  let startColor = chroma(stop.attr()['stop-color']).rgb();
  
  Snap.animate(startColor, chroma(color).rgb(), function( val ) {
      let rgb = `rgb(${val})`;
      stop.attr('stop-color', rgb);
  }, time);

}