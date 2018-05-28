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
    
    loader = new Loader(this.player.svgElement, this.svgLabelToPathMap);
    
    loader.then((assets)=>{
      for (let name in assets) {
        this.assets[name] = assets[name];
      }
      this.onload();
    })

  }

  play() {
    
    this.actions(this.assets).then(this.onfinish);

  }

  runWhenLoaded(callback) {
    this.onload = callback;
  }

  runWhenFinished(callback) {
    this.onfinish = callback;
  }

}