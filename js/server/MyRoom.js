const colyseus = require('colyseus');

exports.MyRoom = class extends colyseus.Room {
  onInit (options) {
    console.log("Room created!", options);
  }
  onJoin (client, options) {
    this.broadcast(`${ client.sessionId } joined.`);
  }
  onMessage (client, message) {
    console.log("BasicRoom received message from", client.sessionId, ":", message);
    this.broadcast(`(${ client.sessionId }) ${ message }`);
  }
  onLeave (client, consented) {
    this.broadcast(`${ client.sessionId } left.`);
  }
  onDispose() {
    console.log("Dispose Room");
  }
}
