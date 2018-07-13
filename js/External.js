class External extends Animated {
  
  constructor(svgContainer, svgImagePath) {

    super(svgContainer.group());
    this.svgImagePath = svgImagePath;
    this.loadingPromise = this.load();
    
  }

  load() {

    return new Promise((resolve, reject)=>{
      Snap.load(this.svgImagePath, (loadedFragment)=>{
        let test = this.element.append(loadedFragment)
        this.vivus = new Vivus(this.element.node.firstElementChild, {start: 'manual'});
        this.vivus.finish();
        resolve(this.element);
      });
    });

  }

}