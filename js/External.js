class External extends Animated {
  
  constructor(svgImagePath) {
    
   this.svgImagePath = svgImagePath;

  }

  load() {

    return new Promise((resolve, reject)=>{

      Snap.load(this.svgImagePath, (loadedFragment)=>{
        resolve(super(svgContainer.group().append(loadedFragment)));
      });

    });

  }

}