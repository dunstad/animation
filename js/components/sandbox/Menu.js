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

    for (let [name, onclick] of Object.entries(this.choiceObject)) {
      let text = svgContainer.text(name);
      text.cx = this.element.cx();
      text.attr(this.options.textOptions || {});
      this.element.add(text);
    }

  }

}