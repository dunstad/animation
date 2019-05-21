class SandboxGUI {

  constructor() {

    this.selectedButton = false;

    // used for easily updating button counts
    this.buttons = [];

  }

  addButton(button) {
    this.buttons.push(button);
    button.GUI = this;
  }

  unselect() {
    if (this.selectedButton) {
      this.selectedButton.unselect();
    }
  }

  tick() {
    for (let button of this.buttons) {
      button.tick();
    }
  }

}