class External extends Animated {
  
  constructor(svgContainer, svgImagePath) {

    super(svgContainer.group());
    this.svgImagePath = svgImagePath;
    this.loadingPromise = this.load();
    
  }

  load() {

    return new Promise((resolve, reject)=>{
      Snap.load(this.svgImagePath, (loadedFragment)=>{
        let test = this.element.add(loadedFragment)
        this._vivus = new Vivus(this.element.node.firstElementChild, {start: 'manual'});
        this._vivus.finish();
        resolve(this);
      });
    });

  }

}