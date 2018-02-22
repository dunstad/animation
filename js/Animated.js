class Animated {

  /**
   * 
   * @param {*} element 
   */
  constructor(element) {
    this.element = element;
    this.queue = [];
    this.animateQueue = false;
    this.element.vivus = new Vivus(this.element.node);
    this.scalar = 's1';
    this.rotation = `r0`;
    let bBox = this.element.getBBox();
    this.location = `t${bBox.x},${bBox.y}`
  }

  /**
   * 
   */
  animate() {
    this.animateQueue = true;
    return this;
  }

  /**
   * 
   */
  process() {
    if (this.queue.length) {
      let attributes = this.queue.shift();
      // change this.rotation etc based on attributes property
      if (this.animateQueue) {
        this.element.animate(attributes, 1000, ()=>{
          this.process();
        });
      }
      else {
        this.element.attr(attributes);
      }
    }
    else {
      this.animateQueue = false;
    }
  }

  /**
   * 
   */
  getState() {
    let bBox = this.element.getBBox();
    return {transform: `${this.location}${this.rotation}${this.scalar}`};
  }

  /**
   * 
   * @param {*} stateChange 
   */
  sendToQueue(stateChange) {
    let attributes = Object.assign({
      transform: `${this.location}${this.rotation}${this.scalar}`
    }, stateChange);
    this.queue.push(attributes);
    if (!this.element.inAnim().length) {this.process();}
    else {console.log('!');}
    return this;
  }

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   */
  move(x, y) {
    return this.sendToQueue({location: `t${x},${y}`});
  }

  /**
   * 
   * @param {*} deg 
   */
  rotate(deg) {
    return this.sendToQueue({rotation: `r${deg}`});
  }

  /**
   * 
   * @param {*} ratio 
   */
  scale(ratio) {
    return this.sendToQueue({scalar: `s${ratio}`});
  }

}