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
      mark.transform(`r${angle} t${-width / 2}, ${-radius * .8}`);
      this.element.append(mark);
      
    }
    
    let width = radius * .05;
    let secondHand = svgContainer.rect(0, 0, width, radius * .9);
    secondHand.attr({fill: 'black'});
    secondHand.transform(`r${180},0,0`);
    this.element.append(secondHand);
    this.secondHand = secondHand;
    
    this.timeValue = 0;
    this.toTime = this.makeAnimationHelper(this.toTime);

  }

  get time() {
    return this.timeValue;
  }

  set time(timeValue) {
    timeValue = timeValue % 12;
    this.secondHand.transform(`r${180 + (timeValue / 12) * 360},0,0`);
    this.timeValue = timeValue;
  }

  toTime(ratio) {
    return {propertyValueMap: {time: ratio}};
  }
  
}