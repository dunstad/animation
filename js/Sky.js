class Sky extends Animated {
  
  constructor(svgContainer, width, height, time) {
    
    super(svgContainer.rect(10, 10, width || 100, height || 100));

    this.timeValue = time != undefined ? time : 0;
    
    this.skyColors = {};
    // best to have a 0 hour and no 24 hour defined
    this.skyColors[0] = chroma('#2300C5');
    this.skyColors[5] = chroma('#FF5733');
    this.skyColors[6] = chroma('#FFC300');
    this.skyColors[7] = chroma('#FFE633');
    this.skyColors[12] = chroma('#7ec0ee');
    this.skyColors[17] = this.skyColors[7];
    this.skyColors[18] = this.skyColors[6];
    this.skyColors[19] = this.skyColors[5];
    this.skyColors[20] = chroma('#3D5FF9');

    this.gradient = svgContainer.gradient('l(0,0,0,1)');
    this.element.attr({fill: this.gradient});
    this.setColorFromTime(time);

    this.toHour = this.makeAnimationHelper(this.toHour);

  }

  /**
   * Used to deal with the 24 hour cycle properly.
   * @param {number} time 
   */
  nextHour(time) {
    let coloredHours = Object.keys(this.skyColors).map(n=>parseInt(n));
    let result = coloredHours.sort((a, b)=>a-b).find(n=>n>time);
    result = result != undefined ? result : coloredHours[0];
    return result;
  }

  /**
   * Used to deal with the 24 hour cycle properly.
   * @param {number} time 
   */
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
    time = time % 24;
    this.timeValue = time;
    this.setColorFromTime(time);
  }

  /**
   * Makes the gradient be the colors it ought to based on the given time.
   * @param {number} time 
   */
  setColorFromTime(time) {
    time = time != undefined ? time : this.timeValue;
    let coloredHours = Object.keys(this.skyColors).map(n=>parseInt(n));

    let bottomHour = coloredHours.indexOf(time) == -1 ? this.previousHour(time) : time;
    let topHour = this.nextHour(time);

    // topHour || 24 lets the transition to the next day work well
    // || .1 and || 100 are for when both differences are 0,
    // so colors continue to change smoothly
    let bottomDifference = (time - bottomHour) || .1;
    let topDifference = ((topHour || 24) - time) || 100;

    let range = bottomDifference + topDifference;

    let bottomRatio = bottomDifference / range;
    let topRatio = topDifference / range;

    let nextColor = this.skyColors[this.nextHour(topHour)];
    let bottomColor = chroma.mix(this.skyColors[bottomHour], this.skyColors[topHour], bottomRatio).hex();
    let topColor = chroma.mix(this.skyColors[topHour], nextColor, bottomRatio).hex();

    this.gradient.setStops(`${topColor}-${bottomColor}`);
  }

  toHour(hour) {
    return {propertyValueMap: {time: hour}};
  }

}