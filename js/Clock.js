class Clock extends Animated {

  constructor(svgContainer, radius) {
  
    super(svgContainer.group());

    this.radius = radius;
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

    let secondHandHeight = radius * .9;
    let secondHand = svgContainer.rect(width, secondHandHeight).x(-width/2).y(-secondHandHeight);
    secondHand.attr({fill: 'red'});
    secondHand.x(-width / 2);
    this.element.add(secondHand);
    this.secondHand = secondHand;
    
    let minuteHand = svgContainer.rect(width, secondHandHeight).x(-width/2).y(-secondHandHeight);
    minuteHand.attr({fill: 'black'});
    minuteHand.x(-width / 2);
    this.element.add(minuteHand);
    this.minuteHand = minuteHand;

    let hourHandHeight = radius * .5;
    let hourHand = svgContainer.rect(width, hourHandHeight).x(-width/2).y(-hourHandHeight);
    hourHand.attr({fill: 'black'});
    hourHand.x(-width / 2);
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
    let centerX = this.element.cx();
    let centerY = this.element.cy();
    let timeDecimal = timeValue % 1;
    let minuteXRotation = 180 + (timeDecimal) * 360;
    this.secondHand.rotate(minuteXRotation * 60, centerX, centerY);
    this.minuteHand.rotate(minuteXRotation, centerX, centerY);
    this.hourHand.rotate(180 + (timeValue / 12) * 360, centerX, centerY);
    this.timeValue = timeValue;
  }

  toTime(ratio) {
    return {propertyValueMap: {time: ratio}};
  }
  
}