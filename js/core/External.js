class External extends Animated {
  
  constructor(svgContainer, svgImagePath) {

    super(svgContainer.nested());
    this.svgImagePath = svgImagePath;
    this.loadingPromise = this.load();
    
  }

  get rotation() {
    return this.element.first().transform().rotate;
  }

  set rotation(degree) {
    if (typeof degree != 'number') {throw new Error('rotation must be a number');}
    this.element.first().transform({rotate: degree});
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