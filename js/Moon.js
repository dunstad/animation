class Moon extends Animated {

  constructor(svgContainer, radius) {
  
    super(svgContainer.group());

    let moonClip = svgContainer.circle(0, 0, radius);
    moonClip.attr({fill: 'white'});
    this.element.add(moonClip);

    let moonColor = '#ffffc0';
    let brightMoon = svgContainer.circle(0, 0, radius);
    brightMoon.attr({fill: moonColor});
    this.element.add(brightMoon);

    let craterColor = chroma(moonColor).darken().hex();
    let numCraters = Math.floor(Math.random() * Math.floor(5)) + 10;
    function craterCoordInsideMoon(craterRadius) {
      return (Math.random() * (radius - craterRadius) * 2) + craterRadius - radius;
    }
    for (let i = 0; i < numCraters; i++) {
      let craterRadius = Math.random() * radius * .1 + radius * .1;
      let crater = svgContainer.circle(0, 0, craterRadius);
      crater.attr({fill: craterColor});
      this.element.add(crater);
      crater.transform(`t${craterCoordInsideMoon(craterRadius)},${craterCoordInsideMoon(craterRadius)}`);
    }
    
    let darkMoon = svgContainer.circle(0, 0, radius);
    darkMoon.attr({fill: 'black', opacity: .7});
    this.element.add(darkMoon);

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