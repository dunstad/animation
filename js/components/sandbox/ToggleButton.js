class ToggleButton extends Animated {

  constructor(svgContainer, displayElement, label, options) {

    if (!options) {options = {};}

    let diameter = 80;
    
    super(svgContainer.magicContainer());
    
    this.label = label;
    
    this.circle = svgContainer.circle(diameter);
    this.circle.attr({fill: 'blue'});
    this.element.add(this.circle);

    this.element.add(displayElement);
    displayElement.cx(diameter / 2).cy(diameter / 2);

    this.countGetter = options.countGetter;

    if (this.countGetter) {
      this.text = svgContainer.text(String(this.countGetter()));
      this.text.attr({stroke: 'white', fill: 'white'});
      this.text.cx(diameter / 2).cy(diameter - (diameter / 8));
      this.element.add(this.text);
    }

    this.isSelected = false;

  }

  get selected() {
    return this.isSelected;
  }

  set selected(bool) {
    this.isSelected = bool;
    if (bool) {
      this.circle.attr({fill: 'lime'});
    }
    else {
      this.circle.attr({fill: 'blue'});
    }
  }

  updateText() {
    this.text.text(String(this.countGetter()));
  }

  tick() {
    if (this.countGetter) {
      this.updateText();
    }
  }

}