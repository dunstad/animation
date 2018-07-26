class Moon extends Animated {

  constructor(svgContainer, radius) {
  
    super(svgContainer.group());

    let moonClip = svgContainer.circle(10, 10, radius);
    moonClip.attr({fill: 'white'});
    this.element.append(moonClip);

    let brightMoon = svgContainer.circle(10, 10, radius);
    brightMoon.attr({fill: '#ffffc0'});
    this.element.append(brightMoon);
    
    let darkMoon = new Animated(svgContainer.circle(10, 10, radius));
    // darkMoon.element.attr({fill: 'black', 'mask': brightMoon});
    darkMoon.element.attr({fill: 'black'});
    this.element.append(darkMoon.element);

    this.darkMoon = darkMoon;

    // brightMoon.attr({'mask': moonClip});
    // moonClip.attr({'mask': darkMoon.element});
    this.element.attr({mask: moonClip});

  }
  
}