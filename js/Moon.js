class Moon extends Animated {

  constructor(svgContainer, radius) {
  
    super(svgContainer.group());

    let moonClip = svgContainer.circle(10, 10, radius);
    moonClip.attr({fill: 'white'});
    this.element.append(moonClip);

    let brightMoon = svgContainer.circle(10, 10, radius);
    brightMoon.attr({fill: '#ffffc0'});
    this.element.append(brightMoon);
    
    let darkMoon = svgContainer.circle(10, 10, radius);
    darkMoon.attr({fill: 'black', opacity: .7});
    this.element.append(darkMoon);

    this.element.attr({mask: moonClip});

    this.phaseRatio = 0;
    this.darkMoon = darkMoon;
    this.darkMoon.transform(`t${radius * 2},0`);

    this.radius = radius;

    this.toPhase = this.makeAnimationHelper(this.toPhase);

  }

  get phase() {
    return this.phaseRatio;
  }

  set phase(ratio) {
    ratio = ratio % 1;
    this.darkMoon.transform(`t${-1 * (this.radius * 4 * ratio - this.radius * 2)},0`);
    this.phaseRatio = ratio;
  }

  toPhase(ratio) {
    return {propertyValueMap: {phase: ratio}};
  }
  
}