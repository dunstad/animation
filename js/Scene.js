class Scene {
  
  /**
   * Used to give a scene the assets and actions it needs to run.
   * actions should return a Promise
   * @param {Player} player 
   * @param {object} svgLabelToPathMap 
   * @param {function} actions 
   */
  constructor(player, svgLabelToPathMap, actions) {
    this.player = player;
    this.assets = {};
    this.svgLabelToPathMap = svgLabelToPathMap;
    this.actions = actions;
  }

  setup() {

    return new Promise((resolve, reject)=>{
      new Loader(this.player.svgElement, this.svgLabelToPathMap).then((assets)=>{
        Object.assign(this.assets, assets);
        resolve(this.assets);
      })
    });

  }

  play() {
    
    return new Promise((resolve, reject)=>{
      this.actions(this.assets).then(resolve).catch(console.error);
    });

  }

}