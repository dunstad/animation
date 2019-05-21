class ToggleButton extends Animated {

  constructor(svgContainer, displayElement, countGetter, options) {

    let diameter = 40;

    super(svgContainer.magicContainer());
    
    this.circle = svgContainer.circle(diameter);
    this.circle.attr({fill: 'blue'});
    this.element.add(this.circle);

    this.element.add(displayElement);

    this.countGetter = countGetter;

    this.text = svgContainer.text(String(this.countGetter()));
    this.text.attr({stroke: 'white'});
    this.text.cx(diameter / 2).cy(diameter);
    this.element.add(this.text);

  }

  updateText() {
    this.text.text(String(this.countGetter()));
  }

  tick() {
    this.updateText();
  }

}