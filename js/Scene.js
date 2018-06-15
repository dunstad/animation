class Scene {
  
  /**
   * Used to set which player controls the scene.
   * @param {Player} player 
   */
  constructor(player) {
    this.player = player;
    this.actors = [];
  }

  /**
   * Add an actor to the scene. Its AnimationQueue will be processed when the Scene plays.
   * @param {Animated} animated 
   */
  addActor(animated) {
    this.actors.push(animated);
  }

  /**
   * Convenience method used to add multiple actors at once.
   * @param {Animated[]} animatedArray 
   */
  addActors(animatedArray) {
    for (let animated of animatedArray) {
      this.addActor(animated);
    }
  }

  async play() {

    let loadingActorPromises = [];
    for (let actor of this.actors) {
      if (actor.loadingPromise) {
        loadingActorPromises.push(actor.loadingPromise);
      }
    }

    await Promise.all(loadingActorPromises);
      
    let processingPromises = [];
    
    for (let actor of this.actors) {
      processingPromises.push(new Promise((resolve, reject)=>{
        actor.process(resolve);
      }));
    }
    
    return await Promise.all(processingPromises);

  }

}