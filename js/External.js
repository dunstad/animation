class External extends Animated {
  
  constructor(svgContainer, svgImagePath) {

    super(svgContainer.group());
    this.svgImagePath = svgImagePath;
    this.loadingPromise = this.load();
    
  }

  load() {

    return new Promise((resolve, reject)=>{
      Snap.load(this.svgImagePath, (loadedFragment)=>{
        resolve(this.element.append(loadedFragment));
      });
    });

  }

}