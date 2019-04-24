class Clock extends Animated {

  constructor(svgContainer, radius) {
  
    super(svgContainer.group());

    let diameter = radius * 2;

    let face = svgContainer.circle(diameter).x(-radius).y(-radius);
    face.attr({
      fill: 'white',
      stroke: 'saddlebrown',
      strokeWidth: radius * .1,
    });
    this.element.add(face);

    let bigMarks = [0, 90, 180, 270];
    for (let angle = 0; angle < 360; angle += 30) {

      let width = radius * .05;
      let height = bigMarks.includes(angle) ? width * 4 : width * 2;
      let mark = svgContainer.rect(width, height).x(-width / 2).y(-height / 2);
      mark.attr({fill: 'black'});
      mark.rotate(angle).y(-radius * .8);
      this.element.add(mark);
      
    }
    
    let width = radius * .05;
    this.width = width;

    let secondHand = svgContainer.rect(width, radius * .9).x(0).y(0);
    secondHand.attr({fill: 'red'});
    secondHand.rotate(180).x(-width / 2);
    this.element.add(secondHand);
    this.secondHand = secondHand;
    
    let minuteHand = svgContainer.rect(width, radius * .9).x(0).y(0);
    minuteHand.attr({fill: 'black'});
    minuteHand.rotate(180).x(-width / 2);
    this.element.add(minuteHand);
    this.minuteHand = minuteHand;

    let hourHand = svgContainer.rect(0, 0, width, radius * .5);
    hourHand.attr({fill: 'black'});
    hourHand.rotate(180).x(-width / 2);
    this.element.add(hourHand);
    this.hourHand = hourHand;

    let centerCircle = svgContainer.circle(diameter * .05).x(-radius * .05).y(-radius * .05);
    centerCircle.attr({fill: 'black'});
    this.element.add(centerCircle);
    
    this.timeValue = 0;
    this.toTime = this.makeAnimationHelper(this.toTime);

  }

  get time() {
    return this.timeValue;
  }

  set time(timeValue) {
    timeValue = timeValue % 12;
    let centerX = -this.width / 2;
    let timeDecimal = timeValue % 1;
    let minuteXRotation = 180 + (timeDecimal) * 360;
    this.secondHand.rotate(minuteXRotation * 60).x(centerX);
    this.minuteHand.rotate(minuteXRotation).x(centerX);
    this.hourHand.rotate(180 + (timeValue / 12) * 360).x(centerX);
    this.timeValue = timeValue;
  }

  toTime(ratio) {
    return {propertyValueMap: {time: ratio}};
  }
  
}