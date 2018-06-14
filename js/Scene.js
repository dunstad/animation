class Scene {
  
  /**
   * Used to give a scene the assets it needs to run.
   * @param {Player} player 
   * @param {object} svgLabelToPathMap 
   */
  constructor(player, svgLabelToPathMap) {
    this.player = player;
    this.assets = {};
    this.svgLabelToPathMap = svgLabelToPathMap;
  }

  setup() {

    return new Promise((resolve, reject)=>{
      new Loader(this.player.svgElement, this.svgLabelToPathMap).then((assets)=>{
        Object.assign(this.assets, assets);
        resolve(this.assets);
      }).catch(reject);
    });

  }

  play() {
    
    return new Promise((resolve, reject)=>{
      let promises = [];
      Object.keys(this.assets).forEach((key)=>{
        promises.push(new Promise((resolve, reject)=>{
          this.assets[key].process(resolve);
        }));
      });
      Promise.all(promises).then(resolve).catch(console.error);
    });

  }

}