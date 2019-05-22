class SandboxGUI {

  constructor() {

    this.selectedButton = false;

    // used for easily updating button counts
    this.buttons = [];

  }

  addButton(button) {
    this.buttons.push(button);
    button.GUI = this;
    button.element.node.addEventListener('click', ()=>{
      button.selected = !button.selected;
    });
  }

  unselect() {
    if (this.selectedButton) {
      this.selectedButton.selected = false;
    }
    this.selectedButton = false;
  }

  select(button) {
    this.unselect();
    this.selectedButton = button;
    this.selectedButton.selected = true;
  }

  tick() {
    for (let button of this.buttons) {
      button.tick();
    }
  }

}