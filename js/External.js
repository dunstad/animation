class External extends Animated {
  
  constructor(svgContainer, svgImagePath) {

    super(svgContainer.nested());
    this.svgImagePath = svgImagePath;
    this.loadingPromise = this.load();
    
  }

  load() {

    return new Promise((resolve, reject)=>{
      fetch(this.svgImagePath).then(res=>res.text()).then((svgText)=>{
        this.element.svg(svgText);
        this._vivus = new Vivus(this.element.node.firstElementChild, {start: 'manual'});
        this._vivus.finish();
        resolve(this);
      }).catch(console.error);
    });

  }

}