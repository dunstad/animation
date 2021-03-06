class Scene {
  
  /**
   * Used to set which player controls the scene.
   * @param {Player} player 
   */
  constructor(player) {
    this.player = player;
    this.actors = [];
    this.paused = false;
  }

  /**
   * Add an actor to the scene. Its AnimationQueue will be processed when the Scene plays.
   * @param {Animated} animated 
   */
  addActor(animated) {
    this.actors.push(animated);
    return this;
  }

  /**
   * Convenience method used to add multiple actors at once.
   * @param {Animated[]} animatedArray 
   */
  addActors(animatedArray) {
    for (let animated of animatedArray) {
      this.addActor(animated);
    }
    return this;
  }

  /**
   * Used to add all actors and set where they're going to move.
   * @param {function} setupFunc 
   */
  async prepareActors(setupFunc) {
    if (setupFunc) {this.setupFunc = setupFunc;}
    this.actors = [];
    this.setupFunc(this);

    let loadingActorPromises = [];
    for (let actor of this.actors) {
      if (actor.loadingPromise) {
        loadingActorPromises.push(actor.loadingPromise);
      }
    }

    return await Promise.all(loadingActorPromises);
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

  pause() {
    this.paused = true;
    for (let actor of this.actors) {
      actor.pause();
    }
  }

  resume() {
    this.paused = false;
    for (let actor of this.actors) {
      actor.resume();
    }
  }

  /**
   * Used to know how long the scene is expected to last,
   * primarily for gif and png exporting.
   * Some of the transformations could have callbacks or callfronts that
   * add more transformations, increasing the duration.
   */
  get duration() {
    return Math.max(...this.actors.map(a=>a.animationQueue.queue.reduce((a, t)=>{return a + t.milliseconds}, 0)));
  }

}