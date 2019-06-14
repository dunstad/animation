const colyseus = require('colyseus');
const Controller = require('../components/sandbox/controllers/Controller');

exports.SandboxRoom = class extends colyseus.Room {
  onInit (options) {
    console.log("Room created!", options);
    this.controller = new Controller();
  }
  onJoin (client, options) {
    // this.broadcast(`${ client.sessionId } joined.`);
    console.log(`${ client.sessionId } joined.`);
    this.controller.addPlayer();
    this.broadcast(this.controller.state.serialize());
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
}
