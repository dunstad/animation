const colyseus = require('colyseus');
const Controller = require('../components/sandbox/controllers/Controller');

const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const type = schema.type;
class MyState extends Schema {
}
type("string")(MyState.prototype, "test");


exports.SandboxRoom = class extends colyseus.Room {

  onInit (options) {
    console.log("Room created!", options);
    this.controller = new Controller();
    this.setState(new MyState());
    this.setSimulationInterval((deltaTime)=>this.update(), 500);
  }

  onJoin (client, options) {
    // this.broadcast(`${ client.sessionId } joined.`);
    console.log(`${ client.sessionId } joined.`);
    this.controller.addPlayer();
    this.broadcast(this.controller.grid.serialize());
  }

  onMessage (client, message) {
    console.log("BasicRoom received message from", client.sessionId, ":", message);
    // this.broadcast(`(${ client.sessionId }) ${ message }`);
  }

  onLeave (client, consented) {
    console.log(`${ client.sessionId } left.`);
    // this.broadcast(`${ client.sessionId } left.`);
  }

  onDispose() {
    console.log("Dispose Room");
  }

  update() {
    // this.state.test = String(Math.random());
    this.state.test = this.state.test + 'a';
  }

}