class Sky {
  
  constructor(time) {
    this.timeValue = time != undefined ? time : 0;
    
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
    this.skyColors[0] = this.skyColors[24];

    this.gradient = svgContainer.gradient('l(0,0,0,1)');
    this.rect = svgContainer.rect(10, 10, 100, 100);
    this.rect.attr({fill: this.gradient});
    this.setColorFromTime(time);
  }

  nextHour(time) {
    let coloredHours = Object.keys(this.skyColors).map(n=>parseInt(n));
    let result = coloredHours.sort((a, b)=>a-b).find(n=>n>time);
    result = result != undefined ? result : coloredHours[0];
    return result;
  }

  previousHour(time) {
    let coloredHours = Object.keys(this.skyColors).map(n=>parseInt(n));
    let result = coloredHours.sort((a, b)=>b-a).find(n=>n<time);
    result = result != undefined ? result : coloredHours[0];
    return result;
  }

  get time() {
    return this.timeValue;
  }

  set time(time) {
    this.timeValue = time;
    this.setColorFromTime(time);
  }

  setColorFromTime(time) {
    time = time != undefined ? time : this.timeValue;
    let coloredHours = Object.keys(this.skyColors).map(n=>parseInt(n));

    let bottomHour = time % 1 ? this.previousHour(time) : time;
    let topHour = this.nextHour(time);

    console.log('hours', bottomHour, topHour);

    let bottomDifference = (time - bottomHour) || 1;
    let topDifference = (topHour - time) || 1;

    let range = bottomDifference + topDifference;

    let bottomRatio = bottomDifference / range;
    let topRatio = topDifference / range;

    console.log('ratios', bottomRatio, topRatio)

    // let bottomerColor = this.skyColors[this.previousHour(bottomHour)];
    // let topperColor = this.skyColors[this.nextHour(topHour)];
    
    // let bottomColor = chroma.mix(bottomerColor, this.skyColors[bottomHour], bottomRatio).hex();
    // let topColor = chroma.mix(this.skyColors[topHour], topperColor, topRatio).hex();
    
    let nextColor = this.skyColors[this.nextHour(topHour)];
    let bottomColor = chroma.mix(this.skyColors[bottomHour], this.skyColors[topHour], bottomRatio).hex();
    let topColor = chroma.mix(this.skyColors[topHour], nextColor, bottomRatio).hex();

    this.gradient.setStops(`${topColor}-${bottomColor}`);
    // this.gradient.setStops(`${bottomColor}-${topColor}`);
  }

}

function animateStopColor(stop, color, time) {

  let startColor = chroma(stop.attr()['stop-color']).rgb();
  
  Snap.animate(startColor, chroma(color).rgb(), function( val ) {
      let rgb = `rgb(${val})`;
      stop.attr('stop-color', rgb);
  }, time);

}