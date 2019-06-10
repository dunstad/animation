class Menu extends Animated {

  constructor(svgContainer, options) {

    super(svgContainer.magicContainer());

    this.options = options || {};
    this.choiceObject = {};

  }

  get choices() {
    return this.choiceObject;
  }

  set choices(choices) {

    this.choiceObject = choices;

    // TODO: apparently this isn't synchronous...
    // for (let child of this.element.children()) {child.remove();}

    let increment = 0;
    for (let [name, onclick] of Object.entries(this.choiceObject)) {
      let text = svgContainer.text(name);
      text.cx(this.element.cx());
      let spacing = (this.options.spacing || 0) * increment;
      text.cy((increment * text.node.getBBox().height) + spacing);
      text.attr(this.options.textOptions || {});
      text.font(this.options.textOptions || {});
      text.node.addEventListener('click', onclick);
      this.element.add(text);
      increment += 1;
    }

  }

}