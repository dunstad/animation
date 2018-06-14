class Loader {

  /**
   * Loads the given svg images.
   * @param {object} svgContainer 
   * @param {object} svgData 
   */
  constructor(svgContainer, svgData) {

    this.promises = [];
    this.assets = {};

    window['svgContainer'] = svgContainer;

    for (let name in svgData) {
      this.promises.push(this.load(svgContainer, svgData[name], name));
    }

    return new Promise((resolve, reject)=>{
      Promise.all(this.promises).then(()=>{resolve(this.assets)}).catch(console.error);
    });

  }

  /**
   * Brings an svg image into the specified svg container.
   * @param {object} container 
   * @param {string} svgPath
   * @param {string} label
   */
  load(svgContainer, svgPath, label) {
    return new Promise((resolve, reject)=>{
      Snap.load(svgPath, (loadedFragment)=>{
        this.assets[label] = new Animated(
          svgContainer.group().append(loadedFragment)
        );
        resolve(this.assets[label]);
      });
    });
  };

}