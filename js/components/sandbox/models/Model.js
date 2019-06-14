class Model {

  constructor() {
    this.state = {};
  }

  serialize() {
    return JSON.stringify(this.state);
  }

}

if (module) {module.exports = Model;}