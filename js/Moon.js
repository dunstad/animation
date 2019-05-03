class Moon extends Animated {

  constructor(svgContainer, radius) {
  
    super(svgContainer.nested());
    this.element.attr({overflow: 'visible'});

    let moonClip = svgContainer.circle(radius * 2).x(-radius).y(-radius);
    moonClip.attr({fill: 'white'});
    this.element.add(moonClip);

    let moonColor = '#ffffc0';
    let brightMoon = svgContainer.circle(radius * 2).x(-radius).y(-radius);
    brightMoon.attr({fill: moonColor});
    this.element.add(brightMoon);

    let craterColor = chroma(moonColor).darken().hex();
    let numCraters = Math.floor(Math.random() * Math.floor(5)) + 10;
    function craterCoordInsideMoon(craterRadius) {
      return (Math.random() * (radius - craterRadius) * 2) + craterRadius - radius;
    }
    for (let i = 0; i < numCraters; i++) {
      let craterRadius = Math.random() * radius * .1 + radius * .1;
      let crater = svgContainer.circle(craterRadius * 2).x(-craterRadius).y(-craterRadius);
      crater.attr({fill: craterColor});
      this.element.add(crater);
      crater.x(craterCoordInsideMoon(craterRadius)).y(craterCoordInsideMoon(craterRadius));
    }
    
    let darkMoon = svgContainer.circle(radius * 2).x(radius).y(-radius);
    darkMoon.attr({fill: 'black', opacity: .7});
    this.element.add(darkMoon);

    this.element.clipWith(moonClip);

    this.phaseRatio = 0;
    this.darkMoon = darkMoon;

    this.radius = radius;

    this.toPhase = this.makeAnimationHelper(this.toPhase);

  }

  get phase() {
    return this.phaseRatio;
  }

  set phase(ratio) {
    ratio = ratio % 1;
    this.darkMoon.x(-1 * (this.radius * 4 * ratio - this.radius));
    this.phaseRatio = ratio;
  }

  toPhase(ratio) {
    return {propertyValueMap: {phase: ratio}};
  }
  
}