class External extends Animated {
  
  constructor(svgContainer, svgImagePath) {

    super(svgContainer.magicContainer());
    this.svgImagePath = svgImagePath;
    this.loadingPromise = this.load();
    
  }

  load() {

    return new Promise((resolve, reject)=>{
      fetch(this.svgImagePath).then(res=>res.text()).then((svgText)=>{
        this.element.add(svgContainer.group().svg(svgText));
        this._vivus = new Vivus(this.element.node.firstElementChild, {start: 'manual'});
        this._vivus.finish();
        resolve(this);
      }).catch(console.error);
    });

  }

}