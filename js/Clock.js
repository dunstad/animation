class Clock extends Animated {

  constructor(svgContainer, radius) {
  
    super(svgContainer.group());

    let face = svgContainer.circle(0, 0, radius);
    face.attr({
      fill: 'white',
      stroke: 'saddlebrown',
      strokeWidth: radius * .1,
    });
    this.element.append(face);

    let bigMarks = [0, 90, 180, 270];
    for (let angle = 0; angle < 360; angle += 30) {

      let width = radius * .05;
      let height = bigMarks.includes(angle) ? width * 4 : width * 2;
      let mark = svgContainer.rect(-width / 2, -height / 2, width, height);
      mark.attr({fill: 'black'});
      mark.transform(`r${angle},0,0 t0,${-radius * .8}`);
      this.element.append(mark);
      
    }
    
    let width = radius * .05;
    this.width = width;

    let secondHand = svgContainer.rect(0, 0, width, radius * .9);
    secondHand.attr({fill: 'red'});
    secondHand.transform(`r180,0,0, t${-width / 2},0`);
    this.element.append(secondHand);
    this.secondHand = secondHand;
    
    let minuteHand = svgContainer.rect(0, 0, width, radius * .9);
    minuteHand.attr({fill: 'black'});
    minuteHand.transform(`r180,0,0, t${-width / 2},0`);
    this.element.append(minuteHand);
    this.minuteHand = minuteHand;

    let hourHand = svgContainer.rect(0, 0, width, radius * .5);
    hourHand.attr({fill: 'black'});
    hourHand.transform(`r180,0,0, t${-width / 2},0`);
    this.element.append(hourHand);
    this.hourHand = hourHand;

    let centerCircle = svgContainer.circle(0, 0, radius * .05);
    centerCircle.attr({fill: 'black'});
    this.element.append(centerCircle);
    
    this.timeValue = 0;
    this.toTime = this.makeAnimationHelper(this.toTime);

  }

  get time() {
    return this.timeValue;
  }

  set time(timeValue) {
    timeValue = timeValue % 12;
    this.secondHand.transform(`r${180 + (timeValue % 1) * 60 * 360},0,0 t${-this.width / 2},0`);
    this.minuteHand.transform(`r${180 + (timeValue % 1) * 360},0,0 t${-this.width / 2},0`);
    this.hourHand.transform(`r${180 + (timeValue / 12) * 360},0,0 t${-this.width / 2},0`);
    this.timeValue = timeValue;
  }

  toTime(ratio) {
    return {propertyValueMap: {time: ratio}};
  }
  
}